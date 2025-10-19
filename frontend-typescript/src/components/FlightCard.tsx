import Button from './ui/Button'
import Card from './ui/Card'
import Badge from './ui/Badge'
import { formatCurrency, formatDateTime } from '@/utils/format'
import type { Flight } from '@/types'

export default function FlightCard({ flight, onReserve }: { flight: Flight; onReserve: (flight: Flight) => void }) {
  return (
    <Card className="flex items-center justify-between">
      <div className="flex gap-4">
        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary to-accent grid place-items-center text-white font-bold">
          {flight.airline?.slice(0, 2)?.toUpperCase() ?? 'AX'}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">
            {flight.origin} → {flight.destination}{' '}
            <Badge color="blue">{flight.airline}</Badge>
          </h3>
          <p className="text-sm text-gray-600">
            {formatDateTime(flight.departureTime)} — {formatDateTime(flight.arrivalTime)}
          </p>
          <p className="text-xs text-gray-500">Asientos disponibles: {flight.availableSeats}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-lg font-semibold text-gray-800">{formatCurrency(flight.price)}</div>
        <Button className="mt-2" onClick={() => onReserve(flight)} disabled={flight.availableSeats <= 0}>
          Reservar
        </Button>
      </div>
    </Card>
  )
}