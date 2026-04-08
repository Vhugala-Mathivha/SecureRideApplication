import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function TripsPage() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (user.accountType === "driver" && (!user.carDetailsCompleted || !user.faceVerified)) {
    return <Navigate to="/welcome" replace />;
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>Trips Page 🚗</h1>
      <p>You can now access trips.</p>
    </div>
  );
}