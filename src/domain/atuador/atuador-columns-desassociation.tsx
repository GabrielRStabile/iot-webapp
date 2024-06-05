/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Unlink } from 'lucide-react'
import { GetAtuador } from './get-atuador-dto'
import AtuadoresEditSheet from '@/pages/atuadores/components/atuadores-edit-sheet'

export const atuadorColumnsDesassociation: ColumnDef<GetAtuador>[] = [
  {
    accessorKey: 'nome',
    header: 'Nome',
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: function CellComponent({ row, table }) {
      const desassociate = (table.options.meta as any)?.onDesassociation

      return (
        <div className="flex gap-[0.625rem]">
          <Button
            onClick={() => desassociate(row.original)}
            type="button"
            variant="outline"
            className="py-2 px-3"
          >
            <Unlink size="16" />
          </Button>
          <AtuadoresEditSheet id={`${row.original.id}`} />
        </div>
      )
    },
  },
]
