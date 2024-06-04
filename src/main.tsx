import { QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider'
import Root from './components/ui/root'
import { Toaster } from './components/ui/sonner'
import { TooltipProvider } from './components/ui/tooltip'
import { AuthProvider } from './contexts/auth-context'
import './index.css'
import { queryClient } from './lib/react-query'
import App from './pages/app'
import LoginPage from './pages/auth/login-page'
import SignUpPage from './pages/auth/signup-page'
import DispositivoCreatePage from './pages/dispositivos/dispositivo-create'
import DispositivosPage from './pages/dispositivos/dispositivos'
import GatewayCreatePage from './pages/gateways/gateway-create-page'
import GatewayEditPage from './pages/gateways/gateway-edit-page'
import GatewaysPage from './pages/gateways/gateways-page'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/auth',
    element: <LoginPage />,
  },
  {
    path: '/auth/signup',
    element: <SignUpPage />,
  },
  {
    path: '/dashboard',
    element: <Root />,
    children: [
      {
        path: '',
        element: <App />,
      },
      {
        path: 'dispositivos',
        element: <DispositivosPage />,
        children: [
          {
            path: 'new',
            element: <DispositivoCreatePage />,
          },
        ],
      },
      {
        path: 'gateways',
        element: <GatewaysPage />,
      },
      {
        path: 'gateways/new',
        element: <GatewayCreatePage />,
      },
      {
        path: 'gateways/:id/edit',
        element: <GatewayEditPage />,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <RouterProvider router={router} />
            <Toaster />
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
