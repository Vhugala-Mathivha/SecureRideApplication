import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/auth.css";
import ProgressStepper from "../../components/ProgressStepper";

export default function CarDetailsPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [car, setCar] = useState({
    make: user?.carDetails?.make || "",
    model: user?.carDetails?.model || "",
    year: user?.carDetails?.year || "",
    plateNumber: user?.carDetails?.plateNumber || "",
    color: user?.carDetails?.color || "",
    licenseExpiryDate: user?.carDetails?.licenseExpiryDate || "",
    licensePhoto: null,
  });

  const [licenseFileName, setLicenseFileName] = useState(
    user?.carDetails?.licensePhotoName || ""
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCar((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setCar((prev) => ({ ...prev, licensePhoto: file }));
    setLicenseFileName(file ? file.name : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!car.licensePhoto && !licenseFileName) {
      alert("Please upload your licence photo.");
      return;
    }

    const vehiclePayload = {
      driverId: user?.id, 
      make: car.make,
      model: car.model,
      year: car.year,
      plateNumber: car.plateNumber,
      color: car.color,
      licenseExpiryDate: car.licenseExpiryDate,
      licensePhotoName: car.licensePhoto ? car.licensePhoto.name : licenseFileName,
    };

    try {
      // Determine if we should use localhost or the live Render API
      const isLocal = window.location.hostname === "localhost";
      const API_BASE_URL = isLocal 
        ? "http://localhost:5000" 
        : "https://secureride-api.onrender.com"; // Your actual Render URL

      const response = await fetch(`${API_BASE_URL}/api/vehicles/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vehiclePayload),
      });

      if (response.ok) {
        updateUser?.({
          carDetailsCompleted: true,
          carDetails: vehiclePayload,
          vehicleModel: `${car.make} ${car.model}`.trim(),
          licensePlate: car.plateNumber,
        });
        
        // REDIRECT TO DASHBOARD AS REQUESTED
        navigate("/driver/dashboard"); 
      } else {
        const errData = await response.json();
        alert(`Error: ${errData.error}`);
      }
    } catch (error) {
      console.error("Connection error:", error);
      alert("Failed to connect to the server. Ensure the API is running.");
    }
  };

  if (!user) return null;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-left">
          <div className="watermark">SR</div>
          <div className="brand-content">
            <h2>SecureRide</h2>
            <p>Driver safety and verification platform.</p>
          </div>
          <div className="left-footer">
            <span>About</span><span>FAQ</span><span>Support</span>
          </div>
        </div>

        <div className="auth-right">
          <ProgressStepper currentStep={1} />
          <h1>Car Details</h1>
          <p className="subtitle">Please provide your vehicle and licence information.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field">
              <label>Car Make</label>
              <input name="make" type="text" placeholder="e.g. Toyota" value={car.make} onChange={handleChange} required />
            </div>

            <div className="field">
              <label>Car Model</label>
              <input name="model" type="text" placeholder="e.g. Corolla" value={car.model} onChange={handleChange} required />
            </div>

            <div className="field">
              <label>Year</label>
              <input name="year" type="number" placeholder="e.g. 2020" value={car.year} onChange={handleChange} required />
            </div>

            <div className="field">
              <label>Plate Number</label>
              <input name="plateNumber" type="text" placeholder="e.g. CA 123-456" value={car.plateNumber} onChange={handleChange} required />
            </div>

            <div className="field">
              <label>Vehicle Color</label>
              <input name="color" type="text" placeholder="e.g. White" value={car.color} onChange={handleChange} required />
            </div>

            <div className="field">
              <label>Licence Expiry Date</label>
              <input name="licenseExpiryDate" type="date" value={car.licenseExpiryDate} onChange={handleChange} required />
            </div>

            <div className="field">
              <label>Upload Licence Photo</label>
              <label className="file-upload">
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <span>{licenseFileName || "Choose licence photo"}</span>
              </label>
            </div>

            <button className="btn-primary" type="submit">Save & Continue</button>
          </form>
        </div>
      </div>
    </div>
  );
}