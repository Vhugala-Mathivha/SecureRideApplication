import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProgressStepper from "../../components/ProgressStepper";
import "../../styles/auth.css";

export default function FaceVerificationPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const rolePrefix = user?.accountType === "passenger" ? "/passenger" : "/driver";

  const handleVerify = () => {
    setError("");
    setSuccess("");

    // TODO: replace with real webcam + backend verification
    updateUser({ faceVerified: true });
    setSuccess("Face verification completed.");
    setTimeout(() => navigate(`${rolePrefix}/dashboard`), 700);
  };

  const handleSkip = () => {
    setError("");
    setSuccess("");
    navigate(`${rolePrefix}/dashboard`);
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ gridTemplateColumns: "1fr" }}>
        <div className="auth-right" style={{ maxWidth: 720, margin: "0 auto", width: "100%" }}>
          <ProgressStepper currentStep={4} />

          <h1>Live Facial Verification</h1>
          <p className="subtitle">
            Verify your face to complete account safety checks.
          </p>

          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}

          <div className="consent-box">
            <p>
              Position your face in the camera frame and follow instructions.
              This helps us confirm account ownership and improve rider safety.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button className="btn-primary" onClick={handleVerify}>
              Start Verification
            </button>

            <button
              type="button"
              onClick={handleSkip}
              style={{
                height: "44px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                background: "#fff",
                color: "#1f4318",
                fontWeight: 700,
                padding: "0 16px",
                cursor: "pointer",
              }}
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}