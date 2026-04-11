import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiRequest } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import VerificationConsentPage from "./VerificationConsentPage";
import UploadIdPage from "./UploadIdPage";
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

  // Your original form fields
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
    console.log(`Moving from Step ${step} to ${step + 1}`, data);
    setCollected((prev) => ({ ...prev, ...data }));
    setError("");
    setStep((s) => s + 1);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitStep1 = (e) => {
    e.preventDefault();
    setError("");
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
      setError("");
      
      // Combine all steps data
      const payload = { ...collected, ...finalData };
      
      const res = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      // Show success message
      setSuccess("Registration Complete! Redirecting to login...");

      // Redirect after a short delay so the user sees the success message
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  // --- STEP RENDERING ---

  // Step 0: The Full Form
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
            <p className="subtitle">Step 1 of 4</p>
            <progress value={1} max={4} style={{ width: "100%", marginBottom: "20px" }} />
            
            <form className="auth-form" onSubmit={handleSubmitStep1}>
              {error && <div className="form-error">{error}</div>}

              <div className="field">
                <label>Full Names (as per ID)</label>
                <input name="fullNames" type="text" value={formData.fullNames} onChange={handleChange} required />
              </div>

              <div className="field">
                <label>ID Number</label>
                <input name="idNumber" type="text" value={formData.idNumber} onChange={handleChange} required />
              </div>

              <div className="field">
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Select gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="field">
                <label>Race</label>
                <select name="race" value={formData.race} onChange={handleChange} required>
                  <option value="">Select race</option>
                  <option value="african">African</option>
                  <option value="coloured">Coloured</option>
                  <option value="indian_asian">Indian / Asian</option>
                  <option value="white">White</option>
                </select>
              </div>

              <div className="field">
                <label>Account Type</label>
                <select name="accountType" value={formData.accountType} onChange={handleChange} required>
                  <option value="">Select type</option>
                  <option value="driver">Driver</option>
                  <option value="passenger">Passenger</option>
                </select>
              </div>

              <div className="field">
                <label>Address</label>
                <input name="address" type="text" value={formData.address} onChange={handleChange} required />
              </div>

              <div className="field">
                <label>Email Address</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>

              <div className="field">
                <label>Contact Number</label>
                <input name="contactNumber" type="tel" value={formData.contactNumber} onChange={handleChange} required />
              </div>

              <div className="field">
                <label>Create Password</label>
                <input name="password" type="password" value={formData.password} onChange={handleChange} required />
              </div>

              <div className="field">
                <label>Confirm Password</label>
                <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
              </div>

              <button className="btn-primary" type="submit">Continue</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Consent
  if (step === 1) {
    return <VerificationConsentPage onNext={(data) => next({ ...data, consentGiven: true })} />;
  }

  // Step 2: Upload ID
  if (step === 2) {
    return <UploadIdPage onNext={(data) => next(data)} />;
  }

  // Step 3: Face Verification
  if (step === 3) {
    return <FaceVerificationPage onNext={(faceData) => handleFinalRegistration(faceData)} />;
  }

  // FINAL FALLBACK: If step becomes 4 or something breaks, show this instead of a grey screen
  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: "center", padding: "40px" }}>
        <h2>{submitting ? "Finalizing Registration..." : "Processing Step..."}</h2>
        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}
        <p>Please wait while we secure your account.</p>
      </div>
    </div>
  );
}