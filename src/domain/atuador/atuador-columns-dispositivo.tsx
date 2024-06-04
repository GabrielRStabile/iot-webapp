import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-react'
import { GetAtuador } from './get-atuador-dto'
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Dispositivo from '../dispositivo/dispositivo-interface'
import { getDispositivoById } from '../dispositivo/dispositivo-queries'
import { Badge } from '@/components/ui/badge'
import { deleteAtuadorById } from './atuador-queries'
import { toast } from 'sonner'

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
        return <Badge variant="outline">{dispositivo.nome}</Badge>
      } else {
        return 'Nenhum'
      }
    },
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: function CellComponent({ row }) {
      const atuadorId = row.original.id

      const queryClient = useQueryClient()

      const { mutateAsync: deleteAtuadorFn } = useMutation({
        mutationFn: deleteAtuadorById,
        onSuccess(_, atuadorId) {
          queryClient.setQueryData(
            ['atuadores'],
            (oldData: GetAtuador[] | undefined) => {
              if (!oldData) return []
              return oldData.filter((atuador) => atuador.id !== atuadorId)
            },
          )
        },
      })

      async function handleDeleteAtuador() {
        try {
          await deleteAtuadorFn(atuadorId)
          toast.success(`${row.original.nome} removido com sucesso!`)
        } catch (err) {
          toast.error('Ops! Erro ao remover o atuador.')
        }
      }

      return (
        <div className="flex gap-[0.625rem]">
          <ConfirmDeleteDialog onConfirm={handleDeleteAtuador} />
          <Button
            onClick={() => {}}
            type="button"
            variant="outline"
            className="py-2 px-3"
          >
            <Edit size="16" />
          </Button>
        </div>
      )
    },
  },
]
