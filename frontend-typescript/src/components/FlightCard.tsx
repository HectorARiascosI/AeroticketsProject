import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

function formatDT(dt?: string) {
  if (!dt) return '—'
  try {
    return new Date(dt).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })
  } catch { return '—' }
}

export default function FlightCard({
  flight,
  onReserve
}: {
  flight: any
  onReserve?: (flight: any) => void
}) {

  const isLive = !!flight.provider  // si viene de Aviationstack/AeroDataBox
  const title = isLive
    ? `${flight.originIata ?? '—'} → ${flight.destinationIata ?? '—'}`
    : `${flight.origin} → ${flight.destination}`

  const airline = isLive ? flight.airline : flight.airline
  const departure = isLive ? formatDT(flight.departureAt) : formatDT(flight.departureTime)
  const arrival = isLive ? formatDT(flight.arrivalAt) : formatDT(flight.arrivalTime)
  const price = isLive ? '—' : Intl.NumberFormat('es-CO', { style:'currency', currency:'COP' }).format(flight.price ?? 0)

  return (
    <Card>
      <div className="flex justify-between items-start gap-4">
        <div>
          <div className="text-lg font-semibold">{title}</div>
          <div className="text-xs text-gray-500">{airline} {isLive && flight.flightNumber ? `· ${flight.flightNumber}`:''}</div>
          <div className="text-xs text-gray-500">{departure} — {arrival}</div>
          {isLive && <div className="mt-1"><Badge color="sky">{flight.status?.toUpperCase() ?? 'SCHEDULED'}</Badge></div>}
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
  )
}