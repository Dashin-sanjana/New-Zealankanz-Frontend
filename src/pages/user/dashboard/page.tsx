import { useEffect, useState } from 'react'
import { DashboardCard } from '../../../components/user/dashboard-card'
import { Alert } from '../../../components/ui/feedback'
import { PageFrame } from '../../../components/ui/page-frame'
import { usePageTitle } from '../../../hooks/use-page-title'
import { getMyAds } from '../../../services/ads.service'
import { getNotifications } from '../../../services/user.service'

export default function UserDashboardPage({ auth }) {
  usePageTitle('Dashboard')
  const [ads, setAds] = useState([])
  const [notifications, setNotifications] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    Promise.all([getMyAds(), getNotifications()])
      .then(([adItems, notificationItems]) => {
        setAds(adItems)
        setNotifications(notificationItems)
        setMessage('')
      })
      .catch((error) => setMessage(error.message))
  }, [])

  const pendingCount = ads.filter((ad) => ad.status === 'PENDING').length
  const unreadCount = notifications.filter((item) => !item.readAt).length

  return (
    <PageFrame title={`Welcome, ${auth.user?.name || 'User'}`} subtitle="Manage your ads and account activity.">
      {message && <Alert type="info" message={message} />}
      <div className="dashboard-grid">
        <DashboardCard title="My Ads" value={ads.length} text="View, edit, or delete your submitted ads." to="/my-ads" />
        <DashboardCard title="Pending Review" value={pendingCount} text="Listings waiting for admin approval." to="/my-ads" />
        <DashboardCard title="Post New Ad" value="+" text="Create a listing with category, city, and images." to="/post-ad" />
        <DashboardCard title="Notifications" value={unreadCount} text="Unread account and listing updates." to="/dashboard" />
      </div>
    </PageFrame>
  )
}
