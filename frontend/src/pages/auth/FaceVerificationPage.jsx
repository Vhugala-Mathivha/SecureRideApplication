import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProgressStepper from "../../components/ProgressStepper";
import "../../styles/auth.css";

export default function FaceVerificationPage({ onNext }) {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const meadow = "var(--meadow)"; 

  const handleVerify = () => {
    setError("");
    setSuccess("Face scanning... Please hold still.");
    setIsProcessing(true);

    // Simulating a successful scan
    setTimeout(() => {
      setSuccess("Face verification completed successfully!");
      setIsProcessing(false);
    }, 1500);
  };

  const handleComplete = () => {
    setError("");
    setSuccess("Registration complete! Finalizing...");
    setIsProcessing(true);

    setTimeout(() => {
      if (onNext) {
        onNext({ faceVerified: true, status: "verified" });
        // Redirect will be handled by RegisterPage after successful registration.
      } else {
        // Fallback for standalone testing
        navigate("/login");
      }
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ gridTemplateColumns: "1fr" }}>
        <div
          className="auth-right"
          style={{ maxWidth: 720, margin: "0 auto", width: "100%" }}
        >
          <ProgressStepper currentStep={4} />

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
              gap: "24px",
              marginTop: "28px",
              width: "100%",
            }}
          >
            <button
              className="btn-primary"
              onClick={handleVerify}
              disabled={isProcessing}
              style={{
                background: isProcessing ? "#ccc" : meadow,
                borderColor: isProcessing ? "#ccc" : meadow,
                color: "#fff",
                fontWeight: 600,
                borderRadius: "8px",
                height: "44px",
                padding: "0 28px",
                fontSize: "1rem",
                cursor: isProcessing ? "not-allowed" : "pointer"
              }}
            >
              {isProcessing ? "Processing..." : "Start Verification"}
            </button>
            
            <button
              type="button"
              onClick={handleComplete}
              disabled={isProcessing}
              style={{
                background: meadow,
                borderColor: meadow,
                color: "#fff",
                fontWeight: 600,
                borderRadius: "8px",
                height: "44px",
                padding: "0 28px",
                fontSize: "1rem",
                opacity: isProcessing ? 0.7 : 1
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