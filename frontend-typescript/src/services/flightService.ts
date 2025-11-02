// src/services/flightService.ts
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

// ✅ Esta función debe estar exportada
export async function searchFlights(origin: string, destination: string, date: string) {
  const payload = { origin, destination, date };
  try {
    const [realRes, simRes] = await Promise.allSettled([
      axios.post(`${API}/flights/search`, payload),
      axios.post(`${API}/live/flights/search`, payload),
    ]);

    const realFlights = realRes.status === "fulfilled" ? realRes.value.data : [];
    const simFlights = simRes.status === "fulfilled" ? simRes.value.data : [];

    const merged = [...realFlights, ...simFlights];
    return merged.sort(
      (a, b) =>
        new Date(a.departureAt).getTime() - new Date(b.departureAt).getTime()
    );
  } catch (err) {
    console.error("Error fetching flights:", err);
    return [];
  }
}

export async function autocompleteAirports(query: string) {
  if (!query || query.length < 2) return [];
  try {
    const res = await axios.get(`${API}/live/airports/search`, {
      params: { query },
    });
    return res.data || [];
  } catch {
    return [];
  }
}