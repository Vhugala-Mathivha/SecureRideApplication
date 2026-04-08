import { Link } from "react-router-dom";
import "../../styles/auth.css";

export default function ForgotPasswordPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-left">
          <div className="watermark">SR</div>
          <div className="brand-content"><h2>SecureRide</h2><p>Reset your password securely.</p></div>
        </div>
        <div className="auth-right">
          <h1>Forgot Password</h1>
          <form className="auth-form">
            <div className="field">
              <label>Email Address</label>
              <input type="email" placeholder="you@example.com" />
            </div>
            <button className="btn-primary" type="submit">Send Reset Link</button>
          </form>
          <p className="switch-auth">Back to <Link className="auth-link" to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
}