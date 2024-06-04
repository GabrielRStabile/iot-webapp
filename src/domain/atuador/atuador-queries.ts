import fetchClient from '@/services/fetch-client'
import { GetAtuador } from './get-atuador-dto'
import { CreateAtuadorDTO } from './create-atuador-dto'

const baseUrl = `${import.meta.env.VITE_IOT_API}/atuador`

const getAtuadores = async (): Promise<GetAtuador[]> => {
  const { data } = await fetchClient().get(baseUrl)
  return data
}

const createAtuador = async (data: CreateAtuadorDTO): Promise<GetAtuador> => {
  const { data: newAtuador } = await fetchClient().post(baseUrl, data)
  return newAtuador
}

const deleteAtuadorById = async (atuadorId: number): Promise<number> => {
  const { status } = await fetchClient().delete(`${baseUrl}/${atuadorId}`)
  return status
}

export { getAtuadores, createAtuador, deleteAtuadorById }
