import { useMemo, useState } from 'react'
import { navigate } from '../../lib/navigation'
import { getStoredAuth } from '../../services/api'
import { logoutAccount } from '../../services/auth.service'

export function useAuth() {
  const [user, setUser] = useState(() => {
    return getStoredAuth()?.user || null
  })

  return useMemo(
    () => ({
      user,
      login: (authResult) => {
        setUser(authResult.user)
      },
      logout: async () => {
        await logoutAccount()
        setUser(null)
        navigate('/')
      },
    }),
    [user],
  )
}
