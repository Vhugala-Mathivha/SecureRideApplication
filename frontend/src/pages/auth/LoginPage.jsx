import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../api/client";
import "../../styles/auth.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setSubmitting(true);

      const res = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password.trim(),
        }),
      });

      // DEBUG: Check what the backend actually sent
      console.log("Login Response:", res);

      if (!res.user) {
        setError("Login failed: No user data received.");
        return;
      }

      // 1. Update the Auth Context first
      await login(res.user);

      // 2. Get account type (handling both snake_case and camelCase)
      const rawType = res.user.account_type || res.user.accountType || "";
      const type = rawType.toLowerCase().trim();

      // 3. Redirect Logic
      if (type === "driver") {
        navigate("/driver/dashboard");
      } else if (type === "passenger") {
        navigate("/passenger/dashboard");
      } else {
        // Fallback to general dashboard if type is missing
        navigate("/dashboard");
      }

    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message || "Invalid email or password.");
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
            <p>Driver safety and verification platform.</p>
          </div>
          <div className="left-footer">
            <span>About</span>
            <span>FAQ</span>
            <span>Support</span>
          </div>
        </div>

        <div className="auth-right">
          <h1>Login</h1>
          <p className="subtitle">Welcome back. Please sign in to continue.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="form-error">{error}</div>}

            <div className="field">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="row-end">
              <Link to="/forgot-password" alt="forgot link" className="auth-link">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
            >
              {submitting ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="switch-auth">
            Don’t have an account?{" "}
            <Link to="/register" className="auth-link">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}