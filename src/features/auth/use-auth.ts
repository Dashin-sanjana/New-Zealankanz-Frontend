import { useMemo, useState } from 'react'
import { navigate } from '../../lib/navigation'
import { getStoredAuth } from '../../services/api'
import { logoutAccount } from '../../services/auth.service'
import type { AuthSession, AuthState, AuthUser } from '../../types/auth'

export function useAuth(): AuthState {
  const [user, setUser] = useState<AuthUser | null>(() => {
    return getStoredAuth()?.user || null
  })

  return useMemo(
    () => ({
      user,
      login: (authResult: AuthSession) => {
        setUser(authResult.user)
      },
      logout: async () => {
        try {
          await logoutAccount()
        } finally {
          setUser(null)
          navigate('/')
        }
      },
    }),
    [user],
  )
}
