import { useState } from "react";
import { loginUser } from "@/services/authService";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await loginUser({ email, password });
      nav("/flights");
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Error iniciando sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-2">
        Bienvenido a Aerotickets ✈️
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Inicia sesión para acceder a tus vuelos y reservas.
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {err && (
          <p className="text-red-600 text-center bg-red-50 py-2 rounded-md">
            {err}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md font-semibold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {loading ? "Cargando..." : "Entrar"}
        </button>
      </form>

      {/* Enlace a recuperar contraseña */}
      <div className="mt-4 text-center">
        <Link
          to="/forgot-password"
          className="text-sm text-blue-600 hover:underline font-medium"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      {/* Enlace para registro */}
      <p className="mt-4 text-center text-gray-600">
        ¿No tienes cuenta?{" "}
        <Link to="/register" className="text-blue-600 font-semibold hover:underline">
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
}