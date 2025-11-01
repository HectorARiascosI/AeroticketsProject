import api from '@/api/client';

export type LiveSearchParams = {
  origin: string;
  destination?: string;
  date?: string;           // yyyy-MM-dd
  provider?: 'auto' | 'Aviationstack' | 'AeroDataBox';
};

export async function getFlights(filters: { origin?: string; destination?: string; date?: string; airline?: string }) {
  const { data } = await api.get('/flights', { params: filters });
  return data;
}

export async function searchLiveFlights(params: LiveSearchParams) {
  const { data } = await api.get('/live/flights/search', {
    params: {
      origin: params.origin,
      destination: params.destination,
      date: params.date,
      provider: params.provider ?? 'auto'
    }
  });
  return data as { source: string; count: number; items: any[] };
}

export async function autocompleteAirports(query: string) {
  const { data } = await api.get('/live/autocomplete', { params: { query } });
  return data as { label: string; iata: string }[];
}