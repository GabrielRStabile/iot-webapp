import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { GoogleMaps } from '@/components/map'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  associateDispositivoWithGateway,
  getGateways,
} from '@/domain/gateway/gateway-queries'
import {
  addAtuadores,
  addSensores,
  getAtuadoresByDispositivoId,
  getDispositivoById,
  getSensoresByDispositivoId,
  removeAtuadores,
  removeSensores,
  updateDispositivo,
} from '@/domain/dispositivo/dispositivo-queries'
import { Link, useNavigate } from 'react-router-dom'
import Dispositivo from '@/domain/dispositivo/dispositivo-interface'
import { GetGateway } from '@/domain/gateway/get-gateway-dto'
import { GetSensor } from '@/domain/sensor/get-sensor-dto'
import { DataTableBasic } from '@/components/data-table-basic'
import { GetAtuador } from '@/domain/atuador/get-atuador-dto'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { UpdateDispositivo } from '@/domain/dispositivo/update-dispositivo-dto'
import { toast } from 'sonner'
import { sensorColumnsDesassociation } from '@/domain/sensor/sensor-columns-desassociation'
import { sensorColumnsAssociation } from '@/domain/sensor/sensor-columns-association'
import { atuadorColumnsDesassociation } from '@/domain/atuador/atuador-columns-desassociation'
import { atuadorColumnsAssociation } from '@/domain/atuador/atuador-columns-association'
import { getSensores } from '@/domain/sensor/sensor-queries'
import { getAtuadores } from '@/domain/atuador/atuador-queries'

