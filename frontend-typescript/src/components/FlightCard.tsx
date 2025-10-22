// frontend/src/components/FlightCard.tsx
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

function formatDT(dt?: string) {
  if (!dt) return '—';
  try {
    return new Date(dt).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return '—';
  }
}

export default function FlightCard({
  flight,
  onReserve
}: {
  flight: any;
  onReserve?: (flight: any) => void;
}) {
  const isLive = !!flight.provider || !!flight.source;
  const origin = flight.originIata || flight.origin_code || flight.origin || '—';
  const destination = flight.destinationIata || flight.destination_code || flight.destination || '—';
  const title = `${origin} → ${destination}`;

  const airline = flight.airline || flight.airline_name || '—';
  const flightNumber = flight.flightNumber || flight.flight_number;
  const departure = formatDT(flight.departureAt || flight.departure_time || flight.departureTime);
  const arrival = formatDT(flight.arrivalAt || flight.arrival_time || flight.arrivalTime);

  const price =
    isLive
      ? '—'
      : Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(flight.price ?? 0);

  return (
    <Card>
      <div className="flex justify-between items-start gap-4">
        <div>
          <div className="text-lg font-semibold">{title}</div>
          <div className="text-xs text-gray-500">
            {airline} {flightNumber ? `· ${flightNumber}` : ''}
          </div>
          <div className="text-xs text-gray-500">
            {departure} — {arrival}
          </div>
          {isLive && (
            <div className="mt-1">
              <Badge color="blue">{(flight.status || 'SCHEDULED').toString().toUpperCase()}</Badge>
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="text-xl font-bold">{price}</div>
          {isLive ? (
            <Button disabled title="Para reservar vuelos reales se requiere integración NDC/GDS">
              No disponible
            </Button>
          ) : (
            <Button onClick={() => onReserve && onReserve(flight)}>Reservar</Button>
          )}
        </div>
      </div>
    </Card>
  );
}