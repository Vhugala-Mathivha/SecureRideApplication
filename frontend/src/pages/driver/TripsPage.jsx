import { useEffect, useState } from "react";
import DriverSidebar from "../../components/driver/DriverSidebar";
import DriverTopbar from "../../components/driver/DriverTopbar";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../api/client";

export default function TripsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadRequests = async () => {
      try {
        setLoading(true);
        setError("");

        // Adjust endpoint if your backend path differs
        const data = await apiRequest("/driver/trip-requests", { method: "GET" });

        if (!mounted) return;
        setRequests(Array.isArray(data) ? data : data?.requests || []);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || "Failed to load trip requests");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadRequests();
    return () => {
      mounted = false;
    };
  }, []);

  const acceptRequest = async (requestId) => {
    try {
      setBusyId(requestId);

      // Adjust endpoint if your backend path differs
      await apiRequest(`/driver/trip-requests/${requestId}/accept`, {
        method: "POST",
        body: JSON.stringify({ driverId: user?.id }),
      });

      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId ? { ...r, status: "accepted" } : r
        )
      );
    } catch (e) {
      alert(e?.message || "Failed to accept request");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="shell">
      <DriverSidebar />
      <div className="main dashboard-green">
        <DriverTopbar
          title="Available Trip Requests"
          subtitle="Passengers who have booked rides"
        />

        <section className="card">
          {loading ? (
            <p>Loading requests...</p>
          ) : error ? (
            <p style={{ color: "#b42318" }}>{error}</p>
          ) : requests.length === 0 ? (
            <p style={{ color: "#667085" }}>No available trip requests right now.</p>
          ) : (
            <div className="recent-list">
              {requests.map((req) => {
                const isAccepted = req.status === "accepted";
                const isBusy = busyId === req.id;

                return (
                  <div className="recent-item" key={req.id}>
                    <div>
                      <div className="trip-route">
                        {req.pickupLocation} → {req.dropoffLocation}
                      </div>
                      <div className="trip-sub">
                        Passenger: <strong>{req.passengerName || "Unknown"}</strong> •{" "}
                        {req.passengerPhone || "No phone"}
                      </div>
                      <div className="trip-sub">
                        Time: {req.pickupTime || "ASAP"} • Seats: {req.seats || 1}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="trip-fare">R {req.fare ?? "--"}</div>

                      <button
                        className="quick-btn"
                        disabled={isAccepted || isBusy}
                        onClick={() => acceptRequest(req.id)}
                      >
                        {isAccepted ? "Accepted" : isBusy ? "Accepting..." : "Accept Request"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}