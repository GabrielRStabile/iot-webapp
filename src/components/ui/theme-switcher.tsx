import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../theme-provider'
import { Button } from './button'

export default function ThemeSwitcher() {
  const { setTheme, theme } = useTheme()

  return (
    <Button
      variant="ghost"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {theme === 'light' ? <Sun /> : <Moon />}
    </Button>
  )
}
