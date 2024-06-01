import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider'
import Root from './components/ui/root'
import { Toaster } from './components/ui/sonner'
import { TooltipProvider } from './components/ui/tooltip'
import { AuthProvider } from './contexts/auth-context'
import './index.css'
import App from './pages/app'
import LoginPage from './pages/auth/login-page'
import SignUpPage from './pages/auth/signup-page'

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
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
