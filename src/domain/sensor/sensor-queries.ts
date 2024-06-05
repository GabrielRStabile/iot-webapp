import fetchClient from '@/services/fetch-client'
import { CreateSensorDTO } from './create-sensor-dto'
import { GetSensorDTO } from './get-sensor-dto'
import Leitura from './leitura'
import { UpdateSensorDTO } from './update-sensor-dto'

const baseUrl = `${import.meta.env.VITE_IOT_API}/sensor`

const getSensores = async (): Promise<GetSensorDTO[]> => {
  const { data } = await fetchClient().get(baseUrl)
  return data
}

const getLeiturasSensor = async (sensorId: string): Promise<Leitura[]> => {
  const { data } = await fetchClient().get(`${baseUrl}/${sensorId}/leitura`)
  return data
}

const createSensor = async (sensor: CreateSensorDTO): Promise<GetSensorDTO> => {
  const { data } = await fetchClient().post(baseUrl, sensor)
  return data
}

const updateSensor = async (sensor: UpdateSensorDTO): Promise<GetSensorDTO> => {
  const { data } = await fetchClient().put(`${baseUrl}/${sensor.id}`, sensor)
  return data
}

const deleteSensor = async (sensorId: string): Promise<void> => {
  await fetchClient().delete(`${baseUrl}/${sensorId}`)
}

export {
  createSensor,
  deleteSensor,
  getLeiturasSensor,
  getSensores,
  updateSensor,
}
