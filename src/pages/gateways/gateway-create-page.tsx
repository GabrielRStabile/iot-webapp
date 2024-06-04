import { useQuery } from '@tanstack/react-query'
import { CirclePlus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { useAuth } from '../../contexts/auth-context'
import Dispositivo from '../../domain/dispositivo/dispositivo-interface'
import { getDispositivos } from '../../domain/dispositivo/dispositivo-queries'
import {
  associateDispositivoWithGateway,
  createGateway,
} from '../../domain/gateway/gateway-queries'
import {
  AssociatedDevicesTable,
  AvailableDevicesTable,
} from './components/association-devices-table'
import GatewayForm, { gatewayFormSchema } from './components/gateway-form'

export default function GatewayCreatePage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data: dispositivoAvalible } = useQuery({
    queryKey: ['dispositivos'],
    queryFn: getDispositivos,
  })

  const [dispositivos, setDispositivos] = useState<Dispositivo[]>([])

  const [associated, setAssociation] = useState<Dispositivo[]>([])

  useEffect(() => {
    if (dispositivoAvalible) {
      setDispositivos(dispositivoAvalible)
    }
  }, [dispositivoAvalible])

  async function onSubmit(values: z.infer<typeof gatewayFormSchema>) {
    try {
      const { name, description, ipAddress } = values
      const dispositivosId = associated.map((d) => d.id)

      const gateway = await createGateway({
        nome: name,
        descricao: description,
        endereco: ipAddress,
        pessoaId: user?.id as unknown as number,
      })

      await associateDispositivoWithGateway({
        gatewayId: gateway.id,
        dispositivosId,
      })

      toast.success('Gateway criado com sucesso!')
      navigate(-1)
    } catch (error) {
      toast.error('Erro ao criar Gateway')
    }
  }

  async function handleLinkUnlinkDispositivo(dispositivo: Dispositivo) {
    if (associated.find((d) => d.id === dispositivo.id)) {
      setAssociation(associated.filter((d) => d.id !== dispositivo.id))
      setDispositivos([...dispositivos, dispositivo])

      toast.success('Dispositivo desvinculado com sucesso!')
    } else {
      setAssociation([...associated, dispositivo])
      setDispositivos(dispositivos.filter((d) => d.id !== dispositivo.id))

      toast.success('Dispositivo vinculado com sucesso!')
    }
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
            <BreadcrumbLink>Adicionar novo Gateway</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <header className="pt-3 flex flex-row justify-between align-middle">
        <h3>Adicionar novo Gateway</h3>
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
            <CirclePlus className="mr-2" size="16" />
            Adicionar Gateway
          </Button>
        </div>
      </header>
      <div className="flex flex-row gap-2">
        <Card className="grow">
          <CardTitle>Informações básicas</CardTitle>
          <CardContent className="flex flex-col gap-2">
            <GatewayForm onSubmit={onSubmit} />
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
