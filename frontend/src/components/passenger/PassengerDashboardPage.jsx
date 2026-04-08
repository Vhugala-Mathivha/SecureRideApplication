import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PassengerSidebar from "./PassengerSidebar";
import PassengerTopbar from "./PassengerTopbar";
import "../../styles/auth.css";
import "../../styles/global.css";
import "../../styles/passenger.css";

export default function PassengerDashboardPage() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();

  const fullName =
    user?.fullNames ||
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    "Passenger";

  const firstName = user?.firstName || fullName.split(" ")[0] || "Passenger";

  const greeting = getGreeting(firstName);

  const totalTrips = user?.totalTrips ?? 47;
  const totalSpent = user?.totalSpent ?? 1240;
  const safetyScore = user?.safetyScore ?? 98;
  const email = user?.email || "not-provided@email.com";
  const phone = user?.phone || "Not provided";
  const isVerified = Boolean(user?.faceVerified || user?.isVerified);
  const idUploaded = Boolean(user?.idDocumentUploaded);
  const consentSigned = Boolean(user?.verificationConsentGiven);

  const recentTrips = [
    {
      id: 1,
      from: "Menlyn Mall",
      to: "Hatfield Square",
      date: "Today, 08:14",
      duration: "12 min",
      amount: 48,
      icon: "🏢",
    },
    {
      id: 2,
      from: "Brooklyn",
      to: "Arcadia",
      date: "Yesterday, 17:32",
      duration: "8 min",
      amount: 31,
      icon: "🏠",
    },
    {
      id: 3,
      from: "Centurion",
      to: "Pretoria Airport",
      date: "4 Apr",
      duration: "22 min",
      amount: 95,
      icon: "✈️",
    },
  ];

  const handleDeleteAccount = async () => {
    const ok = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!ok) return;

    try {
      // TODO: call backend delete endpoint
      // await api.delete('/user/account');
      alert("Account deletion request submitted.");
      await logout?.();
    } catch (err) {
      alert("Could not delete account right now. Please try again.");
    }
  };

  const handleEditInfo = () => {
    navigate("/passenger/profile");
  };

  return (
    <div className="shell">
      <PassengerSidebar />

      <div className="main">
        <PassengerTopbar
          title={greeting}
          subtitle={new Date().toLocaleDateString("en-ZA", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        />

        {/* Name header */}
        <div className="card mb">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div className="section-title" style={{ marginBottom: 6 }}>Passenger Profile</div>
              <h2 style={{ margin: 0, fontSize: 24 }}>{fullName}</h2>
              <p style={{ marginTop: 6, color: "var(--text2)" }}>{email} · {phone}</p>
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
              <span className={`badge ${isVerified ? "badge-ok" : "badge-warn"}`}>
                {isVerified ? "✓ Verified" : "⚠ Verification Pending"}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Trips</div>
            <div className="stat-val text-p">{totalTrips}</div>
            <div className="stat-sub">All time</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Total Spent</div>
            <div className="stat-val">R{Number(totalSpent).toLocaleString("en-ZA")}</div>
            <div className="stat-sub">This month</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Safety Score</div>
            <div className="stat-val text-p">{safetyScore}%</div>
            <div className="stat-sub">Excellent</div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="section-title">Quick Actions</div>
        <div className="grid-4 mb-l">
          <Link to="/passenger/book-ride" className="quick-btn">
            <span className="quick-icon">🚗</span>
            <span className="quick-label">Book Ride</span>
          </Link>
          <Link to="/passenger/trip-history" className="quick-btn">
            <span className="quick-icon">📋</span>
            <span className="quick-label">Trip History</span>
          </Link>
          <Link to="/passenger/active-trip" className="quick-btn">
            <span className="quick-icon">📍</span>
            <span className="quick-label">Live Trip</span>
          </Link>
          <Link to="/passenger/notifications" className="quick-btn">
            <span className="quick-icon">🔔</span>
            <span className="quick-label">Notifications</span>
          </Link>
        </div>

        {/* Account + safety info */}
        <div className="grid-2 mb-l">
          <div className="card">
            <div className="section-title">Verification Status</div>
            <div className="profile-row">
              <span className="profile-label">Consent Form</span>
              <span className={consentSigned ? "badge badge-ok" : "badge badge-warn"}>
                {consentSigned ? "Signed" : "Pending"}
              </span>
            </div>
            <div className="profile-row">
              <span className="profile-label">ID Document</span>
              <span className={idUploaded ? "badge badge-ok" : "badge badge-warn"}>
                {idUploaded ? "Uploaded" : "Not Uploaded"}
              </span>
            </div>
            <div className="profile-row">
              <span className="profile-label">Face Verification</span>
              <span className={isVerified ? "badge badge-ok" : "badge badge-warn"}>
                {isVerified ? "Completed" : "Pending"}
              </span>
            </div>
          </div>

          <div className="card">
            <div className="section-title">Account Information</div>
            <div className="profile-row">
              <span className="profile-label">Full Name</span>
              <span className="profile-val">{fullName}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">Email</span>
              <span className="profile-val">{email}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">Phone</span>
              <span className="profile-val">{phone}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">Emergency Contact</span>
              <span className="profile-val">{user?.emergencyContact || "Not set"}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">Preferred Payment</span>
              <span className="profile-val">{user?.paymentMethod || "Visa •••• 4921"}</span>
            </div>
          </div>
        </div>

        {/* Recent trips */}
        <div className="section-title">Recent Trips</div>
        <div className="card mb-l">
          {recentTrips.map((t) => (
            <div className="trip-row" key={t.id}>
              <div className="trip-icon">{t.icon}</div>
              <div className="trip-info">
                <div className="trip-route">
                  {t.from} &rarr; {t.to}
                </div>
                <div className="trip-date">
                  {t.date} &middot; {t.duration}
                </div>
              </div>
              <div className="trip-amount text-p">R{t.amount}</div>
            </div>
          ))}
        </div>

        {/* Bottom actions */}
        <div className="card">
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", flexWrap: "wrap" }}>
            <button className="btn btn-outline" onClick={handleEditInfo}>
              Edit Information
            </button>
            <button className="btn btn-danger" onClick={handleDeleteAccount}>
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getGreeting(firstName) {
  const hour = new Date().getHours();
  const period = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
  return `Good ${period}, ${firstName}`;
}