import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import FlightsPage from "@/pages/FlightsPage";
import ReservationsPage from "@/pages/ReservationsPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import PrivateRoute from "@/components/PrivateRoute";
import Navbar from "@/components/Navbar";

function AppContent() {
  const location = useLocation();
  const isAuthPage = ["/login", "/register", "/forgot-password", "/reset-password"].includes(location.pathname);

  return (
    <div
      className={`min-h-screen ${
        isAuthPage
          ? "bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 flex items-center justify-center"
          : "bg-gray-50"
      }`}
    >
      {!isAuthPage && <Navbar />}

      <Routes>
        {/* redirección base */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Recuperación de cuenta */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Protegidas */}
        <Route
          path="/flights"
          element={
            <PrivateRoute>
              <FlightsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/reservations"
          element={
            <PrivateRoute>
              <ReservationsPage />
            </PrivateRoute>
          }
        />

        {/* 404 opcional */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}