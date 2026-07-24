import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, token } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="auth-loading-screen">
        <div className="auth-loading-inner">
          <div className="auth-loading-spinner" />
          <p className="auth-loading-text">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!token && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
