import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import { Button } from './ui/button'
import {
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  FileSpreadsheet,
} from 'lucide-react'
import { useState } from 'react'
import { Search } from './ui/input'
import { useNavigate } from 'react-router-dom'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  dataType: 'dispositivo' | 'gateway' | 'sensor' | 'atuador'
}

export function DataTable<TData, TValue>({
  columns,
  data,
  dataType,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      rowSelection,
    },
  })

  const types = {
    dispositivo: 'dispositivos',
    gateway: 'gateways',
    sensor: 'sensores',
    atuador: 'atuadores',
  }

  const navigate = useNavigate()

  return (
    <div>
      <div className="flex justify-between mb-[0.625rem]">
        <Search
          className="flex-1 max-w-sm"
          placeholder="Pesquise pelo nome"
          value={(table.getColumn('nome')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('nome')?.setFilterValue(event.target.value)
          }
        />
        <div>
          <Button variant="outline" className="mr-[0.625rem]">
            <FileSpreadsheet className="mr-2" size="16" />
            Exportar
          </Button>
          <Button className="capitalize" onClick={() => navigate('./new')}>
            <CirclePlus className="mr-2" size="16" />
            Adicionar {dataType}
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="text-center flex flex-col justify-center items-center gap-[0.625rem]">
                    <p className="text-lg font-semibold">
                      Eita! Não encontrei nada por aqui
                    </p>
                    <span className="text-sm block">
                      Que tal deixar isso aqui menos vazio e começar a adicionar
                      seus {types[dataType]}?
                    </span>
                    <Button className="capitalize">
                      <CirclePlus className="mr-2" size="16" />
                      Adicionar {dataType}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end text-neutral-500">
        <Button
          variant="ghost"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft size="16" />
          <span>Anterior</span>
        </Button>
        <Button
          variant="ghost"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span>Próximo</span>
          <ChevronRight size="16" />
        </Button>
      </div>
    </div>
  )
}
