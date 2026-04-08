import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProgressStepper from "../../components/ProgressStepper";
import "../../styles/auth.css";

export default function UploadIdPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [docType, setDocType] = useState("");
  const [file, setFile] = useState(null);

  const rolePrefix = user?.accountType === "passenger" ? "/passenger" : "/driver";

  const handleNext = () => {
    if (!docType) return alert("Please select ID type.");
    if (!file) return alert("Please upload your ID document.");

    updateUser({
      idDocumentType: docType,
      idDocumentName: file.name,
      idDocumentUploaded: true,
    });

    navigate(`${rolePrefix}/face-verification`);
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ gridTemplateColumns: "1fr" }}>
        <div className="auth-right" style={{ maxWidth: 700, margin: "0 auto", width: "100%" }}>
          <ProgressStepper currentStep={3} />

          <h1>Upload Identification</h1>
          <p className="subtitle">Upload your ID card or passport to proceed.</p>

          <div className="auth-form">
            <div className="field">
              <label>Document Type</label>
              <select value={docType} onChange={(e) => setDocType(e.target.value)} required>
                <option value="">Select document type</option>
                <option value="id_card">ID Card</option>
                <option value="passport">Passport</option>
              </select>
            </div>

            <div className="field">
              <label>Upload Document</label>
              <label className="file-upload">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <span>{file ? file.name : "Choose ID card or passport file"}</span>
              </label>
            </div>

            <button className="btn-primary" onClick={handleNext}>
              Next: Face Verification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}