/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from '@tanstack/react-table'
import Leitura from '../../domain/sensor/leitura'

export const leiturasColumns: ColumnDef<Leitura>[] = [
  {
    accessorKey: 'data',
    header: 'Data',
    cell: function CellComponent({ row }) {
      const formattedDate = new Date(row.original.data).toLocaleString(
        'pt-BR',
        {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        },
      )
      return formattedDate
    },
  },
  {
    accessorKey: 'valor',
    header: 'Valor',
  },
]
