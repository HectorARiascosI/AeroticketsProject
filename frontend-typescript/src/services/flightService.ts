import axios from "axios";

export interface Flight {
  airline: string;
  flightNumber?: string;
  origin: string;
  destination: string;
  departureAt: string;
  arrivalAt: string;
  status?: string;
  aircraftType?: string;
  terminal?: string;
  gate?: string;
  baggageBelt?: string;
  delayMinutes?: number;
  diverted?: boolean;
  emergency?: boolean;
  totalSeats?: number;
  occupiedSeats?: number;
  cargoKg?: number;
  boardingStartAt?: string;
  boardingEndAt?: string;
  price?: number;
}

const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

function normalize(text: string) {
  return (text || "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

// ✅ Envío robusto y compatible con el backend
export async function searchFlights(origin: string, destination: string, date: string) {
  const payload = {
    origin: origin.trim(),        // no convertir a minúsculas ni normalizar
    destination: destination.trim(),
    date: date || new Date().toISOString().split("T")[0]
  };

  try {
    const { data } = await axios.post(`${API}/live/flights/search`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    const flights: Flight[] = Array.isArray(data) ? data : [];
    return flights.sort(
      (a, b) =>
        new Date(a.departureAt).getTime() - new Date(b.departureAt).getTime()
    );
  } catch (err) {
    console.error("Error fetching flights:", err);
    return [];
  }
}

export async function autocompleteAirports(query: string) {
  const q = normalize(query);
  if (!q || q.length < 2) return [];
  try {
    const { data } = await axios.get(`${API}/live/airports/search`, {
      params: { query: q },
    });
    return Array.isArray(data)
      ? data.map((a: any) => ({
          iata: a.iata,
          city: a.city,
          label: `${a.city} (${a.iata}) - ${a.airport}`
        }))
      : [];
  } catch (e) {
    console.error("Error loading airports:", e);
    return [];
  }
}