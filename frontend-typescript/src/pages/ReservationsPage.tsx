import { useState } from "react";
import { createReservation, cancelReservation } from "../services/reservationService";

export default function ReservationsPage() {
  const [userId, setUserId] = useState<number | "">("");
  const [flightId, setFlightId] = useState<number | "">("");
  const [seatNumber, setSeatNumber] = useState<number | "">("");
  const [message, setMessage] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await createReservation({
        userId: Number(userId),
        flightId: Number(flightId),
        seatNumber: seatNumber === "" ? undefined : Number(seatNumber),
      });
      setMessage(res);
    } catch (err: any) {
      setMessage("Error al crear la reserva: " + (err?.response?.data || err?.message || err));
    }
  }

  async function handleCancel() {
    try {
      const res = await cancelReservation(Number(flightId), Number(userId)); // note: cancel expects reservationId, you must pass reservation id
      setMessage(res);
    } catch (err: any) {
      setMessage("Error al cancelar: " + (err?.response?.data || err?.message || err));
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Reservas</h1>
      <form onSubmit={handleCreate} className="space-y-3 bg-white p-4 rounded shadow">
        <input required value={userId} onChange={e => setUserId(e.target.value === "" ? "" : Number(e.target.value))} placeholder="userId" className="w-full p-2 border rounded"/>
        <input required value={flightId} onChange={e => setFlightId(e.target.value === "" ? "" : Number(e.target.value))} placeholder="flightId" className="w-full p-2 border rounded"/>
        <input value={seatNumber} onChange={e => setSeatNumber(e.target.value === "" ? "" : Number(e.target.value))} placeholder="seatNumber (optional)" className="w-full p-2 border rounded"/>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-green-600 text-white rounded">Crear reserva</button>
          <button type="button" onClick={handleCancel} className="px-4 py-2 bg-red-600 text-white rounded">Cancelar</button>
        </div>
      </form>
      {message && <div className="mt-4 p-3 bg-yellow-100 rounded">{message}</div>}
    </div>
  );
}