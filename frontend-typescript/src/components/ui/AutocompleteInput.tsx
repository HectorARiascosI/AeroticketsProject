// frontend/src/components/ui/AutocompleteInput.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';

export type AutocompleteItem = {
  id: string;          // puede ser IATA o un UUID
  code?: string;       // IATA si aplica
  name: string;        // "Bogotá - El Dorado (BOG), Colombia"
  city?: string;
  country?: string;
};

type Props = {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeValue: (val: string) => void;
  onSelectItem?: (item: AutocompleteItem) => void;
  fetcher: (q: string) => Promise<AutocompleteItem[]>;
  minChars?: number;
  disabled?: boolean;
};

function useDebounced<T>(value: T, delay = 350) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export default function AutocompleteInput({
  label,
  placeholder = 'Escribe ciudad o aeropuerto…',
  value,
  onChangeValue,
  onSelectItem,
  fetcher,
  minChars = 2,
  disabled
}: Props) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AutocompleteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounced(value, 350);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim().length < minChars) {
      setItems([]);
      return;
    }
    let isActive = true;
    setLoading(true);
    fetcher(debouncedQuery.trim())
      .then((res) => {
        if (isActive) setItems(res);
      })
      .catch(() => {
        if (isActive) setItems([]);
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });
    return () => {
      isActive = false;
    };
  }, [debouncedQuery, fetcher, minChars]);

  useEffect(() => {
    const handler = (ev: MouseEvent) => {
      if (!containerRef.current?.contains(ev.target as Node)) setOpen(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const showList = open && (loading || items.length > 0);

  const handleSelect = (it: AutocompleteItem) => {
    onChangeValue(it.name);
    setOpen(false);
    onSelectItem?.(it);
  };

  return (
    <div className="relative" ref={containerRef}>
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <input
        className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
        placeholder={placeholder}
        value={value}
        onFocus={() => setOpen(true)}
        onChange={(e) => onChangeValue(e.target.value)}
        disabled={disabled}
      />
      {showList && (
        <div className="absolute z-40 mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-200 rounded shadow">
          {loading && <div className="px-3 py-2 text-sm text-gray-500">Buscando…</div>}
          {!loading && items.length === 0 && (
            <div className="px-3 py-2 text-sm text-gray-500">Sin resultados</div>
          )}
          {!loading &&
            items.map((it) => (
              <button
                key={it.id}
                onClick={() => handleSelect(it)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
              >
                <div className="font-medium">{it.name}</div>
                {it.code && <div className="text-gray-500 text-xs">Código: {it.code}</div>}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}