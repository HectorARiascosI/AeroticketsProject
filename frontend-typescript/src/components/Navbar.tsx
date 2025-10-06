import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-bold text-blue-600">Aerotickets</Link>
          <Link to="/flights" className="text-sm text-gray-600 hover:text-blue-600">Vuelos</Link>
          <Link to="/register" className="text-sm text-gray-600 hover:text-blue-600">Registrarse</Link>
        </div>
      </div>
    </nav>
  );
}