import { useQuery } from '@tanstack/react-query'
import { DataTable } from '../../components/data-table'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '../../components/ui/breadcrumb'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '../../components/ui/card'
import { GetSensorDTO } from '../../domain/sensor/get-sensor-dto'
import { getSensores } from '../../domain/sensor/sensor-queries'
import { sensorColumns } from './sensor-columns'
import SensoresCreateSheet from './sensores-create-sheet'

export default function SensoresPage() {
  const { data, isLoading } = useQuery<GetSensorDTO[]>({
    queryKey: ['sensores'],
    queryFn: getSensores,
  })

  return (
    <div className="p-4 w-full">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>Início</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Sensores</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Todos os Sensores</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <CardTitle>Sensores</CardTitle>
        <CardDescription>
          Gerencie, espie os logs e adicione seus sensores, ligue-os à um
          dispositivo.
        </CardDescription>
        <CardContent>
          <DataTable
            columns={sensorColumns}
            data={data || []}
            dataType="sensor"
            isLoading={isLoading}
            customAddButton={<SensoresCreateSheet />}
          />
        </CardContent>
      </Card>
    </div>
  )
}
