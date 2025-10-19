import { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  loading?: boolean
}

export default function Button({ className, variant = 'primary', loading, children, ...rest }: Props) {
  return (
    <button
      className={clsx(
        'px-4 py-2 rounded-md text-sm font-medium transition disabled:opacity-60 disabled:cursor-not-allowed',
        variant === 'primary' && 'bg-primary text-white hover:bg-sky-600',
        variant === 'secondary' && 'bg-gray-200 hover:bg-gray-300',
        variant === 'danger' && 'bg-danger text-white hover:bg-red-600',
        variant === 'ghost' && 'bg-transparent hover:bg-gray-100',
        className
      )}
      {...rest}
    >
      {loading ? 'Procesando...' : children}
    </button>
  )
}