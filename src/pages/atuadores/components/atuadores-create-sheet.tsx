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
import { createAtuador } from '@/domain/atuador/atuador-queries'
import { CreateAtuadorDTO } from '@/domain/atuador/create-atuador-dto'
import { GetAtuador } from '@/domain/atuador/get-atuador-dto'
import Dispositivo from '@/domain/dispositivo/dispositivo-interface'
import {
  addAtuadores,
  getDispositivos,
} from '@/domain/dispositivo/dispositivo-queries'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CirclePlus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const AtuadoresCreateSheet = () => {
  const queryClient = useQueryClient()

  const { data: dispositivos = [] } = useQuery<Dispositivo[]>({
    queryKey: ['dispositivos'],
    queryFn: getDispositivos,
  })

  const { mutateAsync: createAtuadorFn } = useMutation({
    mutationFn: createAtuador,
    onSuccess(newAtuador) {
      queryClient.setQueryData<GetAtuador[]>(['atuadores'], (oldData) => {
        if (oldData) {
          return [...oldData, newAtuador]
        } else {
          return [newAtuador]
        }
      })
      queryClient.invalidateQueries({ queryKey: ['dispositivos'] })
    },
  })

  const { mutateAsync: addAtuadorInDispositivoFn } = useMutation({
    mutationFn: addAtuadores,
    onSuccess(_, variables) {
      queryClient.setQueryData<GetAtuador[]>(['atuadores'], (atuadores) => {
        return atuadores?.map((atuador) =>
          atuador.id === variables.atuadoresId[0]
            ? { ...atuador, dispositivoId: variables.dispositivoId }
            : atuador,
        )
      })
      queryClient.invalidateQueries({ queryKey: ['dispositivos'] })
    },
  })

  const createAtuadorSchema = z.object({
    nome: z.string().min(2),
    dispositivoId: z.string().optional(),
  })

  const form = useForm<z.infer<typeof createAtuadorSchema>>({
    resolver: zodResolver(createAtuadorSchema),
    defaultValues: {
      nome: '',
      dispositivoId: undefined,
    },
  })

  async function onSubmit(values: z.infer<typeof createAtuadorSchema>) {
    console.log('oi teste')
    try {
      const { nome, dispositivoId } = values
      const atuador: CreateAtuadorDTO = {
        nome,
      }

      const newAtuador = await createAtuadorFn(atuador)

      if (dispositivoId) {
        await addAtuadorInDispositivoFn({
          dispositivoId: Number(dispositivoId),
          atuadoresId: [newAtuador.id],
        })
      }
      form.reset()
      toast.success('Atuador criado com sucesso!')
    } catch (err) {
      toast.error('Ops! Um erro ocorreu ao criar o atuador.')
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="default">
          <CirclePlus className="mr-2" size="16" />
          Adicionar Atuador
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
                <Button type="submit">Adicionar Atuador</Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}

export default AtuadoresCreateSheet
