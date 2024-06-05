import { Button } from '@/components/ui/button'
import NotFoundImg from '../assets/not_found.svg'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="text-center">
      <h1 className="mb-3">Ops...</h1>
      <h3 className="mb-3">Página Não Encontrada</h3>
      <Button onClick={() => navigate('/dashboard')}>
        Voltar para o Início
      </Button>
      <img src={NotFoundImg} alt="" />
    </div>
  )
}

export default NotFound
