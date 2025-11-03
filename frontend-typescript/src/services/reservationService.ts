import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
const BASE = `${API}/reservations`;

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface ReservationPayload {
  flightId: number;
  seatNumber?: number;
}

export interface ReservationResponse {
  id: number;
  seatNumber?: number;
  status: "ACTIVE" | "CANCELLED";
  createdAt: string;
  flightId: number;
  airline: string;
  origin: string;
  destination: string;
  departureAt: string;
  arriveAt: string;
  price: number;
}

export async function createReservation(payload: ReservationPayload) {
  const { data } = await axios.post<ReservationResponse>(BASE, payload, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
    withCredentials: true,
  });
  return data;
}

export async function listMyReservations() {
  const { data } = await axios.get<ReservationResponse[]>(`${BASE}/my`, {
    headers: { ...authHeaders() },
    withCredentials: true,
  });
  return data;
}

export async function cancelReservation(id: number) {
  await axios.delete(`${BASE}/${id}`, {
    headers: { ...authHeaders() },
    withCredentials: true,
  });
}