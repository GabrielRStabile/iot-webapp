import {
  ColumnDef,
  ColumnFiltersState,
  TableMeta,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { CirclePlus, FileSpreadsheet } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Search } from './ui/input'
import { LoadingSpinner } from './ui/loading-spinner'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  dataType: 'dispositivo' | 'gateway' | 'sensor' | 'atuador' | 'leitura'
  isLoading?: boolean
  hideHeadingButtons?: boolean
  meta?: TableMeta<TData>
  customAddButton?: React.ReactNode
}

export function DataTable<TData, TValue>({
  columns,
  data,
  dataType,
  isLoading,
  hideHeadingButtons,
  meta,
  customAddButton,
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
    meta,
  })

  const types = {
    dispositivo: 'dispositivos',
    gateway: 'gateways',
    sensor: 'sensores',
    atuador: 'atuadores',
    leitura: 'leituras',
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
        {!hideHeadingButtons && (
          <div className="flex items-center">
            <Button variant="outline" className="mr-[0.625rem]">
              <FileSpreadsheet className="mr-2" size="16" />
              Exportar
            </Button>
            {customAddButton || (
              <Button className="capitalize" onClick={() => navigate('./new')}>
                <CirclePlus className="mr-2" size="16" />
                Adicionar {dataType}
              </Button>
            )}
          </div>
        )}
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

          {isLoading && <LoadingSpinner />}

          {!isLoading && (
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
                        Que tal deixar isso aqui menos vazio e começar a
                        adicionar seus {types[dataType]}?
                      </span>
                      {customAddButton || (
                        <Button
                          className="capitalize"
                          onClick={() => navigate('./new')}
                        >
                          <CirclePlus className="mr-2" size="16" />
                          Adicionar {dataType}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </div>
      <Pagination className="flex justify-end mt-2">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => table.previousPage()} />
          </PaginationItem>
          {table.getPageOptions().map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => table.setPageIndex(page)}
                isActive={table.getPageCount() === page}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext onClick={() => table.nextPage()} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
