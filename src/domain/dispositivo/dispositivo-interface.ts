interface Dispositivo {
  id: number
  nome: string
  descricao: string
  endereco: string
  local: string
  gatewayId: number | null
}

export default Dispositivo
