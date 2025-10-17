import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "@/services/api";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/reset-password", {
        token,
        newPassword,
      });
      setMsg(data);
    } catch (err: any) {
      setMsg(err?.response?.data || "Error al actualizar la contraseña");
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow max-w-md w-full">
        <h1 className="text-xl font-bold mb-4 text-center">
          Nueva contraseña
        </h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="password"
            className="w-full border p-2 rounded"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button className="bg-green-600 text-white px-4 py-2 rounded w-full">
            Guardar nueva contraseña
          </button>
        </form>
        {msg && <p className="mt-3 text-center text-gray-700">{msg}</p>}
      </div>
    </div>
  );
}