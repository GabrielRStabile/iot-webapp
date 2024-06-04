import { GoogleMaps } from '@/components/map'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { CreateDispositivo } from '@/domain/dispositivo/create-dispositivo-dto'
import Dispositivo from '@/domain/dispositivo/dispositivo-interface'
import {
  addAtuadores,
  addSensores,
  createDispositivo,
} from '@/domain/dispositivo/dispositivo-queries'
import {
  associateDispositivoWithGateway,
  getGatewayByPersonId,
} from '@/domain/gateway/gateway-queries'
import { GetGatewayDTO } from '@/domain/gateway/get-gateway-dto'
import { GetSensorDTO } from '@/domain/sensor/get-sensor-dto'
import { getSensores } from '@/domain/sensor/sensor-queries'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CirclePlus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useAuth } from '../../contexts/auth-context'

import { DataTableBasic } from '@/components/data-table-basic'
import { getAtuadores } from '@/domain/atuador/atuador-queries'
import { GetAtuador } from '@/domain/atuador/get-atuador-dto'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { atuadorColumnsAssociation } from '@/domain/atuador/atuador-columns-association'
import { atuadorColumnsDesassociation } from '@/domain/atuador/atuador-columns-desassociation'
import { sensorColumnsAssociation } from '@/domain/sensor/sensor-columns-association'
import { sensorColumnsDesassociation } from '@/domain/sensor/sensor-columns-desassociation'
import { toast } from 'sonner'
import { Card, CardContent, CardTitle } from '../../components/ui/card'

