import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiRequest } from "../../api/client";
import "../../styles/auth.css";

export default function RegisterPage() {
  const navigate = useNavigate();

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

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setSubmitting(true);

      await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          fullNames: formData.fullNames.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          accountType: formData.accountType,
        }),
      });

      alert("Registration successful. Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

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

          <form className="auth-form" onSubmit={handleSubmit}>
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
              <select
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
                required
              >
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
              {submitting ? "Registering..." : "Register"}
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