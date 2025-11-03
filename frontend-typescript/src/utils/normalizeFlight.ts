// src/utils/normalizeFlight.ts
import { Flight } from "../services/flightService";

/**
 * Traduce cualquier estructura cruda de vuelo (del backend o del stream)
 * al formato estándar usado por el frontend.
 */
export function normalizeFlight(raw: any): Flight {
  if (!raw) {
    return {
      airline: "—",
      origin: "—",
      destination: "—",
      departureAt: "",
      arrivalAt: "",
    } as Flight;
  }

  return {
    airline: raw.airline || "Desconocida",
    flightNumber: raw.flightNumber || raw.code || "—",
    origin: raw.origin || raw.originIata || raw.originCity || "—",
    destination: raw.destination || raw.destinationIata || raw.destinationCity || "—",
    departureAt: raw.departureAt || raw.departureTime || raw.departAt || "",
    arrivalAt: raw.arrivalAt || raw.arriveAt || raw.arriveTime || "",
    status: raw.status || "SCHEDULED",
    aircraftType: raw.aircraftType || raw.model || "—",
    terminal: raw.terminal || "—",
    gate: raw.gate || raw.door || "—",
    baggageBelt: raw.baggageBelt || raw.belt || "—",
    delayMinutes: raw.delayMinutes || raw.delay || 0,
    diverted: raw.diverted || false,
    emergency: raw.emergency || false,
    totalSeats: raw.totalSeats || 0,
    occupiedSeats: raw.occupiedSeats || 0,
    cargoKg: raw.cargoKg || 0,
    boardingStartAt: raw.boardingStartAt || "",
    boardingEndAt: raw.boardingEndAt || "",
    price: raw.price || null,
  };
}