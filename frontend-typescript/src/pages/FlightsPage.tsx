// frontend/src/pages/FlightsPage.tsx
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import FlightFilters, { FlightFiltersValue } from '@/components/FlightFilters';
import FlightCard from '@/components/FlightCard';
import Loader from '@/components/ui/Loader';
import EmptyState from '@/components/ui/EmptyState';
import Card from '@/components/ui/Card';
import Pagination from '@/components/ui/Pagination';
import { getFlights, searchLiveFlights } from '@/services/flightService';
import toast from 'react-hot-toast';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar } from 'recharts';

type Flight = any;

function useDebouncedCallback(fn: () => void, delay = 500) {
  const timeoutRef = useRef<number | null>(null);
  return useCallback(() => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      fn();
    }, delay);
  }, [fn, delay]);
}

export default function FlightsPage() {
  const [filters, setFilters] = useState<FlightFiltersValue>({
    origin: '',
    destination: '',
    date: '',
    airline: '',
    live: true,
    provider: 'auto'
  });

  const [loading, setLoading] = useState(true);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 6;

  const runSearch = useCallback(async () => {
    setLoading(true);
    try {
      if (filters.live) {
        if (!filters.origin || filters.origin.trim().length < 2) {
          setFlights([]);
          setTotal(0);
          return;
        }
        const data = await searchLiveFlights({
          originQuery: filters.origin,
          destinationQuery: filters.destination,
          date: filters.date,
          provider: filters.provider
        });
        setFlights(data.items ?? []);
        setTotal((data.items ?? []).length);
      } else {
        const data = await getFlights({
          origin: filters.origin,
          destination: filters.destination,
          date: filters.date,
          airline: filters.airline
        });
        setFlights(data);
        setTotal(data.length);
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'No fue posible cargar vuelos');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const debouncedRunSearch = useDebouncedCallback(() => {
    setPage(1);
    runSearch();
  }, 600);

  // Búsqueda inicial
  useEffect(() => {
    runSearch();
  }, []); // eslint-disable-line

  const onFiltersChange = (patch: Partial<FlightFiltersValue>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    debouncedRunSearch();
  };

  const onSearchClick = () => {
    setPage(1);
    runSearch();
  };

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return flights.slice(start, start + pageSize);
  }, [flights, page]);

  const chartData = useMemo(() => {
    const map = new Map<string, number>();
    flights.forEach((f: any) => {
      const airline =
        f.airline ||
        f.flight?.airline ||
        f.airline_name ||
        'Desconocida';
      map.set(airline, (map.get(airline) ?? 0) + 1);
    });
    return Array.from(map.entries()).map(([airline, count]) => ({ airline, count }));
  }, [flights]);

  return (
    <div className="max-w-6xl mx-auto py-6">
      <div className="mb-4">
        <FlightFilters
          value={filters}
          onChange={onFiltersChange}
          onSearch={onSearchClick}
          autoSearch
        />
      </div>

      <Card className="mb-4">
        <h3 className="font-semibold mb-3">
          {filters.live ? 'Vuelos (en vivo) por aerolínea' : 'Vuelos (catálogo interno) por aerolínea'}
        </h3>
        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <XAxis dataKey="airline" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {loading ? (
        <Loader label={filters.live ? 'Consultando proveedor en vivo...' : 'Cargando vuelos...'} />
      ) : flights.length === 0 ? (
        <EmptyState
          title="No encontramos vuelos"
          subtitle={
            filters.live
              ? 'Prueba cambiar ciudad/aeropuerto. Usa términos comunes (ej: Bogotá, Medellín) o revisa la fecha.'
              : 'Prueba ajustando los filtros o cambia a modo en vivo.'
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginated.map((f: any, idx: number) => (
              <FlightCard key={idx} flight={f} onReserve={() => toast('En vivo: reservar no disponible')} />
            ))}
          </div>
          <Pagination page={page} pageSize={pageSize} total={total} onChange={setPage} />
        </>
      )}
    </div>
  );
}