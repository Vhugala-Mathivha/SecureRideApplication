import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiRequest } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import VerificationConsentPage from "./VerificationConsentPage";
import UploadIdPage from "./UploadIdPage";
// import IDValidationPage from "./IDValidationPage"; // Removed if not used
import FaceVerificationPage from "./FaceVerificationPage";
import "../../styles/auth.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(0);
  const [collected, setCollected] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullNames: "",
    idNumber: "",
    gender: "",
    race: "",
    accountType: "",
    address: "",
    email: "",
    contactNumber: "",
    password: "",
    confirmPassword: "",
  });

  const next = (data = {}) => {
    console.log("Advancing to next step with data:", data);
    setCollected((prev) => ({ ...prev, ...data }));
    setError("");
    setStep((s) => s + 1);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitStep1 = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    next({
      ...formData,
      fullNames: formData.fullNames.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password.trim(),
    });
  };

  const handleFinalRegistration = async (finalData = {}) => {
    try {
      setSubmitting(true);
      const payload = { ...collected, ...finalData };
      
      const res = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res.user) await login(res.user);
      
      setSuccess("Registration Complete!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  // --- STEP RENDERING ---

  // Step 0: Initial Form
  if (step === 0) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-left">
            <div className="watermark">SR</div>
            <div className="brand-content">
              <h2>SecureRide</h2>
              <p>Create your verified account using your official personal details.</p>
            </div>
          </div>
          <div className="auth-right">
            <h1>Create Account</h1>
            <div style={{ marginBottom: 12 }}>
              <div>Step 1 of 4</div>
              <progress value={1} max={4} style={{ width: "100%" }} />
            </div>
            <form className="auth-form" onSubmit={handleSubmitStep1}>
              {error && <div className="form-error">{error}</div>}
              <div className="field">
                <label>Full Names</label>
                <input name="fullNames" type="text" value={formData.fullNames} onChange={handleChange} required />
              </div>
              {/* ... Keep all your other input fields (ID, Gender, Race, etc.) here ... */}
              <div className="field">
                <label>ID Number</label>
                <input name="idNumber" type="text" value={formData.idNumber} onChange={handleChange} required />
              </div>
              {/* Note: I'm shortening the display here for brevity, keep your full list of fields! */}
              <button className="btn-primary" type="submit">Continue</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Consent (Stepper says 2)
  if (step === 1) {
    return <VerificationConsentPage onNext={(data) => next({ ...data, consentGiven: true })} />;
  }

  // Step 2: Upload ID (Stepper says 3)
  if (step === 2) {
    return <UploadIdPage onNext={(data) => next(data)} />;
  }

  // Step 3: Face Verification (Stepper says 4 - FINAL)
  if (step === 3) {
    return (
      <FaceVerificationPage 
        onNext={(faceData) => handleFinalRegistration(faceData)} 
      />
    );
  }

  // Fallback / Loading
  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: "center" }}>
        <h2>{submitting ? "Processing..." : "Redirecting..."}</h2>
        {error && <div className="form-error">{error}</div>}
      </div>
    </div>
  );
}