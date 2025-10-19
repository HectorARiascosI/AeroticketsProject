export default function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center py-14">
      <div className="text-6xl mb-3">🛫</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
    </div>
  )
}