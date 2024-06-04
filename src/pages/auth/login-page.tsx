import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
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

export default function LoginPage() {
  const { login, signed } = useAuth()
  const navigate = useNavigate()

  const formSchema = z.object({
    email: z.string().email('Por favor, insira um email válido'),
    password: z.string(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const logged = await login({
      email: values.email,
      password: values.password,
    })

    if (logged) {
      navigate('/dashboard', { replace: true })
    }
  }

  useEffect(() => {
    if (signed) {
      navigate('/dashboard', { replace: true })
    }
  })

  return (
    <div className="flex flex-col h-screen">
      <AuthHeader>
        <a href="/auth/signup">Cadastrar</a>
      </AuthHeader>
      <AuthMain>
        <h3 className="mb-8">Entrar IoT</h3>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-w-sm w-full"
          >
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
              Entrar
            </Button>
          </form>
        </Form>
      </AuthMain>
      <AuthFooter>
        <a href="/auth/signup">Não tem uma conta? Cadastre-se</a>
      </AuthFooter>
    </div>
  )
}
