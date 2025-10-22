// frontend/src/components/ui/Select.tsx
import React, { SelectHTMLAttributes } from 'react';

type Option = { label: string; value: string };

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options?: Option[];
  error?: string;
};

export default function Select({ label, options, children, error, onChange, value = '', ...rest }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) onChange(e);
  };

  return (
    <label className="block w-full">
      {label && <span className="block mb-1 text-sm font-medium">{label}</span>}
      <select
        className={`w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-primary ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        value={value}
        onChange={handleChange}
        aria-invalid={!!error}
        {...rest}
      >
        {options
          ? options.map((op) => (
              <option key={op.value} value={op.value}>
                {op.label}
              </option>
            ))
          : children}
      </select>
      {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
    </label>
  );
}