import { Button } from '../../../components/ui/button'
import Logo from '../../../components/ui/logo'
import ThemeSwitcher from '../../../components/ui/theme-switcher'

interface AuthHeaderProps {
  children: JSX.Element
}

export default function AuthHeader({ children }: AuthHeaderProps) {
  return (
    <header className="flex flex-row item justify-between px-4 py-2">
      <Logo />
      <div className="flex space-x-1">
        <ThemeSwitcher />
        <Button variant="outline" asChild>
          {children}
        </Button>
      </div>
    </header>
  )
}
