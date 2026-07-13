import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './styles/globals.css'
import { App } from './app/App'
import { loadStoredPreferences, THEME_COLORS } from './features/settings/storage'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('No se encontró el nodo #root para montar la aplicación.')
}

const preferences = loadStoredPreferences()
document.documentElement.dataset.theme = preferences.theme
document.documentElement.lang = preferences.locale
document.documentElement.style.colorScheme = preferences.theme

const themeColor = document.querySelector('meta[name="theme-color"]')
if (themeColor) {
  themeColor.setAttribute('content', THEME_COLORS[preferences.theme])
}

if (import.meta.env.PROD) {
  registerSW({ immediate: true })
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
