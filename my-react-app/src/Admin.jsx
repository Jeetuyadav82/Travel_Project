import React, { useEffect, useState } from 'react';
import axios from './interceptors/axios'; // Adjust the path if needed
import { Container, Row, Col,Form, Card, Button, Navbar, Nav,NavDropdown, Dropdown, DropdownButton } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();
  const [adminDetails, setAdminDetails] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_new_password: '',
  });


  useEffect(() => {
    const fetchAdminDetails = async () => {
      const userId = localStorage.getItem('user_id');
      const token = localStorage.getItem('access_token'); // Assuming you're storing the token in local storage

      try {
        const response = await axios.get(`http://localhost:8000/user/profile/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setAdminDetails({
          name: response.data.name,
          email: response.data.email,
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user details:', error);

        if (error.response && error.response.status === 401) {
          // Handle unauthorized error
          setError('Unauthorized access. Please log in again.');
          handleLogout();
        } else {
          setError('Failed to fetch user details.');
        }
        setLoading(false);
      }
    };

    fetchAdminDetails();
  }, []);

  const handleProfile = () => {
      console.log('admin Details:', adminDetails);
      setProfileOpen(!profileOpen);
    };

  const handleChangePassword = () => {
      setShowChangePasswordForm(!showChangePasswordForm);
  };


  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('user_id');
        const token = localStorage.getItem('access_token'); // Assuming you're storing the token in local storage

        try {
          const response = await axios.post(
            `http://localhost:8000/user/changepassword/${userId}/`,
            passwordData,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            }
          );
          alert('Password changed successfully!');
          setShowChangePasswordForm(false);
        } catch (error) {
          console.error('Error changing password:', error);
          alert('Failed to change password.');
        }
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_new_password: ''
        });
      };





  const handleLogout = () => {
    // Clear user data from localStorage or any other state management
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_type');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }


  const openUserList = () => {
    navigate('/admin/users');
  };

  const openAddUser = () => {
    navigate('/add-user');
  };

  const openTravelPlanList = () => {
    navigate('/admin/travel-plans');
  };

  const openAddTravelPlan = () => {
    navigate('/admin/add-plan');
  };

  return (

  <Container style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#">Hi {adminDetails.name}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end">
          <Nav>
              <NavDropdown.Item onClick={handleProfile} style={{ color: 'blue' }}>Profile</NavDropdown.Item>
                  {profileOpen && adminDetails && (
                    <Container>
                      <Row>
                        <Col>
                          <p><strong>Name:</strong> {adminDetails.name}</p>
                          <p><strong>Email:</strong> {adminDetails.email}</p>
    {/*                       Add more fields like address and contact here */}
                        </Col>
                      </Row>
                    </Container>
                  )}
              <NavDropdown.Item onClick={handleChangePassword} style={{ color: 'blue' }}>Change Password</NavDropdown.Item>
                  {showChangePasswordForm && (
                      <Container>
                        <Row className="justify-content-center">
                          <Col md={8}>
                            <Card>
                              <Card.Header as="h6" className="text-center">Change Password</Card.Header>
                              <Card.Body>
                                <Form onSubmit={handlePasswordSubmit}>
                                  <Form.Group controlId="currentPassword">
                                    <Form.Label>Current Password</Form.Label>
                                    <Form.Control
                                      type="password"
                                      name="current_password"
                                      value={passwordData.current_password}
                                      onChange={handlePasswordChange}
                                      required
                                    />
                                  </Form.Group>
                                  <Form.Group controlId="newPassword">
                                    <Form.Label>New Password</Form.Label>
                                    <Form.Control
                                      type="password"
                                      name="new_password"
                                      value={passwordData.new_password}
                                      onChange={handlePasswordChange}
                                      required
                                    />
                                  </Form.Group>
                                  <Form.Group controlId="confirmNewPassword">
                                    <Form.Label>Confirm New Password</Form.Label>
                                    <Form.Control
                                      type="password"
                                      name="confirm_new_password"
                                      value={passwordData.confirm_new_password}
                                      onChange={handlePasswordChange}
                                      required
                                    />
                                  </Form.Group>
                                  <Button variant="primary" type="submit" className="mt-3 w-100">
                                    Change Password
                                  </Button>
                                </Form>
                              </Card.Body>
                            </Card>
                          </Col>
                        </Row>
                      </Container>
                    )}


              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout} style={{ color: 'blue' }}>Logout</NavDropdown.Item>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

    <Container style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

      <Row className="justify-content-center">
        <Col md={6} className="text-center mb-3">
          <Card>
            <Card.Body>
              <Button variant="primary" onClick={openUserList}>Users Details</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="text-center mb-3">
          <Card>
            <Card.Body>
              <Button variant="primary" onClick={openAddUser}>Add User</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="text-center mb-3">
          <Card>
            <Card.Body>
              <Button variant="primary" onClick={openTravelPlanList}>Travel Plans List</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="text-center mb-3">
          <Card>
            <Card.Body>
              <Button variant="primary" onClick={openAddTravelPlan}>Add Travel Plan</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
   </Container>
  );
};

export default Admin;