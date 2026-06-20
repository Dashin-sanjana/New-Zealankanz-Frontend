import { useState } from 'react'
import { Alert } from '../../../components/ui/feedback'
import { Link } from '../../../components/ui/link'
import { Input } from '../../../components/forms/fields'
import { PageFrame } from '../../../components/ui/page-frame'
import { usePageTitle } from '../../../hooks/use-page-title'
import { resetPassword } from '../../../services/auth.service'

export default function ResetPasswordPage({ query }: { query: URLSearchParams | null }) {
  usePageTitle('Reset Password')
  const token = query?.get('token') || ''
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState<{ type: string; message: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  if (!token) {
    return (
      <PageFrame title="Reset password" subtitle="Use the link from your reset email.">
        <Alert type="error" message="No reset token found. Please use the link from your password reset email." />
        <p style={{ marginTop: '16px' }}>
          <Link to="/forgot-password">Request a new reset link</Link>
        </p>
      </PageFrame>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) {
      setStatus({ type: 'error', message: 'Password must be at least 8 characters.' })
      return
    }
    if (password !== confirm) {
      setStatus({ type: 'error', message: 'Passwords do not match.' })
      return
    }
    setLoading(true)
    setStatus(null)
    try {
      const result = await resetPassword({ token, password })
      setStatus({ type: 'success', message: result?.message || 'Password reset successfully.' })
      setDone(true)
    } catch (err) {
      setStatus({ type: 'error', message: err instanceof Error ? err.message : 'Reset failed. The link may have expired.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageFrame title="Reset password" subtitle="Enter your new password below.">
      <div style={{ maxWidth: '420px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {status && <Alert type={status.type} message={status.message} />}
        {done ? (
          <Link to="/login" className="primary-button" style={{ textAlign: 'center' }}>
            Continue to login
          </Link>
        ) : (
          <form className="auth-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={handleSubmit}>
            <div className="auth-field">
              <Input
                label="New password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="auth-field">
              <Input
                label="Confirm new password"
                name="confirm"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirm(e.target.value)}
                required
              />
            </div>
            <button className="primary-button full" type="submit" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset password'}
            </button>
          </form>
        )}
      </div>
    </PageFrame>
  )
}
