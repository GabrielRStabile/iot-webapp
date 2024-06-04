import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '../../components/ui/breadcrumb'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardTitle } from '../../components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs'
import Dispositivo from '../../domain/dispositivo/dispositivo-interface'
import { getDispositivos } from '../../domain/dispositivo/dispositivo-queries'
import {
  associateDispositivoWithGateway,
  disassociateDispositivoFromGateway,
  getDispositivosByGatewayId,
  getGatewayById,
  updateGateway,
} from '../../domain/gateway/gateway-queries'
import {
  AssociatedDevicesTable,
  AvailableDevicesTable,
} from './components/association-devices-table'
import GatewayForm, { gatewayFormSchema } from './components/gateway-form'

function GatewayEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: gateway, isLoading } = useQuery({
    queryKey: ['gateway', id],
    queryFn: () => getGatewayById(id || ''),
  })

  const { data: associatedDispositivos } = useQuery({
    queryKey: ['dispositivo', id],
    queryFn: () => getDispositivosByGatewayId(id || ''),
  })

  const { data: dispositivoAvalible } = useQuery({
    queryKey: ['dispositivos'],
    queryFn: getDispositivos,
  })

  const [associated, setAssociation] = useState<Dispositivo[]>([])

  const [dispositivos, setDispositivos] = useState<Dispositivo[]>([])

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof gatewayFormSchema>) =>
      updateGateway({
        id: String(gateway?.id ?? 0),
        nome: values.name,
        descricao: values.description,
        endereco: values.ipAddress,
      }),

    onSuccess: () => {
      toast.success('Gateway atualizado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['gateways'] })
      queryClient.invalidateQueries({ queryKey: ['gateway', id] })
      navigate(-1)
    },
    onError: () => {
      toast.error('Erro ao atualizar Gateway')
    },
  })

  const onSubmit = (values: z.infer<typeof gatewayFormSchema>) => {
    mutation.mutate(values)
  }

  const handleLinkUnlinkDispositivo = async (dispositivo: Dispositivo) => {
    if (associated.find((d) => d.id === dispositivo.id)) {
      setAssociation(associated.filter((d) => d.id !== dispositivo.id))
      setDispositivos([...dispositivos, dispositivo])

      await disassociateDispositivoFromGateway({
        gatewayId: gateway?.id ?? 0,
        dispositivosId: [dispositivo.id],
      })
      toast.success('Dispositivo desvinculado com sucesso!')
    } else {
      setAssociation([...associated, dispositivo])
      setDispositivos(dispositivos.filter((d) => d.id !== dispositivo.id))

      await associateDispositivoWithGateway({
        gatewayId: gateway?.id ?? 0,
        dispositivosId: [dispositivo.id],
      })
      toast.success('Dispositivo vinculado com sucesso!')
    }
  }

  useEffect(() => {
    if (associatedDispositivos) {
      setAssociation(associatedDispositivos)
    }
  }, [associatedDispositivos])

  useEffect(() => {
    if (dispositivoAvalible) {
      setDispositivos(dispositivoAvalible)
    }
  }, [dispositivoAvalible])

  if (isLoading) {
    return <div>Carregando...</div>
  }

  return (
    <div className="p-4 w-full">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>Início</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Gateways</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Todos os Gateways</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Editar Gateway</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <header className="pt-3 flex flex-row justify-between align-middle">
        <h3>Editar Gateway</h3>
        <div className="flex gap-1">
          <Button
            className="capitalize"
            size={'sm'}
            variant={'outline'}
            onClick={() => navigate(-1)}
          >
            Voltar
          </Button>
          <Button
            className="capitalize"
            size={'sm'}
            type="submit"
            form="hook-form"
          >
            <Save className="mr-2" size="16" />
            Salvar Alterações
          </Button>
        </div>
      </header>
      <div className="flex flex-row gap-2">
        <Card className="grow">
          <CardTitle>Informações básicas</CardTitle>
          <CardContent className="flex flex-col gap-2">
            <GatewayForm
              onSubmit={onSubmit}
              defaultValues={
                gateway && {
                  name: gateway.nome,
                  description: gateway.descricao,
                  ipAddress: gateway.endereco,
                }
              }
            />
          </CardContent>
        </Card>
        <Card className="grow">
          <CardTitle>Dispositivo do Gateway</CardTitle>
          <CardContent>
            <Tabs defaultValue="alreadyAssociated">
              <TabsList className="w-full">
                <TabsTrigger className="w-full" value="alreadyAssociated">
                  Associados ao Gateway
                </TabsTrigger>
                <TabsTrigger className="w-full" value="avalibleForAssociate">
                  Disponíveis para Associar
                </TabsTrigger>
              </TabsList>
              <TabsContent value="alreadyAssociated">
                <AssociatedDevicesTable
                  dispositivos={associated}
                  onLinkUnlink={handleLinkUnlinkDispositivo}
                />
              </TabsContent>
              <TabsContent value="avalibleForAssociate">
                <AvailableDevicesTable
                  dispositivos={dispositivos}
                  onLinkUnlink={handleLinkUnlinkDispositivo}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default GatewayEditPage
