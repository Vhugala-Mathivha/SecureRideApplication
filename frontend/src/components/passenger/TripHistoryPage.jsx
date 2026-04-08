import { useMemo, useState } from "react";
import PassengerSidebar from "../../components/passenger/PassengerSidebar";
import PassengerTopbar from "../../components/passenger/PassengerTopbar";
import { useAuth } from "../../context/AuthContext";
import "../../styles/auth.css";
import "../../styles/global.css";

export default function TripHistoryPage() {
  const { user } = useAuth();
  const [status, setStatus] = useState("");

  const allTrips = [
    { id: 1, from: "Menlyn", to: "Hatfield", date: "6 Apr · 08:14", duration: "12 min", amount: 48, status: "completed", icon: "🏢", driver: "Thabo M." },
    { id: 2, from: "Brooklyn", to: "Arcadia", date: "5 Apr · 17:32", duration: "8 min", amount: 31, status: "completed", icon: "🏠", driver: "Nomsa K." },
    { id: 3, from: "Centurion", to: "Airport", date: "4 Apr · 10:45", duration: "22 min", amount: 95, status: "completed", icon: "✈️", driver: "James P." },
    { id: 4, from: "Waterkloof", to: "Menlyn", date: "31 Mar", duration: "15 min", amount: 62, status: "cancelled", icon: "🛒", driver: "Sipho D." },
  ];

  const trips = useMemo(() => allTrips.filter((t) => !status || t.status === status), [status]);

  return (
    <div className="shell">
      <PassengerSidebar />
      <div className="main">
        <PassengerTopbar title="Trip History" subtitle="All your past rides" />

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Trips</div>
            <div className="stat-val text-p">{user?.totalTrips ?? 47}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Spent</div>
            <div className="stat-val">R{Number(user?.totalSpent ?? 1240).toLocaleString("en-ZA")}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Avg Rating Given</div>
            <div className="stat-val">{user?.rating ?? 4.9}</div>
          </div>
        </div>

        <div className="card" style={{ display: "flex", gap: 10, padding: "12px 16px", marginBottom: 16 }}>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "var(--radius-xs)", padding: "7px 12px", color: "var(--text)", fontSize: 13, flex: 1 }}
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="card">
          {trips.map((t) => (
            <div className="trip-row" key={t.id}>
              <div className="trip-icon">{t.icon}</div>
              <div className="trip-info">
                <div className="trip-route">{t.from} → {t.to}</div>
                <div className="trip-date">{t.date} · {t.driver} · {t.duration}</div>
              </div>
              <div>
                <div className="trip-amount text-p">R{t.amount}</div>
                <div style={{ textAlign: "right", marginTop: 4 }}>
                  <span className={`badge ${t.status === "completed" ? "badge-ok" : "badge-err"}`}>
                    {t.status === "completed" ? "Done" : "Cancelled"}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {trips.length === 0 && <p className="text-muted">No trips found.</p>}
        </div>
      </div>
    </div>
  );
}