import { SelectHTMLAttributes } from 'react'

type Props = SelectHTMLAttributes<HTMLSelectElement> & { label?: string }

export default function Select({ label, children, ...rest }: Props) {
  return (
    <label className="block w-full">
      {label && <span className="block mb-1 text-sm font-medium">{label}</span>}
      <select
        className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
        {...rest}
      >
        {children}
      </select>
    </label>
  )
}