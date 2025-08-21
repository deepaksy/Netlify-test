import React from "react";
import { Navigate, useLocation } from "react-router-dom";

// Helper: Decode JWT payload
function parseJwt(token) {
  try {
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(payload)));
  } catch (e) {
    console.log(e);
    return null;
  }
}

/**
 * Universal role-protected route.
 * 
 * Usage:
 * <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>...</ProtectedRoute>
 * <ProtectedRoute allowedRoles={["ROLE_TRAINER"]}>...</ProtectedRoute>
 * <ProtectedRoute allowedRoles={["ROLE_USER"]}>...</ProtectedRoute>
 * <ProtectedRoute allowedRoles={["ROLE_RECEPTIONIST"]}>...</ProtectedRoute>
 * <ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_TRAINER"]}>...</ProtectedRoute>
 */
const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const location = useLocation();
  const token = sessionStorage.getItem("gymmateAccessToken");

  let hasRequiredRole = false;

  if (token) {
    const payload = parseJwt(token);
    const authorities = payload?.authorities || [];
    if (allowedRoles.length > 0) {
      // At least one required role should be present
      hasRequiredRole = authorities.some(auth => allowedRoles.includes(auth));
    } else {
      // No role check requested, only authentication needed
      hasRequiredRole = true;
    }
  }

  // Not logged in, or doesn't have the required role
  if (!token || !hasRequiredRole) {
    sessionStorage.removeItem("gymmateAccessToken");
    sessionStorage.removeItem("gymmateUser");
    return <Navigate to="/auth/signin" replace state={{ from: location }} />;
  }

  // Authenticated and has required role
  return children;
};

export default ProtectedRoute;
