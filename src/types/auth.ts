export interface AuthUser {
  id: string
  name: string
  email: string
  emailVerified: boolean
  role: string
}

export interface AuthSession {
  accessToken: string
  user: AuthUser
}

export interface AuthState {
  user: AuthUser | null
  login: (session: AuthSession) => void
  logout: () => Promise<void>
}
