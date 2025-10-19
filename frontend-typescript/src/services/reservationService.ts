import api from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { Reservation } from '@/types'

export async function getMyReservations() {
  const { data } = await api.get<Reservation[]>(ENDPOINTS.RESERVATIONS.MINE)
  return data
}

export async function createReservation(flightId: number) {
  const { data } = await api.post(ENDPOINTS.RESERVATIONS.BASE, { flightId })
  return data
}

export async function cancelReservation(reservationId: number) {
  const { data } = await api.delete(`${ENDPOINTS.RESERVATIONS.BASE}/${reservationId}`)
  return data
}