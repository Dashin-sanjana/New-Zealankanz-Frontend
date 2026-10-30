import { useEffect, useState } from 'react'
import { DashboardCard } from '../../../components/user/dashboard-card'
import { Alert } from '../../../components/ui/feedback'
import { Link } from '../../../components/ui/link'
import { PageFrame } from '../../../components/ui/page-frame'
import { usePageTitle } from '../../../hooks/use-page-title'
import { getMyAds } from '../../../services/ads.service'
import { getNotifications, markNotificationRead } from '../../../services/user.service'
import { resendVerification } from '../../../services/auth.service'
import { getSellerEnquiries } from '../../../services/contact.service'
import type { AuthState } from '../../../types/auth'
import type { MarketplaceAd } from '../../../services/ads.service'
import type { NotificationItem } from '../../../services/user.service'
import type { SellerEnquiry } from '../../../services/contact.service'

export default function UserDashboardPage({ auth }: { auth: AuthState }) {
  usePageTitle('Dashboard')
  const isDemoMode = import.meta.env.MODE === 'demo' && import.meta.env.VITE_DEMO_MODE === 'true'
  const [ads, setAds] = useState<MarketplaceAd[]>([])
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [enquiries, setEnquiries] = useState<SellerEnquiry[]>([])
  const [enquiryError, setEnquiryError] = useState('')
  const [enquiriesLoading, setEnquiriesLoading] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [retry, setRetry] = useState(0)
  const [resendStatus, setResendStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [resending, setResending] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    Promise.all([getMyAds(), getNotifications()])
      .then(([adItems, notificationItems]) => {
        if (active) {
          setAds(adItems)
          setNotifications(notificationItems)
        }
      })
      .catch((err) => { if (active) setError(err.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [retry])

  useEffect(() => {
    let active = true
    setEnquiriesLoading(true)
    setEnquiryError('')
    getSellerEnquiries()
      .then((items) => { if (active) setEnquiries(items) })
      .catch((err) => { if (active) setEnquiryError(err instanceof Error ? err.message : 'Seller enquiries could not be loaded.') })
      .finally(() => { if (active) setEnquiriesLoading(false) })
    return () => { active = false }
  }, [retry])

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

  async function handleMarkRead(id: string) {
    try {
      await markNotificationRead(id)
      setNotifications((items) => items.map((item) => item.id === id
        ? { ...item, readAt: new Date().toISOString() }
        : item))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update this notification.')
    }
  }

  return (
    <PageFrame title={`Welcome, ${auth.user?.name || 'User'}`} subtitle="Manage your ads and account activity.">
      {error && <Alert type="error" message={error} onRetry={() => setRetry((value) => value + 1)} />}
      {loading && <p role="status">Loading your account overview…</p>}

      {!auth.user?.emailVerified && (
        <div className="alert warning" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', padding: '16px 20px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }}>
          <div>
            <strong>Email not verified:</strong> {isDemoMode ? 'Email delivery is disabled in this demo. Registration verifies accounts locally.' : 'Please verify your email to unlock all features.'}
          </div>
          {!isDemoMode && <button
            className="secondary-button"
            onClick={handleResend}
            disabled={resending}
            style={{ fontSize: '13px', padding: '8px 16px', border: '1px solid currentColor', background: 'transparent', cursor: 'pointer', borderRadius: '4px' }}
          >
            {resending ? 'Sending...' : 'Resend link'}
          </button>}
        </div>
      )}

      {resendStatus && (
        <div style={{ marginBottom: '24px' }}>
          <Alert type={resendStatus.type} message={resendStatus.message} />
        </div>
      )}

      {!error && !loading && <div className="dashboard-grid">
        <DashboardCard title="My Ads" value={ads.length} text="View, edit, or delete your submitted ads." to="/my-ads" />
        <DashboardCard title="Pending Review" value={pendingCount} text="Listings waiting for admin approval." to="/my-ads" />
        <DashboardCard title="Post New Ad" value="+" text="Create a listing with category, city, and images." to="/post-ad" />
        <DashboardCard title="Notifications" value={unreadCount} text="Unread account and listing updates." to="/dashboard" />
        <DashboardCard title="Watchlist" value="Saved" text="View listings you have saved." to="/watchlist" />
        <DashboardCard title="Settings" value="Account" text="Update your name or change your password." to="/settings" />
      </div>}
      {!loading && notifications.length > 0 && (
        <section aria-labelledby="recent-notifications-heading">
          <h2 id="recent-notifications-heading">Recent notifications</h2>
          <div className="table-card">
            {notifications.map((item) => (
              <div className="table-row" key={item.id}>
                <div>
                  <strong>{item.title || 'Marketplace update'}</strong>
                  <span>{item.message || 'There is an update to your account.'}</span>
                  {item.createdAt && <time dateTime={item.createdAt}>{new Intl.DateTimeFormat('en-NZ', { dateStyle: 'medium' }).format(new Date(item.createdAt))}</time>}
                </div>
                {item.readAt
                  ? <span className="status approved">Read</span>
                  : <button className="ghost-button" type="button" onClick={() => handleMarkRead(item.id)}>Mark read</button>}
              </div>
            ))}
          </div>
        </section>
      )}
      <section id="seller-enquiries" aria-labelledby="seller-enquiries-heading">
        <h2 id="seller-enquiries-heading">Listing enquiries</h2>
        {enquiryError && <Alert type="error" message={enquiryError} onRetry={() => setRetry((value) => value + 1)} />}
        {enquiriesLoading && <p role="status">Loading listing enquiries…</p>}
        {!enquiriesLoading && !enquiryError && enquiries.length === 0 && <p>No listing enquiries yet.</p>}
        {!enquiriesLoading && enquiries.length > 0 && (
          <div className="table-card">
            {enquiries.map((item) => (
              <article className="table-row" key={item.id}>
                <div>
                  <strong>{item.ad?.title || item.subject}</strong>
                  <span>From {item.name} · <a href={`mailto:${item.email}`}>{item.email}</a></span>
                  <p>{item.message}</p>
                  {item.createdAt && <time dateTime={item.createdAt}>{new Intl.DateTimeFormat('en-NZ', { dateStyle: 'medium' }).format(new Date(item.createdAt))}</time>}
                </div>
                {item.ad?.slug && <Link className="ghost-button" to={`/ads/${item.ad.slug}`}>View listing</Link>}
              </article>
            ))}
          </div>
        )}
      </section>
    </PageFrame>
  )
}