const DispositivoEditPage = ({ id }: { id: string }) => {
  const [position, setPosition] = useState<
    google.maps.LatLngLiteral | undefined
  >()

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutateAsync: updateDispositivoFn } = useMutation({
    mutationFn: updateDispositivo,
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
  const { mutateAsync: removeSensoresFn } = useMutation({
    mutationFn: removeSensores,
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
  const { mutateAsync: removeAtuadoresFn } = useMutation({
    mutationFn: removeAtuadores,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['atuadores'] })
    },
  })

  const { data: dispositivo, isLoading } = useQuery<Dispositivo>({
    queryKey: ['dispositivo', id],
    queryFn: getDispositivoById,
  })

  const { data: gateways = [] } = useQuery<GetGateway[]>({
    queryKey: ['gateways'],
    queryFn: getGateways,
  })

  const { data: sensoresDispositivo = [] } = useQuery<GetSensor[]>({
    queryKey: ['sensoresDispositivo', id],
    queryFn: getSensoresByDispositivoId,
  })

  const { data: atuadoresDispositivo = [] } = useQuery<GetAtuador[]>({
    queryKey: ['atuadoresDispositivo', id],
    queryFn: getAtuadoresByDispositivoId,
  })

  const { data: allSensores = [] } = useQuery<GetSensor[]>({
    queryKey: ['sensores'],
    queryFn: getSensores,
  })

  const { data: allAtuadores = [] } = useQuery<GetAtuador[]>({
    queryKey: ['atuadores'],
    queryFn: getAtuadores,
  })

  const [availableSensores, setAvailableSensores] = useState<GetSensor[]>([])
  const [associatedSensores, setAssociatedSensores] = useState<GetSensor[]>([])
  const [initialAssociatedSensores, setInitialAssociatedSensores] = useState<
    GetSensor[]
  >([])

  const [availableAtuadores, setAvailableAtuadores] = useState<GetAtuador[]>([])
  const [associatedAtuadores, setAssociatedAtuadores] = useState<GetAtuador[]>(
    [],
  )
  const [initialAssociatedAtuadores, setInitialAssociatedAtuadores] = useState<
    GetAtuador[]
  >([])

  const handleAssociateSensor = (sensor: GetSensor) => {
    setAvailableSensores((prev) => prev.filter((s) => s.id !== sensor.id))
    setAssociatedSensores((prev) => [...prev, sensor])
  }

  const handleDisassociateSensor = (sensor: GetSensor) => {
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
      const newDispositivo: UpdateDispositivo = {
        id: Number(id),
        newData: {
          nome,
          descricao,
          endereco,
          local,
        },
      }

      const updatedDispositivo = await updateDispositivoFn(newDispositivo)

      if (gatewayId) {
        await associateDispositivoWithGatewayFn({
          gatewayId: Number(gatewayId),
          dispositivosId: [Number(updatedDispositivo.id)],
        })
      }

      const sensoresToAdd = associatedSensores.filter(
        (sensor) => !initialAssociatedSensores.includes(sensor),
      )
      const sensoresToRemove = initialAssociatedSensores.filter(
        (sensor) => !associatedSensores.includes(sensor),
      )

      const atuadoresToAdd = associatedAtuadores.filter(
        (atuador) => !initialAssociatedAtuadores.includes(atuador),
      )
      const atuadoresToRemove = initialAssociatedAtuadores.filter(
        (atuador) => !associatedAtuadores.includes(atuador),
      )

      if (sensoresToAdd.length > 0) {
        await addSensoresFn({
          dispositivoId: Number(id),
          sensoresId: sensoresToAdd.map((s) => s.id),
        })
      }

      if (sensoresToRemove.length > 0) {
        await removeSensoresFn({
          dispositivoId: Number(id),
          sensoresId: sensoresToRemove.map((s) => s.id),
        })
      }

      if (atuadoresToAdd.length > 0) {
        await addAtuadoresFn({
          dispositivoId: Number(id),
          atuadoresId: atuadoresToAdd.map((s) => s.id),
        })
      }

      if (atuadoresToRemove.length > 0) {
        await removeAtuadoresFn({
          dispositivoId: Number(id),
          atuadoresId: atuadoresToRemove.map((s) => s.id),
        })
      }

      toast.success('Dispositivo atualizado com sucesso!')
      navigate('/dashboard/dispositivos')
    } catch (err) {
      toast.error('Ops! Um erro ocorreu ao atualizar o dispositivo.')
    }
  }

  useEffect(() => {
    if (position) {
      setValue('local', `${position.lat}, ${position.lng}`)
    }
    if (sensoresDispositivo) {
      setInitialAssociatedSensores(sensoresDispositivo)
      setAssociatedSensores(sensoresDispositivo)
    }
    if (atuadoresDispositivo) {
      setInitialAssociatedAtuadores(atuadoresDispositivo)
      setAssociatedAtuadores(atuadoresDispositivo)
    }
    if (allSensores) {
      const disponiveis = allSensores.filter((sensor) => !sensor.dispositivoId)
      setAvailableSensores(disponiveis)
    }
    if (allAtuadores) {
      const disponiveis = allAtuadores.filter(
        (atuador) => !atuador.dispositivoId,
      )
      setAvailableAtuadores(disponiveis)
    }
  }, [
    position,
    setValue,
    sensoresDispositivo,
    atuadoresDispositivo,
    dispositivo,
  ])

  useEffect(() => {
    if (dispositivo) {
      const [lat, lng] = dispositivo.local.split(', ').map(Number)
      setPosition({ lat, lng })

      const createDispositivo = {
        nome: dispositivo.nome,
        descricao: dispositivo.descricao,
        endereco: dispositivo.endereco,
        local: dispositivo.local,
        gatewayId: dispositivo.gatewayId?.toString() ?? undefined,
      }

      form.reset(createDispositivo)
    }
  }, [form, dispositivo])

  if (isLoading) {
    return <div>carregando...</div>
  }

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
              {`Editando ${dispositivo?.nome}`}
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
                <Save className="mr-2" size="16" />
                Salvar Alterações
              </Button>
            </div>
          </div>
          <main className="grid grid-cols-2 gap-[0.625rem]">
            <div className="row-span-2 border border-neutral-200 rounded-md bg-white h-full p-6">
              <h5 className="text-lg font-semibold mb-[0.625rem]">
                Informações básicas
              </h5>
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
                        defaultValue={dispositivo?.gatewayId?.toString()}
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
            </div>
            <div className="border border-neutral-200 rounded-md bg-white h-full p-6">
              <h5 className="text-lg font-semibold mb-[0.625rem]">
                Sensores do Dispositivo
              </h5>
              <Tabs defaultValue="associated">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="associated">
                    <span className="truncate">Associados ao Dispositivo</span>
                  </TabsTrigger>
                  <TabsTrigger value="available">
                    <span className="truncate">Disponíveis para Associar</span>
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
            </div>
            <div className="border border-neutral-200 rounded-md bg-white h-full p-6">
              <h5 className="text-lg font-semibold mb-[0.625rem]">
                Atuadores do Dispositivo
              </h5>
              <Tabs defaultValue="associated">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="associated">
                    <span className="truncate">Associados ao Dispositivo</span>
                  </TabsTrigger>
                  <TabsTrigger value="available">
                    <span className="truncate">Disponíveis para Associar</span>
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
            </div>
          </main>
        </form>
      </Form>
    </div>
  )
}

export default DispositivoEditPage
