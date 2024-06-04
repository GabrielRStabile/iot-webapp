import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-react'
import { GetAtuador } from './get-atuador-dto'
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog'
import { useQuery } from '@tanstack/react-query'
import Dispositivo from '../dispositivo/dispositivo-interface'
import { getDispositivoById } from '../dispositivo/dispositivo-queries'

export const atuadorColumnsDispositivo: ColumnDef<GetAtuador>[] = [
  {
    accessorKey: 'nome',
    header: 'Nome',
  },
  {
    accessorKey: 'dispositivoId',
    header: 'Dispositivo Vinculado',
    cell: function CellComponent({ row }) {
      const dispositivoId = row.original.dispositivoId

      const { data: dispositivo } = useQuery<Dispositivo>({
        queryKey: ['dispositivo', dispositivoId],
        queryFn: getDispositivoById,
      })

      if (dispositivo) {
        return dispositivo.nome
      }
    },
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
