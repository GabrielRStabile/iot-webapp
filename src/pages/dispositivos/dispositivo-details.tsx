import { DataTableBasic } from '@/components/data-table-basic'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { atuadorColumns } from '@/domain/atuador/atuador-columns'
import { GetAtuador } from '@/domain/atuador/get-atuador-dto'
import Dispositivo from '@/domain/dispositivo/dispositivo-interface'
import {
  getAtuadoresByDispositivoId,
  getDispositivoById,
  getSensoresByDispositivoId,
} from '@/domain/dispositivo/dispositivo-queries'
import { GetSensor } from '@/domain/sensor/get-sensor-dto'
import { sensorColumns } from '@/domain/sensor/sensor-columns'
import { useQuery } from '@tanstack/react-query'
import { Map, Marker } from '@vis.gl/react-google-maps'
import { Link, useNavigate } from 'react-router-dom'

const DispositivoDetailsPage = ({ id }: { id: string }) => {
  const navigate = useNavigate()

  const { data: dispositivo } = useQuery<Dispositivo>({
    queryKey: ['dispositivo', id],
    queryFn: getDispositivoById,
  })

  const { data: sensores = [] } = useQuery<GetSensor[]>({
    queryKey: ['sensoresDispositivo', id],
    queryFn: getSensoresByDispositivoId,
  })

  const { data: atuadores = [] } = useQuery<GetAtuador[]>({
    queryKey: ['atuadoresDispositivo', id],
    queryFn: getAtuadoresByDispositivoId,
  })

  const renameMap: Record<string, string> = {
    nome: 'Nome',
    descricao: 'Descrição',
    endereco: 'Endereço IP',
    local: 'Localização',
    gatewayId: 'Gateway Associado',
  }

  const formatValue = (key: string, value: Dispositivo[keyof Dispositivo]) => {
    switch (key) {
      case 'gatewayId':
        return value === null ? 'Nenhum' : value
      default:
        return value
    }
  }

  const renderDetails = () => {
    if (dispositivo) {
      return Object.keys(dispositivo).map((key) => {
        if (key === 'id' || key === 'local') return null
        const displayName = renameMap[key]
        const displayValue = formatValue(
          key,
          dispositivo[key as keyof Dispositivo],
        )
        return (
          <div key={key}>
            <h6 className="text-sm font-medium text-neutral-900">
              {displayName}
            </h6>
            <span className="text-sm text-neutral-600">{displayValue}</span>
          </div>
        )
      })
    }
  }

  const renderLocation = () => {
    if (dispositivo) {
      const [lat, lng] = dispositivo.local.split(', ').map(Number)

      return (
        <div key="local">
          <h6 className="text-sm font-medium text-neutral-900 mb-3">
            {renameMap.local}
          </h6>
          <div>
            <Map
              defaultCenter={{ lat, lng }}
              defaultZoom={18}
              streetViewControl={false}
              className="w-full h-96 overflow-hidden rounded-md"
            >
              <Marker position={{ lat, lng }} />
            </Map>
          </div>
        </div>
      )
    }
  }

  if (!dispositivo) return <p>Nao encontrado</p>

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link to="/dashboard">Início</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link to="/dashboard/dispositivos">Dispositivos</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link to="/dashboard/dispositivos">Todos os Dispositivos</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{dispositivo.nome}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Editar</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mb-3">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight ">
          Detalhes de {dispositivo.nome}
        </h4>
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard/dispositivos')}
        >
          Voltar
        </Button>
      </div>
      <main className="grid grid-cols-2 gap-[0.625rem]">
        <div className="row-span-2 border border-neutral-200 rounded-md bg-white h-full p-6">
          <h5 className="text-lg font-semibold mb-[0.625rem]">
            Informações básicas
          </h5>
          <div className="flex flex-col gap-[0.625rem]">
            {renderDetails()}
            {renderLocation()}
          </div>
        </div>
        <div className="border border-neutral-200 rounded-md bg-white h-full p-6">
          <h5 className="text-lg font-semibold mb-[0.625rem]">
            Sensores do Dispositivo
          </h5>
          <DataTableBasic data={sensores} columns={sensorColumns} />
        </div>
        <div className="border border-neutral-200 rounded-md bg-white h-full p-6">
          <h5 className="text-lg font-semibold mb-[0.625rem]">
            Atuadores do Dispositivo
          </h5>
          <DataTableBasic data={atuadores} columns={atuadorColumns} />
        </div>
      </main>
    </>
  )
}

export default DispositivoDetailsPage
