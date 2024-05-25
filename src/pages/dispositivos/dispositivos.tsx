import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Search } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import ThemeSwitcher from '@/components/ui/theme-switcher'
import useFetch from '@/hooks/useFetch'
import { CirclePlus, Edit, Eye, FileSpreadsheet, Trash } from 'lucide-react'
import { useEffect } from 'react'

interface Dispositivo {
  id: number
  nome: string
  descricao: string
  endereco: string
  local: string
  gatewayId: number | null
}

const Dispositivos = () => {
  const { data, error, loading, request } = useFetch<Dispositivo[]>()

  useEffect(() => {
    request('http://localhost:8080/dispositivo', {
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJpb3QtYXBpIiwic3ViIjoiamFpbHNvbkBnbWFpbC5jb20iLCJmdW5jYW8iOiJVU1VBUklPIiwiZXhwIjoxNzE2NzQ4Nzk5fQ.Sd2CTni6Z2sfMEvcmW3SALOQGbmIgdPbrZuyqYvAt4o',
      },
    })
  }, [request])

  const renderTable = () => {
    let table

    if (!data) {
      table = (
        <TableRow>
          <TableCell colSpan={6}>
            <div className="text-center flex flex-col justify-center items-center gap-[0.625rem]">
              <p className="text-lg font-semibold">
                Eita! Não encontrei nada por aqui
              </p>
              <span className="text-sm block">
                Que tal deixar isso aqui menos vazio e começar a adicionar seus
                dispositivos?
              </span>
              <Button>
                <CirclePlus className="mr-2" size="16" />
                Adicionar Dispositivo
              </Button>
            </div>
          </TableCell>
        </TableRow>
      )
    } else {
      table = data.map((item) => (
        <TableRow key={item.id}>
          <TableCell>{item.nome}</TableCell>
          <TableCell>{item.descricao}</TableCell>
          <TableCell>{item.endereco}</TableCell>
          <TableCell>{item.local}</TableCell>
          <TableCell>{item.gatewayId ? item.gatewayId : 'Nenhum'}</TableCell>
          <TableCell className="flex h-full items-center gap-[0.625rem]">
            <Button variant="outline">
              <Trash size="16" />
            </Button>
            <Button variant="outline">
              <Eye size="16" />
            </Button>
            <Button variant="outline">
              <Edit size="16" />
            </Button>
          </TableCell>
        </TableRow>
      ))
    }
    return table
  }

  if (loading) return <p>Carregando...</p>

  if (error) return <p>{error}</p>

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

          <Table className="h-full">
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Local</TableHead>
                <TableHead>Gateway vinculado</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{renderTable()}</TableBody>
          </Table>

          <Pagination className="flex justify-end">
            <PaginationContent className="text-neutral-500">
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </main>
      </div>
    </>
  )
}

export default Dispositivos
