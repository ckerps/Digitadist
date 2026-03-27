import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table"

export interface TableColumn<T> {
  header: string
  accessorKey?: keyof T
  cell?: (item: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  className?: string
  rowKey?: (item: T) => string | number
  onRowClick?: (item: T) => void
  isLoading?: boolean
  footer?: React.ReactNode
}

export function DataTable<T>({
  data,
  columns,
  className,
  rowKey,
  onRowClick,
  isLoading = false,
  footer,
}: DataTableProps<T>) {
  return (
    <div className={cn(" w-full overflow-hidden rounded-xl shadow-xs animate-in fade-in duration-500", className)}>
      <Table className="w-full text-sm">
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-muted/50">
            {columns.map((col, idx) => (
              <TableHead
                key={idx}
                className={cn(
                  "font-semibold text-muted-foreground",
                  col.className
                )}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow className="p-0">
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <div className="flex justify-center items-center gap-2 text-muted-foreground">
                  <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  Cargando datos...
                </div>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                No hay resultados disponibles.
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, rowIndex) => (
              <TableRow
                key={rowKey ? rowKey(row) : rowIndex}
                onClick={() => onRowClick && onRowClick(row)}
                className={cn(
                  onRowClick && "cursor-pointer",
                  "p-0"
                )}
              >
                {columns.map((col, colIndex) => (
                  <TableCell
                    key={colIndex}
                    className={cn(col.className)}
                  >
                    {col.cell
                      ? col.cell(row)
                      : col.accessorKey
                        ? (row[col.accessorKey] as React.ReactNode)
                        : null}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
        {footer && <TableFooter>{footer}</TableFooter>}
      </Table>
    </div>
  )
}
