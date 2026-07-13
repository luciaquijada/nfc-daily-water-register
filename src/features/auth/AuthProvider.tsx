import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { AuthContext, type AuthStatus } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')

  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (!active) {
        return
      }
      setSession(data.session)
      setStatus(data.session ? 'authenticated' : 'unauthenticated')
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setStatus(nextSession ? 'authenticated' : 'unauthenticated')
    })

    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ status, session, user: session?.user ?? null }}>
      {children}
    </AuthContext.Provider>
  )
}
