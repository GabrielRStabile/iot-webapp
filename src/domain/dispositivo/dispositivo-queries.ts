import fetchClient from '@/services/fetch-client'
import { CreateDispositivo } from './create-dispositivo-dto'
import Dispositivo from './dispositivo-interface'
import { QueryFunctionContext, QueryKey } from '@tanstack/react-query'
import { GetSensor } from '../sensor/get-sensor-dto'
import { GetAtuador } from '../atuador/get-atuador-dto'
import { UpdateDispositivo } from './update-dispositivo-dto'
import { UpdateSensoresDispositivo } from './update-sensor-dispositivo'
import { UpdateAtuadoresDispositivo } from './update-atuador-dispositivo'

const baseUrl = `${import.meta.env.VITE_IOT_API}/dispositivo`

const getDispositivoById = async ({
  queryKey,
}: QueryFunctionContext<QueryKey>): Promise<Dispositivo> => {
  const [, id] = queryKey
  const { data } = await fetchClient().get(`${baseUrl}/${id}`)
  return data
}

const getSensoresByDispositivoId = async ({
  queryKey,
}: QueryFunctionContext<QueryKey>): Promise<GetSensor[]> => {
  const [, id] = queryKey
  const { data } = await fetchClient().get(`${baseUrl}/${id}/sensor`)
  return data
}

const getAtuadoresByDispositivoId = async ({
  queryKey,
}: QueryFunctionContext<QueryKey>): Promise<GetAtuador[]> => {
  const [, id] = queryKey
  const { data } = await fetchClient().get(`${baseUrl}/${id}/atuador`)
  return data
}

const getDispositivos = async (): Promise<Dispositivo[]> => {
  const { data } = await fetchClient().get(baseUrl)
  return data
}

const createDispositivo = async (
  data: CreateDispositivo,
): Promise<Dispositivo> => {
  try {
    const { data: newDispositivo } = await fetchClient().post(baseUrl, data)
    return newDispositivo as Dispositivo
  } catch (err) {
    console.log(err)
    throw new Error('erro')
  }
}

const updateDispositivo = async ({
  id,
  newData,
}: UpdateDispositivo): Promise<Dispositivo> => {
  const { data } = await fetchClient().put(`${baseUrl}/${id}`, newData)
  return data
}

const deleteDispositivo = async (dispositivoId: number) => {
  await fetchClient().delete(`${baseUrl}/${dispositivoId}`)
}

const addSensores = async ({
  dispositivoId,
  sensoresId,
}: UpdateSensoresDispositivo) => {
  const { status } = await fetchClient().post(
    `${baseUrl}/${dispositivoId}/sensor`,
    sensoresId,
  )
  return status
}

const removeSensores = async ({
  dispositivoId,
  sensoresId,
}: UpdateSensoresDispositivo) => {
  const { status } = await fetchClient().delete(
    `${baseUrl}/${dispositivoId}/sensor`,
    { data: sensoresId },
  )
  return status
}

const addAtuadores = async ({
  dispositivoId,
  atuadoresId,
}: UpdateAtuadoresDispositivo) => {
  const { status } = await fetchClient().post(
    `${baseUrl}/${dispositivoId}/atuador`,
    atuadoresId,
  )
  return status
}

const removeAtuadores = async ({
  dispositivoId,
  atuadoresId,
}: UpdateAtuadoresDispositivo) => {
  const { status } = await fetchClient().delete(
    `${baseUrl}/${dispositivoId}/atuador`,
    { data: atuadoresId },
  )
  return status
}

export {
  getDispositivoById,
  getDispositivos,
  createDispositivo,
  updateDispositivo,
  deleteDispositivo,
  getSensoresByDispositivoId,
  getAtuadoresByDispositivoId,
  addSensores,
  removeSensores,
  addAtuadores,
  removeAtuadores,
}
