import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children, onlyRole, excludeRole }) => {
  const userCookie = Cookies.get('user');
  if (!userCookie) return <Navigate to="/" replace />;

  const user = JSON.parse(userCookie);
  const role = user.role;

  // Nếu chỉ cho phép 1 role cụ thể
  if (onlyRole && role !== onlyRole) {
    return <Navigate to="/" replace />;
  }

  // Nếu loại trừ 1 role
  if (excludeRole && role === excludeRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
