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
import { useAuth } from '../../contexts/auth-context'
import { getGatewayByPersonId } from '../../domain/gateway/gateway-queries'
import { gatewayColumns } from './gateway-columns'

export default function GatewaysPage() {
  const { user } = useAuth()

  const { data, isLoading } = useQuery({
    queryKey: ['gateways'],
    enabled: !!user,
    queryFn: () => getGatewayByPersonId(user?.id ?? ''),
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
            <BreadcrumbLink>Gateways</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Todos os Gateways</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <CardTitle>Gateways</CardTitle>
        <CardDescription>
          Gerencie e adicione mais dispositivos em seus gateways.
        </CardDescription>
        <CardContent>
          <DataTable
            columns={gatewayColumns}
            data={data || []}
            dataType="gateway"
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  )
}
