import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../components/ui/form'
import { Input } from '../../../components/ui/input'
import { Textarea } from '../../../components/ui/textarea'
export const gatewayFormSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(2).max(255),
  ipAddress: z.string().min(7).max(15),
})

interface GatewayFormProps {
  onSubmit: (values: z.infer<typeof gatewayFormSchema>) => void
  defaultValues?: z.infer<typeof gatewayFormSchema>
}

export default function GatewayForm({
  onSubmit,
  defaultValues,
}: GatewayFormProps) {
  const form = useForm<z.infer<typeof gatewayFormSchema>>({
    resolver: zodResolver(gatewayFormSchema),
    defaultValues,
  })

  return (
    <Form {...form}>
      <form id="hook-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input id="name" placeholder="Nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  id="description"
                  placeholder="Controla TVs e luzes da sala, pode ser usado também para controlar o Ar Condicionado"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ipAddress"
          render={({ field }) => (
            <FormItem className="mb-8">
              <FormLabel>Endereço IP</FormLabel>
              <FormControl>
                <Input id="ipAddress" placeholder="Endereço IP" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
