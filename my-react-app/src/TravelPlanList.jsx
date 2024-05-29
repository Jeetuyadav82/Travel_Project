import React, { useState, useEffect } from 'react';
import axios from "./interceptors/axios";
import { Table, Container, Button, Modal, Form } from 'react-bootstrap';

const TravelPlanList = () => {
  const userType = localStorage.getItem("user_type"); // Get user type from localStorage
  const [travelPlans, setTravelPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);

  // Function to fetch travel plans
  const fetchTravelPlans = () => {
    setLoading(true);
    setError(null);

    axios
      .get('http://localhost:8000/travelplans/')
      .then((response) => {
        setTravelPlans(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching travel plans:', error);
        setError('Failed to fetch travel plans');
        setLoading(false);
      });
  };

  // Fetch travel plans when component mounts
  useEffect(() => {
    fetchTravelPlans();
  }, []);

  // Handle opening the edit modal
  const handleEdit = (plan) => {
    setCurrentPlan(plan);
    setEditModal(true);
  };

  // Handle closing the edit modal
  const handleClose = () => {
    setEditModal(false);
    setCurrentPlan(null);
  };

  // Handle saving the edited plan
  const handleSave = () => {
    // API call to update the travel plan
    axios
      .put(`http://localhost:8000/travelplans/${currentPlan.id}/`, currentPlan)
      .then((response) => {
        setEditModal(false);
        fetchTravelPlans();
        alert("Plan updated successfully");
        console.log(response);
      })
      .catch((error) => {
        console.error('Error updating travel plan:', error);
        setError('Failed to update travel plan');
        alert("Failed to update travel plan");
      });
  };

  // Handle deleting the plan
  const handleDelete = (planId) => {
    // API call to delete the travel plan
    axios
      .delete(`http://localhost:8000/travelplans/${planId}/`)
      .then((response) => {
        fetchTravelPlans();
        alert("Plan deleted successfully");
        console.log(response);
      })
      .catch((error) => {
        console.error('Error deleting travel plan:', error);
        setError('Failed to delete travel plan');
        alert("Failed to delete travel plan");
      });
  };

  // Handle form input change
  const handleChange = (e) => {
    setCurrentPlan({
      ...currentPlan,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Container>
      {error && <p>{error}</p>}
      {travelPlans.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Destination</th>
              <th>Cost</th>
              <th>Description</th>
              {userType === 'admin' && <th>Actions</th>} {/* Show Actions column for admin */}
            </tr>
          </thead>
          <tbody>
            {travelPlans.map((plan) => (
              <tr key={plan.id}>
                <td>{plan.id}</td>
                <td>{plan.destination}</td>
                <td>{plan.cost}</td>
                <td>{plan.description}</td>
                {userType === 'admin' && (
                  <td>
                    <Button variant="primary" onClick={() => handleEdit(plan)}>Edit Plan</Button>
                    <Button variant="danger" onClick={() => handleDelete(plan.id)} style={{ marginLeft: '0px' }}>Delete Plan</Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        !loading && <p>No travel plans available</p>
      )}

      {/* Edit Plan Modal */}
      {currentPlan && (
        <Modal show={editModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Travel Plan</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formDestination">
                <Form.Label>Destination</Form.Label>
                <Form.Control
                  type="text"
                  name="destination"
                  value={currentPlan.destination}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formCost">
                <Form.Label>Cost</Form.Label>
                <Form.Control
                  type="number"
                  name="cost"
                  value={currentPlan.cost}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={currentPlan.description}
                  onChange={handleChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default TravelPlanList;
