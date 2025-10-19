import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import ProtectedRoute from '@/auth/ProtectedRoute'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import FlightsPage from '@/pages/FlightsPage'
import MyReservationsPage from '@/pages/MyReservationsPage'
import ForgotPasswordPage from '@/pages/ForgotPasswordPage'
import ResetPasswordPage from '@/pages/ResetPasswordPage'

export default function AppRoutes() {
  return (
    <>
      <Navbar />
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
    </>
  )
}