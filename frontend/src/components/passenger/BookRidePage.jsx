import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PassengerSidebar from "../../components/passenger/PassengerSidebar";
import PassengerTopbar from "../../components/passenger/PassengerTopbar";
import { apiRequest } from "../../api/client"; // adjust path if different
import "../../styles/auth.css";
import "../../styles/global.css";

export default function BookRidePage() {
  const navigate = useNavigate();

  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [rideType, setRideType] = useState("standard");
  const [payment, setPayment] = useState("card");

  const [drivers, setDrivers] = useState([]);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const searchDrivers = async () => {
    setError("");
    setSuccess("");

    if (!pickup.trim()) {
      setError("Please enter pickup location.");
      return;
    }

    if (!destination.trim()) {
      setError("Please enter destination.");
      return;
    }

    try {
      setLoadingDrivers(true);

      const res = await apiRequest("/passenger/drivers", {
        method: "GET",
      });

      const list = Array.isArray(res) ? res : res.drivers || [];

      setDrivers(list);
      if (!list.length) {
        setError("No registered drivers found yet.");
      } else {
        setSuccess(`Found ${list.length} registered driver(s).`);
      }
    } catch (err) {
      setDrivers([]);
      setError(err.message || "Failed to load drivers.");
    } finally {
      setLoadingDrivers(false);
    }
  };

  const selectDriver = (driver) => {
    const now = new Date();

    // Active trip (for ActiveTripPage)
    const activeTrip = {
      id: Date.now(),
      pickup: pickup || "N/A",
      destination: destination || "N/A",
      date: now.toLocaleDateString(),
      requestedAt: now.toLocaleTimeString(),
      arrivalTime: driver.arrivalTime || "N/A",
      status: "active",
      driverName: driver.name || "Driver",
      vehicle: driver.vehicle || "N/A",
      plate: driver.plate || "N/A",
      distance: driver.distance || "N/A",
      eta: driver.eta || "N/A",
      fare: driver.fare != null ? Number(driver.fare) : null,
      paymentMethod: payment || "N/A",
      rideType: rideType || "standard",
      rating: Number(driver.rating || 0),
      gradient: driver.gradient || "linear-gradient(135deg,#1f7a1f,#256f1d)",
      initials:
        (
          driver.initials ||
          driver.name?.split(" ").map((n) => n[0]).join("").slice(0, 2) ||
          "DR"
        ).toUpperCase(),
      progress: 15,
    };

    // History trip (for TripHistoryPage)
    const historyTrip = {
      ...activeTrip,
      status: "completed",
      progress: 100,
    };

    // Save active trip
    localStorage.setItem("active_trip", JSON.stringify(activeTrip));

    // Save history (newest first)
    const existingHistory = JSON.parse(localStorage.getItem("trip_history") || "[]");
    localStorage.setItem("trip_history", JSON.stringify([historyTrip, ...existingHistory]));

    // Navigate with trip state
    navigate("/passenger/active-trip", { state: { driver, trip: activeTrip } });
  };

  return (
    <div className="shell">
      <PassengerSidebar />
      <div className="main">
        <PassengerTopbar
          title="Book a Ride"
          subtitle="Find a verified driver near you"
        />

        <div className="auth-card" style={{ gridTemplateColumns: "1fr", marginBottom: 18 }}>
          <div className="auth-right" style={{ maxWidth: 820, margin: "0 auto", width: "100%" }}>
            <h1 style={{ marginBottom: 6 }}>Ride Information</h1>
            <p className="subtitle">Fill in your trip details to find nearby drivers.</p>

            {error && <div className="form-error">{error}</div>}
            {success && <div className="form-success">{success}</div>}

            <div className="auth-form">
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
                  <select value={rideType} onChange={(e) => setRideType(e.target.value)}>
                    <option value="standard">SecureRide Standard</option>
                    <option value="plus">SecureRide Plus</option>
                    <option value="xl">SecureRide XL</option>
                  </select>
                </div>

                <div className="field">
                  <label>Payment</label>
                  <select value={payment} onChange={(e) => setPayment(e.target.value)}>
                    <option value="card">Visa •••• 4921</option>
                    <option value="cash">Cash</option>
                    <option value="payfast">PayFast</option>
                  </select>
                </div>
              </div>

              <button className="btn-primary" type="button" onClick={searchDrivers} disabled={loadingDrivers}>
                {loadingDrivers ? "Finding drivers..." : "Find Driver"}
              </button>
            </div>
          </div>
        </div>

        <div className="section-title mt-l">Registered SecureRide Drivers</div>

        <div id="drivers-list">
          {!loadingDrivers && drivers.length === 0 ? (
            <div className="card">
              <div style={{ color: "var(--text2)", fontSize: 14 }}>
                Click <strong>Find Driver</strong> to load registered drivers.
              </div>
            </div>
          ) : null}

          {drivers.map((d) => (
            <div className="driver-card" key={d.id}>
              <div
                className="driver-avatar"
                style={{
                  background: d.gradient || "linear-gradient(135deg,#1f7a1f,#256f1d)",
                }}
              >
                {(d.initials || d.name?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "DR").toUpperCase()}
              </div>

              <div className="driver-info">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div className="driver-name">{d.name || "Driver"}</div>
                  <span className="badge badge-p">✓ Verified</span>
                </div>
                <div className="driver-meta">
                  {(d.vehicle || "Vehicle not specified")} · {(d.plate || "Plate N/A")} · {(d.distance || "N/A")}
                </div>
                <div className="stars">
                  {"★".repeat(Math.floor(Number(d.rating || 0)))}
                </div>
              </div>

              <div className="driver-price">
                <div className="driver-price-amount">
                  {d.fare != null ? `R${d.fare}` : "Fare N/A"}
                </div>
                <div className="driver-price-eta">
                  {d.eta ? `~${d.eta}` : "ETA N/A"}
                </div>
                <button
                  className="btn btn-p btn-sm"
                  style={{ marginTop: 6 }}
                  onClick={() => selectDriver(d)}
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