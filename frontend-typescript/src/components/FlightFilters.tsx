import { useState } from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'

export type FlightFiltersValue = {
  origin: string
  destination: string
  date: string   // yyyy-mm-dd
  airline: string
  live: boolean
  provider: 'Aviationstack' | 'AeroDataBox'
}

export default function FlightFilters({
  value,
  onChange,
  onSearch
}: {
  value: FlightFiltersValue
  onChange: (patch: Partial<FlightFiltersValue>) => void
  onSearch: () => void
}) {
  const [local, setLocal] = useState(value)

  const set = (patch: Partial<FlightFiltersValue>) => {
    const next = { ...local, ...patch }
    setLocal(next); onChange(patch)
  }

  return (
    <Card>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
        <Input label="Origen (IATA)" placeholder="Ej: BOG"
               value={local.origin} onChange={e => set({ origin: e.target.value.toUpperCase() })}/>
        <Input label="Destino (IATA)" placeholder="Ej: MDE"
               value={local.destination} onChange={e => set({ destination: e.target.value.toUpperCase() })}/>
        <Input label="Fecha" type="date"
               value={local.date} onChange={e => set({ date: e.target.value })}/>
        <Select label="Aerolínea" value={local.airline} onChange={v => set({ airline: v })} options={[
          { label: 'Todas', value: '' },
          { label: 'Avianca', value: 'Avianca' },
          { label: 'LATAM', value: 'LATAM' },
          { label: 'VivaAir', value: 'Viva' },
        ]}/>
        <Select label="Proveedor" value={local.provider} onChange={v => set({ provider: v as any })} options={[
          { label: 'Aviationstack', value: 'Aviationstack' },
          { label: 'AeroDataBox', value: 'AeroDataBox' }
        ]}/>
        <div>
          <label className="text-sm font-medium block mb-1">Datos en vivo</label>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={local.live} onChange={e => set({ live: e.target.checked })}/>
            <span className="text-sm text-gray-600">Usar proveedor externo</span>
          </div>
        </div>
      </div>
      <div className="text-right mt-3">
        <Button onClick={onSearch}>Buscar</Button>
      </div>
    </Card>
  )
}