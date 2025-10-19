import api from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { Flight } from '@/types'

export async function getFlights(filters: { origin?: string; destination?: string; date?: string; airline?: string }) {
  const { data } = await api.get<Flight[]>(ENDPOINTS.FLIGHTS, { params: filters })
  return data
}