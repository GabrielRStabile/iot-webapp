import fetchClient from '@/services/fetch-client'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { useCallback, useState } from 'react'

interface FetchOptions extends AxiosRequestConfig {}

interface FetchResponse<T> {
  response: AxiosResponse<T> | null
  json: T | null
}

interface UseFetch<T> {
  data: T | null
  error: string | null
  loading: boolean
  request: (url: string, options?: FetchOptions) => Promise<FetchResponse<T>>
}

const useFetch = <T = unknown,>(): UseFetch<T> => {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const request = useCallback(
    async (url: string, options?: FetchOptions): Promise<FetchResponse<T>> => {
      let response: AxiosResponse<T> | null = null
      let json: T | null = null

      try {
        setError(null)
        setLoading(true)

        const axiosOptions = {
          method: options?.method ?? 'GET',
          url,
          headers: options?.headers,
          data: options?.data,
        }

        response = await fetchClient().request<T>(axiosOptions)
        json = response.data

        setData(json)
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const axiosError = err.response
          if (axiosError && axiosError.status === 403) {
            console.log('redirect')
          }
          setError(axiosError?.data?.message)
        } else {
          setError((err as Error).message)
        }
        json = null
      } finally {
        setLoading(false)
      }
      return { response, json }
    },
    [],
  )
  return { data, error, loading, request }
}

export default useFetch
