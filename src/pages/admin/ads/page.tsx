import { useEffect, useState } from 'react'
import { AdminListPage } from '../../../components/admin/admin-list-page'
import { AdminEditAdModal } from '../../../components/admin/admin-edit-ad-modal'
import { Alert } from '../../../components/ui/feedback'
import { usePageTitle } from '../../../hooks/use-page-title'
import type { MarketplaceAd } from '../../../services/ads.service'
import {
  approveAd,
  deleteAdminAd,
  expireAd,
  featureAd,
  getAdminAds,
  getPendingAds,
  rejectAd,
} from '../../../services/admin.service'

function useAdminRows(loader: () => Promise<MarketplaceAd[]>) {
  const [rows, setRows] = useState<MarketplaceAd[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'info' | 'success' | 'error'>('info')
  const [editingAd, setEditingAd] = useState<MarketplaceAd | null>(null)

  function load() {
    setLoading(true)
    loader()
      .then((items) => {
        setRows(items)
        setMessage('')
      })
      .catch((error: unknown) => {
        setMessageType('error')
        setMessage(error instanceof Error ? error.message : 'Could not load listings.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function handleAction(action: string, row: MarketplaceAd) {
    if (action === 'Edit') {
      setEditingAd(row)
      return
    }
    try {
      if (action === 'Approve') await approveAd(row.id)
      if (action === 'Reject') await rejectAd(row.id, 'Rejected by admin.')
      if (action === 'Feature') await featureAd(row.id)
      if (action === 'Expire') await expireAd(row.id)
      if (action === 'Delete') await deleteAdminAd(row.id)
      setMessageType('success')
      setMessage(`${action} completed.`)
      load()
    } catch (error) {
      setMessageType('error')
      setMessage(error instanceof Error ? error.message : `${action} failed.`)
    }
  }

  function handleEditSaved() {
    setEditingAd(null)
    setMessageType('success')
    setMessage('Ad updated successfully.')
    load()
  }

  return { rows, loading, message, messageType, handleAction, editingAd, setEditingAd, handleEditSaved, load }
}

export function AdminPendingAdsPage() {
  usePageTitle('Pending Ads')
  const { rows, loading, message, messageType, handleAction, editingAd, setEditingAd, handleEditSaved, load } = useAdminRows(getPendingAds)

  return (
    <>
      {message && <Alert type={messageType} message={message} onRetry={messageType === 'error' ? load : undefined} />}
      <AdminListPage
        title="Pending ads"
        subtitle="No listing goes public until admin approval."
        rows={rows}
        loading={loading}
        error={messageType === 'error' && Boolean(message)}
        actions={['Approve', 'Reject', 'Edit', 'Feature']}
        onAction={handleAction}
      />
      {editingAd && (
        <AdminEditAdModal
          ad={editingAd}
          onClose={() => setEditingAd(null)}
          onSaved={handleEditSaved}
        />
      )}
    </>
  )
}

export function AdminAllAdsPage() {
  usePageTitle('All Ads')
  const { rows, loading, message, messageType, handleAction, editingAd, setEditingAd, handleEditSaved, load } = useAdminRows(getAdminAds)

  return (
    <>
      {message && <Alert type={messageType} message={message} onRetry={messageType === 'error' ? load : undefined} />}
      <AdminListPage
        title="All ads"
        subtitle="Inspect listings across all moderation states."
        rows={rows}
        loading={loading}
        error={messageType === 'error' && Boolean(message)}
        actions={['Edit', 'Feature', 'Expire', 'Delete']}
        onAction={handleAction}
      />
      {editingAd && (
        <AdminEditAdModal
          ad={editingAd}
          onClose={() => setEditingAd(null)}
          onSaved={handleEditSaved}
        />
      )}
    </>
  )
}
