import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function PassengerTopbar({ title, subtitle }) {
  const { user } = useAuth();

  const firstName = user?.firstName || user?.fullNames?.split(" ")?.[0] || "Passenger";
  const lastName = user?.lastName || user?.fullNames?.split(" ")?.slice(1).join(" ") || "";
  const initials =
    user?.initials ||
    `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() ||
    "??";

  return (
    <div className="topbar">
      <div className="topbar-left">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      <div className="topbar-right">
        <Link to="/passenger/notifications" className="notif-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {(user?.unreadNotifications || 0) > 0 ? <span className="dot passenger" /> : null}
        </Link>

        <Link to="/passenger/profile">
          <div className="avatar passenger">{initials}</div>
        </Link>
      </div>
    </div>
  );
}