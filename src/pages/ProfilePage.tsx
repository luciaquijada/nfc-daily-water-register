import { useState } from 'react'
import { ChevronRight, KeyRound, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet } from '@/components/ui/sheet'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useSignOut } from '@/features/auth/hooks/auth-mutations'
import { ChangePasswordForm } from '@/features/profile/components/ChangePasswordForm'
import { ProfileAccountForm } from '@/features/profile/components/ProfileAccountForm'
import { useProfile } from '@/features/profile/hooks/useProfile'
import { useSettings } from '@/features/settings/SettingsProvider'

function ProfileSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-2">
      <div className="h-14 rounded-[20px] bg-surface-muted" />
      <div className="h-14 rounded-[20px] bg-surface-muted" />
      <div className="h-14 rounded-[20px] bg-surface-muted" />
    </div>
  )
}

type ProfileRowProps = {
  icon: typeof UserRound
  title: string
  subtitle: string
  onClick: () => void
}

function ProfileRow({ icon: Icon, title, subtitle, onClick }: ProfileRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[20px] bg-surface p-3 text-left shadow-[var(--shadow-soft)] transition-colors hover:bg-surface-muted/60"
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-water-primary/10 text-water-primary">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-semibold text-text-primary">{title}</span>
        <span className="mt-0.5 block truncate text-[12px] text-text-secondary">{subtitle}</span>
      </span>
      <ChevronRight className="size-4 shrink-0 text-text-secondary" aria-hidden="true" />
    </button>
  )
}

export function ProfilePage() {
  const { user } = useAuth()
  const { translate } = useSettings()
  const { data: profile, isLoading, isError, refetch } = useProfile()
  const signOut = useSignOut()
  const [nameOpen, setNameOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)

  return (
    <div className="scroll-page flex h-full min-h-0 flex-col overflow-x-hidden page-px pb-3 pt-4">
      <header className="shrink-0 pb-3 text-center">
        <h1 className="text-heading-md font-semibold text-text-primary">
          {translate('profile', 'title')}
        </h1>
      </header>

      {isLoading ? (
        <ProfileSkeleton />
      ) : isError ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <p className="text-[14px] text-text-secondary">{translate('profile', 'loadError')}</p>
          <Button variant="surface" onClick={() => void refetch()}>
            {translate('profile', 'retry')}
          </Button>
        </div>
      ) : profile ? (
        <>
          <div className="flex min-h-0 flex-1 flex-col gap-2">
            {user?.email ? (
              <div className="rounded-[20px] bg-surface p-3 shadow-[var(--shadow-soft)]">
                <p className="text-[11px] text-text-secondary">{translate('profile', 'email')}</p>
                <p className="mt-0.5 truncate text-[14px] font-medium text-text-primary">
                  {user.email}
                </p>
              </div>
            ) : null}

            <ProfileRow
              icon={UserRound}
              title={translate('profile', 'name')}
              subtitle={profile.display_name?.trim() || translate('profile', 'nameDescription')}
              onClick={() => setNameOpen(true)}
            />

            <ProfileRow
              icon={KeyRound}
              title={translate('profile', 'password')}
              subtitle={translate('profile', 'passwordDescription')}
              onClick={() => setPasswordOpen(true)}
            />
          </div>

          <div className="shrink-0 pt-2">
            {signOut.isError ? (
              <p role="alert" className="mb-2 text-center text-[13px] text-error">
                {translate('profile', 'signOutError')}
              </p>
            ) : null}
            <Button
              variant="surface"
              size="lg"
              className="w-full"
              onClick={() => signOut.mutate()}
              disabled={signOut.isPending}
            >
              {signOut.isPending
                ? translate('profile', 'signingOut')
                : translate('profile', 'signOut')}
            </Button>
          </div>

          <Sheet
            open={nameOpen}
            onOpenChange={setNameOpen}
            title={translate('profile', 'name')}
            description={translate('profile', 'nameDescription')}
          >
            <ProfileAccountForm profile={profile} />
          </Sheet>

          <Sheet
            open={passwordOpen}
            onOpenChange={setPasswordOpen}
            title={translate('profile', 'password')}
            description={translate('profile', 'passwordDescription')}
          >
            <ChangePasswordForm />
          </Sheet>
        </>
      ) : null}
    </div>
  )
}
