import { DataTable } from '@/components/data-table'
import { atuadorColumnsDispositivo } from '@/domain/atuador/atuador-columns-dispositivo'
import { getAtuadores } from '@/domain/atuador/atuador-queries'
import { GetAtuador } from '@/domain/atuador/get-atuador-dto'
import { useQuery } from '@tanstack/react-query'

const AtuadoresListPage = () => {
  // const queryClient = useQueryClient()

  const { data: atuadores = [], isLoading } = useQuery<GetAtuador[]>({
    queryKey: ['atuadores'],
    queryFn: getAtuadores,
  })

  if (isLoading) return <p>carregando...</p>

  return (
    <>
      <main className="flex flex-col gap-[0.625rem] border border-solid rounded-md mt-3 p-6 h-full">
        <div>
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Atuadores
          </h4>
          <span className="text-sm ">
            Gerencie e adicione mais atuadores em seus dispositivos.
          </span>
        </div>
        {
          <DataTable
            data={atuadores}
            columns={atuadorColumnsDispositivo}
            dataType="atuador"
          />
        }
      </main>
    </>
  )
}

export default AtuadoresListPage
