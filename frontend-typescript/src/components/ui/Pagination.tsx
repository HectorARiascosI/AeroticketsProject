import Button from './Button'

type Props = {
  page: number
  pageSize: number
  total: number
  onChange: (page: number) => void
}

export default function Pagination({ page, pageSize, total, onChange }: Props) {
  const maxPage = Math.max(1, Math.ceil(total / pageSize))
  const prev = () => onChange(Math.max(1, page - 1))
  const next = () => onChange(Math.min(maxPage, page + 1))

  return (
    <div className="flex items-center justify-end gap-2 mt-3">
      <span className="text-sm text-gray-600">Página {page} de {maxPage}</span>
      <Button variant="secondary" onClick={prev} disabled={page <= 1}>Anterior</Button>
      <Button variant="secondary" onClick={next} disabled={page >= maxPage}>Siguiente</Button>
    </div>
  )
}