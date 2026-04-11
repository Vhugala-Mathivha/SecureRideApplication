import { useState } from "react";
import ProgressStepper from "../../components/ProgressStepper";
import "../../styles/auth.css";

export default function UploadIdPage({ onNext }) { // Received onNext from RegisterPage
  const [docType, setDocType] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleNext = async () => {
    setError("");
    setSuccess("");

    if (!docType) {
      setError("Please select ID type.");
      return;
    }
    if (!file) {
      setError("Please upload your ID document.");
      return;
    }

    try {
      setUploading(true);

      // 1. Prepare data for Cloudinary
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("upload_preset", "secureride_docs"); // Your Unsigned Preset Name

      // 2. Upload to your Cloud Name: dziumltnl
      const response = await fetch("https://api.cloudinary.com/v1_1/dziumltnl/image/upload", {
        method: "POST",
        body: uploadData,
      });

      if (!response.ok) throw new Error("Upload failed. Please check your connection.");

      const result = await response.json();
      const imageUrl = result.secure_url; // This is the link we save to MySQL

      setSuccess("ID uploaded successfully to cloud.");

      // 3. Pass the URL back to RegisterPage
      // This merges documentPath and documentType into the 'collected' state
      setTimeout(() => {
        onNext({
          documentType: docType,
          documentPath: imageUrl,
        });
      }, 800);

    } catch (err) {
      setError(err.message || "Failed to upload to cloud.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ gridTemplateColumns: "1fr" }}>
        <div className="auth-right" style={{ maxWidth: 700, margin: "0 auto", width: "100%" }}>
          <ProgressStepper currentStep={3} />

          <h1>Upload Identification</h1>
          <p className="subtitle">Upload your ID card or passport to proceed.</p>

          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}

          <div className="auth-form">
            <div className="field">
              <label>Document Type</label>
              <select 
                value={docType} 
                onChange={(e) => setDocType(e.target.value)}
                disabled={uploading}
              >
                <option value="">Select document type</option>
                <option value="id_card">ID Card</option>
                <option value="passport">Passport</option>
              </select>
            </div>

            <div className="field">
              <label>Upload Document</label>
              <label className={`file-upload ${uploading ? 'disabled' : ''}`}>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  disabled={uploading}
                />
                <span>{file ? file.name : "Choose ID card or passport file"}</span>
              </label>
            </div>

            <button 
              className="btn-primary" 
              onClick={handleNext} 
              disabled={uploading}
            >
              {uploading ? "Uploading to Cloud..." : "Next: Face Verification"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}