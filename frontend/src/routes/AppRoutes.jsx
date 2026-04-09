import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";

import WelcomePage from "../pages/driver/WelcomePage";
import CarDetailsPage from "../pages/driver/CarDetailsPage";
import DriverDashboardPage from "../pages/driver/DriverDashboardPage";
import TripsPage from "../pages/driver/TripsPage";
import DriverEmergencyContactsPage from "../pages/driver/DriverEmergencyContactsPage";
import DriverTripHistoryPage from "../pages/driver/DriverTripHistoryPage";
import DriverNotificationsPage from "../pages/driver/DriverNotificationsPage";

import VerificationConsentPage from "../pages/auth/VerificationConsentPage";
import UploadIdPage from "../pages/auth/UploadIdPage";
import FaceVerificationPage from "../pages/auth/FaceVerificationPage";

import PassengerDashboardPage from "../components/passenger/PassengerDashboardPage";
import BookRidePage from "../components/passenger/BookRidePage";
import ActiveTripPage from "../components/passenger/ActiveTripPage";
import TripHistoryPage from "../components/passenger/TripHistoryPage";
import PassengerVerificationPage from "../components/passenger/PassengerVerificationPage";
import PassengerNotificationsPage from "../components/passenger/PassengerNotificationsPage";
import PassengerProfilePage from "../components/passenger/PassengerProfilePage";
import PassengerEmergencyContactsPage from "../components/passenger/PassengerEmergencyContactsPage";

import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route
          path="/welcome"
          element={
            <ProtectedRoute>
              <WelcomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/driver/dashboard"
          element={
            <ProtectedRoute>
              <DriverDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/trips"
          element={
            <ProtectedRoute>
              <TripsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/trip-history"
          element={
            <ProtectedRoute>
              <DriverTripHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/notifications"
          element={
            <ProtectedRoute>
              <DriverNotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/emergency-contacts"
          element={
            <ProtectedRoute>
              <DriverEmergencyContactsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/car-details"
          element={
            <ProtectedRoute>
              <CarDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/verification-consent"
          element={
            <ProtectedRoute>
              <VerificationConsentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/upload-id"
          element={
            <ProtectedRoute>
              <UploadIdPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/face-verification"
          element={
            <ProtectedRoute>
              <FaceVerificationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/passenger/dashboard"
          element={
            <ProtectedRoute>
              <PassengerDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/passenger/book-ride"
          element={
            <ProtectedRoute>
              <BookRidePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/passenger/active-trip"
          element={
            <ProtectedRoute>
              <ActiveTripPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/passenger/trip-history"
          element={
            <ProtectedRoute>
              <TripHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/passenger/verification"
          element={
            <ProtectedRoute>
              <PassengerVerificationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/passenger/notifications"
          element={
            <ProtectedRoute>
              <PassengerNotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/passenger/profile"
          element={
            <ProtectedRoute>
              <PassengerProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/passenger/emergency-contacts"
          element={
            <ProtectedRoute>
              <PassengerEmergencyContactsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/passenger/verification-consent"
          element={
            <ProtectedRoute>
              <VerificationConsentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/passenger/upload-id"
          element={
            <ProtectedRoute>
              <UploadIdPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/passenger/face-verification"
          element={
            <ProtectedRoute>
              <FaceVerificationPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}