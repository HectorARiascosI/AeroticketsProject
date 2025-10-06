import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import FlightsPage from "./pages/FlightsPage";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/flights" replace />} />
          <Route path="/flights" element={<FlightsPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* add more routes (reservations, admin, etc.) later */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}