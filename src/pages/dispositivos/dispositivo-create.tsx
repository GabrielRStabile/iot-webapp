import { Button } from '@/components/ui/button'
import { CirclePlus } from 'lucide-react'
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
import { createDispositivo } from '@/domain/dispositivo/dispositivo-queries'
import { CreateDispositivo } from '@/domain/dispositivo/create-dispositivo-dto'
import { useNavigate } from 'react-router-dom'
import Dispositivo from '@/domain/dispositivo/dispositivo-interface'
import { GetGateway } from '@/domain/gateway/get-gateway-dto'
import { GetSensor } from '@/domain/sensor/get-sensor-dto'
import { getSensores } from '@/domain/sensor/sensor-queries'
import { sensorColumns } from '@/domain/sensor/sensor-columns'
import { DataTableBasic } from '@/components/data-table-basic'

const DispositivoCreatePage = () => {
  const [position, setPosition] = useState<
    google.maps.LatLngLiteral | undefined
  >()

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

  const { data: gateways } = useQuery<GetGateway[]>({
    queryKey: ['gateways'],
    queryFn: getGateways,
  })

  const { data: sensores } = useQuery<GetSensor[]>({
    queryKey: ['sensores'],
    queryFn: getSensores,
  })

  const [availableSensores, setAvailableSensores] = useState<GetSensor[]>([])
  const [associatedSensores, setAssociatedSensores] = useState<GetSensor[]>([])

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

      if (gatewayId) {
        await associateDispositivoWithGatewayFn({
          gatewayId: Number(gatewayId),
          dispositivosId: [Number(newDispositivo.id)],
        })
      }

      alert('dispositivo criado com sucesso')
      navigate('/dispositivos')
    } catch (err) {
      alert('erro ao criar dispositivo')
    }
  }

  useEffect(() => {
    setAssociatedSensores([])
    if (position) {
      setValue('local', `${position.lat}, ${position.lng}`)
    }
    if (sensores) {
      const disponiveis = sensores.filter((sensor) => !sensor.dispositivoId)
      setAvailableSensores(disponiveis)
    }
  }, [position, setValue, sensores])

  return (
    <div className="bg-neutral-50 p-4 h-full">
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
                onClick={() => navigate('/dispositivos')}
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
            </div>
            <div className="border border-neutral-200 rounded-md bg-white h-full p-6">
              <Tabs defaultValue="available">
                <TabsList>
                  <TabsTrigger value="associated">
                    Associados ao Dispositivo
                  </TabsTrigger>
                  <TabsTrigger value="available">
                    Disponíveis para Associar
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="associated">
                  {
                    <DataTableBasic
                      data={associatedSensores}
                      columns={sensorColumns}
                    />
                  }
                </TabsContent>
                <TabsContent value="available">
                  {
                    <DataTableBasic
                      data={availableSensores}
                      columns={sensorColumns}
                    />
                  }
                </TabsContent>
              </Tabs>
            </div>
            <div className="border border-neutral-200 rounded-md bg-white h-full p-6">
              aaa
            </div>
          </main>
        </form>
      </Form>
    </div>
  )
}

export default DispositivoCreatePage
