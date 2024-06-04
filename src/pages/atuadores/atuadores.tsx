import { useLocation } from 'react-router-dom'
import AtuadoresListPage from './atuadores-list'

const AtuadoresPage = () => {
  const path = useLocation()
  // const params = useParams()

  const checkRoute = () => {
    const { pathname } = path

    if (pathname === '/dashboard/atuadores') {
      return <AtuadoresListPage />
    }
  }
  return (
    <>
      <div className="p-4 h-full">{checkRoute()}</div>
    </>
  )
}

export default AtuadoresPage
