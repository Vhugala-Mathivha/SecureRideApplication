import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/auth.css";
import ProgressStepper from "../../components/ProgressStepper";

export default function CarDetailsPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [car, setCar] = useState({
    make: "",
    model: "",
    year: "",
    plateNumber: "",
    color: "",
    licenseExpiryDate: "",
    licensePhoto: null,
  });

  const [licenseFileName, setLicenseFileName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCar((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setCar((prev) => ({ ...prev, licensePhoto: file }));
    setLicenseFileName(file ? file.name : "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!car.licensePhoto) {
      alert("Please upload your licence photo.");
      return;
    }

    // Save in auth user state (mock storage flow)
    updateUser({
      carDetailsCompleted: true,
      carDetails: {
        make: car.make,
        model: car.model,
        year: car.year,
        plateNumber: car.plateNumber,
        color: car.color,
        licenseExpiryDate: car.licenseExpiryDate,
        licensePhotoName: licenseFileName,
      },
    });

    navigate("/driver/verification-consent");
  };

  if (!user) return null;

  return (
    <div className="auth-page driver-page">
      <div className="auth-card driver-card">
        <div className="auth-left driver-left">
          <div className="watermark">DR</div>
          <div className="brand-content">
            <h2>Driver Profile Setup</h2>
            <p>
              Complete your car and licence details to unlock trip access.
              This helps keep the platform safe and verified.
            </p>
          </div>
          <div className="left-footer">
            <span>Clover</span>
            <span>Sprout</span>
            <span>Willow</span>
            <span>Meadow</span>
          </div>
        </div>

        <div className="auth-right">
          <ProgressStepper currentStep={1} />

          <h1>Car Details</h1>
          <p className="subtitle">
            Please provide your vehicle and licence information.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field">
              <label>Car Make</label>
              <input
                name="make"
                type="text"
                placeholder="e.g. Toyota"
                value={car.make}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label>Car Model</label>
              <input
                name="model"
                type="text"
                placeholder="e.g. Corolla"
                value={car.model}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label>Year</label>
              <input
                name="year"
                type="number"
                placeholder="e.g. 2020"
                value={car.year}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label>Plate Number</label>
              <input
                name="plateNumber"
                type="text"
                placeholder="e.g. CA 123-456"
                value={car.plateNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label>Vehicle Color</label>
              <input
                name="color"
                type="text"
                placeholder="e.g. White"
                value={car.color}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label>Licence Expiry Date</label>
              <input
                name="licenseExpiryDate"
                type="date"
                value={car.licenseExpiryDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label>Upload Licence Photo</label>
              <label className="file-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
                <span>{licenseFileName || "Choose licence photo"}</span>
              </label>
            </div>

            <button className="btn-primary driver-btn" type="submit">
              Save & Continue to Face Verification
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}