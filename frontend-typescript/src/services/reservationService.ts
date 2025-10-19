import api from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { Reservation } from "@/types";

export async function getMyReservations(): Promise<Reservation[]> {
  const { data } = await api.get(ENDPOINTS.RESERVATIONS.MINE);
  return data;
}

export async function createReservation(flightId: number) {
  const { data } = await api.post(ENDPOINTS.RESERVATIONS.BASE, { flightId });
  return data;
}

export async function cancelReservation(id: number) {
  const { data } = await api.delete(`${ENDPOINTS.RESERVATIONS.BASE}/${id}`);
  return data;
}