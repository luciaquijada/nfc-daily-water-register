import { createContext } from 'react'
import type { Session, User } from '@supabase/supabase-js'

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export type AuthContextValue = {
  status: AuthStatus
  session: Session | null
  user: User | null
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
