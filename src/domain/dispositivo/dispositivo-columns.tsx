import { ColumnDef } from '@tanstack/react-table'
import Dispositivo from './dispositivo-interface'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Edit, Eye } from 'lucide-react'
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteDispositivo } from './dispositivo-queries'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { GetGatewayDTO } from '../gateway/get-gateway-dto'
import { getGatewayById } from '../gateway/gateway-queries'

export const dispositivoColumns: ColumnDef<Dispositivo>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'nome',
    header: 'Nome',
  },
  {
    accessorKey: 'descricao',
    header: 'Descrição',
  },
  {
    accessorKey: 'endereco',
    header: 'Endereço',
  },
  {
    accessorKey: 'local',
    header: 'Local',
  },
  {
    accessorKey: 'gatewayId',
    header: 'Gateway Vinculado',
    cell: function CellComponent({ row }) {
      const gatewayId = row.original.gatewayId

      const { data: gateway } = useQuery<GetGatewayDTO>({
        queryKey: ['gateway', gatewayId?.toString()],
        queryFn: () => getGatewayById(gatewayId?.toString() || ''),
      })

      if (gateway) {
        return <Badge variant="outline">{gateway.nome}</Badge>
      } else {
        return 'Nenhum'
      }
    },
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: function CellComponent({ row }) {
      const dispositivoId = row.original.id

      const queryClient = useQueryClient()
      const navigate = useNavigate()

      const { mutateAsync: deleteDispositivoFn } = useMutation({
        mutationFn: deleteDispositivo,
        onSuccess(_, dispositivoId) {
          queryClient.setQueryData(
            ['dispositivos'],
            (oldData: Dispositivo[] | undefined) => {
              if (!oldData) return []
              return oldData.filter(
                (dispositivo) => dispositivo.id !== dispositivoId,
              )
            },
          )
        },
      })

      async function handleDeleteDispositivo() {
        try {
          await deleteDispositivoFn(dispositivoId)
          toast.success(`${row.original.nome} removido com sucesso!`)
        } catch (err) {
          toast.error('Ops! Erro ao remover o dispositivo.')
        }
      }

      return (
        <div className="flex gap-[0.625rem]">
          <ConfirmDeleteDialog onConfirm={handleDeleteDispositivo} />
          <Button
            onClick={() => navigate(`./${dispositivoId}/details`)}
            type="button"
            variant="outline"
            className="py-2 px-3"
          >
            <Eye size="16" />
          </Button>
          <Button
            onClick={() => navigate(`./${dispositivoId}/edit`)}
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
