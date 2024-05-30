import fetchClient from '@/services/fetch-client'
import { CreateDispositivo } from './create-dispositivo-dto'

const baseUrl = 'http://localhost:8080/dispositivo'

const getDispositivos = async () => {
  const { data } = await fetchClient().get(baseUrl)
  return data
}

const createDispositivo = async (data: CreateDispositivo) => {
  try {
    const { data: newDispositivo } = await fetchClient().post(baseUrl, data)
    return newDispositivo
  } catch (err) {
    console.log(err)
  }
}

const deleteDispositivo = async (dispositivoId: number) => {
  await fetchClient().delete(`${baseUrl}/${dispositivoId}`)
}

export { getDispositivos, createDispositivo, deleteDispositivo }
