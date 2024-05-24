import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import useFetch from '@/hooks/useFetch'
import { CirclePlus, FileSpreadsheet } from 'lucide-react'
import { useEffect, useState } from 'react'

const Dispositivos = () => {
  const { data, loading, error, request } = useFetch()

  useEffect(() => {
    request('http://localhost:8080/dispositivo/1', {
      headers: {
        Authorization: 'Bearer ',
      },
    })
  }, [request])

  return (
    <>
      <div className="bg-neutral-50 p-4 h-screen">
        <main className="flex flex-col gap-[0.625rem] bg-white border border-solid border-neutral-200 rounded-md p-6 h-full">
          <div>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Dispositivos
            </h4>
            <span className="text-sm text-stone-600">
              Gerencie e adicione mais dispositivos em seus gateways.
            </span>
          </div>
          <div className="flex justify-between">
            <Input className="flex-1 max-w-sm" />
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
            <TableBody>
              {!data && (
                <div className="flex flex-col justify-center items-center h-full w-full text-center gap-[10px]">
                  <p className="text-lg font-semibold">
                    Eita! Não encontrei nada por aqui
                  </p>
                  <span className="text-sm">
                    Que tal deixar isso aqui menos vazio e começar a adicionar
                    seus dispositivos?
                  </span>
                  <Button>
                    <CirclePlus className="mr-2" size="16" />
                    Adicionar Dispositivo
                  </Button>
                </div>
              )}
            </TableBody>
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
