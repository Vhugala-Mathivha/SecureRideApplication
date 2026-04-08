import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // or loader

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const path = location.pathname;
  const isDriverPath = path.startsWith("/driver");
  const isPassengerPath = path.startsWith("/passenger");

  // Role-based route guard
  if (isDriverPath && user.accountType !== "driver") {
    return <Navigate to="/welcome" replace />;
  }

  if (isPassengerPath && user.accountType !== "passenger") {
    return <Navigate to="/welcome" replace />;
  }

  return children;
}