import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Container } from 'react-bootstrap';

const TravelPlanList = () => {
  const userId = localStorage.getItem("user_id");
  const [travelPlans, setTravelPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPlans, setShowPlans] = useState(false); // Track whether to show travel plans

  useEffect(() => {
    fetchTravelPlans(); // Call fetchTravelPlans when the component mounts
  }, []); // Empty dependency array to run effect only once on mount

  const handleBooking = (userId, planId) => {
    axios.post('http://localhost:8000/bookings/', { userid: userId, planid: planId })
      .then((response) => {
        alert("Plan booked successfully");
        console.log('Plan booked successfully:', response.data);
        // Handle any further actions after booking
      })
      .catch((error) => {
        alert("Failed to book plan");
        console.error('Error booking plan:', error);
        // Handle error cases
      });
  };

  // Function to fetch travel plans
  const fetchTravelPlans = () => {
    setLoading(true);
    setError(null);

    axios
      .get('http://localhost:8000/travelplans/')
      .then((response) => {
        setTravelPlans(response.data);
        setLoading(false);
        setShowPlans(true); // Show travel plans after fetching
      })
      .catch((error) => {
        console.error('Error fetching travel plans:', error);
        setError();
        setLoading(false);
      });
  };

  return (
    <Container>
      {showPlans && (
        <>
          {error && <p>{error}</p>}
          {travelPlans.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Destination</th>
                  <th>Cost</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {travelPlans.map((plan) => (
                  <tr key={plan.id}>
                    <td>{plan.id}</td>
                    <td>{plan.destination}</td>
                    <td>{plan.cost}</td>
                    <td>{plan.description}</td>
                    <td>
                    <button
                      onClick={() => handleBooking(userId, plan.id)}
                      style={{ backgroundColor: '#007bff', color: '#ffffff', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px' }}
                    >
                      Book
                    </button>
                     </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            !loading && <p>No travel plans found.</p>
          )}
        </>
      )}
    </Container>
  );
};

export default TravelPlanList;
