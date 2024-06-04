import { DataTable } from '../../../components/data-table'
import Dispositivo from '../../../domain/dispositivo/dispositivo-interface'
import { createGatewayDispositivoLinkColumns } from '../create-gateway-dispositivo-link-columns'

interface DevicesTableProps {
  dispositivos: Dispositivo[]
  onLinkUnlink: (dispositivo: Dispositivo) => void
}

function AvailableDevicesTable({
  dispositivos,
  onLinkUnlink,
}: DevicesTableProps) {
  return (
    <DataTable
      columns={createGatewayDispositivoLinkColumns}
      data={dispositivos.filter((dispositivo) => !dispositivo.gatewayId)}
      dataType="dispositivo"
      hideHeadingButtons
      meta={{
        fn: onLinkUnlink,
      }}
    />
  )
}

function AssociatedDevicesTable({
  dispositivos,
  onLinkUnlink,
}: DevicesTableProps) {
  return (
    <DataTable
      columns={createGatewayDispositivoLinkColumns}
      data={dispositivos}
      dataType="dispositivo"
      hideHeadingButtons
      meta={{
        fn: onLinkUnlink,
      }}
    />
  )
}

export { AssociatedDevicesTable, AvailableDevicesTable }
