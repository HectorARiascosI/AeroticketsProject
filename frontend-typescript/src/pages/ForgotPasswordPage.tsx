import { useState } from "react";
import api from "@/services/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      setMsg(data);
    } catch (err: any) {
      setMsg(err?.response?.data || "Error al procesar la solicitud");
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow max-w-md w-full">
        <h1 className="text-xl font-bold mb-4 text-center">
          Recuperar contraseña
        </h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            className="w-full border p-2 rounded"
            type="email"
            placeholder="Tu correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
            Enviar enlace
          </button>
        </form>
        {msg && <p className="mt-3 text-center text-gray-700">{msg}</p>}
      </div>
    </div>
  );
}