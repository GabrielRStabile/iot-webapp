import fetchClient from '@/services/fetch-client'

const baseUrl = 'http://localhost:8080/gateway'

const getGateways = async () => {
  const { data } = await fetchClient().get(baseUrl)
  return data
}

interface AssociateDispositivoWithGateway {
  gatewayId: number
  dispositivosId: number[]
}

const associateDispositivoWithGateway = async (
  data: AssociateDispositivoWithGateway,
) => {
  const { gatewayId, dispositivosId } = data
  const { status } = await fetchClient().put(
    `${baseUrl}/${gatewayId}/dispositivo`,
    dispositivosId,
  )
  return status
}

export { getGateways, associateDispositivoWithGateway }
