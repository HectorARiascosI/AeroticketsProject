import api from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'

export type FlightFilters = {
  origin?: string
  destination?: string
  date?: string   // yyyy-mm-dd
  airline?: string
}

export async function getFlights(filters: FlightFilters) {
  const params = new URLSearchParams()
  if (filters.origin) params.set('origin', filters.origin)
  if (filters.destination) params.set('destination', filters.destination)
  if (filters.date) params.set('date', filters.date)
  if (filters.airline) params.set('airline', filters.airline)
  const { data } = await api.get(`${ENDPOINTS.FLIGHTS}`, { params })
  return data
}

export type LiveProvider = 'Aviationstack' | 'AeroDataBox'

export async function searchLiveFlights(filters: FlightFilters, provider: LiveProvider = 'Aviationstack') {
  const params = new URLSearchParams()
  params.set('provider', provider)
  if (filters.origin) params.set('origin', filters.origin)
  if (filters.destination) params.set('destination', filters.destination)
  if (filters.date) params.set('date', filters.date)
  if (filters.airline) params.set('airline', filters.airline)
  const { data } = await api.get(ENDPOINTS.LIVE.SEARCH, { params })
  return data as LiveFlight[]
}

export type LiveFlight = {
  provider: string
  airline: string
  flightNumber: string
  originIata: string
  destinationIata: string
  departureAt?: string
  arrivalAt?: string
  status?: string
  indicativePrice?: number
}