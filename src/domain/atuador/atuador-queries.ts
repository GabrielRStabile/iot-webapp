import fetchClient from '@/services/fetch-client'
import { GetAtuador } from './get-atuador-dto'
import { CreateAtuadorDTO } from './create-atuador-dto'
import { QueryFunctionContext, QueryKey } from '@tanstack/react-query'
import { UpdateAtuadorDTO } from './update-atuador-dto'

const baseUrl = `${import.meta.env.VITE_IOT_API}/atuador`

const getAtuadores = async (): Promise<GetAtuador[]> => {
  const { data } = await fetchClient().get(baseUrl)
  return data
}

const getAtuadorById = async ({
  queryKey,
}: QueryFunctionContext<QueryKey>): Promise<GetAtuador> => {
  const [, id] = queryKey
  const { data } = await fetchClient().get(`${baseUrl}/${id}`)
  return data
}

const createAtuador = async (data: CreateAtuadorDTO): Promise<GetAtuador> => {
  const { data: newAtuador } = await fetchClient().post(baseUrl, data)
  return newAtuador
}

const updateAtuador = async ({
  id,
  newData,
}: UpdateAtuadorDTO): Promise<GetAtuador> => {
  const { data: editedAtuador } = await fetchClient().put(
    `${baseUrl}/${id}`,
    newData,
  )
  return editedAtuador
}

const deleteAtuadorById = async (atuadorId: number): Promise<number> => {
  const { status } = await fetchClient().delete(`${baseUrl}/${atuadorId}`)
  return status
}

export {
  getAtuadores,
  getAtuadorById,
  createAtuador,
  updateAtuador,
  deleteAtuadorById,
}
