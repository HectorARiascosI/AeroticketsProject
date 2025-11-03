import React, { useEffect, useMemo, useState } from "react";
import {
  searchFlights,
  Flight,
  autocompleteAirports,
} from "../services/flightService";
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

  // 🔹 Stream de vuelos en tiempo real
  useEffect(() => {
    const stream = new FlightStream();
    stream.connect((updated) => {
      setFlights((prev) => {
        const idx = prev.findIndex(
          (f) =>
            f.flightNumber === updated.flightNumber &&
            f.origin === updated.origin &&
            f.destination === updated.destination
        );
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], ...updated };
          return next;
        }
        return [...prev, updated];
      });
    });
    return () => stream.disconnect();
  }, []);

  // 🔹 Buscar vuelos
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

  // 🔹 Autocompletar con debounce
  const debounce = (fn: (...args: any[]) => void, ms = 250) => {
    let timer: any;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
    };
  };

  const loadOrig = useMemo(
    () =>
      debounce(async (q: string) => {
        setOrigOptions(await autocompleteAirports(q));
      }),
    []
  );

  const loadDest = useMemo(
    () =>
      debounce(async (q: string) => {
        setDestOptions(await autocompleteAirports(q));
      }),
    []
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-10">
        Seguimiento de vuelos en tiempo real
      </h1>

      {/* 🔹 Buscador de vuelos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
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
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          {showOrig && origOptions.length > 0 && (
            <ul
              className="absolute bg-white border rounded-md w-full mt-1 shadow max-h-52 overflow-auto z-10"
              onMouseLeave={() => setShowOrig(false)}
            >
              {origOptions.map((o) => (
                <li
                  key={o.iata}
                  className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setOrigin(o.iata);
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
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          {showDest && destOptions.length > 0 && (
            <ul
              className="absolute bg-white border rounded-md w-full mt-1 shadow max-h-52 overflow-auto z-10"
              onMouseLeave={() => setShowDest(false)}
            >
              {destOptions.map((o) => (
                <li
                  key={o.iata}
                  className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setDestination(o.iata);
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
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-sky-500"
        />

        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-sky-600 hover:bg-sky-700 transition text-white font-medium rounded-lg px-6 py-3"
        >
          {loading ? "Cargando..." : "Buscar vuelos"}
        </button>
      </div>

      {/* 🔹 Resultados */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {!loading && flights.length === 0 && (
          <p className="text-center text-gray-500 col-span-full">
            No hay vuelos disponibles.
          </p>
        )}
        {flights.map((f) => (
          <FlightCard
            key={`${f.flightNumber}-${f.origin}-${f.departureAt}`}
            flight={f}
          />
        ))}
      </div>
    </div>
  );
}