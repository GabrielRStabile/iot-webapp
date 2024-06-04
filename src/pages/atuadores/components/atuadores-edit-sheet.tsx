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
import { getAtuadorById, updateAtuador } from '@/domain/atuador/atuador-queries'
import { CreateAtuadorDTO } from '@/domain/atuador/create-atuador-dto'
import { GetAtuador } from '@/domain/atuador/get-atuador-dto'
import Dispositivo from '@/domain/dispositivo/dispositivo-interface'
import {
  addAtuadores,
  getDispositivos,
} from '@/domain/dispositivo/dispositivo-queries'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Edit } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const AtuadoresEditSheet = ({ id }: { id: string }) => {
  const queryClient = useQueryClient()

  const { data: atuador, isLoading } = useQuery<GetAtuador>({
    queryKey: ['atuador', Number(id)],
    queryFn: getAtuadorById,
  })

  const { data: dispositivos = [] } = useQuery<Dispositivo[]>({
    queryKey: ['dispositivos'],
    queryFn: getDispositivos,
  })

  const { mutateAsync: updateAtuadorFn } = useMutation({
    mutationFn: updateAtuador,
    onSuccess(newAtuador) {
      queryClient.setQueryData<GetAtuador[]>(['atuadores'], (oldData) => {
        if (!oldData) return []
        return oldData.map((atuador) =>
          atuador.id === newAtuador.id ? newAtuador : atuador,
        )
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
    try {
      const { nome, dispositivoId } = values
      const atuador: CreateAtuadorDTO = {
        nome,
      }

      const newAtuador = await updateAtuadorFn({
        id: Number(id),
        newData: atuador,
      })

      if (dispositivoId) {
        await addAtuadorInDispositivoFn({
          dispositivoId: Number(dispositivoId),
          atuadoresId: [newAtuador.id],
        })
      }
      form.reset()
      toast.success('Atuador atualizado com sucesso!')
    } catch (err) {
      toast.error('Ops! Um erro ocorreu ao atualizar o atuador.')
    }
  }

  useEffect(() => {
    if (atuador) {
      const newAtuador = {
        nome: atuador.nome,
        dispositivoId: atuador.dispositivoId?.toString() ?? undefined,
      }
      form.reset(newAtuador)
    }
  }, [atuador, form])

  if (isLoading) return <p>carregano...</p>

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button type="button" className="py-2 px-3" variant="outline">
          <Edit size="16" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="mb-6">
          <SheetTitle>Editando {atuador?.nome}</SheetTitle>
          <SheetDescription>
            Mude as propriedades de seu atuador por aqui, clique em salvar
            quando tiver terminado.
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
                      defaultValue={atuador?.dispositivoId?.toString()}
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
                <Button type="submit">Salvar Alterações</Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}

export default AtuadoresEditSheet
