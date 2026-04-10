import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiRequest } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import VerificationConsentPage from "./VerificationConsentPage";
import UploadIdPage from "./UploadIdPage";
import IDValidationPage from "./IDValidationPage";
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

  // Registration Form State
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

  // Advance to next step, merging data
  const next = (data = {}) => {
    setCollected((prev) => ({ ...prev, ...data }));
    setError("");
    setSuccess("");
    setStep((s) => s + 1);
  };

  // --- User Info Handlers ---
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setSubmitting(true);
      const res = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          ...collected,
          ...formData,
          fullNames: formData.fullNames.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password.trim(),
        }),
      });

      if (res.user) {
        await login(res.user);
      }

      // After successful registration, go to next step (Consent)
      next();
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  // ---- STEP LOGIC ----

  // Step 0: User info form
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
            <div className="left-footer">
              <span>About</span>
              <span>FAQ</span>
              <span>Support</span>
            </div>
          </div>
          <div className="auth-right">
            <h1>Create Account</h1>
            <p className="subtitle">Fill in your details to register.</p>
            <div style={{ marginBottom: 12 }}>
              <div>Step 1 of 5</div>
              <progress value={1} max={5} style={{ width: 100 }} />
            </div>
            <form className="auth-form" onSubmit={handleSubmit}>
              {error && <div className="form-error">{error}</div>}
              {success && <div className="form-success">{success}</div>}

              <div className="field">
                <label>Full Names (as per ID)</label>
                <input
                  name="fullNames"
                  type="text"
                  placeholder="e.g. Vhugala Mathivha"
                  value={formData.fullNames}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field">
                <label>ID Number</label>
                <input
                  name="idNumber"
                  type="text"
                  placeholder="South African ID Number"
                  value={formData.idNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field">
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Select gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
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
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
              <div className="field">
                <label>Account Type</label>
                <select name="accountType" value={formData.accountType} onChange={handleChange} required>
                  <option value="">Select account type</option>
                  <option value="driver">Driver</option>
                  <option value="passenger">Passenger</option>
                </select>
              </div>
              <div className="field">
                <label>Address</label>
                <input
                  name="address"
                  type="text"
                  placeholder="Street, suburb, city, postal code"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field">
                <label>Email Address</label>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field">
                <label>Contact Number</label>
                <input
                  name="contactNumber"
                  type="tel"
                  placeholder="+27 71 234 5678"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field">
                <label>Create Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field">
                <label>Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <button className="btn-primary" type="submit" disabled={submitting}>
                {submitting ? "Continuing..." : "Continue"}
              </button>
            </form>
            <p className="switch-auth">
              Already have an account?{" "}
              <Link to="/login" className="auth-link">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Consent
  if (step === 1) {
    return <VerificationConsentPage onNext={next} />;
  }
  // Step 2: Upload ID
  if (step === 2) {
    return <UploadIdPage onNext={next} />;
  }
  // Step 3: ID Validation
  if (step === 3) {
    return <IDValidationPage onNext={next} />;
  }
  // Step 4: Face Verification
  if (step === 4) {
    // Pass a prop for redirect after verification success
    return (
      <FaceVerificationPage
        onNext={() => {
          // Optionally show a success screen here, or redirect immediately:
          navigate("/login");
        }}
      />
    );
  }

  // ...optionally: Show "All done!"
  return (
    <div>
      <h2>Registration completed!</h2>
      <p>Redirecting to login...</p>
    </div>
  );
}