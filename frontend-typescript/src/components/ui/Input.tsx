import { forwardRef, InputHTMLAttributes } from 'react'
import clsx from 'clsx'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
}

/**
 * Input con soporte para forwardRef (necesario para React Hook Form)
 */
const Input = forwardRef<HTMLInputElement, Props>(({ label, error, className, ...rest }, ref) => {
  return (
    <label className="block w-full">
      {label && <span className="block mb-1 text-sm font-medium">{label}</span>}
      <input
        ref={ref}
        className={clsx(
          'w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
          className
        )}
        {...rest}
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </label>
  )
})

Input.displayName = 'Input'
export default Input