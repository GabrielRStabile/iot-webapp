import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Bot, Cpu, Gauge, Home, Network, PanelLeft } from 'lucide-react'
import { Outlet, useLocation } from 'react-router-dom'
import Logo from './logo'
import LogoutButton from './logout-button'
import ThemeSwitcher from './theme-switcher'

const menuItems = [
  {
    icon: <Home className="h-5 w-5" />,
    name: 'Dashboard',
    path: '/dashboard',
  },
  {
    icon: <Network className="h-5 w-5" />,
    name: 'Gateways',
    path: '/dashboard/gateways',
  },
  {
    icon: <Cpu className="h-5 w-5" />,
    name: 'Dispositivos',
    path: '/dashboard/dispositivos',
  },
  {
    icon: <Gauge className="h-5 w-5" />,
    name: 'Sensores',
    path: '/dashboard/sensores',
  },
  {
    icon: <Bot className="h-5 w-5" />,
    name: 'Atuadores',
    path: '/dashboard/atuadores',
  },
]

export default function Root() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SideBar />
      <MainContent />
    </div>
  )
}

function SideBar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-16 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center justify-between h-full gap-4 px-2 sm:py-5">
        <Logo reduced />
        <MenuItems />
        <UserControls />
      </nav>
    </aside>
  )
}

function MenuItems() {
  return (
    <div className="flex flex-col gap-3">
      {menuItems.map((item) => (
        <MenuItem key={item.path} {...item} />
      ))}
    </div>
  )
}

function UserControls() {
  return (
    <div className="flex flex-col gap-3 items-center">
      <ThemeSwitcher />
      <LogoutButton />
    </div>
  )
}

function MainContent() {
  return (
    <div>
      <Header />
      <main className="p-4 sm:px-6 sm:py-0">
        <Outlet />
      </main>
    </div>
  )
}

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background  sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Logo />
            <MenuItems />
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}

type MenuItemProps = {
  icon: React.ReactNode
  name: string
  path: string
  reduced?: boolean
}

function MenuItem({ icon, name, path, reduced = true }: MenuItemProps) {
  const location = useLocation()
  const selected = location.pathname === path

  if (reduced) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={path}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 ${selected ? 'bg-muted' : ''}`}
          >
            {icon}
            <span className="sr-only">{name}</span>
          </a>
        </TooltipTrigger>
        <TooltipContent side="right">{name}</TooltipContent>
      </Tooltip>
    )
  } else {
    return (
      <a
        href={path}
        className={`flex items-center gap-4 px-2.5 ${selected ? 'text-foreground' : 'text-muted-foreground'} hover:text-foreground`}
      >
        {icon}
        {name}
      </a>
    )
  }
}
