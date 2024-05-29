import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Button } from 'react-bootstrap';

const UsersAllDetailsList = () => {
  const userId = localStorage.getItem("user_id");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    fetchUsers(); // Call fetchUsers when the component mounts
  }, []); // Empty dependency array to run effect only once on mount

  const fetchUsers = () => {
    setLoading(true);
    setError(null);
    axios
      .get(`http://localhost:8000/useralldetails/${userId}`)
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user details:', error);
        setError('');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = (bookingId) => {
    console.log("======")
    console.log(bookingId)
    setLoading(true);
    setError(null);
    axios
      .delete(`http://localhost:8000/bookings/${bookingId}/`)
      .then((response) => {
        alert('Booking deleted successfully');
        fetchUsers(); // Refresh the list of bookings after deletion
      })
      .catch((error) => {
        console.error('Error deleting booking:', error);
        alert('Failed to delete Booking');
        setError('');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Container>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {userData.length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Bookings</th>
            </tr>
          </thead>
          <tbody>
            {userData.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.bookings ? (
                    <ul>
                      {user.bookings.map(booking => (
                        <li key={booking.id}>
                          BookingID: {booking.id}<br />
                          Destination: {booking.destination}<br />
                          Cost: {booking.cost}<br />
                          Description: {booking.description}<br />
                          <Button
                            variant="danger"
                            onClick={() => handleDelete(booking.id)}
                            style={{ marginTop: '10px' }}
                          >
                            Delete Booking
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : 'No bookings'}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default UsersAllDetailsList;
