import { useEffect, useMemo, useState } from 'react';
import FlightFilters, { FlightFiltersValue } from '@/components/FlightFilters';
import FlightCard from '@/components/FlightCard';
import Loader from '@/components/ui/Loader';
import EmptyState from '@/components/ui/EmptyState';
import Card from '@/components/ui/Card';
import Pagination from '@/components/ui/Pagination';
import { getFlights } from '@/services/flightService';
import { createReservation, getMyReservations } from '@/services/reservationService';
import toast from 'react-hot-toast';
import type { Flight, ReservationDTO } from '@/types';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar } from 'recharts';

export default function FlightsPage() {
  const [filters, setFilters] = useState<FlightFiltersValue>({ origin: '', destination: '', date: '', airline: '' });
  const [loading, setLoading] = useState(true);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [myRes, setMyRes] = useState<ReservationDTO[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 6;

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [fls, res] = await Promise.all([
        getFlights(filters),
        getMyReservations().catch(() => []) // si no hay, retorna vacío
      ]);
      setFlights(fls);
      setTotal(fls.length);
      setMyRes(res ?? []);
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'No fue posible cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return flights.slice(start, start + pageSize);
  }, [flights, page]);

  const alreadyReserved = (flightId: number) =>
    myRes.some(r => r.flightId === flightId && r.status === 'ACTIVE');

  const onReserve = async (flight: Flight) => {
    try {
      await createReservation(flight.id);
      toast.success('Reserva creada');
      await fetchAll();
    } catch (e: any) {
      const status = e?.response?.status;
      const msg = e?.response?.data?.message;
      if (status === 409) {
        toast.error(msg ?? 'Ya tienes una reserva activa en este vuelo');
      } else {
        toast.error(msg ?? 'No fue posible reservar');
      }
    }
  };

  const chartData = useMemo(() => {
    const map = new Map<string, number>();
    flights.forEach(f => map.set(f.airline, (map.get(f.airline) ?? 0) + 1));
    return Array.from(map.entries()).map(([airline, count]) => ({ airline, count }));
  }, [flights]);

  return (
    <div className="max-w-6xl mx-auto py-6">
      <div className="mb-4">
        <FlightFilters value={filters} onChange={patch => setFilters({ ...filters, ...patch })} onSearch={() => { setPage(1); fetchAll(); }} />
      </div>

      <Card className="mb-4">
        <h3 className="font-semibold mb-3">Vuelos por aerolínea</h3>
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

      {loading ? <Loader label="Cargando vuelos..." /> : (
        flights.length === 0 ? (
          <EmptyState title="No hay vuelos disponibles" subtitle="Prueba ajustando los filtros" />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paginated.map(f => (
                <FlightCard
                  key={f.id}
                  flight={f}
                  onReserve={() => onReserve(f)}
                  disabled={alreadyReserved(f.id)}
                  disabledReason={alreadyReserved(f.id) ? 'Ya tienes reserva activa' : undefined}
                />
              ))}
            </div>
            <Pagination page={page} pageSize={pageSize} total={total} onChange={setPage} />
          </>
        )
      )}
    </div>
  );
}