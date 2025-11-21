import { TableRow, TableHeader, TableHead } from '@/components/ui/table'
import { MoveDown, MoveUp } from 'lucide-react'

export default function BaseTableHeader({ columns, handleSort, sortConfig }) {
  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <MoveDown className="ml-1 h-4 w-4 text-gray-400" />
    }

    if (sortConfig.direction === 'asc') {
      return <MoveUp className="ml-1 h-4 w-4" />
    }

    if (sortConfig.direction === 'desc') {
      return <MoveDown className="ml-1 h-4 w-4" />
    }

    return <MoveDown className="ml-1 h-4 w-4 text-gray-400" />
  }

  return (
    <TableHeader>
      <TableRow>
        {columns.map((column, index) => (
          <TableHead
            key={column.key}
            className={`${column.className} ${index !== columns.length - 1 && 'border-r'}`}
            onClick={() => column.sortable && handleSort(column.key)}
            style={{ cursor: column.sortable ? 'pointer' : 'default' }}
          >
            <div className="flex items-center px-1">
              <h2 className="">{column.header}</h2>
              {column.sortable && renderSortIcon(column.key)}
            </div>
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  )
}
