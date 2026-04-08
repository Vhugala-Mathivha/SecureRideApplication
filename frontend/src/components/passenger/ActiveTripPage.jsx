import PassengerSidebar from "../../components/passenger/PassengerSidebar";
import PassengerTopbar from "../../components/passenger/PassengerTopbar";
import "../../styles/auth.css";
import "../../styles/global.css";

export default function ActiveTripPage() {
  const trip = {
    from: "Menlyn Mall",
    to: "Hatfield Square",
    etaMinutes: 8,
    distanceKm: 2.6,
    fare: 48,
    progress: 62,
    driver: {
      name: "Thabo Molefe",
      initials: "TM",
      plate: "GP 124-567",
      vehicle: "Toyota Corolla",
      rating: 5,
      gradient: "linear-gradient(135deg,#0099FF,#6C63FF)",
    },
  };

  const triggerSOS = () => {
    const ok = window.confirm(
      "🚨 Trigger Emergency SOS?\nAuthorities and emergency contacts will be notified."
    );
    if (ok) alert("SOS triggered! Help is on the way.");
  };

  return (
    <div className="shell">
      <PassengerSidebar />
      <div className="main">
        <PassengerTopbar title="Active Trip" subtitle="En route to destination" />

        <div style={{ textAlign: "right", marginBottom: 16, marginTop: -16 }}>
          <span className="badge badge-info">● Live</span>
        </div>

        <div className="map-area" style={{ height: 220 }}>
          <svg className="map-grid" width="100%" height="100%">
            <defs>
              <pattern id="at-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth=".5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#at-grid)" />
          </svg>
          <div className="map-pulse" />
          <div className="map-car">🚗</div>
          <div className="map-dot" style={{ top: "25%", left: "35%" }} />
          <div className="map-dot" style={{ top: "70%", left: "72%", borderColor: "var(--success)" }} />
          <div className="map-label">{trip.from}</div>
          <div className="map-dest">{trip.to}</div>
        </div>

        <div className="card">
          <div className="eta-row">
            <div className="eta-block">
              <div className="eta-label">ETA</div>
              <div className="eta-val text-p">{trip.etaMinutes} min</div>
            </div>
            <div className="eta-block">
              <div className="eta-label">Distance</div>
              <div className="eta-val">{trip.distanceKm} km</div>
            </div>
            <div className="eta-block">
              <div className="eta-label">Fare</div>
              <div className="eta-val">R{trip.fare}</div>
            </div>
          </div>

          <div className="trip-progress">
            <div className="trip-bar" style={{ width: `${trip.progress}%` }} />
          </div>
          <div className="progress-note">{trip.progress}% of journey complete</div>
        </div>

        <div className="card mt">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="driver-avatar" style={{ width: 48, height: 48, background: trip.driver.gradient }}>
              {trip.driver.initials}
            </div>
            <div className="driver-info">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div className="driver-name">{trip.driver.name}</div>
                <span className="badge badge-p">✓ Verified</span>
              </div>
              <div className="driver-meta">
                {trip.driver.vehicle} · {trip.driver.plate}
              </div>
              <div className="stars">{"★".repeat(trip.driver.rating)}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-outline btn-sm" onClick={() => alert("Calling driver…")}>📞</button>
              <button className="btn btn-outline btn-sm" onClick={() => alert("Chat coming soon")}>💬</button>
            </div>
          </div>
        </div>

        <div className="card card-accent-p mt">
          <div style={{ fontSize: 13, color: "var(--p-accent)", fontWeight: 500, marginBottom: 4 }}>
            🎤 Audio Monitoring Active
          </div>
          <div style={{ fontSize: 12, color: "var(--text2)" }}>
            AI is monitoring for distress signals.
          </div>
        </div>

        <button className="sos-btn mt" onClick={triggerSOS}>🚨 EMERGENCY SOS</button>
      </div>
    </div>
  );
}