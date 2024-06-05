/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Link } from 'lucide-react'
import { GetAtuador } from './get-atuador-dto'
import AtuadoresEditSheet from '@/pages/atuadores/components/atuadores-edit-sheet'

export const atuadorColumnsAssociation: ColumnDef<GetAtuador>[] = [
  {
    accessorKey: 'nome',
    header: 'Nome',
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
          <AtuadoresEditSheet id={`${row.original.id}`} />
        </div>
      )
    },
  },
]
