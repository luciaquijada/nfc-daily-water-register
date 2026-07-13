import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSettings } from '../SettingsProvider'
import { SettingsSection } from './SettingsSection'

type ThemeSettingProps = {
  compact?: boolean
}

export function ThemeSetting({ compact = false }: ThemeSettingProps) {
  const { theme, setTheme, translate } = useSettings()

  const options = [
    { value: 'light' as const, label: translate('settings', 'themeLight'), icon: Sun },
    { value: 'dark' as const, label: translate('settings', 'themeDark'), icon: Moon },
  ]

  return (
    <SettingsSection
      title={translate('settings', 'theme')}
      description={translate('settings', 'themeDescription')}
      compact={compact}
    >
      <div className="flex gap-2">
        {options.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            aria-pressed={theme === value}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-xl font-medium transition-colors',
              compact ? 'px-3 py-2.5 text-[14px]' : 'px-4 py-3 text-[15px]',
              theme === value
                ? 'bg-water-primary text-text-on-water'
                : 'bg-surface-muted text-text-primary hover:bg-border-soft',
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>
    </SettingsSection>
  )
}
