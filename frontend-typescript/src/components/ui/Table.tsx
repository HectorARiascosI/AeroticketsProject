export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="min-w-full text-sm">{children}</table>
    </div>
  )
}

export const THead = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-gray-50 text-gray-700">{children}</thead>
)

export const TBody = ({ children }: { children: React.ReactNode }) => <tbody className="divide-y">{children}</tbody>

export const TR = ({ children }: { children: React.ReactNode }) => <tr className="hover:bg-gray-50">{children}</tr>

export const TH = ({ children }: { children: React.ReactNode }) => (
  <th className="text-left font-semibold px-4 py-3">{children}</th>
)

export const TD = ({ children }: { children: React.ReactNode }) => <td className="px-4 py-3">{children}</td>