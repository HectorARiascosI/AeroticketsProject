import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import FlightsPage from "./pages/FlightsPage";
import RegisterPage from "./pages/RegisterPage";
import ReservationsPage from "./pages/ReservationsPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Navigate to="/flights" replace />} />
          <Route path="/flights" element={<FlightsPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reservations" element={<ReservationsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}