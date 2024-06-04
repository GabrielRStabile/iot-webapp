import fetchClient from '@/services/fetch-client'
import Dispositivo from '../dispositivo/dispositivo-interface'
import { CreateGatewayDTO } from './create-gateway-dto'
import { GatewayEntity } from './gateway-entity'
import { GetGatewayDTO } from './get-gateway-dto'
import { UpdateGatewayDTO } from './update-gateway-dto'

const baseUrl = import.meta.env.VITE_IOT_API

const getGatewayByPersonId = async (id: string): Promise<GetGatewayDTO[]> => {
  const { data } = await fetchClient().get(`${baseUrl}/pessoa/${id}/gateway`)
  return data
}

interface AssociateDisassociateDispositivoWithGateway {
  gatewayId: number
  dispositivosId: number[]
}

const associateDispositivoWithGateway = async (
  data: AssociateDisassociateDispositivoWithGateway,
) => {
  const { gatewayId, dispositivosId } = data
  const { status } = await fetchClient().put(
    `${baseUrl}/gateway/${gatewayId}/dispositivo`,
    dispositivosId,
  )
  return status
}

const disassociateDispositivoFromGateway = async (
  data: AssociateDisassociateDispositivoWithGateway,
) => {
  const { gatewayId, dispositivosId } = data
  const { status } = await fetchClient().delete(
    `${baseUrl}/gateway/${gatewayId}/dispositivo`,
    { data: dispositivosId },
  )
  return status
}

const createGateway = async (dto: CreateGatewayDTO): Promise<GatewayEntity> => {
  const { data } = await fetchClient().post(`${baseUrl}/gateway`, dto)
  return data
}

const getGatewayById = async (id: string): Promise<GatewayEntity> => {
  const { data } = await fetchClient().get(`${baseUrl}/gateway/${id}`)
  return data
}

const updateGateway = async (dto: UpdateGatewayDTO) => {
  await fetchClient().put(`${baseUrl}/gateway/${dto.id}`, dto)
}

const deleteGatewayById = async (gatewayId: number) => {
  await fetchClient().delete(`${baseUrl}/gateway/${gatewayId}`)
}

const getDispositivosByGatewayId = async (
  gatewayId: string,
): Promise<Dispositivo[]> => {
  const { data } = await fetchClient().get(
    `${baseUrl}/gateway/${gatewayId}/dispositivo`,
  )
  return data
}

export {
  associateDispositivoWithGateway,
  createGateway,
  deleteGatewayById,
  disassociateDispositivoFromGateway,
  getDispositivosByGatewayId,
  getGatewayById,
  getGatewayByPersonId,
  updateGateway,
}
