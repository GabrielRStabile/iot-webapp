import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-react'
import { GetAtuador } from './get-atuador-dto'
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog'

export const atuadorColumnsDispositivo: ColumnDef<GetAtuador>[] = [
  {
    accessorKey: 'nome',
    header: 'Nome',
  },
  {
    accessorKey: 'dispositivoId',
    header: 'Dispositivo Vinculado',
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: function CellComponent() {
      return (
        <div className="flex gap-[0.625rem]">
          <ConfirmDeleteDialog onConfirm={() => {}} />
          <Button type="button" variant="outline" className="py-2 px-3">
            <Edit size="16" />
          </Button>
        </div>
      )
    },
  },
]
