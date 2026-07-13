import type { AppLocale, AppPreferences, ThemeMode } from './types'

const STORAGE_KEY = 'glup-glup-preferences'

const DEFAULT_PREFERENCES: AppPreferences = {
  theme: 'light',
  locale: 'es',
}

function readPreferences(): AppPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return DEFAULT_PREFERENCES
    }
    const parsed = JSON.parse(raw) as Partial<AppPreferences>
    return {
      theme: parsed.theme === 'dark' ? 'dark' : 'light',
      locale: parsed.locale === 'en' ? 'en' : 'es',
    }
  } catch {
    return DEFAULT_PREFERENCES
  }
}

function writePreferences(preferences: AppPreferences) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
}

export function loadStoredPreferences(): AppPreferences {
  return readPreferences()
}

export function saveTheme(theme: ThemeMode): AppPreferences {
  const next = { ...readPreferences(), theme }
  writePreferences(next)
  return next
}

export function saveLocale(locale: AppLocale): AppPreferences {
  const next = { ...readPreferences(), locale }
  writePreferences(next)
  return next
}

export const THEME_COLORS: Record<ThemeMode, string> = {
  light: '#dcecff',
  dark: '#0f1419',
}
