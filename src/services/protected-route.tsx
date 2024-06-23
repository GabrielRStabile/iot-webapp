import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/auth-context'

export default function ProtectedRoute(children: React.ReactNode) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/auth" />
  }

  return children
}
