import { useEffect, useState, FormEvent, ChangeEvent } from 'react'
import { usePageTitle } from '../../../hooks/use-page-title'
import { Alert } from '../../../components/ui/feedback'
import { Link } from '../../../components/ui/link'
import { PageFrame } from '../../../components/ui/page-frame'
import { verifyEmail, resendVerification } from '../../../services/auth.service'
import { Input } from '../../../components/forms/fields'

export default function EmailVerificationPage({ query }: { query: URLSearchParams | null }) {
  usePageTitle('Verify Email')
  const isDemoMode = import.meta.env.MODE === 'demo' && import.meta.env.VITE_DEMO_MODE === 'true'
  const token = query?.get('token') || ''
  const [status, setStatus] = useState({
    type: 'info',
    message: token ? 'Verifying your email...' : isDemoMode ? 'Email delivery is disabled in this demo. Register to verify your account locally.' : 'Verification token is required.',
  })
  const [email, setEmail] = useState('')
  const [resendStatus, setResendStatus] = useState<{ type: string; message: string } | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) return
    verifyEmail(token)
      .then((result) => setStatus({ type: 'success', message: result?.message || 'Email verified successfully.' }))
      .catch((error) =>
        setStatus({
          type: 'error',
          message: error instanceof Error ? error.message : 'Email verification failed.',
        }),
      )
  }, [token])

  const handleResend = async (e: FormEvent) => {
    e.preventDefault()
    if (!email) {
      setResendStatus({ type: 'error', message: 'Email address is required.' })
      return
    }
    setLoading(true)
    setResendStatus(null)
    try {
      const result = await resendVerification(email)
      setResendStatus({ type: 'success', message: result?.message || 'Verification link sent.' })
    } catch (error) {
      setResendStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to resend verification link.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageFrame title="Email verification" subtitle="Activate your account to post and manage ads.">
      <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Alert type={status.type} message={status.message} />

        {status.type === 'success' ? (
          <Link to="/login" className="primary-button" style={{ textAlign: 'center' }}>
            Continue to login
          </Link>
        ) : !isDemoMode ? (
          <div className="auth-card" style={{ padding: '24px', width: '100%', boxSizing: 'border-box' }}>
            <div className="auth-card-heading" style={{ marginBottom: '16px' }}>
              <h2>Resend verification link</h2>
              <p>Enter your account email to receive a new verification link.</p>
            </div>

            {resendStatus && <Alert type={resendStatus.type} message={resendStatus.message} />}

            <form onSubmit={handleResend} className="auth-form" style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="auth-field">
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button className="primary-button full" type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Resend link'}
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </PageFrame>
  )
}
