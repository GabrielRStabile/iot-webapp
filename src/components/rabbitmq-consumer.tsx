import { useEffect, useState } from 'react'
// import { connect } from 'amqplib'
// import SockJS from 'sockjs-client'
// import Stomp from 'stompjs'
import { toast, Toaster } from 'sonner'
import { useAuth } from '@/contexts/auth-context'
import { StompSessionProvider, useSubscription } from 'react-stomp-hooks'
// const RabbitMQConsumer = () => {
//   const { signed } = useAuth()

//   useEffect(() => {
//     if (!signed) return
//     const token = sessionStorage.getItem('@App:token')

//     const client = new Client({
//       brokerURL: 'ws://localhost/spring/ws',
//       connectHeaders: {
//         Authorization: `Bearer ${token}`,
//       },
//     })

//     client.onConnect = function () {
//       client.subscribe('/topic/message', (msg) => {
//         console.log(msg.body)
//         toast.success(msg.body)
//       })
//     }
//     client.activate()
//   }, [signed])
//   return <Toaster position="bottom-right"></Toaster>
// }

const RabbitSubscriber = () => {
  useSubscription('/topic/message', (msg) => toast.success(msg.body))
  return <Toaster position="bottom-right" />
}

const RabbitMQConsumer = () => {
  const { signed } = useAuth()
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    if (signed) {
      const storedToken = sessionStorage.getItem('@App:token')
      setToken(storedToken)
    }
  }, [signed])

  return (
    <StompSessionProvider
      url={'ws://localhost/spring/ws'}
      connectHeaders={{ Authorization: `Bearer ${token}` }}
    >
      <RabbitSubscriber />
    </StompSessionProvider>
  )
}

export default RabbitMQConsumer
