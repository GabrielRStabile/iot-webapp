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
  removeSensores,
} from '@/domain/dispositivo/dispositivo-queries'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Edit } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { GetSensorDTO } from '../../domain/sensor/get-sensor-dto'
import { updateSensor } from '../../domain/sensor/sensor-queries'
import { UpdateSensorDTO } from '../../domain/sensor/update-sensor-dto'

interface SensorEditSheetProps {
  sensor: GetSensorDTO
}

const SensorEditSheet = ({ sensor }: SensorEditSheetProps) => {
  const queryClient = useQueryClient()

  const { data: dispositivos = [] } = useQuery<Dispositivo[]>({
    queryKey: ['dispositivos'],
    queryFn: getDispositivos,
  })

  const { mutateAsync: updateSensorFn } = useMutation({
    mutationFn: updateSensor,
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

  const { mutateAsync: removeSensoresFn } = useMutation({
    mutationFn: removeSensores,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['sensores'] })
    },
  })

  const updateSensorSchema = z.object({
    nome: z.string().min(2),
    tipo: z.string().min(2),
    dispositivoId: z.string().optional(),
  })

  const form = useForm<z.infer<typeof updateSensorSchema>>({
    resolver: zodResolver(updateSensorSchema),
    defaultValues: {
      nome: sensor.nome,
      tipo: sensor.tipo,
      dispositivoId: String(sensor.dispositivoId),
    },
  })

  async function onSubmit(values: z.infer<typeof updateSensorSchema>) {
    try {
      const { nome, tipo, dispositivoId } = values
      const updatingSensor: UpdateSensorDTO = {
        id: String(sensor.id),
        nome,
        tipo,
      }

      await updateSensorFn(updatingSensor)

      if (dispositivoId) {
        if (sensor.dispositivoId) {
          await removeSensoresFn({
            dispositivoId: sensor.dispositivoId,
            sensoresId: [sensor.id],
          })
        }

        await addSensorInDispositivoFn({
          dispositivoId: Number(dispositivoId),
          sensoresId: [Number(updatingSensor.id)],
        })
      } else {
        await removeSensoresFn({
          dispositivoId: sensor.dispositivoId ? sensor.dispositivoId : 0,
          sensoresId: [sensor.id],
        })
      }
      form.reset()
      toast.success('Sensor atualizado com sucesso!')
    } catch (err) {
      toast.error('Ops! Um erro ocorreu ao atualizar o sensor.')
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button type="button" variant="outline" className="py-2 px-3">
          <Edit size="16" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="mb-6">
          <SheetTitle>Editando {sensor.nome}</SheetTitle>
          <SheetDescription>
            Mude as propriedades de seu sensor por aqui, clique em salvar quando
            tiver terminado.
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
                <Button type="submit">Salvar alterações</Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}

export default SensorEditSheet
