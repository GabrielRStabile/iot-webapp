import { ColumnDef } from '@tanstack/react-table'
import Dispositivo from './dispositivo-interface'

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
  },
]
