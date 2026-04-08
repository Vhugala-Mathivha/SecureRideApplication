import { useState } from "react";
import PassengerSidebar from "../../components/passenger/PassengerSidebar";
import PassengerTopbar from "../../components/passenger/PassengerTopbar";
import "../../styles/auth.css";
import "../../styles/global.css";

export default function BookRidePage() {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [rideType, setRideType] = useState("standard");
  const [payment, setPayment] = useState("card");

  const [drivers, setDrivers] = useState([
    {
      id: 1,
      name: "Thabo Molefe",
      initials: "TM",
      plate: "GP 124-567",
      vehicle: "Toyota Corolla",
      distance: "2.4 km",
      eta: "6 min",
      fare: 44,
      rating: 5.0,
      gradient: "linear-gradient(135deg,#0099FF,#6C63FF)",
    },
    {
      id: 2,
      name: "Nomsa Khumalo",
      initials: "NK",
      plate: "GP 089-234",
      vehicle: "Hyundai i20",
      distance: "3.1 km",
      eta: "8 min",
      fare: 41,
      rating: 4.8,
      gradient: "linear-gradient(135deg,#6C63FF,#FF6B35)",
    },
    {
      id: 3,
      name: "James Pretorius",
      initials: "JP",
      plate: "GP 311-890",
      vehicle: "VW Polo",
      distance: "4.8 km",
      eta: "11 min",
      fare: 38,
      rating: 5.0,
      gradient: "linear-gradient(135deg,#00B894,#0099FF)",
    },
  ]);

  const searchDrivers = () => {
    if (!destination.trim()) {
      alert("Please enter a destination.");
      return;
    }

    // TODO: Replace with backend API call
    // Example:
    // const result = await api.get(`/passenger/nearby-drivers?...`);
    // setDrivers(result);

    // Demo refresh
    setDrivers((prev) => [...prev]);
  };

  const selectDriver = (id) => {
    alert(`Driver selected (ID: ${id})! Redirecting to active trip...`);
    window.location.href = "/passenger/active-trip";
  };

  return (
    <div className="shell">
      <PassengerSidebar />

      <div className="main">
        <PassengerTopbar
          title="Book a Ride"
          subtitle="Find a verified driver near you"
        />

        <div className="map-area" style={{ height: 160 }}>
          <svg className="map-grid" width="100%" height="100%">
            <defs>
              <pattern
                id="book-ride-grid"
                width="30"
                height="30"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 30 0 L 0 0 0 30"
                  fill="none"
                  stroke="white"
                  strokeWidth=".5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#book-ride-grid)" />
          </svg>

          <div className="map-pulse" />
          <div className="map-car">📍</div>
          <div className="map-label">{pickup || "Locating you…"}</div>
        </div>

        <div className="card">
          <div className="field">
            <label>Pickup Location</label>
            <input
              type="text"
              placeholder="Enter pickup address"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Destination</label>
            <input
              type="text"
              placeholder="Where to?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>

          <div className="grid-2">
            <div className="field">
              <label>Ride Type</label>
              <select
                value={rideType}
                onChange={(e) => setRideType(e.target.value)}
              >
                <option value="standard">SecureRide Standard</option>
                <option value="plus">SecureRide Plus</option>
                <option value="xl">SecureRide XL</option>
              </select>
            </div>

            <div className="field">
              <label>Payment</label>
              <select
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
              >
                <option value="card">Visa •••• 4921</option>
                <option value="cash">Cash</option>
                <option value="payfast">PayFast</option>
              </select>
            </div>
          </div>

          <button className="btn btn-p btn-full" onClick={searchDrivers}>
            Find Verified Driver
          </button>
        </div>

        <div className="section-title mt-l">Nearby Verified Drivers</div>
        <div id="drivers-list">
          {drivers.map((d) => (
            <div className="driver-card" key={d.id}>
              <div className="driver-avatar" style={{ background: d.gradient }}>
                {d.initials}
              </div>

              <div className="driver-info">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div className="driver-name">{d.name}</div>
                  <span className="badge badge-p">✓ Verified</span>
                </div>
                <div className="driver-meta">
                  {d.vehicle} · {d.plate} · {d.distance}
                </div>
                <div className="stars">
                  {"★".repeat(Math.floor(d.rating))}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>
                  R{d.fare}
                </div>
                <div style={{ fontSize: 11, color: "var(--text2)" }}>
                  ~{d.eta}
                </div>
                <button
                  className="btn btn-p btn-sm"
                  style={{ marginTop: 6 }}
                  onClick={() => selectDriver(d.id)}
                >
                  Select
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}