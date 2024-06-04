/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Edit, Link } from 'lucide-react'
import { GetSensor } from './get-sensor-dto'

export const sensorColumnsAssociation: ColumnDef<GetSensor>[] = [
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
      const associate = (table.options.meta as any)?.onAssociation

      return (
        <div className="flex gap-[0.625rem]">
          <Button
            onClick={() => associate(row.original)}
            type="button"
            variant="outline"
            className="py-2 px-3"
          >
            <Link size="16" />
          </Button>
          <Button type="button" variant="outline" className="py-2 px-3">
            <Edit size="16" />
          </Button>
        </div>
      )
    },
  },
]
