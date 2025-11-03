import { useEffect, useState } from 'react'
import { listMyReservations, cancelReservation } from '@/services/reservationService'
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table'
import Loader from '@/components/ui/Loader'
import EmptyState from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { formatCurrency, formatDateTime } from '@/utils/format'
import { ReservationDTO } from '@/types'
import toast from 'react-hot-toast'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

export default function MyReservationsPage() {
  const [loading, setLoading] = useState(true)
  const [cancelingId, setCancelingId] = useState<number | null>(null)
  const [reservations, setReservations] = useState<ReservationDTO[]>([])

  const load = async () => {
    setLoading(true)
    try {
      const data = await listMyReservations()
      // ✅ Ordena por fecha de creación más reciente
      const ordered = [...data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      setReservations(ordered)
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'No fue posible cargar reservas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const onCancel = async (id: number) => {
    if (!window.confirm('¿Seguro que deseas cancelar esta reserva?')) return
    setCancelingId(id)
    try {
      await cancelReservation(id)
      toast.success('Reserva cancelada correctamente')
      await load()
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'No fue posible cancelar la reserva')
    } finally {
      setCancelingId(null)
    }
  }

  if (loading) return <Loader label="Cargando tus reservas..." />
  if (reservations.length === 0) return <EmptyState title="Aún no tienes reservas" />

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <div className="mb-6 text-2xl font-semibold text-gray-800 flex items-center gap-2">
        ✈️ Mis Reservas
      </div>

      <Table>
        <THead>
          <TR>
            <TH className="text-left">Vuelo</TH>
            <TH className="text-left">Fechas</TH>
            <TH className="text-right">Precio</TH>
            <TH className="text-center">Estado</TH>
            <TH className="text-right"></TH>
          </TR>
        </THead>
        <TBody>
          {reservations.map(r => (
            <TR
              key={r.id}
              className={`transition-colors hover:bg-gray-50 ${
                r.status === 'CANCELLED' ? 'opacity-70' : ''
              }`}
            >
              <TD>
                <div className="font-semibold text-gray-800">
                  {r.origin} → {r.destination}
                </div>
                <div className="text-xs text-gray-500">{r.airline}</div>
                {r.seatNumber && (
                  <div className="text-xs text-gray-500">Asiento: {r.seatNumber}</div>
                )}
              </TD>

              <TD>
                <div className="text-sm text-gray-700">
                  {formatDateTime(r.departureAt)}
                </div>
                <div className="text-xs text-gray-500">
                  {formatDateTime(r.arriveAt)}
                </div>
              </TD>

              <TD className="text-right font-medium text-gray-800">
                {formatCurrency(r.price)}
              </TD>

              <TD className="text-center">
                <Badge
                  color={r.status === 'ACTIVE' ? 'green' : 'red'}
                  className="flex items-center justify-center gap-1"
                >
                  {r.status === 'ACTIVE' ? (
                    <>
                      <FaCheckCircle className="text-green-500" />
                      <span>Activa</span>
                    </>
                  ) : (
                    <>
                      <FaTimesCircle className="text-red-500" />
                      <span>Cancelada</span>
                    </>
                  )}
                </Badge>
              </TD>

              <TD className="text-right">
                {r.status === 'ACTIVE' && (
                  <Button
                    variant="danger"
                    disabled={cancelingId === r.id}
                    onClick={() => onCancel(r.id)}
                  >
                    {cancelingId === r.id ? 'Cancelando...' : 'Cancelar'}
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