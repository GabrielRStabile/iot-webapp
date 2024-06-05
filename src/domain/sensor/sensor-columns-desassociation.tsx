/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { Edit, Unlink } from 'lucide-react'
import { GetSensorDTO } from './get-sensor-dto'

export const sensorColumnsDesassociation: ColumnDef<GetSensorDTO>[] = [
  {
    accessorKey: 'nome',
    header: 'Nome',
  },
  {
    accessorKey: 'tipo',
    header: 'Tipo',
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: function CellComponent({ row, table }) {
      const disassociate = (table.options.meta as any)?.onDesassociation

      return (
        <div className="flex gap-[0.625rem]">
          <Button
            onClick={() => disassociate(row.original)}
            type="button"
            variant="outline"
            className="py-2 px-3"
          >
            <Unlink size="16" />
          </Button>
          <Button type="button" variant="outline" className="py-2 px-3">
            <Edit size="16" />
          </Button>
        </div>
      )
    },
  },
]
