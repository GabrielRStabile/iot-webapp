import fetchClient from '@/services/fetch-client'
import { CreateDispositivo } from './create-dispositivo-dto'
import Dispositivo from './dispositivo-interface'

const baseUrl = `${import.meta.env.VITE_IOT_API}/dispositivo`

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

const deleteDispositivo = async (dispositivoId: number) => {
  await fetchClient().delete(`${baseUrl}/${dispositivoId}`)
}

export { createDispositivo, deleteDispositivo, getDispositivos }
