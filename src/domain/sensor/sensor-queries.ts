import fetchClient from '@/services/fetch-client'
import { GetSensor } from './get-sensor-dto'

const baseUrl = 'http://localhost:8080/sensor'

const getSensores = async (): Promise<GetSensor[]> => {
  const { data } = await fetchClient().get(baseUrl)
  return data
}

export { getSensores }
