// ProtectedAdminRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Spinner, Container } from 'react-bootstrap';

const ProtectedAdminRoute = () => {
  const userType = localStorage.getItem("user_type");

  if (userType !== 'admin') {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;
