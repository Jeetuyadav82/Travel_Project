import React, { useState } from 'react';
import axios from "./interceptors/axios"
import { Modal, Form } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddTravelPlan = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(true); // Controls modal visibility
  const [destination, setDestination] = useState('');
  const [cost, setCost] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      const response = await axios.post('http://localhost:8000/travelplans/', { destination, cost, description });
      alert('Travel plan added successfully!');
      console.log('Travel plan added:', response.data);
      setShow(false); // Close the modal after successful submission
      setDestination('');
      setCost('');
      setDescription('');
      navigate('/admin'); // Navigate back to admin page
    } catch (error) {
      alert('Failed to add travel plan');
      console.error('Error adding travel plan:', error);
    }
  };

  const handleClose = () => {
    setShow(false); // Close the modal
  };

  return (
    <>
      {/* Modal containing the Add Travel Plan form */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Travel Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Destination:</Form.Label>
              <Form.Control
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Cost:</Form.Label>
              <Form.Control
                type="text"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Description:</Form.Label>
              <Form.Control
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>

            {/* Button to submit the form */}
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
            <ToastContainer /> {/* Toast for success/error messages */}
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddTravelPlan;
