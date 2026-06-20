import { useEffect, useState } from 'react'
import { DashboardCard } from '../../../components/user/dashboard-card'
import { Alert } from '../../../components/ui/feedback'
import { PageFrame } from '../../../components/ui/page-frame'
import { usePageTitle } from '../../../hooks/use-page-title'
import { getMyAds } from '../../../services/ads.service'
import { getNotifications } from '../../../services/user.service'
import { resendVerification } from '../../../services/auth.service'

export default function UserDashboardPage({ auth }: { auth: any }) {
  usePageTitle('Dashboard')
  const [ads, setAds] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [error, setError] = useState('')
  const [resendStatus, setResendStatus] = useState<{ type: string; message: string } | null>(null)
  const [resending, setResending] = useState(false)

  useEffect(() => {
    Promise.all([getMyAds(), getNotifications()])
      .then(([adItems, notificationItems]) => {
        setAds(adItems)
        setNotifications(notificationItems)
        setError('')
      })
      .catch((err) => setError(err.message))
  }, [])

  const handleResend = async () => {
    if (!auth.user?.email) return
    setResending(true)
    setResendStatus(null)
    try {
      const result = await resendVerification(auth.user.email)
      setResendStatus({ type: 'success', message: result?.message || 'Verification link sent to your email.' })
    } catch (error) {
      setResendStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to send verification link.',
      })
    } finally {
      setResending(false)
    }
  }

  const pendingCount = ads.filter((ad) => ad.status === 'PENDING').length
  const unreadCount = notifications.filter((item) => !item.readAt).length

  return (
    <PageFrame title={`Welcome, ${auth.user?.name || 'User'}`} subtitle="Manage your ads and account activity.">
      {error && <Alert type="error" message={error} />}

      {!auth.user?.emailVerified && (
        <div className="alert warning" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', padding: '16px 20px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }}>
          <div>
            <strong>Email not verified:</strong> Please verify your email to unlock all features.
          </div>
          <button
            className="secondary-button"
            onClick={handleResend}
            disabled={resending}
            style={{ fontSize: '13px', padding: '8px 16px', border: '1px solid currentColor', background: 'transparent', cursor: 'pointer', borderRadius: '4px' }}
          >
            {resending ? 'Sending...' : 'Resend link'}
          </button>
        </div>
      )}

      {resendStatus && (
        <div style={{ marginBottom: '24px' }}>
          <Alert type={resendStatus.type} message={resendStatus.message} />
        </div>
      )}

      <div className="dashboard-grid">
        <DashboardCard title="My Ads" value={ads.length} text="View, edit, or delete your submitted ads." to="/my-ads" />
        <DashboardCard title="Pending Review" value={pendingCount} text="Listings waiting for admin approval." to="/my-ads" />
        <DashboardCard title="Post New Ad" value="+" text="Create a listing with category, city, and images." to="/post-ad" />
        <DashboardCard title="Notifications" value={unreadCount} text="Unread account and listing updates." to="/dashboard" />
        <DashboardCard title="Watchlist" value="★" text="View listings you have saved." to="/watchlist" />
        <DashboardCard title="Settings" value="⚙" text="Update your name or change your password." to="/settings" />
      </div>
    </PageFrame>
  )
}
