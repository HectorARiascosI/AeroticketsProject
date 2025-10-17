import { useEffect, useState } from "react";
import { getAllFlights } from "@/services/flightService";
import { createReservation } from "@/services/reservationService";
import type { Flight } from "@/types";
import { Link, useNavigate } from "react-router-dom";

function formatDateTime(iso?: string) {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function FlightsPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [selected, setSelected] = useState<Flight | null>(null);
  const [seat, setSeat] = useState<number | "">("");
  const [msg, setMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadFlights();

    // Opcional: refrescar cada 30 segundos para “tiempo real”
    const interval = setInterval(() => {
      loadFlights();
    }, 30_000);

    return () => clearInterval(interval);
  }, []);

  async function loadFlights() {
    setLoading(true);
    setErr(null);
    try {
      const all = await getAllFlights();
      setFlights(all);
    } catch (e: any) {
      setErr("Error al cargar vuelos: " + (e?.response?.data || e?.message || ""));
    } finally {
      setLoading(false);
    }
  }

  async function handleReserve(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;

    // Prevalidaciones en frontend
    if (seat !== "" && (Number.isNaN(Number(seat)) || Number(seat) < 1)) {
      setMsg("El número de asiento debe ser un número válido ≥ 1.");
      return;
    }

    setMsg(null);
    try {
      await createReservation({
        flightId: selected.id,
        seatNumber: seat === "" ? undefined : Number(seat),
      });
      setMsg("✅ Reserva realizada con éxito.");
      setSelected(null);
      setSeat("");
      // navegar o refrescar reservas
      navigate("/reservations");
    } catch (err: any) {
      const errorMsg = err?.response?.data || err?.message || "Error desconocido";
      setMsg("❌ No se pudo reservar: " + errorMsg);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">✈️ Vuelos Disponibles</h1>
        <Link to="/reservations" className="text-sm underline text-gray-600 hover:text-blue-600">
          Mis reservas
        </Link>
      </div>

      {loading ? (
        <p>Cargando vuelos...</p>
      ) : err ? (
        <p className="text-red-600">{err}</p>
      ) : (
        <div className="space-y-4">
          {flights.map((f) => (
            <div
              key={f.id}
              className="p-4 bg-white rounded shadow flex justify-between items-start"
            >
              <div className="flex-1">
                <div className="font-semibold text-lg">
                  {f.airline} — {f.origin} → {f.destination}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Salida: {formatDateTime(f.departureAt)} | Llegada: {formatDateTime(f.arriveAt)}
                </div>
                <div className="text-sm mt-1">Precio: <strong>${Number(f.price).toLocaleString()}</strong></div>
                <div className="text-sm text-gray-500">Asientos totales: {f.totalSeats}</div>
                {f.totalSeats !== undefined && (
                  <div className="text-sm text-gray-500">
                    🪑 Ocupados: {/* podemos mostrar ocupados si lo retornara el backend */}
                    {f.occupiedSeats !== undefined ? f.occupiedSeats : "N/D"}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => setSelected(f)}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Reservar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h2 className="font-semibold mb-3">
              Reservar — {selected.airline} ({selected.origin} → {selected.destination})
            </h2>
            <div className="text-sm text-gray-700 mb-3">
              Salida: {formatDateTime(selected.departureAt)} <br />
              Llegada: {formatDateTime(selected.arriveAt)}
            </div>
            <form onSubmit={handleReserve} className="space-y-3">
              <input
                className="w-full p-2 border rounded"
                type="number"
                placeholder="Número de asiento (opcional)"
                min={1}
                value={seat}
                onChange={(e) =>
                  setSeat(e.target.value === "" ? "" : Number(e.target.value))
                }
              />
              <div className="flex justify-between">
                <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                  Confirmar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(null);
                    setSeat("");
                  }}
                  className="px-3 py-1 border rounded hover:bg-gray-100"
                >
                  Cerrar
                </button>
              </div>
            </form>
            {msg && <p className="mt-3 text-center">{msg}</p>}
          </div>
        </div>
      )}
    </div>
  );
}