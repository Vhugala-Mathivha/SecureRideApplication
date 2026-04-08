import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/welcome.css";

export default function WelcomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  if (!user) return null;

  const isDriver = user.accountType === "driver";
  const isPassenger = user.accountType === "passenger";

  const goNext = () => {
    // Passenger flow: consent -> upload id -> face verification -> dashboard
    if (isPassenger) {
      if (!user.verificationConsentGiven) {
        navigate("/passenger/verification-consent");
        return;
      }

      if (!user.idDocumentUploaded) {
        navigate("/passenger/upload-id");
        return;
      }

      if (!user.faceVerified) {
        navigate("/passenger/face-verification");
        return;
      }

      navigate("/passenger/dashboard");
      return;
    }

    // Driver flow: car details -> consent -> upload id -> face verification -> trips
    if (isDriver) {
      if (!user.carDetailsCompleted) {
        navigate("/driver/car-details");
        return;
      }

      if (!user.verificationConsentGiven) {
        navigate("/driver/verification-consent");
        return;
      }

      if (!user.idDocumentUploaded) {
        navigate("/driver/upload-id");
        return;
      }

      if (!user.faceVerified) {
        navigate("/driver/face-verification");
        return;
      }

      navigate("/driver/trips");
      return;
    }

    // Fallback (unknown role)
    navigate("/login");
  };

  return (
    <div className="welcome-page">
      <div className="welcome-card">
        <div className="welcome-arc left" />
        <div className="welcome-arc right" />

        <div className="welcome-chip">
          SecureRide {isPassenger ? "Passenger" : "Driver"} Verification
        </div>

        <h1 className="welcome-title">
          Welcome, {user.fullNames || "User"} <span>👋</span>
        </h1>

        <p className="welcome-subtitle">
          Complete your setup to continue.
        </p>

        <div className="welcome-status-list">
          <div className="welcome-status-item">
            <span>Account Type:</span>
            <strong>{user.accountType || "—"}</strong>
          </div>

          {isDriver && (
            <div className="welcome-status-item">
              <span>Car details:</span>
              <strong>{user.carDetailsCompleted ? "✅ Complete" : "❌ Not complete"}</strong>
            </div>
          )}

          <div className="welcome-status-item">
            <span>Consent form:</span>
            <strong>{user.verificationConsentGiven ? "✅ Signed" : "❌ Not signed"}</strong>
          </div>

          <div className="welcome-status-item">
            <span>ID upload:</span>
            <strong>{user.idDocumentUploaded ? "✅ Uploaded" : "❌ Not uploaded"}</strong>
          </div>

          <div className="welcome-status-item">
            <span>Facial verification:</span>
            <strong>{user.faceVerified ? "✅ Verified" : "❌ Not verified"}</strong>
          </div>
        </div>

        <div className="welcome-actions">
          <button className="welcome-btn primary" onClick={goNext}>
            Continue
          </button>
          <button className="welcome-btn ghost" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}