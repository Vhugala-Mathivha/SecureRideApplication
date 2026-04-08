import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function PassengerSidebar() {
  const { user } = useAuth();
  const linkClass = ({ isActive }) => `nav-item ${isActive ? "active" : ""}`;

  const displayName =
    user?.fullNames?.trim() ||
    user?.name?.trim() ||
    user?.email?.split("@")[0] ||
    "Passenger";

  return (
    <nav className="sidebar">
      {/* Replaced logo with user name */}
      <div
        style={{
          fontWeight: 800,
          fontSize: "0.95rem",
          padding: "10px 12px",
          marginBottom: 8,
          borderRadius: 10,
          background: "rgba(255,255,255,0.08)",
          color: "#fff",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
        title={displayName}
      >
        {displayName}
      </div>

      <NavLink to="/passenger/dashboard" className={linkClass} title="Dashboard">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        <span>Dashboard</span>
      </NavLink>

      <NavLink to="/passenger/book-ride" className={linkClass} title="Book Ride">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
          <path d="M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
        </svg>
        <span>Book Ride</span>
      </NavLink>

      <NavLink to="/passenger/active-trip" className={linkClass} title="Active Trip">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        <span>Active Trip</span>
      </NavLink>

      <NavLink to="/passenger/trip-history" className={linkClass} title="History">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span>History</span>
      </NavLink>

      <NavLink to="/passenger/verification" className={linkClass} title="Verification">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <span>Verification</span>
      </NavLink>

      <NavLink to="/passenger/notifications" className={linkClass} title="Notifications">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        <span>Notifications</span>
      </NavLink>

      <NavLink
        to="/passenger/emergency-contacts"
        className={linkClass}
        title="Emergency Contacts"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 5.65-7 10-7 10z" />
          <path d="M9 12h6M12 9v6" />
        </svg>
        <span>Emergency Contacts</span>
      </NavLink>

      <div className="nav-spacer" />

      <NavLink to="/passenger/profile" className={linkClass} title="Profile">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span>Profile</span>
      </NavLink>
    </nav>
  );
}