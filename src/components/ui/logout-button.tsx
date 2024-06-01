import { LogOut } from 'lucide-react'
import { Button } from './button'

export default function LogoutButton() {
  return (
    <Button size="icon" variant="ghost">
      <LogOut className="text-red-500" />
    </Button>
  )
}
