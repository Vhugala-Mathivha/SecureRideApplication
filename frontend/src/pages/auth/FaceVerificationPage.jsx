import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProgressStepper from "../../components/ProgressStepper";
import "../../styles/auth.css";

export default function FaceVerificationPage({ onNext }) {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const meadow = "var(--meadow)"; // Make sure this variable is set in your CSS!

  const handleVerify = () => {
    setError("");
    setSuccess("");

    // TODO: Replace with real webcam + backend verification
    updateUser({ faceVerified: true });
    setSuccess("Face verification completed.");

    setTimeout(() => {
      if (onNext) {
        onNext();
      } else {
        navigate("/login");
      }
    }, 1000);
  };

  const handleComplete = () => {
    setError("");
    setSuccess("Registration complete!");
    setTimeout(() => {
      if (onNext) {
        onNext();
      } else {
        navigate("/login");
      }
    }, 1000);
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ gridTemplateColumns: "1fr" }}>
        <div
          className="auth-right"
          style={{ maxWidth: 720, margin: "0 auto", width: "100%" }}
        >
          <ProgressStepper currentStep={5} />

          <h1 style={{ fontWeight: 700, marginBottom: 6 }}>
            Live Facial Verification
          </h1>
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

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: "24px", // space between buttons
              marginTop: "28px",
              width: "100%",
            }}
          >
            <button
              className="btn-primary"
              onClick={handleVerify}
              style={{
                background: meadow,
                borderColor: meadow,
                color: "#fff",
                fontWeight: 600,
                borderRadius: "8px",
                height: "44px",
                padding: "0 28px",
                fontSize: "1rem"
              }}
            >
              Start Verification
            </button>
            <button
              type="button"
              onClick={handleComplete}
              style={{
                background: meadow,
                borderColor: meadow,
                color: "#fff",
                fontWeight: 600,
                borderRadius: "8px",
                height: "44px",
                padding: "0 28px",
                fontSize: "1rem"
              }}
            >
              Complete & Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}