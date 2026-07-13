import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getIntlLocale, t } from './i18n'
import {
  loadStoredPreferences,
  saveLocale,
  saveTheme,
  THEME_COLORS,
} from './storage'
import type { AppLocale, ThemeMode } from './types'

type SettingsContextValue = {
  theme: ThemeMode
  locale: AppLocale
  intlLocale: string
  setTheme: (theme: ThemeMode) => void
  setLocale: (locale: AppLocale) => void
  translate: (section: 'settings' | 'profile', key: string) => string
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme

  const themeColor = document.querySelector('meta[name="theme-color"]')
  if (themeColor) {
    themeColor.setAttribute('content', THEME_COLORS[theme])
  }
}

function applyLocale(locale: AppLocale) {
  document.documentElement.lang = locale
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState(loadStoredPreferences)

  useEffect(() => {
    applyTheme(preferences.theme)
    applyLocale(preferences.locale)
  }, [preferences.theme, preferences.locale])

  const setTheme = useCallback((theme: ThemeMode) => {
    setPreferences(saveTheme(theme))
  }, [])

  const setLocale = useCallback((locale: AppLocale) => {
    setPreferences(saveLocale(locale))
  }, [])

  const value = useMemo<SettingsContextValue>(
    () => ({
      theme: preferences.theme,
      locale: preferences.locale,
      intlLocale: getIntlLocale(preferences.locale),
      setTheme,
      setLocale,
      translate: (section, key) => t(preferences.locale, section, key),
    }),
    [preferences.locale, preferences.theme, setLocale, setTheme],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings debe usarse dentro de SettingsProvider')
  }
  return context
}
