import fetchClient from '@/services/fetch-client'

const getDispositivos = async () => {
  const { data } = await fetchClient().get('http://localhost:8080/dispositivo')
  return data
}

export { getDispositivos }
