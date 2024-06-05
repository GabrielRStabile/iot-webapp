import { DataTable } from '@/components/data-table'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { dispositivoColumns } from '@/domain/dispositivo/dispositivo-columns'
import { getDispositivos } from '@/domain/dispositivo/dispositivo-queries'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '../../components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

const DispositivoListPage = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ['dispositivos'],
    queryFn: getDispositivos,
  })

  if (isLoading) return <LoadingSpinner />

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard">Início</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard/dispositivos">Dispositivos</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard/dispositivos">Todos os Dispositivos</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <CardTitle>Dispositivos</CardTitle>
        <CardDescription>
          Gerencie e adicione mais dispositivos em seus gateways.
        </CardDescription>
        <CardContent>
          <DataTable
            columns={dispositivoColumns}
            data={data}
            dataType="dispositivo"
          />
        </CardContent>
      </Card>
    </>
  )
}

export default DispositivoListPage
