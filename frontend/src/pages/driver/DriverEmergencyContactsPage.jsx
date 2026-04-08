import { useMemo, useState } from "react";
import DriverSidebar from "../../components/driver/DriverSidebar";
import DriverTopbar from "../../components/driver/DriverTopbar";
import "../../styles/auth.css";
import "../../styles/global.css";

export default function DriverEmergencyContactsPage() {
  const [contactName, setContactName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [relationship, setRelationship] = useState("");
  const [isPrimary, setIsPrimary] = useState(true);

  const [contacts, setContacts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [showSecondary, setShowSecondary] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const primaryContact = useMemo(
    () => contacts.find((c) => c.type === "primary") || null,
    [contacts]
  );
  const secondaryContacts = useMemo(
    () => contacts.filter((c) => c.type === "secondary"),
    [contacts]
  );

  const resetForm = () => {
    setContactName("");
    setContactNumber("");
    setRelationship("");
    setIsPrimary(true);
    setEditingId(null);
  };

  const validate = () => {
    if (!contactName.trim()) return "Contact name is required.";
    if (!contactNumber.trim()) return "Contact number is required.";
    if (!/^[+0-9()\-\s]{7,20}$/.test(contactNumber.trim())) return "Enter a valid contact number.";
    if (!relationship.trim()) return "Relationship is required.";
    return "";
  };

  const handleSave = () => {
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const type = isPrimary ? "primary" : "secondary";

    if (type === "primary") {
      const existingPrimary = contacts.find((c) => c.type === "primary" && c.id !== editingId);
      if (existingPrimary) {
        setError("A primary contact already exists. Edit/remove it first or save this as secondary.");
        return;
      }
    }

    if (editingId) {
      setContacts((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? {
                ...c,
                name: contactName.trim(),
                number: contactNumber.trim(),
                relationship: relationship.trim(),
                type,
              }
            : c
        )
      );
      setSuccess("Contact updated successfully.");
    } else {
      const newContact = {
        id: Date.now(),
        name: contactName.trim(),
        number: contactNumber.trim(),
        relationship: relationship.trim(),
        type,
      };
      setContacts((prev) => [newContact, ...prev]);
      setSuccess("Contact added successfully.");
    }

    resetForm();
  };

  const handleEdit = (contact) => {
    setError("");
    setSuccess("");
    setEditingId(contact.id);
    setContactName(contact.name);
    setContactNumber(contact.number);
    setRelationship(contact.relationship);
    setIsPrimary(contact.type === "primary");
  };

  const handleRemove = (id) => {
    setError("");
    setSuccess("");
    setContacts((prev) => prev.filter((c) => c.id !== id));
    if (editingId === id) resetForm();
    setSuccess("Contact removed.");
  };

  const ContactCard = ({ c }) => (
    <div className="driver-card" key={c.id}>
      <div
        className="driver-avatar"
        style={{ background: c.type === "primary" ? "linear-gradient(135deg,#1f7a1f,#256f1d)" : "linear-gradient(135deg,#667085,#475467)" }}
      >
        {c.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()}
      </div>

      <div className="driver-info">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="driver-name">{c.name}</div>
          <span className={c.type === "primary" ? "badge badge-p" : "chip"}>
            {c.type === "primary" ? "Primary" : "Secondary"}
          </span>
        </div>
        <div className="driver-meta">{c.number} · {c.relationship}</div>
      </div>

      <div className="driver-price">
        <button className="btn btn-outline btn-sm" onClick={() => handleEdit(c)} style={{ marginRight: 8 }}>
          Edit
        </button>
        <button className="btn btn-p btn-sm" onClick={() => handleRemove(c.id)}>
          Remove
        </button>
      </div>
    </div>
  );

  return (
    <div className="shell">
      <DriverSidebar />
      <div className="main">
        <DriverTopbar
          title="Emergency Contacts"
          subtitle="Add trusted contacts for trip safety"
        />

        <div className="auth-card" style={{ gridTemplateColumns: "1fr", marginBottom: 18 }}>
          <div className="auth-right" style={{ maxWidth: 820, margin: "0 auto", width: "100%" }}>
            <h1 style={{ marginBottom: 6 }}>Emergency Contact Information</h1>
            <p className="subtitle">Add a primary contact and optional secondary contacts.</p>

            {error && <div className="form-error">{error}</div>}
            {success && <div className="form-success">{success}</div>}

            <div className="auth-form">
              <div className="field">
                <label>Contact Name</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                />
              </div>

              <div className="grid-2">
                <div className="field">
                  <label>Contact Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +27 82 123 4567"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label>Relationship</label>
                  <input
                    type="text"
                    placeholder="e.g. Parent, Spouse, Friend"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                  />
                </div>
              </div>

              <label className="consent-check">
                <input
                  type="checkbox"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                />
                <span>Set as Primary Contact</span>
              </label>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button className="btn-primary" type="button" onClick={handleSave}>
                  {editingId ? "Update Contact" : "Add Contact"}
                </button>
                {editingId ? (
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={resetForm}
                  >
                    Cancel Edit
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="section-title">Primary Contact</div>
        <div id="drivers-list" style={{ marginBottom: 14 }}>
          {primaryContact ? (
            <ContactCard c={primaryContact} />
          ) : (
            <div className="card">
              <div style={{ color: "var(--text2)", fontSize: 14 }}>No primary contact added yet.</div>
            </div>
          )}
        </div>

        <div className="section-title">Secondary Contacts</div>
        <div className="card" style={{ marginBottom: 10 }}>
          <button
            className="btn btn-p"
            type="button"
            onClick={() => setShowSecondary((v) => !v)}
          >
            {showSecondary ? "Hide Secondary Contacts" : "Show Secondary Contacts"}
          </button>
        </div>

        {showSecondary && (
          <div id="drivers-list">
            {secondaryContacts.length ? (
              secondaryContacts.map((c) => <ContactCard key={c.id} c={c} />)
            ) : (
              <div className="card">
                <div style={{ color: "var(--text2)", fontSize: 14 }}>No secondary contacts added yet.</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}