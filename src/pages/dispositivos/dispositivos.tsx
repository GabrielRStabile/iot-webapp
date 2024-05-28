import { DataTable } from '@/components/data-table'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

import ThemeSwitcher from '@/components/ui/theme-switcher'
import { dispositivoColumns } from '@/domain/dispositivo/dispositivo-columns'
import { useQuery } from '@tanstack/react-query'
import { getDispositivos } from '@/domain/dispositivo/dispositivo-queries'
import { Outlet, useLocation } from 'react-router-dom'
import DispositivoCreatePage from './dispositivo-create'

const DispositivosPage = () => {
  const { data } = useQuery({
    queryKey: ['dispositivos'],
    queryFn: getDispositivos,
  })

  const location = useLocation()

  if (location.pathname === '/dispositivos/new') {
    return <DispositivoCreatePage />
  }

  return (
    <>
      <div className="bg-neutral-50 p-4 h-full">
        <Outlet />
        {location.pathname === '/dispositivos/new' ? (
          <DispositivoCreatePage />
        ) : null}
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
        <ThemeSwitcher />
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
