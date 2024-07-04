import React from 'react';
import { Navigate } from 'react-router-dom';
import jwt from 'jsonwebtoken'; // Import jwt from jsonwebtoken

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  try {
    // Decode and verify the token
    const decoded = jwt.verify(token, 'your_jwt_secret'); // Replace 'your_jwt_secret' with your actual JWT secret

    // Redirect to login if user is not an admin
    if (!decoded || decoded.role !== 'admin') {
      return <Navigate to="/login" />;
    }

    // Render the children if user is authenticated as admin
    return <>{children}</>;
  } catch (error) {
    // Handle invalid or expired tokens
    console.error('Invalid token', error);
    return <Navigate to="/login" />;
  }
};

export default AdminRoute;
