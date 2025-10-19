import Select from './ui/Select'
import Input from './ui/Input'
import Button from './ui/Button'

export type FlightFiltersValue = {
  origin: string
  destination: string
  date: string
  airline: string
}

export default function FlightFilters({
  value, onChange, onSearch
}: {
  value: FlightFiltersValue
  onChange: (patch: Partial<FlightFiltersValue>) => void
  onSearch: () => void
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
      <Input label="Origen" value={value.origin} onChange={e => onChange({ origin: e.target.value })} placeholder="Ej: BOG" />
      <Input label="Destino" value={value.destination} onChange={e => onChange({ destination: e.target.value })} placeholder="Ej: MDE" />
      <Input label="Fecha" type="date" value={value.date} onChange={e => onChange({ date: e.target.value })} />
      <Select label="Aerolínea" value={value.airline} onChange={e => onChange({ airline: e.target.value })}>
        <option value="">Todas</option>
        <option value="Avianca">Avianca</option>
        <option value="LATAM">LATAM</option>
        <option value="VivaAir">VivaAir</option>
      </Select>
      <div className="flex items-end">
        <Button className="w-full" onClick={onSearch}>Buscar</Button>
      </div>
    </div>
  )
}