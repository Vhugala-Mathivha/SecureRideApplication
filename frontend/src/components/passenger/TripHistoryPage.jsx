import { useEffect, useMemo, useState } from "react";
import PassengerSidebar from "./PassengerSidebar";
import PassengerTopbar from "./PassengerTopbar";
import { apiRequest } from "../../api/client"; // adjust if needed
import "../../styles/auth.css";
import "../../styles/global.css";

export default function TripHistoryPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadTrips = async () => {
      try {
        setLoading(true);
        setError("");

        // 1) Try backend first
        const res = await apiRequest("/passenger/trips/history", { method: "GET" });
        const apiList = Array.isArray(res) ? res : res.trips || [];

        if (apiList.length > 0) {
          if (mounted) setTrips(apiList);
          return;
        }

        // 2) API empty -> fallback to localStorage
        const localList = JSON.parse(localStorage.getItem("trip_history") || "[]");
        if (mounted) setTrips(localList);
      } catch (e) {
        // 3) API failed -> fallback to localStorage
        const localList = JSON.parse(localStorage.getItem("trip_history") || "[]");

        if (localList.length > 0) {
          if (mounted) setTrips(localList);
        } else {
          if (mounted) setError(e.message || "Failed to load trip history.");
        }
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
    const spent = trips
      .filter((t) => t.fare != null)
      .reduce((acc, t) => acc + Number(t.fare || 0), 0);

    return { total, completed, cancelled, spent };
  }, [trips]);

  return (
    <div className="shell">
      <PassengerSidebar />
      <div className="main">
        <PassengerTopbar title="Trip History" subtitle="Your previous rides and details" />

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
            <div className="history-stat-label">Total Spent</div>
            <div className="history-stat-value">R{summary.spent.toFixed(2)}</div>
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}
        {loading && <div className="card">Loading trip history...</div>}

        {!loading && !trips.length && (
          <div className="card">
            <div style={{ color: "var(--text2)" }}>No trips found yet.</div>
          </div>
        )}

        <div id="drivers-list">
          {trips.map((t) => (
            <div className="history-card" key={t.id}>
              <div className="history-head">
                <div>
                  <div className="history-route">
                    {(t.pickup || "N/A")} → {(t.destination || "N/A")}
                  </div>
                  <div className="history-sub">
                    {t.date || "N/A"} · Requested {t.requestedAt || "N/A"} · Arrived {t.arrivalTime || "N/A"}
                  </div>
                </div>
                <span className={`history-status status-${t.status || "pending"}`}>
                  {t.status || "pending"}
                </span>
              </div>

              <div className="history-grid">
                <div><strong>Driver:</strong> {t.driverName || "N/A"}</div>
                <div><strong>Vehicle:</strong> {t.vehicle || "N/A"}</div>
                <div><strong>Plate:</strong> {t.plate || "N/A"}</div>
                <div><strong>Distance:</strong> {t.distance || "N/A"}</div>
                <div><strong>ETA:</strong> {t.eta || "N/A"}</div>
                <div><strong>Fare:</strong> {t.fare != null ? `R${t.fare}` : "N/A"}</div>
                <div><strong>Payment:</strong> {t.paymentMethod || "N/A"}</div>
                <div><strong>Trip ID:</strong> #{t.id}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}