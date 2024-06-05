import { DataTable } from '@/components/data-table'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
import { atuadorColumnsDispositivo } from '@/domain/atuador/atuador-columns-dispositivo'
import { getAtuadores } from '@/domain/atuador/atuador-queries'
import { GetAtuador } from '@/domain/atuador/get-atuador-dto'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import AtuadoresCreateSheet from './components/atuadores-create-sheet'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

const AtuadoresListPage = () => {
  const { data: atuadores = [], isLoading } = useQuery<GetAtuador[]>({
    queryKey: ['atuadores'],
    queryFn: getAtuadores,
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
              <Link to="/dashboard/atuadores">Atuadores</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard/atuadores">Todos os Atuadores</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <CardTitle>Atuadores</CardTitle>
        <CardDescription>
          Gerencie e adicione mais atuadores em seus dispositivos.
        </CardDescription>
        <CardContent>
          <DataTable
            data={atuadores}
            columns={atuadorColumnsDispositivo}
            dataType="atuador"
            customAddButton={<AtuadoresCreateSheet />}
          />
        </CardContent>
      </Card>
    </>
  )
}

export default AtuadoresListPage
