import { useEffect, useState } from "react";
import { getAllFlights } from "../services/flightService";
import { createReservation } from "../services/reservationService";
import type { Flight } from "../types";

function formatDate(iso?: string) {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString("es-CO");
  } catch {
    return iso;
  }
}

export default function FlightsPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [selected, setSelected] = useState<Flight | null>(null);
  const [userId, setUserId] = useState<number | "">("");
  const [seat, setSeat] = useState<number | "">("");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const data = await getAllFlights();
      setFlights(data);
    } catch (e: any) {
      setErr("Error al cargar vuelos: " + (e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  async function handleReserve(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    if (!userId) {
      setMsg("Ingresa tu userId.");
      return;
    }
    const payload = {
      userId: Number(userId),
      flightId: selected.id,
      seatNumber: seat === "" ? null : Number(seat),
    };
    try {
      const resText = await createReservation(payload);
      setMsg(resText);
      setSelected(null);
      setUserId("");
      setSeat("");
      load();
    } catch (err: any) {
      setMsg("Error: " + (err?.response?.data || err?.message || err));
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">✈️ Vuelos</h1>
      {loading ? <p>Cargando...</p> : err ? <p className="text-red-600">{err}</p> : (
        <div className="space-y-4">
          {flights.map(f => (
            <div key={f.id} className="p-4 bg-white rounded shadow flex justify-between">
              <div>
                <div className="font-semibold">{f.airline} — {f.origin} → {f.destination}</div>
                <div className="text-sm text-gray-600">{formatDate(f.departureAt)} → {formatDate(f.arriveAt)}</div>
                <div className="text-sm mt-1">Precio: <strong>${Number(f.price).toLocaleString()}</strong></div>
                <div className="text-sm text-gray-500">Asientos totales: {f.totalSeats}</div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <button onClick={() => setSelected(f)} className="px-3 py-1 bg-blue-600 text-white rounded">Reservar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h2 className="font-semibold mb-2">Reservar — {selected.airline} {selected.origin}→{selected.destination}</h2>
            <form onSubmit={handleReserve} className="space-y-3">
              <input placeholder="Tu userId" value={userId} onChange={e => setUserId(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-2 border rounded"/>
              <input placeholder="Nro asiento (opcional)" value={seat} onChange={e => setSeat(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-2 border rounded"/>
              <div className="flex justify-between">
                <button className="px-4 py-2 bg-green-600 text-white rounded">Confirmar</button>
                <button type="button" onClick={() => setSelected(null)} className="px-3 py-1 border rounded">Cerrar</button>
              </div>
            </form>
            {msg && <p className="mt-3">{msg}</p>}
          </div>
        </div>
      )}
    </div>
  );
}