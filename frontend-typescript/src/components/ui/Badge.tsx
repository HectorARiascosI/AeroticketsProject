import clsx from 'clsx'

export default function Badge({ children, color = 'gray' }: { children: React.ReactNode; color?: 'green'|'red'|'blue'|'gray' }) {
  return (
    <span className={clsx(
      'px-2 py-0.5 rounded-full text-xs font-medium',
      color === 'green' && 'bg-green-100 text-green-700',
      color === 'red' && 'bg-red-100 text-red-700',
      color === 'blue' && 'bg-blue-100 text-blue-700',
      color === 'gray' && 'bg-gray-100 text-gray-700',
    )}>
      {children}
    </span>
  )
}