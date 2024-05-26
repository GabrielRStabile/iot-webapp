import { ColumnDef } from '@tanstack/react-table'
import Dispositivo from './dispositivo-interface'
import { Badge } from '@/components/ui/badge'

export const dispositivoColumns: ColumnDef<Dispositivo>[] = [
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
]
