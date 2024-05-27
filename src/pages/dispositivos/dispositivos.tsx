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
import { useEffect, useState } from 'react'

const Dispositivos = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    async function getData() {
      const res = await fetch('http://localhost:8080/dispositivo', {
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJpb3QtYXBpIiwic3ViIjoiamFpbHNvbkBnbWFpbC5jb20iLCJmdW5jYW8iOiJVU1VBUklPIiwiZXhwIjoxNzE2ODM3NjEyfQ.6LtPX0ImCWV3lsPv7M0DVH1_tRjIfz-q5TYKeTClu2M',
        },
      })
      const json = await res.json()
      setData(json)
    }
    getData()
  }, [])

  return (
    <>
      <div className="bg-neutral-50 p-4 h-screen">
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

export default Dispositivos
