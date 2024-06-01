import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '../../components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../../components/ui/form'
import { Input } from '../../components/ui/input'
import { useAuth } from '../../contexts/auth-context'
import AuthFooter from './components/auth-footer'
import AuthHeader from './components/auth-header'
import AuthMain from './components/auth-main'

export default function SignUpPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const formSchema = z.object({
    name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
    email: z.string().email('Por favor, insira um email válido'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const registered = await register({
      name: values.name,
      email: values.email,
      password: values.password,
    })

    if (registered) {
      toast.success('Conta criada com sucesso!')
      navigate('/auth', { replace: true })
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <AuthHeader>
        <a href="/auth">Entrar</a>
      </AuthHeader>
      <AuthMain>
        <h3 className="mb-8">Cadastre-se para entrar no IoT</h3>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-w-sm w-full"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormControl>
                    <Input placeholder="Nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormControl>
                    <Input placeholder="Email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mb-8">
                  <FormControl>
                    <Input placeholder="Senha" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Criar conta
            </Button>
          </form>
        </Form>
      </AuthMain>
      <AuthFooter>
        <a href="/auth">Já tem uma conta? Entre</a>
      </AuthFooter>
    </div>
  )
}
