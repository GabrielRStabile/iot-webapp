import fetchClient from '@/services/fetch-client'

const getDispositivos = async () => {
  const { data } = await fetchClient().get('http://localhost:8080/dispositivo')
  return data
}

const deleteDispositivo = async (dispositivoId: number) => {
  await fetchClient().delete(
    `http://localhost:8080/dispositivo/${dispositivoId}`,
  )
}

export { getDispositivos, deleteDispositivo }
