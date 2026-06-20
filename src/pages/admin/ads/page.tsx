import { useEffect, useState } from 'react'
import { AdminListPage } from '../../../components/admin/admin-list-page'
import { Alert } from '../../../components/ui/feedback'
import { usePageTitle } from '../../../hooks/use-page-title'
import {
  approveAd,
  deleteAdminAd,
  expireAd,
  featureAd,
  getAdminAds,
  getPendingAds,
  rejectAd,
} from '../../../services/admin.service'

function useAdminRows(loader) {
  const [rows, setRows] = useState([])
  const [message, setMessage] = useState('')

  function load() {
    loader()
      .then((items) => {
        setRows(items)
        setMessage('')
      })
      .catch((error) => setMessage(error.message))
  }

  useEffect(load, [])

  async function handleAction(action, row) {
    try {
      if (action === 'Approve') await approveAd(row.id)
      if (action === 'Reject') await rejectAd(row.id, 'Rejected by admin.')
      if (action === 'Feature') await featureAd(row.id)
      if (action === 'Expire') await expireAd(row.id)
      if (action === 'Delete') await deleteAdminAd(row.id)
      setMessage(`${action} completed.`)
      load()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : `${action} failed.`)
    }
  }

  return { rows, message, handleAction }
}

export function AdminPendingAdsPage() {
  usePageTitle('Pending Ads')
  const { rows, message, handleAction } = useAdminRows(getPendingAds)

  return (
    <>
      {message && <Alert type="info" message={message} />}
      <AdminListPage
        title="Pending ads"
        subtitle="No listing goes public until admin approval."
        rows={rows}
        actions={['Approve', 'Reject', 'Feature']}
        onAction={handleAction}
      />
    </>
  )
}

export function AdminAllAdsPage() {
  usePageTitle('All Ads')
  const { rows, message, handleAction } = useAdminRows(getAdminAds)
  return (
    <>
      {message && <Alert type="info" message={message} />}
      <AdminListPage
        title="All ads"
        subtitle="Inspect listings across all moderation states."
        rows={rows}
        actions={['Feature', 'Expire', 'Delete']}
        onAction={handleAction}
      />
    </>
  )
}
