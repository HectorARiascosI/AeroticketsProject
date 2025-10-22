// frontend/src/services/flightService.ts
import api from '@/api/client';

export type LiveSearchParams = {
  originQuery: string;       // ciudad o IATA (texto libre)
  destinationQuery?: string;
  date?: string;             // yyyy-MM-dd
  provider?: 'auto' | 'Aviationstack' | 'AeroDataBox';
};

export async function getFlights(filters: { origin?: string; destination?: string; date?: string; airline?: string }) {
  // catálogo interno (persistente)
  const { data } = await api.get('/flights', { params: filters });
  return data;
}

export async function searchLiveFlights(params: LiveSearchParams) {
  const { data } = await api.get('/live/flights/search', {
    params: {
      origin: params.originQuery,
      destination: params.destinationQuery,
      date: params.date,
      provider: params.provider ?? 'auto'
    }
  });
  return data as { source: string; count: number; items: any[] };
}

/**
 * Sugerencias de ciudades/aeropuertos (vía backend).
 * Fallback: si el backend no tiene /live/autocomplete, usamos algunos básicos locales.
 */
export async function autocompleteAirports(query: string) {
  try {
    const { data } = await api.get('/live/autocomplete', { params: { query } });
    return data as Array<{ id: string; code?: string; name: string; city?: string; country?: string }>;
  } catch {
    // Fallback mínimo (para no bloquear UX mientras implementas el backend)
    const q = query.toLowerCase();
    const base = [
      { id: 'BOG', code: 'BOG', name: 'Bogotá - El Dorado (BOG), Colombia', city: 'Bogotá', country: 'Colombia' },
      { id: 'MDE', code: 'MDE', name: 'Medellín - José María Córdova (MDE), Colombia', city: 'Medellín', country: 'Colombia' },
      { id: 'CLO', code: 'CLO', name: 'Cali - Alfonso Bonilla Aragón (CLO), Colombia', city: 'Cali', country: 'Colombia' },
      { id: 'CTG', code: 'CTG', name: 'Cartagena - Rafael Núñez (CTG), Colombia', city: 'Cartagena', country: 'Colombia' },
      { id: 'PEI', code: 'PEI', name: 'Pereira - Matecaña (PEI), Colombia', city: 'Pereira', country: 'Colombia' },
      { id: 'MIA', code: 'MIA', name: 'Miami International (MIA), Estados Unidos', city: 'Miami', country: 'Estados Unidos' },
      { id: 'MAD', code: 'MAD', name: 'Madrid - Barajas (MAD), España', city: 'Madrid', country: 'España' },
      { id: 'CDG', code: 'CDG', name: 'París - Charles de Gaulle (CDG), Francia', city: 'París', country: 'Francia' }
    ];
    return base.filter(
      (x) =>
        x.name.toLowerCase().includes(q) ||
        x.city?.toLowerCase().includes(q) ||
        x.code?.toLowerCase().includes(q)
    );
  }
}