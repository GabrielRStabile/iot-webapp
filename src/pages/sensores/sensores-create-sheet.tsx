import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import Dispositivo from '@/domain/dispositivo/dispositivo-interface'
import {
  addSensores,
  getDispositivos,
} from '@/domain/dispositivo/dispositivo-queries'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CirclePlus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { CreateSensorDTO } from '../../domain/sensor/create-sensor-dto'
import { GetSensorDTO } from '../../domain/sensor/get-sensor-dto'
import { createSensor } from '../../domain/sensor/sensor-queries'

const SensoresCreateSheet = () => {
  const queryClient = useQueryClient()

  const { data: dispositivos = [] } = useQuery<Dispositivo[]>({
    queryKey: ['dispositivos'],
    queryFn: getDispositivos,
  })

  const { mutateAsync: createSensorFn } = useMutation({
    mutationFn: createSensor,
    onSuccess(newSensor) {
      queryClient.setQueryData<GetSensorDTO[]>(['sensores'], (oldData) => {
        if (oldData) {
          return [...oldData, newSensor]
        } else {
          return [newSensor]
        }
      })
      queryClient.invalidateQueries({ queryKey: ['dispositivos'] })
    },
  })

  const { mutateAsync: addSensorInDispositivoFn } = useMutation({
    mutationFn: addSensores,
    onSuccess(_, variables) {
      queryClient.setQueryData<GetSensorDTO[]>(['sensores'], (sensores) => {
        return sensores?.map((sensor) =>
          sensor.id === variables.sensoresId[0]
            ? { ...sensor, dispositivoId: variables.dispositivoId }
            : sensor,
        )
      })
      queryClient.invalidateQueries({ queryKey: ['dispositivos'] })
    },
  })

  const createSensorSchema = z.object({
    nome: z.string().min(2),
    tipo: z.string().min(2),
    dispositivoId: z.string().optional(),
  })

  const form = useForm<z.infer<typeof createSensorSchema>>({
    resolver: zodResolver(createSensorSchema),
    defaultValues: {
      nome: '',
      tipo: '',
      dispositivoId: undefined,
    },
  })

  async function onSubmit(values: z.infer<typeof createSensorSchema>) {
    try {
      const { nome, tipo, dispositivoId } = values
      const sensor: CreateSensorDTO = {
        nome,
        tipo,
      }

      const newSensor = await createSensorFn(sensor)

      if (dispositivoId) {
        await addSensorInDispositivoFn({
          dispositivoId: Number(dispositivoId),
          sensoresId: [newSensor.id],
        })
      }
      form.reset()
      toast.success('Sensor criado com sucesso!')
    } catch (err) {
      toast.error('Ops! Um erro ocorreu ao criar o sensor.')
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="default">
          <CirclePlus className="mr-2" size="16" />
          Adicionar Sensor
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="mb-6">
          <SheetTitle>Adicionar novo Atuador</SheetTitle>
          <SheetDescription>
            Adicione um novo atuador aqui, clique em adicionar quando tiver
            terminado.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between gap-[0.625rem] mb-4">
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between gap-[0.625rem] mb-4">
                  <FormLabel>Tipo</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dispositivoId"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between gap-[0.625rem] mb-6">
                  <FormLabel>Dispositivo Associado</FormLabel>
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
                          {dispositivos.map((dispositivo) => (
                            <SelectItem
                              key={dispositivo.id}
                              value={`${dispositivo.id}`}
                            >
                              {dispositivo.nome}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit">Adicionar Sensor</Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}

export default SensoresCreateSheet
