/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { Edit, Link } from 'lucide-react'
import Dispositivo from '../../domain/dispositivo/dispositivo-interface'

export const createGatewayDispositivoLinkColumns: ColumnDef<Dispositivo>[] = [
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
    id: 'actions',
    header: 'Ações',
    meta: {
      func: () => {},
    },
    cell: function CellComponent({ row, table }) {
      function handleLinkUnlinkDispositivo() {
        ;(table.options.meta as any)?.fn(row.original)
      }

      return (
        <div className="flex gap-[0.625rem]">
          <Button
            variant="outline"
            className="py-2 px-3"
            onClick={handleLinkUnlinkDispositivo}
          >
            <Link size="16" />
          </Button>
          <Button variant="outline" className="py-2 px-3">
            <Edit size="16" />
          </Button>
        </div>
      )
    },
  },
]
