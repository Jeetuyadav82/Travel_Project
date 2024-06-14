import React, { useEffect, useState } from 'react';
import axios from './interceptors/axios'; // Adjust the path if needed
import { Container, Row, Col, Card, Button, Form, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const User = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_new_password: '',
  });
  const [travelPlans, setTravelPlans] = useState([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem('user_id');
      const token = localStorage.getItem('access_token');

      try {
        const response = await axios.get(`http://localhost:8000/user/profile/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setUserDetails({
          name: response.data.name,
          email: response.data.email,
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user details:', error);
        if (error.response && error.response.status === 401) {
          setError('Unauthorized access. Please log in again.');
          handleLogout();
        } else {
          setError('Failed to fetch user details.');
        }
        setLoading(false);
      }
    };

    const fetchTravelPlans = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`http://localhost:8000/travelplans`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setTravelPlans(response.data);
      } catch (error) {
        console.error('Error fetching travel plans:', error);
      }
    };

    fetchUserDetails();
    fetchTravelPlans();
  }, []);

  const handleProfile = () => {
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
    const token = localStorage.getItem('access_token');

    try {
      await axios.post(
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

  const handleMyBookings = () => {
    navigate('/user/bookings');
  };

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_type');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleBookPlan = async (planId) => {
    const userId = localStorage.getItem('user_id');
    const token = localStorage.getItem('access_token');

    try {
      await axios.post(
        `http://localhost:8000/bookings/`,
        { userid: userId, planid: planId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      alert('Plan booked successfully!');
    } catch (error) {
      console.error('Error booking plan:', error);
      alert('Failed to book plan.');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Container style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
  <Navbar bg="light" expand="lg">
    <Navbar.Brand href="#">Hi {userDetails.name}</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 p-2" />

    <Navbar.Collapse className="justify-content-end">
      <Nav>
        <NavDropdown.Item onClick={handleProfile} style={{ color: 'blue' }}>Profile</NavDropdown.Item>
        {profileOpen && userDetails && (
          <Container>
            <Row className="justify-content-end">
              <Col md={4}>
                <Card>
                  <Card.Header as="h6" className="text-center">Profile</Card.Header>
                  <Card.Body>
                    <p><strong>Name:</strong> {userDetails.name}</p>
                    <p><strong>Email:</strong> {userDetails.email}</p>
                    {/* Add more fields like address and contact here */}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        )}
        <NavDropdown.Item onClick={handleChangePassword} style={{ color: 'blue' }}>Change Password</NavDropdown.Item>
        {showChangePasswordForm && (
          <Container>
            <Row className="justify-content-end">
              <Col md={4}>
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
        <NavDropdown.Item onClick={handleMyBookings} style={{ color: 'blue' }}>Bookings</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item onClick={handleLogout} style={{ color: 'red' }}>Logout</NavDropdown.Item>
      </Nav>
    </Navbar.Collapse>
  </Navbar>

  {/* Travel plans section */}
  <Container className="my-2">
  <Row className="justify-content-center">
    <Col md={12}>
      <h2 className="text-center mb-2">Grab the below plans before its too late</h2>
      {travelPlans.map(plan => (
        <Row key={plan.id} className="mb-4">
          <Col md={12}>
            <Card className="shadow-sm">
              <Card.Header className="bg-primary text-white text-center">{plan.destination}</Card.Header>
              <Card.Body>
                <Card.Title>{plan.title}</Card.Title>
                <Card.Text>{plan.description}</Card.Text>
                <h5 className="text-center text-success">Cost: ₹{plan.cost}</h5>
                <Form>
                  <Form.Group controlId={`bookingForm${plan.id}`}>
                    <Button variant="primary" onClick={() => handleBookPlan(plan.id)} className="mt-3">
                      Book Plan
                    </Button>
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ))}
    </Col>
  </Row>
</Container>
</Container>
  );
};

export default User;
