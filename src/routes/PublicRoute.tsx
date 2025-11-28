import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const PublicRoute: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  
  // Get the intended destination from state, or default to home
  const from = location.state?.from?.pathname || '/';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
