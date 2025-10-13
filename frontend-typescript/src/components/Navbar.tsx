import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "@/services/authService";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const nav = useNavigate();
  const location = useLocation();

  // Ocultar Navbar en rutas específicas
  const hiddenPaths = ["/login", "/register"];
  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }

  useEffect(() => {
    const token = localStorage.getItem("vueler_token");
    const user = localStorage.getItem("vueler_user");
    setLoggedIn(!!token);
    if (user) {
      try {
        const parsed = JSON.parse(user);
        setUserName(parsed.fullName || null);
      } catch {
        setUserName(null);
      }
    }
  }, [location.pathname]); // se actualiza si cambia la ruta

  function handleLogout() {
    logout();
    setLoggedIn(false);
    nav("/login");
  }

  return (
    <nav className="bg-white shadow px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/flights" className="text-xl font-bold text-blue-600">
            Aerotickets
          </Link>
          <Link to="/flights" className="text-sm text-gray-600 hover:text-blue-600">
            Vuelos
          </Link>
        </div>

        {loggedIn ? (
          <div className="flex items-center gap-3">
            {userName && <span className="text-gray-700 text-sm">👤 {userName}</span>}
            <button
              onClick={handleLogout}
              className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-gray-600 hover:text-blue-600">
              Iniciar sesión
            </Link>
            <Link to="/register" className="text-sm text-gray-600 hover:text-blue-600">
              Registrarse
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}