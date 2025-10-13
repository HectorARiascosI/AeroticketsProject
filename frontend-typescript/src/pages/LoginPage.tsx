import { useState } from "react";
import { loginUser } from "@/services/authService";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      await loginUser({ email, password });
      nav("/flights");
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Error iniciando sesión");
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Inicia sesión</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border p-2" placeholder="Correo" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border p-2" type="password" placeholder="Contraseña" value={password} onChange={e=>setPassword(e.target.value)} />
        {err && <p className="text-red-600">{err}</p>}
        <button className="bg-black text-white px-4 py-2 rounded">Entrar</button>
      </form>
      <p className="mt-4">¿No tienes cuenta? <Link to="/register" className="underline">Regístrate</Link></p>
    </div>
  );
}