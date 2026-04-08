import { useEffect, useMemo, useState } from "react";
import DriverSidebar from "../../components/driver/DriverSidebar";
import DriverTopbar from "../../components/driver/DriverTopbar";
import { useAuth } from "../../context/AuthContext";

const STORAGE_KEY = "driver_notifications_v1";

export default function DriverNotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  const baseNotifications = useMemo(() => {
    const now = new Date().toISOString();
    return [
      {
        id: "welcome-register",
        title: "Welcome to SecureRide",
        message: "Your driver account was created successfully.",
        type: "success",
        createdAt: now,
      },
      {
        id: "login-success",
        title: "Login successful",
        message: "You signed in successfully. Your account is active.",
        type: "info",
        createdAt: now,
      },
    ];
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const existing = raw ? JSON.parse(raw) : [];

    const hasWelcome = existing.some((n) => n.id === "welcome-register");
    const hasLogin = existing.some((n) => n.id === "login-success");

    let merged = [...existing];
    if (!hasWelcome) merged = [baseNotifications[0], ...merged];
    if (!hasLogin) merged = [baseNotifications[1], ...merged];

    merged.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    setNotifications(merged);
  }, [baseNotifications, user?.id]);

  const clearNotifications = () => {
    const keepDefaults = [
      {
        id: "welcome-register",
        title: "Welcome to SecureRide",
        message: "Your driver account was created successfully.",
        type: "success",
        createdAt: new Date().toISOString(),
      },
      {
        id: "login-success",
        title: "Login successful",
        message: "You signed in successfully. Your account is active.",
        type: "info",
        createdAt: new Date().toISOString(),
      },
    ];

    // If you want FULL clear, replace keepDefaults with []
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keepDefaults));
    setNotifications(keepDefaults);
  };

  return (
    <div className="shell">
      <DriverSidebar />
      <div className="main dashboard-green">
        <DriverTopbar title="Notifications" subtitle="Your alerts and updates" />

        <section className="card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 8,
            }}
          >
            <h3 className="section-title-clean" style={{ margin: 0 }}>
              Notifications
            </h3>
            <button className="quick-btn btn-danger" onClick={clearNotifications}>
              Clear Notifications
            </button>
          </div>

          {notifications.length === 0 ? (
            <p style={{ color: "#667085" }}>No notifications yet.</p>
          ) : (
            <div className="recent-list">
              {notifications.map((n) => (
                <div className="recent-item" key={n.id}>
                  <div>
                    <div className="trip-route">{n.title}</div>
                    <div className="trip-sub">{n.message}</div>
                  </div>
                  <div className="trip-sub">{new Date(n.createdAt).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}