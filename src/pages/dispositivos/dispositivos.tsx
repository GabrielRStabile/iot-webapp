import { DataTable } from '@/components/data-table'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { dispositivoColumns } from '@/domain/dispositivo/dispositivo-columns'
import { useQuery } from '@tanstack/react-query'
import { getDispositivos } from '@/domain/dispositivo/dispositivo-queries'

const DispositivosPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['dispositivos'],
    queryFn: getDispositivos,
  })

  if (isLoading) return <p>carregando...</p>

  return (
    <>
      <div className="bg-neutral-50 p-4 h-full">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>Início</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Dispositivos</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Todos os Dispositivos</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <main className="flex flex-col gap-[0.625rem] bg-white border border-solid border-neutral-200 rounded-md mt-3 p-6 h-full">
          <div>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Dispositivos
            </h4>
            <span className="text-sm text-stone-600">
              Gerencie e adicione mais dispositivos em seus gateways.
            </span>
          </div>

          {data && (
            <DataTable
              columns={dispositivoColumns}
              data={data}
              dataType="dispositivo"
            />
          )}
        </main>
      </div>
    </>
  )
}

export default DispositivosPage
