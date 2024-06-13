import { ColumnDef } from '@tanstack/react-table'
import { GetAtuador } from './get-atuador-dto'

export const atuadorColumns: ColumnDef<GetAtuador>[] = [
  {
    accessorKey: 'nome',
    header: 'Nome',
  },
]
