export default function Loader({ label = 'Cargando...' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mr-3" />
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  )
}