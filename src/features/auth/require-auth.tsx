import { Alert } from '../../components/ui/feedback'
import { Link } from '../../components/ui/link'
import { PageFrame } from '../../components/ui/page-frame'
import { usePageTitle } from '../../hooks/use-page-title'
import type { AuthState } from '../../types/auth'
import type { ReactNode } from 'react'

interface AuthGuardProps { auth: AuthState; children: ReactNode }

export function RequireAuth({ auth, children }: AuthGuardProps) {
  usePageTitle(auth.user ? 'Protected' : 'Login Required')
  if (!auth.user) {
    return (
      <PageFrame title="Login required" subtitle="Please login to continue.">
        <Link to={`/login?returnTo=${encodeURIComponent(`${window.location.pathname}${window.location.search}${window.location.hash}`)}`} className="primary-button">Login</Link>
      </PageFrame>
    )
  }
  return children
}

export function RequireAdmin({ auth, children }: AuthGuardProps) {
  usePageTitle(auth.user?.role === 'ADMIN' ? 'Admin' : 'Admin Only')
  if (!auth.user) {
    return <RequireAuth auth={auth}>{children}</RequireAuth>
  }
  if (auth.user.role !== 'ADMIN') {
    return (
      <PageFrame title="Admin only" subtitle="This screen is protected by admin role access.">
        <Alert type="info" message="Login with an admin account to preview moderation screens." />
      </PageFrame>
    )
  }
  return children
}
