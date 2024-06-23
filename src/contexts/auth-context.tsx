import { AxiosError } from 'axios'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { LoginRequestDTO } from '../domain/auth/login-request-dto'
import { RegisterRequestDTO } from '../domain/auth/register-request-dto'
import { UserEntity } from '../domain/auth/user-entity'
import fetchClient from '../services/fetch-client'

interface AuthContextData {
  signed: boolean
  user: UserEntity | null
  login(user: LoginRequestDTO): Promise<boolean>
  register(user: RegisterRequestDTO): Promise<boolean>
  logout(): void
}

interface AuthContextProviderProps {
  children: React.ReactNode
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<UserEntity | null>(null)

  useEffect(() => {
    const storagedUser = sessionStorage.getItem('@App:user')
    const storagedToken = sessionStorage.getItem('@App:token')

    if (storagedUser === 'undefined' || storagedToken === 'undefined') {
      sessionStorage.removeItem('@App:user')
      sessionStorage.removeItem('@App:token')
    }

    if (storagedToken && storagedUser) {
      const user: UserEntity = JSON.parse(storagedUser)
      setUser(user)
    }
  }, [])

  async function login(userData: LoginRequestDTO): Promise<boolean> {
    try {
      const response = await fetch(`${import.meta.env.VITE_IOT_API}/auth`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify({
          email: userData.email,
          senha: userData.password,
        }),
      })

      if (response.ok) {
        const data = await response.text()
        sessionStorage.setItem('@App:token', data)

        await fetchClient()
          .get(`${import.meta.env.VITE_IOT_API}/pessoa`)
          .then((response) => {
            setUser(response.data)
            sessionStorage.setItem(
              '@App:user',
              JSON.stringify({
                id: response.data.id,
                name: response.data.nome,
                email: response.data.email,
              }),
            )
          })

        return true
      } else {
        const errorData = await response.json()
        if (Array.isArray(errorData.errors)) {
          const errorMessages = errorData.errors.join('\n')
          toast.error(errorMessages)
        } else {
          toast.error(`${errorData}`)
        }

        return false
      }
    } catch (error) {
      toast.error(`${error}`)
      return false
    }
  }

  async function register(userData: RegisterRequestDTO): Promise<boolean> {
    try {
      await fetch(`${import.meta.env.VITE_IOT_API}/auth/register`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: userData.name,
          email: userData.email,
          senha: userData.password,
        }),
      })

      return true
    } catch (error) {
      if ((error as AxiosError).response?.data) {
        console.log('error', error)
        const { errors } = (error as AxiosError).response?.data as {
          errors: string[]
        }
        if (Array.isArray(errors)) {
          const errorMessages = errors.join('\n')
          toast.error(errorMessages)
        } else {
          toast.error(`${error}`)
        }
      } else {
        toast.error(`${error}`)
      }

      return false
    }
  }

  function logout() {
    setUser(null)

    sessionStorage.removeItem('@App:user')
    sessionStorage.removeItem('@App:token')
  }

  return (
    <AuthContext.Provider
      value={{ signed: Boolean(user), user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  return context
}
