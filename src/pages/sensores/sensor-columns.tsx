/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'
import ConfirmDeleteDialog from '../../components/confirm-delete-dialog'
import Dispositivo from '../../domain/dispositivo/dispositivo-interface'
import { getDispositivoById } from '../../domain/dispositivo/dispositivo-queries'
import { GetSensorDTO } from '../../domain/sensor/get-sensor-dto'
import { deleteSensor } from '../../domain/sensor/sensor-queries'
import { queryClient } from '../../lib/react-query'
import SensorEditSheet from './sensores-edit-sheet'
import SensorLeituraSheet from './sensores-leitura-sheet'

export const sensorColumns: ColumnDef<GetSensorDTO>[] = [
  {
    accessorKey: 'nome',
    header: 'Nome',
  },
  {
    accessorKey: 'tipo',
    header: 'Tipo',
  },
  {
    accessorKey: 'dispositivoVinculado',
    header: 'Dispositivo Vinculado',
    cell: function CellComponent({ row }) {
      const dispositivoId = row.original.dispositivoId

      const { data: dispositivo } = useQuery<Dispositivo>({
        queryKey: ['dispositivo', dispositivoId],
        queryFn: getDispositivoById,
      })

      return dispositivo?.nome || 'Nenhum'
    },
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: function CellComponent({ row }) {
      const sensorId = String(row.original.id)

      const { mutateAsync: removeSensor } = useMutation({
        mutationFn: deleteSensor,
        onSuccess(_, sensorId) {
          queryClient.setQueryData(
            ['sensores'],
            (oldData: GetSensorDTO[] | undefined) => {
              if (!oldData) return []
              return oldData.filter((sensor) => String(sensor.id) !== sensorId)
            },
          )
        },
        onError() {
          toast.error('Erro ao remover sensor')
        },
      })

      async function handleDeleteSensor() {
        await removeSensor(sensorId)
        toast.success('Sensor removido com sucesso')
      }

      return (
        <div className="flex gap-[0.625rem]">
          <ConfirmDeleteDialog onConfirm={handleDeleteSensor} />
          <SensorEditSheet sensor={row.original} />
          <SensorLeituraSheet sensor={row.original} />
        </div>
      )
    },
  },
]
