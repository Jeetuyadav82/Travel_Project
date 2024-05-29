// ProtectedUserRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Spinner, Container } from 'react-bootstrap';

const ProtectedUserRoute = () => {
    const userType = localStorage.getItem("user_type");

//     if (loading) {
//         return (
//             <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
//                 <Spinner animation="border" role="status">
//                     <span className="visually-hidden">Loading...</span>
//                 </Spinner>
//             </Container>
//         );
//     }

    if (userType !== 'normal_user') {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};

export default ProtectedUserRoute;
