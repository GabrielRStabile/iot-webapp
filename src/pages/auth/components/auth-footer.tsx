import { Button } from '../../../components/ui/button'

interface AuthFooterProps {
  children: JSX.Element
}

export default function AuthFooter({ children }: AuthFooterProps) {
  return (
    <footer className="h-20 p-4 flex justify-center">
      <Button variant="link" asChild>
        {children}
      </Button>
    </footer>
  )
}
