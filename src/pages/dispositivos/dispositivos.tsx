import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Search } from '@/components/ui/input'
import ThemeSwitcher from '@/components/ui/theme-switcher'
import { CirclePlus, FileSpreadsheet } from 'lucide-react'

const Dispositivos = () => {
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
          <div className="flex justify-between">
            <Search
              className="flex-1 max-w-sm"
              placeholder="Pesquise pelo nome"
            />
            <div>
              <Button variant="outline" className="mr-[0.625rem]">
                <FileSpreadsheet className="mr-2" size="16" />
                Exportar
              </Button>
              <Button>
                <CirclePlus className="mr-2" size="16" />
                Adicionar Dispositivo
              </Button>
            </div>
          </div>
          {/* {data && (
            <DataTable
              columns={dispositivoColumns}
              data={data}
              dataType="dispositivo"
            />
          )} */}
        </main>
      </div>
    </>
  )
}

export default Dispositivos
