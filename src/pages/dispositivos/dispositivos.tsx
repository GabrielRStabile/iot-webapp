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
import { CirclePlus, FileSpreadsheet } from 'lucide-react'

const Dispositivos = () => {
  return (
    <>
      <div className="bg-neutral-50 p-4">
        <main className="flex flex-col gap-[10px] bg-white border border-solid border-neutral-200 rounded-md p-6">
          <div>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Dispositivos
            </h4>
            <span className="text-sm text-stone-600">
              Gerencie e adicione mais dispositivos em seus gateways.
            </span>
          </div>
          <div className="flex justify-between">
            <Input className="flex-1 max-w-[384px]" />
            <div>
              <Button variant="outline" className="mr-[10px]">
                <FileSpreadsheet className="mr-2" size="16" />
                Exportar
              </Button>
              <Button>
                <CirclePlus className="mr-2" size="16" />
                Adicionar Dispositivo
              </Button>
            </div>
          </div>

          <Table className="border border-neutral-200 ">
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
