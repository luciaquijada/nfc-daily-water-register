import { cn } from '@/lib/utils'
import type { AppLocale } from '../types'
import { useSettings } from '../SettingsProvider'
import { SettingsSection } from './SettingsSection'

const LOCALE_OPTIONS: { value: AppLocale; labelKey: string }[] = [
  { value: 'es', labelKey: 'languageEs' },
  { value: 'en', labelKey: 'languageEn' },
]

type LanguageSettingProps = {
  compact?: boolean
}

export function LanguageSetting({ compact = false }: LanguageSettingProps) {
  const { locale, setLocale, translate } = useSettings()

  return (
    <SettingsSection
      title={translate('settings', 'language')}
      description={translate('settings', 'languageDescription')}
      compact={compact}
    >
      <div className="flex gap-2">
        {LOCALE_OPTIONS.map(({ value, labelKey }) => (
          <button
            key={value}
            type="button"
            onClick={() => setLocale(value)}
            aria-pressed={locale === value}
            className={cn(
              'flex flex-1 items-center justify-center rounded-xl font-medium transition-colors',
              compact ? 'px-3 py-2.5 text-[14px]' : 'px-4 py-3 text-[15px]',
              locale === value
                ? 'bg-water-primary text-text-on-water'
                : 'bg-surface-muted text-text-primary hover:bg-border-soft',
            )}
          >
            {translate('settings', labelKey)}
          </button>
        ))}
      </div>
    </SettingsSection>
  )
}
