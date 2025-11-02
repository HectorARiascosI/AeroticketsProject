import React, { useEffect, useState } from "react";
import { searchFlights, Flight } from "../services/flightService";
import { FlightStream } from "../services/flightStream";
import { FlightCard } from "../components/FlightCard";

export default function FlightsPage() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔴 Conectar stream SSE (en vivo)
  useEffect(() => {
    const stream = new FlightStream();
    stream.connect((updated) => {
      setFlights((prev) => {
        const exists = prev.some(
          (f) =>
            f.flightNumber === updated.flightNumber &&
            f.origin === updated.origin &&
            f.destination === updated.destination
        );
        if (exists) {
          // Actualiza vuelo existente
          return prev.map((f) =>
            f.flightNumber === updated.flightNumber ? { ...f, ...updated } : f
          );
        }
        // Añadir nuevo vuelo emitido
        return [...prev, updated];
      });
    });
    return () => stream.disconnect();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    const result = await searchFlights(origin, destination, date);
    setFlights(result);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Seguimiento de vuelos en tiempo real
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Origen (ej: Bogotá o BOG)"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          className="border p-2 rounded-md w-full"
        />
        <input
          type="text"
          placeholder="Destino (ej: Medellín o MDE)"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="border p-2 rounded-md w-full"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded-md w-full"
        />
      </div>

      <button
        onClick={handleSearch}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
      >
        {loading ? "Cargando..." : "Buscar vuelos"}
      </button>

      <div className="mt-6 space-y-3">
        {flights.length === 0 && !loading ? (
          <p className="text-center text-gray-500">No hay vuelos para mostrar.</p>
        ) : (
          flights.map((f) => <FlightCard key={`${f.flightNumber}-${f.origin}`} flight={f} />)
        )}
      </div>
    </div>
  );
}