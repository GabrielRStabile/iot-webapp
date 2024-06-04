import { cn } from '../../lib/utils'

type CardChild = React.ReactElement<
  typeof CardTitle | typeof CardDescription | typeof CardContent
>

interface CardProps {
  children: CardChild | CardChild[]
  className?: string
}

interface CardTitleProps {
  children: string
  className?: string
}

interface CardDescriptionProps {
  children: string
  className?: string
}

function Card({ children, className }: CardProps) {
  return (
    <main
      className={cn(
        'flex flex-col gap-[0.625rem] bg-background border rounded-md mt-3 p-6 h-full',
        className,
      )}
    >
      {children}
    </main>
  )
}

function CardTitle({ children, className }: CardTitleProps) {
  return <h4 className={cn(className)}>{children}</h4>
}

function CardDescription({ children, className }: CardDescriptionProps) {
  return <span className={cn('text-sm', className)}>{children}</span>
}

function CardContent({ children, className }: CardProps) {
  return <div className={cn(className)}>{children}</div>
}

export { Card, CardContent, CardDescription, CardTitle }
