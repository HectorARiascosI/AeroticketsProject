import { useEffect, useState } from 'react'
import { getMyReservations, cancelReservation } from '@/services/reservationService'
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table'
import Loader from '@/components/ui/Loader'
import EmptyState from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { formatCurrency, formatDateTime } from '@/utils/format'
import { Reservation } from '@/types'
import toast from 'react-hot-toast'

export default function MyReservationsPage() {
  const [loading, setLoading] = useState(true)
  const [reservations, setReservations] = useState<Reservation[]>([])

  const load = async () => {
    setLoading(true)
    try {
      const data = await getMyReservations()
      setReservations(data)
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'No fue posible cargar reservas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const onCancel = async (id: number) => {
    await cancelReservation(id)
    toast('Reserva cancelada')
    await load()
  }

  if (loading) return <Loader label="Cargando tus reservas..." />
  if (reservations.length === 0) return <EmptyState title="Aún no tienes reservas" />

  return (
    <div className="max-w-6xl mx-auto py-6">
      <div className="mb-3 text-xl font-semibold">Mis Reservas</div>
      <Table>
        <THead>
          <TR>
            <TH>Vuelo</TH>
            <TH>Fechas</TH>
            <TH>Precio</TH>
            <TH>Estado</TH>
            <TH></TH>
          </TR>
        </THead>
        <TBody>
          {reservations.map(r => (
            <TR key={r.id}>
              <TD>
                {r.flight.origin} → {r.flight.destination}
                <div className="text-xs text-gray-500">{r.flight.airline}</div>
              </TD>
              <TD>
                <div className="text-sm">{formatDateTime(r.flight.departureTime)}</div>
                <div className="text-xs text-gray-500">{formatDateTime(r.flight.arrivalTime)}</div>
              </TD>
              <TD>{formatCurrency(r.flight.price)}</TD>
              <TD>
                <Badge color={r.status === 'ACTIVE' ? 'green' : 'red'}>
                  {r.status}
                </Badge>
              </TD>
              <TD className="text-right">
                {r.status === 'ACTIVE' && (
                  <Button variant="danger" onClick={() => onCancel(r.id)}>
                    Cancelar
                  </Button>
                )}
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  )
}