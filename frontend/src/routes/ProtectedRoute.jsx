import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // or a loader

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const path = location.pathname;
  const isDriverPath = path.startsWith("/driver");
  const isPassengerPath = path.startsWith("/passenger");

  const accountType = user.accountType || user.account_type;

  // Role-based route guard
  if (isDriverPath && accountType !== "driver") {
    return <Navigate to="/login" replace />;
  }
  if (isPassengerPath && accountType !== "passenger") {
    return <Navigate to="/login" replace />;
  }

  return children;
}