import { useCallback, useEffect, useState } from "react";
import PassengerSidebar from "./PassengerSidebar";
import PassengerTopbar from "./PassengerTopbar";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../api/client";
import "../../styles/auth.css";
import "../../styles/global.css";

export default function PassengerNotificationsPage() {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadNotifications = useCallback(async () => {
    if (!user?.id) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await apiRequest(
        `/notifications?userId=${user.id}&accountType=passenger`,
        { method: "GET" }
      );
      setItems(Array.isArray(res) ? res : res.notifications || []);
    } catch (e) {
      setError(e.message || "Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const clearAll = async () => {
    if (!user?.id) return;

    try {
      setBusy(true);
      setError("");
      setSuccess("");

      await apiRequest("/notifications/clear", {
        method: "POST",
        body: { userId: user.id, accountType: "passenger" },
      });

      setItems([]);
      setSuccess("All notifications cleared.");
    } catch (e) {
      setError(e.message || "Failed to clear notifications.");
    } finally {
      setBusy(false);
    }
  };

  const markRead = async (id) => {
    try {
      await apiRequest(`/notifications/${id}/read`, { method: "POST" });
      setItems((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch {
      // keep UI unchanged if mark-read fails silently
    }
  };

  return (
    <div className="shell">
      <PassengerSidebar />
      <div className="main">
        <PassengerTopbar
          title="Notifications"
          subtitle="Your alerts and updates"
        />

        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}

        <div className="card" style={{ marginBottom: 12 }}>
          <button
            className="btn btn-p"
            type="button"
            onClick={clearAll}
            disabled={busy || loading}
            style={{
              backgroundColor: "#16a34a",
              borderColor: "#16a34a",
              color: "#fff",
            }}
          >
            {busy ? "Clearing..." : "Clear Notifications"}
          </button>
        </div>

        {loading ? (
          <div className="card">Loading notifications...</div>
        ) : items.length === 0 ? (
          <div className="card">
            <div style={{ color: "var(--text2)" }}>No notifications yet.</div>
          </div>
        ) : (
          <div id="drivers-list">
            {items.map((n) => (
              <div
                key={n.id}
                className={`notice-card ${n.read ? "notice-read" : "notice-unread"}`}
                onClick={() => !n.read && markRead(n.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === " ") && !n.read) {
                    markRead(n.id);
                  }
                }}
              >
                <div className="notice-left">
                  <span className={`notice-dot dot-${n.kind || "info"}`} />
                </div>

                <div className="notice-body">
                  <div className="notice-title">{n.title}</div>
                  <div className="notice-message">{n.message}</div>
                  <div className="notice-time">{n.createdAt}</div>
                </div>

                {!n.read && <span className="notice-pill">New</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}