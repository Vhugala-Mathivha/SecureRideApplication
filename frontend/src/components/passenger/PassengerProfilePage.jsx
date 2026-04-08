import { useMemo, useState } from "react";
import PassengerSidebar from "../../components/passenger/PassengerSidebar";
import PassengerTopbar from "../../components/passenger/PassengerTopbar";
import { useAuth } from "../../context/AuthContext";
import "../../styles/auth.css";
import "../../styles/global.css";

export default function PassengerProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const [editing, setEditing] = useState(false);

  const initialName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.fullNames || "";
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");

  const initials = useMemo(() => {
    if (user?.initials) return user.initials;
    const [f = "", l = ""] = name.split(" ");
    return `${f[0] || ""}${l[0] || ""}`.toUpperCase() || "??";
  }, [name, user]);

  const saveProfile = () => {
    const [firstName, ...rest] = name.trim().split(" ");
    const lastName = rest.join(" ");
    updateUser?.({ firstName, lastName, email, phone, initials });
    setEditing(false);
    alert("Profile updated successfully!");
  };

  const signOut = async () => {
    const ok = window.confirm("Are you sure you want to sign out?");
    if (!ok) return;
    await logout?.();
  };

  return (
    <div className="shell">
      <PassengerSidebar />
      <div className="main">
        <PassengerTopbar title="My Profile" subtitle="Account settings and preferences" />

        <div className="card">
          <div className="profile-header">
            <div className="profile-avatar passenger">{initials}</div>
            <div className="profile-name">{name || "—"}</div>
            <div className="profile-email">{email || "—"}</div>
            <div className="profile-badges">
              <span className={`badge ${user?.isVerified ? "badge-p" : "badge-warn"}`}>
                {user?.isVerified ? "✓ Verified" : "⚠ Unverified"}
              </span>
              <span className="badge badge-info">{user?.rating ?? "—"} ★</span>
              <span className="badge badge-ok">{user?.totalTrips ?? 0} trips</span>
            </div>
          </div>

          <div className="section-title">Personal Info</div>

          <div className="profile-row">
            <span className="profile-label">Full Name</span>
            {!editing ? (
              <span className="profile-val">{name || "—"}</span>
            ) : (
              <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
            )}
          </div>

          <div className="profile-row">
            <span className="profile-label">Email</span>
            {!editing ? (
              <span className="profile-val">{email || "—"}</span>
            ) : (
              <input value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
            )}
          </div>

          <div className="profile-row">
            <span className="profile-label">Phone</span>
            {!editing ? (
              <span className="profile-val">{phone || "—"}</span>
            ) : (
              <input value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />
            )}
          </div>

          <div className="grid-2 mt-s">
            {!editing ? (
              <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}>Edit</button>
            ) : (
              <>
                <button className="btn btn-outline btn-sm" onClick={() => setEditing(false)}>Cancel</button>
                <button className="btn btn-p btn-sm" onClick={saveProfile}>Save Changes</button>
              </>
            )}
          </div>

          <button className="btn btn-danger btn-full mt" onClick={signOut}>Sign Out</button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: 220,
  background: "var(--bg3)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-xs)",
  padding: "6px 10px",
  color: "var(--text)",
  fontSize: 13,
};