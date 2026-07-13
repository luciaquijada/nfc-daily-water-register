import { useState } from 'react'
import { ArrowLeft, ChevronRight, Droplets } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { routes } from '@/app/routes'
import { Button } from '@/components/ui/button'
import { Sheet } from '@/components/ui/sheet'
import { formatMl } from '@/features/hydration/utils/progress'
import { useProfile } from '@/features/profile/hooks/useProfile'
import { useSettings } from '@/features/settings/SettingsProvider'
import { HydrationSettingsForm } from '@/features/settings/components/HydrationSettingsForm'
import { LanguageSetting } from '@/features/settings/components/LanguageSetting'
import { ThemeSetting } from '@/features/settings/components/ThemeSetting'

function SettingsSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-2">
      <div className="h-16 rounded-[20px] bg-surface-muted" />
      <div className="h-16 rounded-[20px] bg-surface-muted" />
      <div className="h-14 rounded-[20px] bg-surface-muted" />
    </div>
  )
}

export function SettingsPage() {
  const navigate = useNavigate()
  const { translate } = useSettings()
  const { data: profile, isLoading, isError, refetch } = useProfile()
  const [hydrationOpen, setHydrationOpen] = useState(false)

  return (
    <div className="scroll-page flex h-full min-h-0 flex-col overflow-x-hidden page-px pb-3 pt-3">
      <header className="flex shrink-0 items-center gap-2 pb-3">
        <Button
          variant="surface"
          size="icon"
          aria-label={translate('settings', 'back')}
          onClick={() => navigate(routes.today)}
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </Button>
        <h1 className="text-heading-md font-semibold text-text-primary">
          {translate('settings', 'title')}
        </h1>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <ThemeSetting compact />
        <LanguageSetting compact />

        {isLoading ? (
          <SettingsSkeleton />
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 rounded-[20px] bg-surface p-5 text-center shadow-[var(--shadow-soft)]">
            <p className="text-[14px] text-text-secondary">{translate('profile', 'loadError')}</p>
            <Button variant="surface" onClick={() => void refetch()}>
              {translate('profile', 'retry')}
            </Button>
          </div>
        ) : profile ? (
          <button
            type="button"
            onClick={() => setHydrationOpen(true)}
            className="flex w-full items-center gap-3 rounded-[20px] bg-surface p-3 text-left shadow-[var(--shadow-soft)] transition-colors hover:bg-surface-muted/60"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-water-primary/10 text-water-primary">
              <Droplets className="size-4" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-semibold text-text-primary">
                {translate('settings', 'goal')}
              </span>
              <span className="mt-0.5 block text-[12px] text-text-secondary">
                {formatMl(profile.daily_goal_ml)} ml · +{formatMl(profile.default_amount_ml)} ml
              </span>
            </span>
            <ChevronRight className="size-4 shrink-0 text-text-secondary" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      {profile ? (
        <Sheet
          open={hydrationOpen}
          onOpenChange={setHydrationOpen}
          title={translate('settings', 'goal')}
          description={`${translate('settings', 'goalDescription')} · ${translate('settings', 'quickAmountDescription')}`}
        >
          <HydrationSettingsForm profile={profile} />
        </Sheet>
      ) : null}
    </div>
  )
}
