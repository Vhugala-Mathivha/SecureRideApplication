import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PassengerSidebar from "../../components/passenger/PassengerSidebar";
import PassengerTopbar from "../../components/passenger/PassengerTopbar";
import "../../styles/auth.css";
import "../../styles/global.css";

export default function ActiveTripPage() {
  const location = useLocation();

  // fallback demo trip if nothing is selected yet
  const fallbackTrip = {
    id: "DEMO-001",
    pickup: "Menlyn Mall",
    destination: "Hatfield Square",
    eta: "8 min",
    distance: "2.6 km",
    fare: 48,
    progress: 62,
    status: "active",
    driverName: "Thabo Molefe",
    vehicle: "Toyota Corolla",
    plate: "GP 124-567",
    rating: 5,
    gradient: "linear-gradient(135deg,#0099FF,#6C63FF)",
    initials: "TM",
    paymentMethod: "card",
    rideType: "standard",
    requestedAt: new Date().toLocaleTimeString(),
    date: new Date().toLocaleDateString(),
  };

  const [trip, setTrip] = useState(fallbackTrip);

  useEffect(() => {
    const navTrip = location.state?.trip || null;

    if (navTrip) {
      const normalized = {
        ...fallbackTrip,
        ...navTrip,
        pickup: navTrip.pickup || navTrip.from || fallbackTrip.pickup,
        destination: navTrip.destination || navTrip.to || fallbackTrip.destination,
        eta: navTrip.eta || (navTrip.etaMinutes ? `${navTrip.etaMinutes} min` : fallbackTrip.eta),
        distance:
          navTrip.distance ||
          (navTrip.distanceKm != null ? `${navTrip.distanceKm} km` : fallbackTrip.distance),
        driverName:
          navTrip.driverName || navTrip.driver?.name || fallbackTrip.driverName,
        vehicle:
          navTrip.vehicle || navTrip.driver?.vehicle || fallbackTrip.vehicle,
        plate:
          navTrip.plate || navTrip.driver?.plate || fallbackTrip.plate,
        rating:
          Number(navTrip.rating || navTrip.driver?.rating || fallbackTrip.rating),
        gradient:
          navTrip.gradient || navTrip.driver?.gradient || fallbackTrip.gradient,
        initials:
          navTrip.initials ||
          navTrip.driver?.initials ||
          (navTrip.driverName || navTrip.driver?.name || "DR")
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase(),
        status: navTrip.status || "active",
      };

      setTrip(normalized);
      localStorage.setItem("active_trip", JSON.stringify(normalized));
      return;
    }

    const saved = JSON.parse(localStorage.getItem("active_trip") || "null");
    if (saved) setTrip({ ...fallbackTrip, ...saved });
  }, [location.state]);

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
          <div className="map-label">{trip.pickup}</div>
          <div className="map-dest">{trip.destination}</div>
        </div>

        <div className="card">
          <div className="eta-row">
            <div className="eta-block">
              <div className="eta-label">ETA</div>
              <div className="eta-val text-p">{trip.eta}</div>
            </div>
            <div className="eta-block">
              <div className="eta-label">Distance</div>
              <div className="eta-val">{trip.distance}</div>
            </div>
            <div className="eta-block">
              <div className="eta-label">Fare</div>
              <div className="eta-val">R{trip.fare ?? "N/A"}</div>
            </div>
          </div>

          <div className="trip-progress">
            <div className="trip-bar" style={{ width: `${trip.progress || 15}%` }} />
          </div>
          <div className="progress-note">{trip.progress || 15}% of journey complete</div>
        </div>

        <div className="card mt">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="driver-avatar" style={{ width: 48, height: 48, background: trip.gradient }}>
              {trip.initials}
            </div>
            <div className="driver-info">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div className="driver-name">{trip.driverName}</div>
                <span className="badge badge-p">✓ Verified</span>
              </div>
              <div className="driver-meta">
                {trip.vehicle} · {trip.plate}
              </div>
              <div className="stars">{"★".repeat(Number(trip.rating || 0))}</div>
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