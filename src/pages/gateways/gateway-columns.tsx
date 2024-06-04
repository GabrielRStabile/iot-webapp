import { Checkbox } from '@radix-ui/react-checkbox'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { Edit } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import ConfirmDeleteDialog from '../../components/confirm-delete-dialog'
import { Button } from '../../components/ui/button'
import { GatewayEntity } from '../../domain/gateway/gateway-entity'
import { deleteGatewayById } from '../../domain/gateway/gateway-queries'
import { GetGatewayDTO } from '../../domain/gateway/get-gateway-dto'

export const gatewayColumns: ColumnDef<GatewayEntity>[] = [
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
    id: 'actions',
    header: 'Ações',
    cell: function CellComponent({ row }) {
      const gatewayId = row.original.id

      const queryClient = useQueryClient()

      const navigate = useNavigate()

      const { mutateAsync: removeGateway } = useMutation({
        mutationFn: deleteGatewayById,
        onSuccess(_, gatewayId) {
          queryClient.setQueryData(
            ['gateways'],
            (oldData: GetGatewayDTO[] | undefined) => {
              if (!oldData) return []
              return oldData.filter((gateway) => gateway.id !== gatewayId)
            },
          )
        },
        onError() {
          toast.error('Erro ao remover gateway')
        },
      })

      async function handleDeleteGateway() {
        await removeGateway(gatewayId)
        toast.success('Gateway removido com sucesso')
      }

      return (
        <div className="flex gap-[0.625rem]">
          <ConfirmDeleteDialog onConfirm={handleDeleteGateway} />
          <Button
            variant="outline"
            className="py-2 px-3"
            onClick={() => navigate(`./${gatewayId}/edit`)}
          >
            <Edit size="16" />
          </Button>
        </div>
      )
    },
  },
]
