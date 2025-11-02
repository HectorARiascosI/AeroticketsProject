import React, { useEffect, useMemo, useState } from "react";
import { searchFlights, Flight, autocompleteAirports } from "../services/flightService";
import { FlightStream } from "../services/flightStream";
import { FlightCard } from "../components/FlightCard";

type AirportOption = { iata: string; city: string; label: string };

export default function FlightsPage() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);

  const [origOptions, setOrigOptions] = useState<AirportOption[]>([]);
  const [destOptions, setDestOptions] = useState<AirportOption[]>([]);
  const [showOrig, setShowOrig] = useState(false);
  const [showDest, setShowDest] = useState(false);

  useEffect(() => {
    const stream = new FlightStream();
    stream.connect((updated) => {
      setFlights((prev) => {
        const idx = prev.findIndex(
          f => f.flightNumber === updated.flightNumber &&
               f.origin === updated.origin &&
               f.destination === updated.destination
        );
        if (idx >= 0) {
          const next = prev.slice();
          next[idx] = { ...next[idx], ...updated };
          return next;
        }
        return [...prev, updated];
      });
    });
    return () => stream.disconnect();
  }, []);

  async function handleSearch() {
    if (!origin || !destination) {
      alert("Por favor selecciona un origen y un destino válidos.");
      return;
    }
    setLoading(true);
    const list = await searchFlights(origin, destination, date);
    setFlights(list);
    setLoading(false);
  }

  const debounce = (fn: (...a: any[]) => void, ms = 250) => {
    let t: any;
    return (...a: any[]) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...a), ms);
    };
  };

  const loadOrig = useMemo(() => debounce(async (q: string) => {
    setOrigOptions(await autocompleteAirports(q));
  }, 250), []);

  const loadDest = useMemo(() => debounce(async (q: string) => {
    setDestOptions(await autocompleteAirports(q));
  }, 250), []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Seguimiento de vuelos en tiempo real
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2 relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Origen (ej: Bogotá o BOG)"
            value={origin}
            onChange={(e) => {
              setOrigin(e.target.value);
              setShowOrig(true);
              loadOrig(e.target.value);
            }}
            onFocus={() => setShowOrig(true)}
            className="border p-2 rounded-md w-full"
          />
          {showOrig && origOptions.length > 0 && (
            <ul
              className="absolute z-10 bg-white border rounded-md w-full mt-1 max-h-56 overflow-auto shadow"
              onMouseLeave={() => setShowOrig(false)}
            >
              {origOptions.map((o) => (
                <li
                  key={o.iata}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => {
                    setOrigin(o.iata); // ✅ ahora enviamos código IATA
                    setShowOrig(false);
                  }}
                >
                  {o.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Destino (ej: Medellín o MDE)"
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              setShowDest(true);
              loadDest(e.target.value);
            }}
            onFocus={() => setShowDest(true)}
            className="border p-2 rounded-md w-full"
          />
          {showDest && destOptions.length > 0 && (
            <ul
              className="absolute z-10 bg-white border rounded-md w-full mt-1 max-h-56 overflow-auto shadow"
              onMouseLeave={() => setShowDest(false)}
            >
              {destOptions.map((o) => (
                <li
                  key={o.iata}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => {
                    setDestination(o.iata); // ✅ enviamos código IATA
                    setShowDest(false);
                  }}
                >
                  {o.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded-md w-full"
        />
      </div>

      <div className="mb-6">
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "Cargando..." : "Buscar vuelos"}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {!loading && flights.length === 0 && (
          <p className="text-center text-gray-500 col-span-full">
            No hay vuelos para mostrar.
          </p>
        )}
        {flights.map((f) => (
          <FlightCard key={`${f.flightNumber}-${f.origin}-${f.departureAt}`} flight={f} />
        ))}
      </div>
    </div>
  );
}