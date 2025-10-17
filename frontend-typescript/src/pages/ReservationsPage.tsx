import { useEffect, useMemo, useState } from "react";
import {
  getMyReservations,
  createReservation,
  cancelReservation,
} from "@/services/reservationService";

// Tipos locales para no romper tu proyecto si aún no tienes /types formales
type Flight = {
  id: number;
  airline: string;
  origin: string;
  destination: string;
  departureAt?: string;
  arriveAt?: string;
  price?: number | string;
  totalSeats?: number;
};

type Reservation = {
  id: number;
  seatNumber?: number | null;
  status: "ACTIVE" | "CANCELLED";
  createdAt?: string;
  flight: Flight;
};

function formatDateTime(iso?: string) {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString("es-CO");
  } catch {
    return iso;
  }
}

export default function ReservationsPage() {
  // Listado
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Crear reserva (simple): flightId + seatNumber opcional
  const [flightId, setFlightId] = useState<number | "">("");
  const [seatNumber, setSeatNumber] = useState<number | "">("");
  const [creating, setCreating] = useState(false);

  // UI
  const [toast, setToast] = useState<string | null>(null);
  const [cancelingId, setCancelingId] = useState<number | null>(null);

  // Ordenamos por fecha de creación desc si viene
  const orderedReservations = useMemo(() => {
    return [...reservations].sort((a, b) => {
      const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return tB - tA;
    });
  }, [reservations]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const data = await getMyReservations();
      setReservations(data || []);
    } catch (e: any) {
      setErr(
        "No fue posible cargar tus reservas. " +
          (e?.response?.data || e?.message || "")
      );
    } finally {
      setLoading(false);
    }
  }

  async function onCreateReservation(e: React.FormEvent) {
    e.preventDefault();
    if (flightId === "" || Number.isNaN(Number(flightId))) {
      setToast("Ingresa un flightId válido.");
      return;
    }
    setCreating(true);
    setToast(null);
    try {
      await createReservation({
        flightId: Number(flightId),
        seatNumber: seatNumber === "" ? undefined : Number(seatNumber),
      });
      setToast("✅ Reserva creada correctamente.");
      setFlightId("");
      setSeatNumber("");
      await load();
    } catch (e: any) {
      setToast(
        "❌ Error al crear la reserva: " +
          (e?.response?.data || e?.message || "Intenta nuevamente")
      );
    } finally {
      setCreating(false);
    }
  }

  async function onCancelReservation(id: number) {
    if (!id) return;
    const confirm = window.confirm(
      "¿Seguro deseas cancelar esta reserva? Esta acción no se puede deshacer."
    );
    if (!confirm) return;

    setCancelingId(id);
    setToast(null);
    try {
      await cancelReservation(id);
      setToast("✅ Reserva cancelada correctamente.");
      await load();
    } catch (e: any) {
      setToast(
        "❌ No se pudo cancelar: " +
          (e?.response?.data || e?.message || "Intenta nuevamente")
      );
    } finally {
      setCancelingId(null);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">🎟️ Mis Reservas</h1>

      {/* Crear reserva rápida (desde flightId) */}
      <div className="bg-white rounded shadow p-4 mb-6">
        <h2 className="font-semibold mb-2">Crear nueva reserva</h2>
        <p className="text-sm text-gray-600 mb-3">
          Ingresa el <strong>ID del vuelo</strong> que deseas reservar. El sistema
          tomará automáticamente tu usuario desde el token (JWT). El asiento es
          opcional y puedes dejarlo vacío para asignación automática.
        </p>
        <form onSubmit={onCreateReservation} className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-sm text-gray-700">ID de vuelo</label>
            <input
              className="w-48 border p-2 rounded block"
              placeholder="p.ej. 3"
              value={flightId}
              onChange={(e) =>
                setFlightId(e.target.value === "" ? "" : Number(e.target.value))
              }
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-700">Asiento (opcional)</label>
            <input
              className="w-48 border p-2 rounded block"
              placeholder="p.ej. 12"
              value={seatNumber}
              onChange={(e) =>
                setSeatNumber(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            />
          </div>
          <button
            className={`px-4 py-2 rounded text-white ${
              creating ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            }`}
            disabled={creating}
          >
            {creating ? "Creando..." : "Crear reserva"}
          </button>
        </form>
      </div>

      {/* Toast */}
      {toast && (
        <div className="mb-4 p-3 rounded bg-blue-50 border border-blue-200 text-blue-800">
          {toast}
        </div>
      )}

      {/* Listado */}
      <div className="bg-white rounded shadow">
        <div className="border-b px-4 py-3 font-semibold">Historial</div>

        {loading ? (
          <div className="p-6 text-gray-600">Cargando reservas...</div>
        ) : err ? (
          <div className="p-6 text-red-600">{err}</div>
        ) : orderedReservations.length === 0 ? (
          <div className="p-6">Aún no tienes reservas registradas.</div>
        ) : (
          <ul className="divide-y">
            {orderedReservations.map((r) => (
              <li key={r.id} className="p-4 flex justify-between gap-6">
                <div>
                  <div className="font-medium">
                    ✈️ {r.flight?.airline || "—"} — {r.flight?.origin} →{" "}
                    {r.flight?.destination}
                  </div>
                  <div className="text-sm text-gray-600">
                    Salida: {formatDateTime(r.flight?.departureAt)} — Llegada:{" "}
                    {formatDateTime(r.flight?.arriveAt)}
                  </div>
                  <div className="text-sm">
                    Asiento:{" "}
                    <strong>{r.seatNumber ?? "Asignación automática"}</strong>
                  </div>
                  <div className="text-sm">
                    Estado:{" "}
                    <span
                      className={`font-semibold ${
                        r.status === "ACTIVE"
                          ? "text-green-700"
                          : "text-gray-500"
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                  {r.createdAt && (
                    <div className="text-xs text-gray-500">
                      Reservado el {formatDateTime(r.createdAt)}
                    </div>
                  )}
                </div>

                <div className="flex items-center">
                  <button
                    onClick={() => onCancelReservation(r.id)}
                    className={`px-3 py-1 rounded text-white ${
                      r.status !== "ACTIVE" || cancelingId === r.id
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                    disabled={r.status !== "ACTIVE" || cancelingId === r.id}
                  >
                    {cancelingId === r.id ? "Cancelando..." : "Cancelar"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}