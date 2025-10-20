import api from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import type { Flight } from '@/types';

export async function getFlights(filters: { origin?: string; destination?: string; date?: string; airline?: string }): Promise<Flight[]> {
  const params: any = {};
  if (filters.origin) params.origin = filters.origin;
  if (filters.destination) params.destination = filters.destination;
  if (filters.date) params.date = filters.date;
  if (filters.airline) params.airline = filters.airline;

  const { data } = await api.get(ENDPOINTS.FLIGHTS, { params });
  return data;
}