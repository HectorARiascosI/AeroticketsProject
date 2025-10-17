import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "@/services/authService";
import { useEffect, useState, useMemo } from "react";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const nav = useNavigate();
  const location = useLocation();

  // Ocultar Navbar en rutas específicas
  const hiddenPaths = useMemo(
    () => ["/login", "/register", "/forgot-password", "/reset-password"],
    []
  );
  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }

  useEffect(() => {
    const token = localStorage.getItem("vueler_token");
    const userStr = localStorage.getItem("vueler_user");
    setLoggedIn(!!token);

    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setUserName(u.fullName || null);
      } catch {
        setUserName(null);
      }
    } else {
      setUserName(null);
    }
  }, [location.pathname]);

  function handleLogout() {
    logout();
    setLoggedIn(false);
    nav("/login");
  }

  const linkClass = (path: string) =>
    `text-sm px-2 py-1 rounded ${
      location.pathname.startsWith(path)
        ? "text-blue-700 font-semibold bg-blue-50"
        : "text-gray-600 hover:text-blue-600"
    }`;

  return (
    <nav className="bg-white shadow px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/flights" className="text-xl font-bold text-blue-600">
            Vueler
          </Link>
          <Link to="/flights" className={linkClass("/flights")}>
            Vuelos
          </Link>
          <Link to="/reservations" className={linkClass("/reservations")}>
            Mis Reservas
          </Link>
        </div>

        {loggedIn ? (
          <div className="flex items-center gap-3">
            {userName && (
              <span className="text-gray-700 text-sm">👤 {userName}</span>
            )}
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