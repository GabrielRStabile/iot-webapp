import fetchClient from '@/services/fetch-client'
import { GetAtuador } from './get-atuador-dto'

const baseUrl = 'http://localhost:8080/atuador'

const getAtuadores = async (): Promise<GetAtuador[]> => {
  const { data } = await fetchClient().get(baseUrl)
  return data
}

export { getAtuadores }
