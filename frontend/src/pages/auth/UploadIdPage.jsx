import { useState } from "react";
import ProgressStepper from "../../components/ProgressStepper";
import "../../styles/auth.css";

export default function UploadIdPage({ onNext }) { 
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
      uploadData.append("upload_preset", "secureride_docs"); 

      // 2. Upload to your Cloud Name: dziumltnl
      const response = await fetch("https://api.cloudinary.com/v1_1/dziumltnl/image/upload", {
        method: "POST",
        body: uploadData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Upload failed.");
      }

      const result = await response.json();
      const imageUrl = result.secure_url; 

      setSuccess("ID uploaded successfully!");

      // 3. IMMEDIATE Step Change
      // We remove the setTimeout to ensure RegisterPage receives the command instantly
      onNext({
        documentType: docType,
        documentPath: imageUrl,
      });

    } catch (err) {
      console.error("Cloudinary Error:", err);
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
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  disabled={uploading}
                />
                <span style={{ color: file ? "#2e7d32" : "#666" }}>
                    {file ? `📄 ${file.name}` : "Click to choose ID card or passport"}
                </span>
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