const DispositivoCreatePage = () => {
  const [position, setPosition] = useState<
    google.maps.LatLngLiteral | undefined
  >()

  const { user } = useAuth()

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutateAsync: createDispositivoFn } = useMutation({
    mutationFn: createDispositivo,
    onSuccess(newDispositivo) {
      queryClient.setQueryData<Dispositivo[]>(['dispositivos'], (data) => {
        if (data) {
          return [...data, newDispositivo]
        } else {
          return [newDispositivo]
        }
      })
    },
  })

  const { mutateAsync: associateDispositivoWithGatewayFn } = useMutation({
    mutationFn: associateDispositivoWithGateway,
    onSuccess(_, variables) {
      queryClient.setQueryData<Dispositivo[]>(
        ['dispositivos'],
        (dispositivos) => {
          return dispositivos?.map((dispositivo) =>
            dispositivo.id === variables.dispositivosId[0]
              ? { ...dispositivo, gatewayId: variables.gatewayId }
              : dispositivo,
          )
        },
      )
    },
  })

  const { mutateAsync: addSensoresFn } = useMutation({
    mutationFn: addSensores,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['sensores'] })
    },
  })

  const { mutateAsync: addAtuadoresFn } = useMutation({
    mutationFn: addAtuadores,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['atuadores'] })
    },
  })

  const { data: gateways } = useQuery<GetGatewayDTO[]>({
    queryKey: ['gateways'],
    queryFn: () => getGatewayByPersonId(user?.id ?? ''),
  })

  const { data: sensores } = useQuery<GetSensorDTO[]>({
    queryKey: ['sensores'],
    queryFn: getSensores,
  })

  const { data: atuadores } = useQuery<GetAtuador[]>({
    queryKey: ['atuadores'],
    queryFn: getAtuadores,
  })

  const [availableSensores, setAvailableSensores] = useState<GetSensorDTO[]>([])
  const [associatedSensores, setAssociatedSensores] = useState<GetSensorDTO[]>([])

  const [availableAtuadores, setAvailableAtuadores] = useState<GetAtuador[]>([])
  const [associatedAtuadores, setAssociatedAtuadores] = useState<GetAtuador[]>(
    [],
  )

  const handleAssociateSensor = (sensor: GetSensorDTO) => {
    setAvailableSensores((prev) => prev.filter((s) => s.id !== sensor.id))
    setAssociatedSensores((prev) => [...prev, sensor])
  }

  const handleDisassociateSensor = (sensor: GetSensorDTO) => {
    setAssociatedSensores((prev) => prev.filter((s) => s.id !== sensor.id))
    setAvailableSensores((prev) => [...prev, sensor])
  }

  const handleAssociateAtuador = (atuador: GetAtuador) => {
    setAvailableAtuadores((prev) => prev.filter((s) => s.id !== atuador.id))
    setAssociatedAtuadores((prev) => [...prev, atuador])
  }

  const handleDisassociateAtuador = (atuador: GetAtuador) => {
    setAssociatedAtuadores((prev) => prev.filter((s) => s.id !== atuador.id))
    setAvailableAtuadores((prev) => [...prev, atuador])
  }

  const createDispositivoSchema = z.object({
    nome: z.string().min(2),
    descricao: z.string().min(1),
    local: z.string().min(1),
    gatewayId: z.string().optional(),
    endereco: z.string().ip(),
  })

  const form = useForm<z.infer<typeof createDispositivoSchema>>({
    resolver: zodResolver(createDispositivoSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      local: '',
      gatewayId: undefined,
      endereco: '',
    },
  })
  const { setValue } = form

  async function onSubmit(values: z.infer<typeof createDispositivoSchema>) {
    try {
      const { nome, descricao, endereco, local, gatewayId } = values
      const dispositivo: CreateDispositivo = {
        nome,
        descricao,
        endereco,
        local,
      }

      const newDispositivo = await createDispositivoFn(dispositivo)
      const dispositivoId = Number(newDispositivo.id)

      if (gatewayId) {
        await associateDispositivoWithGatewayFn({
          gatewayId: Number(gatewayId),
          dispositivosId: [dispositivoId],
        })
      }

      if (associatedSensores) {
        const sensoresId = associatedSensores.map((sensor) => sensor.id)
        await addSensoresFn({
          dispositivoId,
          sensoresId,
        })
      }

      if (associatedAtuadores) {
        const atuadoresId = associatedAtuadores.map((atuador) => atuador.id)
        await addAtuadoresFn({
          dispositivoId,
          atuadoresId,
        })
      }

      toast.success('Dispositivo criado com sucesso!')
      navigate('/dashboard/dispositivos')
    } catch (err) {
      toast.error('Ops! Um erro ocorreu ao criar o dispositivo.')
    }
  }

  useEffect(() => {
    if (position) {
      setValue('local', `${position.lat}, ${position.lng}`)
    }
    if (sensores) {
      const disponiveis = sensores.filter((sensor) => !sensor.dispositivoId)
      setAvailableSensores(disponiveis)
    }
    if (atuadores) {
      const disponiveis = atuadores.filter((atuador) => !atuador.dispositivoId)
      setAvailableAtuadores(disponiveis)
    }
  }, [position, setValue, sensores, atuadores])

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard">Início</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard/dispositivos">Dispositivos</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard/dispositivos">Todos os Dispositivos</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Adicionar novo Dispositivo</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex justify-between items-center mb-3">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Adicionar novo Dispositivo
            </h4>
            <div className="flex items-center gap-[0.625rem]">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard/dispositivos')}
              >
                Voltar
              </Button>
              <Button type="submit" className="capitalize">
                <CirclePlus className="mr-2" size="16" />
                Adicionar Dispositivo
              </Button>
            </div>
          </div>
          <main className="grid grid-cols-2 gap-[0.625rem]">
            <Card className="row-span-2">
              <CardTitle>Informações básicas</CardTitle>
              <CardContent className="row-span-2">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="descricao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          className="resize-none max-h-20"
                          placeholder=""
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endereco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço de IP</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="000.000.000.000"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gatewayId"
                  render={({ field }) => (
                    <FormItem className="flex items-center">
                      <FormLabel>Gateway Associado</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Nenhum" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {gateways &&
                                gateways.map((gateway) => (
                                  <SelectItem
                                    key={gateway.id}
                                    value={`${gateway.id}`}
                                  >
                                    {gateway.nome}
                                  </SelectItem>
                                ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="local"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Localização</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="mt-[0.625rem]">
                  <GoogleMaps position={position} setPosition={setPosition} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardTitle>Sensores do Dispositivo</CardTitle>
              <CardContent>
                <Tabs defaultValue="available">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="associated">
                      <span className="truncate">
                        Associados ao Dispositivo
                      </span>
                    </TabsTrigger>
                    <TabsTrigger value="available">
                      <span className="truncate">
                        Disponíveis para Associar
                      </span>
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="associated">
                    {
                      <DataTableBasic
                        data={associatedSensores}
                        columns={sensorColumnsDesassociation}
                        meta={{
                          onDesassociation: handleDisassociateSensor,
                        }}
                      />
                    }
                  </TabsContent>
                  <TabsContent value="available">
                    {
                      <DataTableBasic
                        data={availableSensores}
                        columns={sensorColumnsAssociation}
                        meta={{
                          onAssociation: handleAssociateSensor,
                        }}
                      />
                    }
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            <Card>
              <CardTitle>Atuadores do Dispositivo</CardTitle>
              <CardContent>
                <Tabs defaultValue="available">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="associated">
                      <span className="truncate">
                        Associados ao Dispositivo
                      </span>
                    </TabsTrigger>
                    <TabsTrigger value="available">
                      <span className="truncate">
                        Disponíveis para Associar
                      </span>
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="associated">
                    {
                      <DataTableBasic
                        data={associatedAtuadores}
                        columns={atuadorColumnsDesassociation}
                        meta={{
                          onDesassociation: handleDisassociateAtuador,
                        }}
                      />
                    }
                  </TabsContent>
                  <TabsContent value="available">
                    {
                      <DataTableBasic
                        data={availableAtuadores}
                        columns={atuadorColumnsAssociation}
                        meta={{
                          onAssociation: handleAssociateAtuador,
                        }}
                      />
                    }
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </main>
        </form>
      </Form>
    </div>
  )
}

export default DispositivoCreatePage
