import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const PrivateRoute: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to register page if not authenticated, saving the current location
    return <Navigate to="/register" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
