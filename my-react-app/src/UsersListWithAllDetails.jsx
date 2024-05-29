import React, { useState, useEffect } from 'react';
import axios from "./interceptors/axios"
import { Container, Table } from 'react-bootstrap';

const UserList = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState([]);

  const fetchUsers = () => {
    setLoading(true);
    setError(null);
    axios.get('http://localhost:8000/useralldetails/')
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Container>
      {error && <p>{error}</p>}
      {userData.length > 0 ? (
        <div>
          <h2>All Users with all details</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
              <th>Id</th>
                <th>Name</th>
                <th>Email</th>
                <th>Bookings</th>
              </tr>
            </thead>
            <tbody>
              {userData.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
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
                          </li>
                        ))}
                      </ul>
                    ) : (
                      'No bookings'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        loading ? <p>Loading...</p> : <p>No users available</p>
      )}
    </Container>
  );
};

export default UserList;
