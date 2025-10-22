import api from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { ReservationDTO } from "@/types";

export async function getMyReservations(): Promise<ReservationDTO[]> {
  const { data } = await api.get(ENDPOINTS.RESERVATIONS.MINE);
  return data;
}

export async function createReservation(flightId: number, seatNumber?: number) {
  const payload: any = { flightId };
  if (seatNumber) payload.seatNumber = seatNumber;
  const { data } = await api.post(ENDPOINTS.RESERVATIONS.BASE, payload);
  return data;
}

export async function cancelReservation(id: number) {
  const { data } = await api.delete(`${ENDPOINTS.RESERVATIONS.BASE}/${id}`);
  return data;
}