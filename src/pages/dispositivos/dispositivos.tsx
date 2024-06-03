import { Outlet, useLocation, useParams } from 'react-router-dom'
import DispositivoCreatePage from './dispositivo-create'
import DispositivoDetailsPage from './dispositivo-details'
import DispositivoListPage from './dispositivo-list'
import DispositivoEditPage from './dispositivo-edit'

const DispositivosPage = () => {
  const path = useLocation()
  const params = useParams()

  const checkRoute = () => {
    const { pathname } = path

    if (pathname === '/dashboard/dispositivos') {
      return <DispositivoListPage />
    } else if (pathname === '/dashboard/dispositivos/new') {
      return <DispositivoCreatePage />
    } else if (
      pathname === `/dashboard/dispositivos/${params.dispositivoId}/details`
    ) {
      if (params.dispositivoId) {
        return <DispositivoDetailsPage id={params.dispositivoId} />
      }
    } else if (
      pathname === `/dashboard/dispositivos/${params.dispositivoId}/edit`
    ) {
      if (params.dispositivoId) {
        return <DispositivoEditPage id={params.dispositivoId} />
      }
    }
  }

  return (
    <>
      <div className="bg-neutral-50 p-4 h-full">
        <Outlet />
        {checkRoute()}
      </div>
    </>
  )
}

export default DispositivosPage
