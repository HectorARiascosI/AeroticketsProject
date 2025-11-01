import React from 'react';

type Option = { label: string; value: string };

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options?: Option[];
  onValueChange?: (value: string) => void;
};

export default function Select({ label, options, children, onValueChange, value, ...rest }: Props) {
  return (
    <label className="block w-full">
      {label && <span className="block mb-1 text-sm font-medium">{label}</span>}
      <select
        className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
        value={value ?? ''}
        onChange={(e) => onValueChange ? onValueChange(e.target.value) : rest.onChange?.(e)}
        {...rest}
      >
        {options
          ? options.map((op, i) => <option key={i} value={op.value}>{op.label}</option>)
          : children}
      </select>
    </label>
  );
}