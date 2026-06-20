import { useEffect, useState } from 'react'
import { AdminListPage } from '../../../components/admin/admin-list-page'
import { AdminEditAdModal } from '../../../components/admin/admin-edit-ad-modal'
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
  const [messageType, setMessageType] = useState<'info' | 'success' | 'error'>('info')
  const [editingAd, setEditingAd] = useState(null)

  function load() {
    loader()
      .then((items) => {
        setRows(items)
        setMessage('')
      })
      .catch((error) => {
        setMessageType('error')
        setMessage(error.message)
      })
  }

  useEffect(load, [])

  async function handleAction(action, row) {
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

  return { rows, message, messageType, handleAction, editingAd, setEditingAd, handleEditSaved }
}

export function AdminPendingAdsPage() {
  usePageTitle('Pending Ads')
  const { rows, message, messageType, handleAction, editingAd, setEditingAd, handleEditSaved } = useAdminRows(getPendingAds)

  return (
    <>
      {message && <Alert type={messageType} message={message} />}
      <AdminListPage
        title="Pending ads"
        subtitle="No listing goes public until admin approval."
        rows={rows}
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
  const { rows, message, messageType, handleAction, editingAd, setEditingAd, handleEditSaved } = useAdminRows(getAdminAds)

  return (
    <>
      {message && <Alert type={messageType} message={message} />}
      <AdminListPage
        title="All ads"
        subtitle="Inspect listings across all moderation states."
        rows={rows}
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
