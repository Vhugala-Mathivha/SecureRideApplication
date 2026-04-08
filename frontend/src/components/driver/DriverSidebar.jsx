import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function DriverSidebar() {
  const { user } = useAuth();

  const displayName =
    user?.fullNames?.trim() ||
    user?.name?.trim() ||
    user?.email?.split("@")[0] ||
    "Driver";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const linkClass = ({ isActive }) => `nav-item ${isActive ? "active" : ""}`;

  return (
    <aside className="driver-sidebar">
      <div className="driver-user-pill" title={displayName}>
        <span className="driver-user-name">{displayName}</span>
        <span className="driver-user-avatar">{initials || "DR"}</span>
      </div>

      <NavLink to="/driver/dashboard" className={linkClass}>
        <span>Dashboard</span>
      </NavLink>

      <NavLink to="/driver/trips" className={linkClass}>
        <span>Available Trip Requests</span>
      </NavLink>

      <NavLink to="/driver/trip-history" className={linkClass}>
        <span>Trip History</span>
      </NavLink>

      <NavLink to="/driver/notifications" className={linkClass}>
        <span>Notifications</span>
      </NavLink>

      <NavLink to="/driver/emergency-contacts" className={linkClass}>
        <span>Emergency Contacts</span>
      </NavLink>

      <NavLink to="/driver/car-details" className={linkClass}>
        <span>Car Details</span>
      </NavLink>

      <NavLink to="/driver/verification-consent" className={linkClass}>
        <span>Verification</span>
      </NavLink>

      <div className="nav-spacer" />

      <NavLink to="/welcome" className={linkClass}>
        <span>Back</span>
      </NavLink>
    </aside>
  );
}