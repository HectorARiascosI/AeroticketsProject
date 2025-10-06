import { useState } from "react";
import { registerUser } from "../services/userService";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [createdId, setCreatedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null); setCreatedId(null); setLoading(true);
    try {
      const res = await registerUser({ fullName, email, password });
      setResult(`Usuario creado: ${res.fullName} (ID: ${res.id})`);
      setCreatedId(res.id);
      setPassword("");
    } catch (err: any) {
      setResult("Error registrando: " + (err?.response?.data || err?.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Crear cuenta</h1>
      <form onSubmit={handleSubmit} className="space-y-3 bg-white p-4 rounded shadow">
        <input required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Nombre completo" className="w-full p-2 border rounded" />
        <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Correo" className="w-full p-2 border rounded" />
        <input required type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" className="w-full p-2 border rounded" />
        <div><button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? "Creando..." : "Crear cuenta"}</button></div>
      </form>

      {result && <div className="mt-4 p-3 bg-green-50 rounded text-sm">{result}</div>}
      {createdId && <div className="mt-4 p-3 bg-gray-50 rounded text-sm">Guarda tu <strong>userId</strong>: <code>{createdId}</code></div>}
    </div>
  );
}