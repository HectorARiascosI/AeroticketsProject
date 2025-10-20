import api from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import type { ReservationDTO } from '@/types';

export async function getMyReservations(): Promise<ReservationDTO[]> {
  const { data } = await api.get(ENDPOINTS.RESERVATIONS.MINE);
  return data;
}

export async function createReservation(flightId: number, seatNumber?: number) {
  const { data } = await api.post(ENDPOINTS.RESERVATIONS.BASE, { flightId, seatNumber });
  return data;
}

export async function cancelReservation(id: number) {
  await api.delete(`${ENDPOINTS.RESERVATIONS.BASE}/${id}`);
}