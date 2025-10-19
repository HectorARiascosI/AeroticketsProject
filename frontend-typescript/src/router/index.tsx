import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/auth/ProtectedRoute";
import { Suspense, lazy } from "react";

const LoginPage = lazy(() => import("@/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));
const FlightsPage = lazy(() => import("@/pages/FlightsPage"));
const MyReservationsPage = lazy(() => import("@/pages/MyReservationsPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("@/pages/ResetPasswordPage"));

export default function AppRoutes() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="p-6">Cargando...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/flights" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route
            path="/flights"
            element={
              <ProtectedRoute>
                <FlightsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservations"
            element={
              <ProtectedRoute>
                <MyReservationsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<div className="p-6">404 — Página no encontrada</div>} />
        </Routes>
      </Suspense>
    </>
  );
}