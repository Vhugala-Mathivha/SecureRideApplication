import { useNavigate } from "react-router-dom";
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
    setCollected((prev) => ({ ...prev, ...data }));
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
      const payload = { ...collected, ...finalData };
      
      // Hit the API
      await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      // DIRECT REDIRECT - No timers, no waiting
      navigate("/login");

    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  // --- RENDERING ---

  if (step === 0) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-right">
            <h1>Create Account</h1>
            <form className="auth-form" onSubmit={handleSubmitStep1}>
              {error && <div className="form-error">{error}</div>}
              <div className="field">
                <label>Full Names</label>
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
                </select>
              </div>
              <div className="field">
                <label>Race</label>
                <select name="race" value={formData.race} onChange={handleChange} required>
                  <option value="">Select race</option>
                  <option value="african">African</option>
                  <option value="white">White</option>
                  <option value="coloured">Coloured</option>
                  <option value="indian_asian">Indian / Asian</option>
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

  if (step === 1) return <VerificationConsentPage onNext={(data) => next({ ...data, consentGiven: true })} />;
  if (step === 2) return <UploadIdPage onNext={(data) => next(data)} />;
  if (step === 3) return <FaceVerificationPage onNext={handleFinalRegistration} />;

  return null;
}