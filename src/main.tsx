import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './styles/globals.css'
import { App } from './app/App'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('No se encontró el nodo #root para montar la aplicación.')
}

if (import.meta.env.PROD) {
  registerSW({ immediate: true })
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
