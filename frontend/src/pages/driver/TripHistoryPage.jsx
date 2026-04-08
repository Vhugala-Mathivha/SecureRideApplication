import { useEffect, useMemo, useState } from "react";
import DriverSidebar from "../../components/driver/DriverSidebar";
import DriverTopbar from "../../components/driver/DriverTopbar";
import { apiRequest } from "../../api/client"; // adjust path if needed
import "../../styles/auth.css";
import "../../styles/global.css";

export default function DriverTripHistoryPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadTrips = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await apiRequest("/driver/trips/history", { method: "GET" });
        const list = Array.isArray(res) ? res : res.trips || [];
        if (mounted) setTrips(list);
      } catch (e) {
        if (mounted) setError(e.message || "Failed to load driver trip history.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadTrips();
    return () => {
      mounted = false;
    };
  }, []);

  const summary = useMemo(() => {
    const total = trips.length;
    const completed = trips.filter((t) => t.status === "completed").length;
    const cancelled = trips.filter((t) => t.status === "cancelled").length;
    const earnings = trips
      .filter((t) => t.earnings != null)
      .reduce((acc, t) => acc + Number(t.earnings || 0), 0);
    return { total, completed, cancelled, earnings };
  }, [trips]);

  return (
    <div className="shell">
      <DriverSidebar />
      <div className="main">
        <DriverTopbar title="Trip History" subtitle="Completed and past trips" />

        <div className="history-summary-grid">
          <div className="history-stat-card">
            <div className="history-stat-label">Total Trips</div>
            <div className="history-stat-value">{summary.total}</div>
          </div>
          <div className="history-stat-card">
            <div className="history-stat-label">Completed</div>
            <div className="history-stat-value">{summary.completed}</div>
          </div>
          <div className="history-stat-card">
            <div className="history-stat-label">Cancelled</div>
            <div className="history-stat-value">{summary.cancelled}</div>
          </div>
          <div className="history-stat-card">
            <div className="history-stat-label">Total Earnings</div>
            <div className="history-stat-value">R{summary.earnings.toFixed(2)}</div>
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}
        {loading && <div className="card">Loading trip history...</div>}

        {!loading && !trips.length && (
          <div className="card">
            <div style={{ color: "var(--text2)" }}>No driver trips found yet.</div>
          </div>
        )}

        <div id="drivers-list">
          {trips.map((t) => (
            <div className="history-card" key={t.id}>
              <div className="history-head">
                <div>
                  <div className="history-route">{t.pickup} → {t.destination}</div>
                  <div className="history-sub">
                    {t.date} · Accepted {t.acceptedAt || "N/A"} · Arrived {t.arrivalTime || "N/A"}
                  </div>
                </div>
                <span className={`history-status status-${t.status || "pending"}`}>
                  {t.status || "pending"}
                </span>
              </div>

              <div className="history-grid">
                <div><strong>Passenger:</strong> {t.passengerName || "N/A"}</div>
                <div><strong>Distance:</strong> {t.distance || "N/A"}</div>
                <div><strong>ETA:</strong> {t.eta || "N/A"}</div>
                <div><strong>Fare:</strong> {t.fare != null ? `R${t.fare}` : "N/A"}</div>
                <div><strong>Earnings:</strong> {t.earnings != null ? `R${t.earnings}` : "N/A"}</div>
                <div><strong>Payment:</strong> {t.paymentMethod || "N/A"}</div>
                <div><strong>Rating:</strong> {t.rating != null ? `${t.rating}/5` : "N/A"}</div>
                <div><strong>Trip ID:</strong> #{t.id}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}