import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/auth.css";
import ProgressStepper from "../../components/ProgressStepper";

export default function VerificationConsentPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  const rolePrefix = user?.accountType === "passenger" ? "/passenger" : "/driver";

  const handleContinue = () => {
    setError("");

    if (!agreed) {
      setError("Please tick the consent checkbox before proceeding.");
      return;
    }

    updateUser({ verificationConsentGiven: true });
    navigate(`${rolePrefix}/upload-id`);
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ gridTemplateColumns: "1fr" }}>
        <div className="auth-right" style={{ padding: "28px" }}>
          <ProgressStepper currentStep={2} />

          <h1>Live Verification Consent</h1>
          <p className="subtitle">Please read carefully before continuing.</p>

          {error && <div className="form-error">{error}</div>}

          <div className="consent-box">
            <p>
              <strong>
                Please read the following carefully before proceeding with the Live Verification process.
              </strong>
            </p>

            <p>
              By clicking "I Agree" and proceeding with Live Verification in SecureRide,
              you acknowledge and consent to the collection and processing of your
              personal and biometric data for platform safety and fraud prevention.
            </p>

            <p>
              <strong>1. Accuracy and Truthfulness of Information</strong>
              <br />
              You confirm all submitted information and documents are true, accurate,
              and current. False information may result in account suspension or termination.
            </p>

            <p>
              <strong>2. Purpose of Data Collection (Safety and Security)</strong>
              <br />
              SecureRide uses verification to protect both drivers and passengers from
              impersonation, fraud, and safety threats.
            </p>

            <p>
              <strong>3. Legal and Compliance Acknowledgment</strong>
              <br />
              Verification records may form part of a digital audit trail and may be
              disclosed to authorized entities when required by law.
            </p>

            <p>
              <strong>4. Consent to Secure Processing</strong>
              <br />
              You consent to secure transmission, storage, and processing of this data
              within SecureRide systems.
            </p>
          </div>

          <label className="consent-check">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>I agree to the Live Verification Consent</span>
          </label>

          <button className="btn-primary" onClick={handleContinue}>
            Continue to ID Upload
          </button>
        </div>
      </div>
    </div>
  );
}