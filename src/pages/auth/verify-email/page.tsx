import { useEffect, useState } from 'react'
import { usePageTitle } from '../../../hooks/use-page-title'
import { Alert } from '../../../components/ui/feedback'
import { Link } from '../../../components/ui/link'
import { PageFrame } from '../../../components/ui/page-frame'
import { verifyEmail } from '../../../services/auth.service'

export default function EmailVerificationPage({ query }) {
  usePageTitle('Verify Email')
  const token = query?.get('token') || ''
  const [status, setStatus] = useState({
    type: 'info',
    message: token ? 'Verifying your email...' : 'Add ?token=YOUR_TOKEN to verify your email.',
  })

  useEffect(() => {
    if (!token) return
    verifyEmail(token)
      .then((result) => setStatus({ type: 'success', message: result?.message || 'Email verified.' }))
      .catch((error) =>
        setStatus({
          type: 'info',
          message: error instanceof Error ? error.message : 'Email verification failed.',
        }),
      )
  }, [token])

  return (
    <PageFrame title="Email verification" subtitle="Your verification link will be checked by the backend.">
      <Alert type={status.type} message={status.message} />
      <Link to="/login" className="primary-button">
        Continue to login
      </Link>
    </PageFrame>
  )
}
