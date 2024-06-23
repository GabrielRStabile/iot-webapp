import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/auth-context'
import { Button } from './button'

export default function LogoutButton() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/auth')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Button size="icon" variant="ghost" onClick={handleLogout}>
      <LogOut className="text-red-500" />
    </Button>
  )
}
