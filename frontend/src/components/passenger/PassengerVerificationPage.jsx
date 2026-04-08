import PassengerSidebar from "../../components/passenger/PassengerSidebar";
import PassengerTopbar from "../../components/passenger/PassengerTopbar";
import { useAuth } from "../../context/AuthContext";
import "../../styles/auth.css";
import "../../styles/global.css";

export default function PassengerVerificationPage() {
  const { user } = useAuth();
  const step = user?.verificationStep || 1;

  const steps = [
    { label: "Create Account", desc: "Profile registered", done: step > 1, active: step === 1 },
    { label: "Email Verified", desc: "Email address confirmed", done: step > 2, active: step === 2 },
    { label: "Upload Government ID", desc: "SA ID Book or Smart Card", done: step > 3, active: step === 3 },
    { label: "Facial Recognition", desc: "Live selfie matched to ID", done: step > 4, active: step === 4 },
    { label: "Audio Monitoring Consent", desc: "Enable AI trip safety", done: step > 5, active: step === 5 },
  ];

  return (
    <div className="shell">
      <PassengerSidebar />
      <div className="main">
        <PassengerTopbar title="Identity Verification" subtitle="Required before your first ride" />

        <div className="card card-accent-p mb">
          <div style={{ fontSize: 13, color: "var(--p-accent)", fontWeight: 500, marginBottom: 4 }}>
            🔒 Why verification matters
          </div>
          <div style={{ fontSize: 13, color: "var(--text2)" }}>
            SecureRide uses Digital Handshake checks to verify identities before rides.
          </div>
        </div>

        <div className="section-title">Verification Steps</div>
        <div className="card mb">
          {steps.map((s, i) => (
            <div className="verif-step" key={s.label}>
              <div className={`step-num ${s.done ? "step-done" : s.active ? "step-active" : "step-pending"}`}>
                {s.done ? "✓" : i + 1}
              </div>
              <div className="step-body">
                <div className="step-title">{s.label}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
              <span className={s.done ? "badge badge-ok" : s.active ? "badge badge-p" : "chip"}>
                {s.done ? "Done" : s.active ? "In Progress" : "Pending"}
              </span>
            </div>
          ))}
        </div>

        {!user?.isVerified ? (
          <div>
            <div className="section-title">Upload ID Document</div>
            <div className="card">
              <div className="dropzone" onClick={() => alert("File picker coming soon")}>
                <div className="dropzone-icon">🪪</div>
                <div className="dropzone-label">Tap to upload or take a photo</div>
                <div className="dropzone-hint">SA ID Book, Smart Card, or Passport · JPG / PNG / PDF</div>
              </div>
              <div className="grid-2 mt">
                <button className="btn btn-outline">📷 Take Photo</button>
                <button className="btn btn-outline">📁 Upload File</button>
              </div>
              <button className="btn btn-p btn-full mt" onClick={() => alert("ID submitted for verification.")}>
                Submit ID for Verification
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}