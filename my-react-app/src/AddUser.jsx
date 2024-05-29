import React, { useState } from 'react';
import axios from "./interceptors/axios"
import { Modal, Form } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddUser = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(true); // Controls modal visibility
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    axios
      .post('http://localhost:8000/users/', { name, email, password })
      .then((response) => {
        alert(JSON.stringify(response));
        console.log(response);
        setShow(false); // Close the modal after successful submission
        setName('');
        setEmail('');
        setPassword('');
        navigate('/admin'); // Navigate back to admin page
      })
      .catch((error) => {
        alert('Failed to add user');
        console.error('Error adding user:', error);
      });
  };

  const handleClose = () => {
    setShow(false); // Close the modal
  };

  return (
    <>
      {/* Modal containing the Add User form */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Name:</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

export default AddUser;
