import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import AutocompleteInput from "@/components/ui/AutocompleteInput";

export type FlightFiltersValue = {
  origin: string;
  destination: string;
  date: string;
  airline: string;
  live: boolean;
  provider: 'auto' | 'Aviationstack' | 'AeroDataBox';
};

export default function FlightFilters({
  value,
  onChange,
  onSearch
}: {
  value: FlightFiltersValue;
  onChange: (patch: Partial<FlightFiltersValue>) => void;
  onSearch: () => void;
}) {
  const providers = [
    { label: 'Automático', value: 'auto' },
    { label: 'Aviationstack', value: 'Aviationstack' },
    { label: 'AeroDataBox', value: 'AeroDataBox' }
  ];

  return (
    <Card>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
        <div className="md:col-span-2">
          <AutocompleteInput
            label="Origen"
            placeholder="Ej: BOG o 'Bogotá... (BOG), Colombia'"
            value={value.origin ?? ''}
            onChange={(v) => onChange({ origin: v })}
          />
        </div>
        <div className="md:col-span-2">
          <AutocompleteInput
            label="Destino"
            placeholder="Ej: CLO o 'Cali... (CLO), Colombia'"
            value={value.destination ?? ''}
            onChange={(v) => onChange({ destination: v })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Fecha</label>
          <input
            type="date"
            className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
            value={value.date ?? ''}
            onChange={(e) => onChange({ date: e.target.value })}
          />
        </div>
        <Select
          label="Proveedor"
          value={value.provider ?? 'auto'}
          onValueChange={(v) => onChange({ provider: v as any })}
          options={providers}
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <label className="flex items-center gap-2">
          <input
            id="live"
            type="checkbox"
            checked={!!value.live}
            onChange={(e) => onChange({ live: e.target.checked })}
          />
          <span className="text-sm">Datos en vivo</span>
        </label>
        <Button onClick={onSearch}>Buscar</Button>
      </div>
    </Card>
  );
}