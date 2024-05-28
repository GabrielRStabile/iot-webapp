import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider'
import Root from './components/ui/root'
import { TooltipProvider } from './components/ui/tooltip'
import './index.css'
import App from './pages/app'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/react-query'
import DispositivosPage from './pages/dispositivos/dispositivos'
import DispositivoCreatePage from './pages/dispositivos/dispositivo-create'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/dashboard',
    element: <Root />,
    children: [
      {
        path: '',
        element: <App />,
      },
    ],
  },
  {
    path: '/dispositivos',
    element: <DispositivosPage />,
    children: [
      {
        path: 'new',
        element: <DispositivoCreatePage />,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <RouterProvider router={router} />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
