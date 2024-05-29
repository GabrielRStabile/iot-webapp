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
import { useState } from 'react'

const DispositivoCreatePage = () => {
  const [position, setPosition] = useState<
    google.maps.LatLngLiteral | undefined
  >()

  const createDispositivoSchema = z.object({
    nome: z.string().min(2),
    descricao: z.string().min(1),
    local: z.string().min(1),
    gatewayId: z.number(),
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

  function onSubmit(values: z.infer<typeof createDispositivoSchema>) {
    console.log(values)
  }

  return (
    <div className="bg-neutral-50 p-4 h-full">
      <div className="flex justify-between items-center mb-3">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Adicionar novo Dispositivo
        </h4>
        <div className="flex items-center gap-[0.625rem]">
          <Button variant="outline">Voltar</Button>
          <Button className="capitalize">
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
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-[0.625rem]"
            >
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
                render={() => (
                  <FormItem className="flex items-center">
                    <FormLabel>Gateway Associado</FormLabel>
                    <FormControl>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Nenhum" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="1">Gateway Casa</SelectItem>
                            <SelectItem value="2">
                              Gateway Lorem ipsum
                            </SelectItem>
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
                      <Input
                        type="text"
                        {...field}
                        value={
                          position ? `${position.lat}, ${position.lng}` : ''
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <GoogleMaps position={position} setPosition={setPosition} />
            </form>
          </Form>
        </div>
        <div className="border border-neutral-200 rounded-md bg-white h-full p-6">
          aaa
        </div>
        <div className="border border-neutral-200 rounded-md bg-white h-full p-6">
          aaa
        </div>
      </main>
    </div>
  )
}

export default DispositivoCreatePage
