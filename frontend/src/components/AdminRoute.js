
import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  return userInfo && userInfo.user.role === 'admin' ? children : <Navigate to="/login" replace />;
};

export default AdminRoute;
