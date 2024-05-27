import { ColumnDef } from '@tanstack/react-table'
import Dispositivo from './dispositivo-interface'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Edit, Eye } from 'lucide-react'
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog'
import useFetch from '@/hooks/useFetch'

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
    cell: ({ getValue }) => {
      const value = getValue<number | null>()
      return value === null ? (
        'Nenhum'
      ) : (
        <Badge variant="outline">{value}</Badge>
      )
    },
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: function CellComponent({ row }) {
      const dispositivoId = row.original.id
      const { error, request } = useFetch()

      const handleDelete = () => {
        request(`http://localhost:8080/dispositivo/${dispositivoId}`, {
          method: 'DELETE',
        })
        if (error) console.log(error)
      }

      return (
        <div className="flex gap-[0.625rem]">
          <ConfirmDeleteDialog onConfirm={handleDelete} />
          <Button variant="outline" className="py-2 px-3">
            <Eye size="16" />
          </Button>
          <Button variant="outline" className="py-2 px-3">
            <Edit size="16" />
          </Button>
        </div>
      )
    },
  },
]
