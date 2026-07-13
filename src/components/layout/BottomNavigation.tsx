import { NavLink } from 'react-router-dom'
import { ChartColumn, Droplet, History, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { routes } from '@/app/routes'
import { cn } from '@/lib/utils'

type NavItem = {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

const navItems: NavItem[] = [
  { to: routes.today, label: 'Hoy', icon: Droplet, end: true },
  { to: routes.history, label: 'Historial', icon: History },
  { to: routes.analytics, label: 'Análisis', icon: ChartColumn },
  { to: routes.profile, label: 'Perfil', icon: User },
]

export function BottomNavigation() {
  return (
    <nav
      aria-label="Navegación principal"
      className="shrink-0 border-t border-border-soft bg-surface pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="flex items-stretch justify-around px-2 py-1.5">
        {navItems.map((item) => (
          <li key={item.to} className="flex-1">
            <NavLink
              to={item.to}
              end={item.end}
              className="group flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-lg py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-water-primary/50"
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      'grid h-8 w-14 place-items-center rounded-full transition-colors',
                      isActive
                        ? 'bg-water-primary text-text-on-water'
                        : 'text-text-secondary',
                    )}
                  >
                    <item.icon className="h-5 w-5" aria-hidden="true" strokeWidth={2} />
                  </span>
                  <span
                    className={cn(
                      'text-[12px] leading-none transition-colors',
                      isActive
                        ? 'font-medium text-water-primary'
                        : 'text-text-secondary',
                    )}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
