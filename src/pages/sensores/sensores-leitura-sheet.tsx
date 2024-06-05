import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useQuery } from '@tanstack/react-query'
import { Eye } from 'lucide-react'
import { DataTable } from '../../components/data-table'
import { GetSensorDTO } from '../../domain/sensor/get-sensor-dto'
import Leitura from '../../domain/sensor/leitura'
import { getLeiturasSensor } from '../../domain/sensor/sensor-queries'
import { leiturasColumns } from './leituras-columns'

interface SensorEditSheetProps {
  sensor: GetSensorDTO
}

const SensorLeituraSheet = ({ sensor }: SensorEditSheetProps) => {
  const { data: leituras = [] } = useQuery<Leitura[]>({
    queryKey: ['leituras', sensor.id],
    queryFn: () => getLeiturasSensor(String(sensor.id)),
  })

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button type="button" variant="outline" className="py-2 px-3">
          <Eye size="16" />
        </Button>
      </SheetTrigger>
      <SheetContent className="min-w-max">
        <SheetHeader className="mb-6">
          <SheetTitle>Leituras do {sensor.nome}</SheetTitle>
          <SheetDescription>
            Aqui você vai encontrar as últimas leituras feitas por esse sensor,
            a lista está em ordem decrescente de disparo.
          </SheetDescription>
        </SheetHeader>
        <DataTable
          columns={leiturasColumns}
          data={leituras || []}
          dataType="leitura"
          hideHeadingButtons
          customAddButton={<div />}
        />
      </SheetContent>
    </Sheet>
  )
}

export default SensorLeituraSheet
