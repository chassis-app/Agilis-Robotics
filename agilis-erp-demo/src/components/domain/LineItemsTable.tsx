import type { ReactNode } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

export interface ColumnDef<T = Record<string, unknown>> {
  key: string
  header: string
  width?: string
  align?: 'left' | 'center' | 'right'
  render?: (value: unknown, row: T, index: number) => ReactNode
}

interface LineItemsTableProps<T extends Record<string, unknown>> {
  columns: ColumnDef<T>[]
  data: T[]
  editable?: boolean
  onAdd?: () => void
  onRemove?: (index: number) => void
  emptyText?: string
  className?: string
}

export function LineItemsTable<T extends Record<string, unknown>>({
  columns,
  data,
  editable = false,
  onAdd,
  onRemove,
  emptyText = 'No line items.',
  className,
}: LineItemsTableProps<T>) {
  const alignClass = (align?: string) => {
    switch (align) {
      case 'center':
        return 'text-center'
      case 'right':
        return 'text-right'
      default:
        return 'text-left'
    }
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="overflow-x-auto border border-neutral-200 rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-3 font-medium text-neutral-600',
                    alignClass(col.align),
                  )}
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.header}
                </th>
              ))}
              {editable && (
                <th className="px-4 py-3 font-medium text-neutral-600 w-12" />
              )}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (editable ? 1 : 0)}
                  className="px-4 py-8 text-center text-neutral-400"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn('px-4 py-3 text-neutral-700', alignClass(col.align))}
                    >
                      {col.render
                        ? col.render(row[col.key], row, rowIndex)
                        : (row[col.key] as ReactNode) ?? '--'}
                    </td>
                  ))}
                  {editable && (
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => onRemove?.(rowIndex)}
                        className="inline-flex items-center justify-center h-7 w-7 rounded text-neutral-400 hover:text-danger-500 hover:bg-danger-50 transition-colors"
                        aria-label="Remove line"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editable && onAdd && (
        <div>
          <Button variant="ghost" size="sm" onClick={onAdd}>
            <Plus className="h-4 w-4" />
            Add Line
          </Button>
        </div>
      )}
    </div>
  )
}
