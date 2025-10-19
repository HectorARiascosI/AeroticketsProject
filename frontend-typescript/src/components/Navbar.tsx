import { Link, NavLink } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="font-extrabold tracking-wide text-sky-600">
          AEROTICKETS
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <NavLink className="hover:text-sky-600" to="/flights">Vuelos</NavLink>
              <NavLink className="hover:text-sky-600" to="/reservations">Mis reservas</NavLink>
              <button onClick={logout} className="text-red-600 hover:underline">Salir</button>
              <span className="text-gray-500">| {user.fullName ?? user.email}</span>
            </>
          ) : (
            <>
              <NavLink className="hover:text-sky-600" to="/login">Ingresar</NavLink>
              <NavLink className="hover:text-sky-600" to="/register">Registrarse</NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}