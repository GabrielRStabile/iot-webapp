import { useCallback, useState } from 'react'

interface FetchOptions extends RequestInit {}

interface FetchResponse<T> {
  response: Response | null
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
      let response: Response | null = null
      let json: T | null = null

      try {
        setError(null)
        setLoading(true)
        response = await fetch(url, options)
        json = await response.json()
        if (!response.ok) throw new Error(json as unknown as string)
        setData(json)
      } catch (err) {
        json = null
        setError((err as Error).message)
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
