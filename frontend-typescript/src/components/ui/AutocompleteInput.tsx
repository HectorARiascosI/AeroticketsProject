import React, { useEffect, useRef, useState } from 'react';
import { autocompleteAirports } from '@/services/flightService';
import clsx from 'clsx';

type Item = { label: string; iata: string };

export default function AutocompleteInput({
  label,
  placeholder,
  value,
  onChange
}: {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState(value ?? '');
  const [items, setItems] = useState<Item[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  // Cierra dropdown al hacer click fuera
  useEffect(() => {
    const h = (ev: MouseEvent) => {
      if (!ref.current?.contains(ev.target as Node)) setOpen(false);
    };
    document.addEventListener('click', h);
    return () => document.removeEventListener('click', h);
  }, []);

  // Debounce fetch
  useEffect(() => {
    const t = setTimeout(async () => {
      if (q && q.trim().length >= 2) {
        try {
          const res = await autocompleteAirports(q.trim());
          setItems(res);
          setOpen(true);
        } catch {
          setItems([]);
          setOpen(false);
        }
      } else {
        setItems([]);
        setOpen(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  const commit = (val: string) => {
    onChange(val);
    setQ(val);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <input
        className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
        placeholder={placeholder}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => { if (items.length > 0) setOpen(true); }}
      />
      <div className={clsx(
        "absolute z-50 mt-1 w-full bg-white border rounded shadow",
        open ? "block" : "hidden"
      )}>
        {items.length === 0 ? (
          <div className="px-3 py-2 text-sm text-gray-500">Sin sugerencias</div>
        ) : items.map((it, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => commit(it.label)} // enviamos la etiqueta completa, el backend extrae (IATA)
            className="w-full text-left px-3 py-2 hover:bg-gray-50"
          >
            {it.label}
          </button>
        ))}
      </div>
    </div>
  );
}