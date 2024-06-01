interface AuthMainProps {
  children: JSX.Element[]
}

export default function AuthMain({ children }: AuthMainProps) {
  return (
    <main className="flex flex-col flex-grow justify-center align-middle items-center">
      {children}
    </main>
  )
}
