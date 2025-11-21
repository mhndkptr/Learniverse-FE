import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TableBody, TableCell, TableRow } from '@/components/ui/table'
import { getObjValueByPath } from '@/utils/helper'
import { MoreVertical } from 'lucide-react'
import React, { useState } from 'react'

export default function BaseTableBody({
  data,
  columns,
  onRowAction,
  isLoading,
  renderExpandedContent,
  allowMultipleExpand = false,
  canRowExpand = () => true,
  renderRowActionsBelow = null,
}) {
  const [expandedRowIndices, setExpandedRowIndices] = useState([])

  const isRowExpanded = (index) => expandedRowIndices.includes(index)

  const toggleExpand = (index) => {
    if (!canRowExpand(data[index])) return

    if (allowMultipleExpand) {
      setExpandedRowIndices((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index]
      )
    } else {
      setExpandedRowIndices((prev) => (prev.includes(index) ? [] : [index]))
    }
  }

  const renderCell = (row, column, index) => {
    if (column.render) {
      return column.render(row, index)
    }

    if (column.key === 'actions') {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={'w-[220px]'}>
            {column.actions?.map((action, index) => {
              if (action.showAction && !action.showAction(row)) {
                return
              }

              return (
                <DropdownMenuItem
                  key={index}
                  onClick={() => onRowAction(action.action, row)}
                  className={
                    'cursor-pointer space-x-1 border-none! ring-0! outline-none!'
                  }
                >
                  {action.icon && <action.icon className={'stroke-2'} />}
                  {action.render ? (
                    action.render(row)
                  ) : (
                    <p className="text-xs font-normal md:text-sm">
                      {action.label}
                    </p>
                  )}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    return getObjValueByPath(row, column.key)
  }

  return (
    <TableBody>
      {isLoading ? (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            Sedang memuat data...
          </TableCell>
        </TableRow>
      ) : data.length > 0 ? (
        data.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            <TableRow
              className={`${renderExpandedContent && canRowExpand(row) ? 'border-none' : ''} `}
            >
              {columns.map((column, index) => (
                <TableCell
                  key={`${rowIndex}-${column.key}`}
                  className={`${column.cellClassName} px-3! font-medium`}
                >
                  {renderCell(row, column, rowIndex)}
                </TableCell>
              ))}
            </TableRow>

            {renderExpandedContent && canRowExpand(row) && (
              <TableRow className={`hover:bg-transparent`}>
                <TableCell colSpan={columns.length} className="p-0">
                  {typeof renderRowActionsBelow === 'function'
                    ? renderRowActionsBelow(
                        row,
                        rowIndex,
                        isRowExpanded(rowIndex),
                        toggleExpand
                      )
                    : null}
                </TableCell>
              </TableRow>
            )}

            {renderExpandedContent &&
              isRowExpanded(rowIndex) &&
              canRowExpand(row) && (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={columns.length} className="p-0">
                    {renderExpandedContent(row)}
                  </TableCell>
                </TableRow>
              )}
          </React.Fragment>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            Tidak ada data
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  )
}
