import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Simple driver dashboard (no custom dashboard.css styling).
 * Shows driver name + car info, with Edit and Delete buttons.
 */
export default function MainDashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Adjust these fields to match your real user shape
  const fullName = user?.fullNames || user?.fullName || "Driver";
  const email = user?.email || user?.emailAddress || "";
  const phone = user?.phone || user?.phoneNumber || "";

  const car =
    user?.car ||
    user?.carDetails ||
    user?.vehicle ||
    {}; // fallback if your object is nested differently

  const carMake = car?.make || user?.carMake || "";
  const carModel = car?.model || user?.carModel || "";
  const carColor = car?.color || user?.carColor || "";
  const carPlate = car?.plate || car?.licensePlate || user?.carPlate || "";

  const handleEdit = () => {
    // If your car details page is where the driver edits their info, reuse it.
    navigate("/driver/car-details");
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This cannot be undone."
    );
    if (!confirmed) return;

    /**
     * IMPORTANT:
     * You must implement the backend endpoint for this.
     * Examples:
     * - DELETE /api/users/me
     * - DELETE /api/drivers/me
     *
     * If you don't have it yet, we can temporarily just log out.
     */
    try {
      // If you already have an API helper, use it here instead of fetch.
      // await fetch(`${process.env.REACT_APP_API_URL}/api/users/me`, {
      //   method: "DELETE",
      //   credentials: "include",
      // });

      await logout(); // fallback behavior for now
      navigate("/login");
    } catch (e) {
      console.error(e);
      alert("Failed to delete account. Please try again.");
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 6 }}>Driver Dashboard</h1>
      <p style={{ marginTop: 0, color: "#6b7280" }}>
        Welcome back, <strong>{fullName}</strong>
      </p>

      <div
        style={{
          border: "1px solid #d1d5db",
          padding: 16,
          borderRadius: 10,
          background: "#fff",
          marginTop: 16,
        }}
      >
        <h2 style={{ marginTop: 0 }}>Your Profile</h2>
        <div style={{ display: "grid", gap: 8 }}>
          <div>
            <strong>Name:</strong> {fullName}
          </div>
          {email ? (
            <div>
              <strong>Email:</strong> {email}
            </div>
          ) : null}
          {phone ? (
            <div>
              <strong>Phone:</strong> {phone}
            </div>
          ) : null}
        </div>
      </div>

      <div
        style={{
          border: "1px solid #d1d5db",
          padding: 16,
          borderRadius: 10,
          background: "#fff",
          marginTop: 16,
        }}
      >
        <h2 style={{ marginTop: 0 }}>Car Information</h2>

        {carMake || carModel || carColor || carPlate ? (
          <div style={{ display: "grid", gap: 8 }}>
            <div>
              <strong>Make:</strong> {carMake || "—"}
            </div>
            <div>
              <strong>Model:</strong> {carModel || "—"}
            </div>
            <div>
              <strong>Color:</strong> {carColor || "—"}
            </div>
            <div>
              <strong>Plate:</strong> {carPlate || "—"}
            </div>
          </div>
        ) : (
          <p style={{ margin: 0, color: "#6b7280" }}>
            No car information found yet. Click <strong>Edit information</strong>{" "}
            to add your car details.
          </p>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
          <button
            onClick={handleEdit}
            style={{
              height: 42,
              padding: "0 14px",
              borderRadius: 10,
              border: "1px solid #0b2e13",
              background: "#0b2e13",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Edit information
          </button>

          <button
            onClick={handleDeleteAccount}
            style={{
              height: 42,
              padding: "0 14px",
              borderRadius: 10,
              border: "1px solid #ef4444",
              background: "#fff",
              color: "#b91c1c",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
}