import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DriverSidebar from "../../components/driver/DriverSidebar";
import DriverTopbar from "../../components/driver/DriverTopbar";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../api/client";
import "../../styles/dashboard-professional.css";

export default function DriverDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const loadData = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const [historyRes, requestsRes] = await Promise.all([
        apiRequest(`/driver/trips/history?driverId=${user.id}`, { method: "GET" }),
        apiRequest(`/driver/trips/requests`, { method: "GET" }),
      ]);
      setHistory(historyRes?.trips || []);
      setRequests(requestsRes?.trips || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const stats = useMemo(() => {
    const totalTrips = history.length;
    const completed = history.filter((t) => t.status === "completed");
    const totalEarnings = completed.reduce(
      (acc, t) => acc + Number(t.earnings || t.fare || 0),
      0
    );
    const activeTrips = history.filter((t) =>
      ["accepted", "in_progress"].includes(t.status)
    ).length;

    return {
      totalTrips,
      totalEarnings: totalEarnings.toFixed(0),
      activeTrips,
    };
  }, [history]);

  const recentTrips = history.slice(0, 5);

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Delete account + always redirect to login on success
  const handleDeleteAccount = async () => {
    if (!user?.id) {
      alert("User not found. Please log in again.");
      navigate("/login", { replace: true });
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      setDeleting(true);

      await apiRequest(`/driver/account/${user.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      try {
        if (logout) await logout();
      } catch (_) {
        // ignore logout failure
      }

      localStorage.clear();
      sessionStorage.clear();

      navigate("/login", { replace: true });
    } catch (e) {
      alert(e?.message || "Failed to delete account");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="shell">
      <DriverSidebar />

      <main className="pro-main">
        <DriverTopbar
          title={`Good evening, ${user?.fullNames?.split(" ")[0] || "Driver"}`}
          subtitle={today}
        />

        <section className="pro-card pro-profile">
          <div>
            <p className="pro-eyebrow">Driver profile</p>
            <h2>{user?.fullNames || "Driver"}</h2>
            <p className="pro-muted">
              {user?.email || "No email"} · {user?.phone || "Not provided"}
            </p>
          </div>
          <span className={`pro-badge ${user?.faceVerified ? "ok" : "warn"}`}>
            {user?.faceVerified ? "Verified" : "Verification pending"}
          </span>
        </section>

        <section className="pro-kpis">
          <article className="pro-card">
            <p className="pro-label">Total trips</p>
            <p className="pro-value">{stats.totalTrips}</p>
          </article>
          <article className="pro-card">
            <p className="pro-label">Total earnings</p>
            <p className="pro-value">R{stats.totalEarnings}</p>
          </article>
          <article className="pro-card">
            <p className="pro-label">Active trips</p>
            <p className="pro-value">{stats.activeTrips}</p>
          </article>
        </section>

        <section>
          <h3 className="pro-section-title">Quick actions</h3>
          <div className="pro-actions">
            <button className="pro-btn" onClick={() => navigate("/driver/trips")}>
              Trip requests
            </button>
            <button className="pro-btn" onClick={() => navigate("/driver/trip-history")}>
              Trip history
            </button>
            <button className="pro-btn" onClick={() => navigate("/driver/notifications")}>
              Notifications
            </button>
            <button className="pro-btn" onClick={() => navigate("/driver/car-details")}>
              Car details
            </button>
          </div>
        </section>

        <section className="pro-grid-2">
          <article className="pro-card">
            <h3 className="pro-card-title">Verification status</h3>
            <div className="pro-row">
              <span>Consent form</span>
              <strong>{user?.verificationConsentGiven ? "Signed" : "Pending"}</strong>
            </div>
            <div className="pro-row">
              <span>ID document</span>
              <strong>{user?.idDocumentUploaded ? "Uploaded" : "Pending"}</strong>
            </div>
            <div className="pro-row">
              <span>Face verification</span>
              <strong>{user?.faceVerified ? "Verified" : "Pending"}</strong>
            </div>
          </article>

          <article className="pro-card">
            <h3 className="pro-card-title">Driver information</h3>
            <div className="pro-row">
              <span>Full name</span>
              <strong>{user?.fullNames || "—"}</strong>
            </div>
            <div className="pro-row">
              <span>Email</span>
              <strong>{user?.email || "—"}</strong>
            </div>
            <div className="pro-row">
              <span>Phone</span>
              <strong>{user?.phone || "Not provided"}</strong>
            </div>
            <div className="pro-row">
              <span>Vehicle</span>
              <strong>{user?.vehicleModel || "Not set"}</strong>
            </div>
            <div className="pro-row">
              <span>Plate</span>
              <strong>{user?.licensePlate || "Not set"}</strong>
            </div>
          </article>
        </section>

        <section>
          <h3 className="pro-section-title">Recent trips</h3>
          <div className="pro-card">
            {loading ? (
              <p className="pro-muted">Loading trips...</p>
            ) : recentTrips.length === 0 ? (
              <p className="pro-muted">No trips yet.</p>
            ) : (
              <div className="pro-list">
                {recentTrips.map((t) => (
                  <div className="pro-list-item" key={t.id}>
                    <div>
                      <p className="pro-route">
                        {t.pickup} → {t.destination}
                      </p>
                      <p className="pro-muted">
                        {t.date || "N/A"} · {t.passengerName || "Passenger"}
                      </p>
                    </div>
                    <div className="pro-right">
                      <strong>{t.fare != null ? `R${t.fare}` : "—"}</strong>
                      <span className="pro-status">{t.status || "requested"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {requests.length > 0 && (
          <section>
            <h3 className="pro-section-title">Open requests</h3>
            <div className="pro-card">
              <div className="pro-list">
                {requests.slice(0, 3).map((r) => (
                  <div className="pro-list-item" key={r.id}>
                    <div>
                      <p className="pro-route">
                        {r.pickup} → {r.destination}
                      </p>
                      <p className="pro-muted">Passenger: {r.passengerName}</p>
                    </div>
                    <button className="pro-btn ghost" onClick={() => navigate("/driver/trips")}>
                      Open
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="pro-card">
          <h3 className="pro-card-title">Account</h3>
          <div className="pro-actions">
            <button className="pro-btn" onClick={() => navigate("/driver/car-details")}>
              Edit information
            </button>
            <button
              className="pro-btn danger"
              onClick={handleDeleteAccount}
              disabled={deleting}
              title="Permanently delete your account"
            >
              {deleting ? "Deleting..." : "Delete account"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}