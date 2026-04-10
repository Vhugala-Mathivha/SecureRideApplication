import { useMemo, useState } from "react";
import PassengerSidebar from "../../components/passenger/PassengerSidebar";
import PassengerTopbar from "../../components/passenger/PassengerTopbar";
import { useAuth } from "../../context/AuthContext";
import "../../styles/auth.css";
import "../../styles/global.css";

export default function PassengerProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const [editing, setEditing] = useState(false);

  const initialName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    user?.fullNames ||
    "";

  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");

  const stats = useMemo(
    () => ({
      verified: user?.isVerified ? "Yes" : "No",
      rating: user?.rating ?? "—",
      totalTrips: user?.totalTrips ?? 0,
      accountType: user?.accountType || user?.account_type || "passenger",
    }),
    [user]
  );

  const saveProfile = () => {
    const [firstName, ...rest] = (name || "").trim().split(" ");
    const lastName = rest.join(" ");
    updateUser?.({
      firstName: firstName || "",
      lastName: lastName || "",
      fullNames: name,
      email,
      phone,
    });
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
        <PassengerTopbar
          title="My Profile"
          subtitle="Account information and preferences"
        />

        <div className="card profile-table-card">
          <div className="profile-table-header">
            <h3>Passenger Details</h3>
            <div className="profile-table-actions">
              {!editing ? (
                <button
                  className="btn btn-p btn-sm"
                  type="button"
                  onClick={() => setEditing(true)}
                >
                  Edit
                </button>
              ) : (
                <>
                  <button
                    className="btn btn-outline btn-sm"
                    type="button"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-p btn-sm"
                    type="button"
                    onClick={saveProfile}
                  >
                    Save
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="profile-table-wrap">
            <table className="profile-table">
              <tbody>
                <tr>
                  <th>Full Name</th>
                  <td>
                    {!editing ? (
                      name || "—"
                    ) : (
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={tableInputStyle}
                      />
                    )}
                  </td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>
                    {!editing ? (
                      email || "—"
                    ) : (
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={tableInputStyle}
                      />
                    )}
                  </td>
                </tr>
                <tr>
                  <th>Phone</th>
                  <td>
                    {!editing ? (
                      phone || "—"
                    ) : (
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={tableInputStyle}
                      />
                    )}
                  </td>
                </tr>
                <tr>
                  <th>Account Type</th>
                  <td style={{ textTransform: "capitalize" }}>{stats.accountType}</td>
                </tr>
                <tr>
                  <th>Verified</th>
                  <td>{stats.verified}</td>
                </tr>
                <tr>
                  <th>Rating</th>
                  <td>{stats.rating} ★</td>
                </tr>
                <tr>
                  <th>Total Trips</th>
                  <td>{stats.totalTrips}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 14 }}>
            <button className="btn btn-danger btn-sm" type="button" onClick={signOut}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const tableInputStyle = {
  width: "100%",
  maxWidth: 360,
  background: "#fff",
  border: "1px solid #d0d5dd",
  borderRadius: 8,
  padding: "8px 10px",
  fontSize: 14,
  color: "#101828",
};