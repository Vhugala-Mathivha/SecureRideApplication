import DriverSidebar from "../../components/driver/DriverSidebar";
import DriverTopbar from "../../components/driver/DriverTopbar";

export default function DriverTripHistoryPage() {
  return (
    <div className="shell">
      <DriverSidebar />
      <div className="main dashboard-green">
        <DriverTopbar title="Trip History" subtitle="Your completed and past trips" />

        <section className="card">
          <h3 className="section-title-clean">Trip History</h3>
          <p style={{ color: "#667085" }}>No trip history yet.</p>
        </section>
      </div>
    </div>
  );
}