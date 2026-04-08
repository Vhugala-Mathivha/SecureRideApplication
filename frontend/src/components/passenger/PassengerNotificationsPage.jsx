import { useMemo, useState } from "react";
import PassengerSidebar from "../../components/passenger/PassengerSidebar";
import PassengerTopbar from "../../components/passenger/PassengerTopbar";
import "../../styles/auth.css";
import "../../styles/global.css";

export default function PassengerNotificationsPage() {
  const [items, setItems] = useState([
    { id: 1, icon: "🍱", bg: "rgba(0,212,170,0.12)", title: "Verification step completed", body: "Your email has been successfully verified.", time: "2 hours ago", unread: true },
    { id: 2, icon: "🚗", bg: "rgba(0,153,255,0.12)", title: "Trip completed — Menlyn to Hatfield", body: "Your ride with Thabo M. is complete. Fare: R48.", time: "5 hours ago", unread: true },
    { id: 3, icon: "🎤", bg: "rgba(255,107,53,0.12)", title: "Audio monitoring reminder", body: "Enable AI audio monitoring to complete verification.", time: "Yesterday, 09:15", unread: false },
  ]);

  const unread = useMemo(() => items.filter((n) => n.unread).length, [items]);

  const markRead = (id) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  };

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <div className="shell">
      <PassengerSidebar />
      <div className="main">
        <PassengerTopbar title="Notifications" subtitle="Your alerts and updates" />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span className="badge badge-p">{unread} unread</span>
          <button className="btn btn-outline btn-sm" onClick={markAllRead}>Mark all read</button>
        </div>

        <div>
          {items.map((n) => (
            <div className="card mb" key={n.id} style={{ padding: 0 }}>
              <div className={`notif-item ${n.unread ? "notif-unread" : ""}`} style={{ padding: "14px 20px" }}>
                <div className="notif-icon" style={{ background: n.bg }}>{n.icon}</div>
                <div className="notif-text">
                  <div className="notif-title">{n.title}</div>
                  <div className="notif-sub">{n.body}</div>
                  <div className="notif-time">{n.time}</div>
                </div>
                {n.unread ? (
                  <button className="btn btn-ghost btn-sm" onClick={() => markRead(n.id)}>✕</button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}