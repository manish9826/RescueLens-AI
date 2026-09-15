import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, token, isDemo, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#090D16] text-white">Loading...</div>;
  }

  if (!user && !token && !isDemo) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
