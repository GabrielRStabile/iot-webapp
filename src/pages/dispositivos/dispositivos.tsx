import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJpb3QtYXBpIiwic3ViIjoiamFpbHNvbkBnbWFpbC5jb20iLCJmdW5jYW8iOiJVU1VBUklPIiwiZXhwIjoxNzE2NjAxMTc0fQ.QR1LFUTRp9WSkJ_zVif-KR5TQ9Et0UsZuJBD-3jPyl4',
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

          <Table>
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
              <TableRow>
                <TableCell>Exemplo</TableCell>
                <TableCell>Exemplo</TableCell>
                <TableCell>Exemplo</TableCell>
                <TableCell>Exemplo</TableCell>
                <TableCell>Exemplo</TableCell>
                <TableCell>Exemplo</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </main>
      </div>
    </>
  )
}

export default Dispositivos
