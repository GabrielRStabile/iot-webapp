import fetchClient from '@/services/fetch-client'
import { GetAtuador } from './get-atuador-dto'

const baseUrl = `${import.meta.env.VITE_IOT_API}/atuador`

const getAtuadores = async (): Promise<GetAtuador[]> => {
  const { data } = await fetchClient().get(baseUrl)
  return data
}

const deleteAtuadorById = async (atuadorId: number): Promise<number> => {
  const { status } = await fetchClient().delete(`${baseUrl}/${atuadorId}`)
  return status
}

export { getAtuadores, deleteAtuadorById }
