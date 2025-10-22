// frontend/src/components/FlightFilters.tsx
import { useEffect } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import AutocompleteInput, { AutocompleteItem } from '@/components/ui/AutocompleteInput';
import { autocompleteAirports } from '@/services/flightService';

export type FlightFiltersValue = {
  origin: string;        // texto libre (ciudad o aeropuerto)
  destination: string;   // texto libre
  date: string;          // yyyy-MM-dd
  airline: string;       // nombre comercial
  live: boolean;
  provider: 'auto' | 'Aviationstack' | 'AeroDataBox';
};

type Props = {
  value: FlightFiltersValue;
  onChange: (patch: Partial<FlightFiltersValue>) => void;
  onSearch: () => void;
  autoSearch?: boolean; // dispara búsqueda automáticamente
};

const AIRLINES: Array<{ label: string; value: string }> = [
  { label: 'Cualquiera', value: '' },
  { label: 'Avianca', value: 'Avianca' },
  { label: 'LATAM', value: 'LATAM' },
  { label: 'Wingo', value: 'Wingo' },
  { label: 'Satena', value: 'Satena' }
];

const PROVIDERS = [
  { label: 'Automático', value: 'auto' },
  { label: 'Aviationstack', value: 'Aviationstack' },
  { label: 'AeroDataBox', value: 'AeroDataBox' }
];

export default function FlightFilters({ value, onChange, onSearch, autoSearch = true }: Props) {
  // Auto-búsqueda al cambiar filtros (con debounce desde el contenedor)
  useEffect(() => {
    if (!autoSearch) return;
    // Reglas mínimas: origen requerido en live; en catálogo interno puede buscar vacío
    const canRun = value.live ? value.origin.trim().length >= 2 : true;
    if (!canRun) return;
    // El contenedor ( FlightsPage ) se encarga del debounce; acá solo notificar cambios
    onSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.origin, value.destination, value.date, value.airline, value.provider, value.live]);

  const onSelectOrigin = (it: AutocompleteItem) => {
    onChange({ origin: it.name });
  };
  const onSelectDestination = (it: AutocompleteItem) => {
    onChange({ destination: it.name });
  };

  return (
    <Card>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
        <AutocompleteInput
          label="Origen"
          placeholder="Ciudad o aeropuerto (Ej: Bogotá o El Dorado)"
          value={value.origin ?? ''}
          onChangeValue={(v) => onChange({ origin: v })}
          onSelectItem={onSelectOrigin}
          fetcher={autocompleteAirports}
        />

        <AutocompleteInput
          label="Destino"
          placeholder="Ciudad o aeropuerto (Ej: Medellín o José María Córdova)"
          value={value.destination ?? ''}
          onChangeValue={(v) => onChange({ destination: v })}
          onSelectItem={onSelectDestination}
          fetcher={autocompleteAirports}
        />

        <Input
          label="Fecha"
          type="date"
          value={value.date ?? ''}
          onChange={(e) => onChange({ date: e.target.value })}
        />

        <Select
          label="Aerolínea"
          value={value.airline ?? ''}
          onChange={(e) => onChange({ airline: e.currentTarget.value })}
          options={AIRLINES}
        />

        <Select
          label="Proveedor de datos"
          value={value.provider ?? 'auto'}
          onChange={(e) => onChange({ provider: e.currentTarget.value as any })}
          options={PROVIDERS}
        />

        <div className="flex items-center gap-2 mb-1">
          <input
            id="live"
            type="checkbox"
            checked={!!value.live}
            onChange={(e) => onChange({ live: e.target.checked })}
          />
          <label htmlFor="live" className="text-sm">Solo datos en vivo</label>
        </div>
      </div>

      <div className="mt-3 text-right">
        <Button onClick={onSearch}>Buscar</Button>
      </div>
    </Card>
  );
}