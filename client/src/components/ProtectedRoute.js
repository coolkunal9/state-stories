import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "./ui/Spinner";

/**
 * Route guard component that protects authenticated routes.
 * Displays a loading spinner while session verification is in progress.
 * Redirects unauthenticated users to the homepage ("/").
 */
const ProtectedRoute = ({ children }) => {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background dark:bg-primary transition-colors duration-300">
        <Spinner label="Verifying session..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
