import { useEffect, useState } from 'react'
import { AdminSimplePage } from '../../../components/admin/admin-simple-page'
import { Alert } from '../../../components/ui/feedback'
import { usePageTitle } from '../../../hooks/use-page-title'
import {
  activateUser,
  createBanner,
  createCategory,
  createLocation,
  deactivateUser,
  deleteBanner,
  deleteCategory,
  deleteLocation,
  getAdminBanners,
  getAdminUsers,
  updateBanner,
  updateCategory,
  updateLocation,
} from '../../../services/admin.service'
import { getCategories, getLocations } from '../../../services/marketplace.service'

function useAdminItems(loader) {
  const [items, setItems] = useState([])
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'info' | 'success' | 'error'>('info')

  function load() {
    loader()
      .then((result) => {
        setItems(result)
        setMessage('')
      })
      .catch((error) => {
        setMessageType('error')
        setMessage(error.message)
      })
  }

  useEffect(load, [])

  function setSuccess(msg: string) {
    setMessageType('success')
    setMessage(msg)
  }

  function setError(msg: string) {
    setMessageType('error')
    setMessage(msg)
  }

  return { items, message, messageType, setSuccess, setError, load }
}

export function AdminCategoriesPage() {
  usePageTitle('Admin Categories')
  const { items, message, messageType, setSuccess, setError, load } = useAdminItems(getCategories)
  const rows = items.flatMap((item) => [
    { ...item, label: `${item.name}${item.children.length ? `: ${item.children.map((child) => child.name || child).join(', ')}` : ''}` },
    ...item.children.map((child) => ({ ...child, label: `${item.name} / ${child.name || child}` })),
  ])

  async function addCategory() {
    const name = window.prompt('Category name')
    if (!name) return
    await createCategory({ name }).then(() => { setSuccess('Category added.'); load() }).catch((error) => setError(error.message))
  }

  async function editCategory(item) {
    const name = window.prompt('Category name', item.name)
    if (!name) return
    await updateCategory(item.id, { name }).then(() => { setSuccess('Category updated.'); load() }).catch((error) => setError(error.message))
  }

  return (
    <>
      {message && <Alert type={messageType} message={message} />}
      <AdminSimplePage
        title="Categories"
        subtitle="Manage parent and child category structure."
        items={rows}
        onAdd={addCategory}
        onEdit={editCategory}
        onDisable={(item) => deleteCategory(item.id).then(() => { setSuccess('Category deleted.'); load() }).catch((error) => setError(error.message))}
      />
    </>
  )
}

export function AdminLocationsPage() {
  usePageTitle('Admin Locations')
  const { items, message, messageType, setSuccess, setError, load } = useAdminItems(getLocations)

  async function addLocation() {
    const name = window.prompt('Location name')
    if (!name) return
    await createLocation({ name }).then(() => { setSuccess('Location added.'); load() }).catch((error) => setError(error.message))
  }

  return (
    <>
      {message && <Alert type={messageType} message={message} />}
      <AdminSimplePage
        title="Locations"
        subtitle="Manage city and region filters."
        items={items.map((item) => ({ ...item, label: item.name }))}
        onAdd={addLocation}
        onEdit={(item) => {
          const name = window.prompt('Location name', item.name)
          if (name) updateLocation(item.id, { name }).then(() => { setSuccess('Location updated.'); load() }).catch((error) => setError(error.message))
        }}
        onDisable={(item) => deleteLocation(item.id).then(() => { setSuccess('Location deleted.'); load() }).catch((error) => setError(error.message))}
      />
    </>
  )
}

export function AdminBannersPage() {
  usePageTitle('Admin Banners')
  const { items, message, messageType, setSuccess, setError, load } = useAdminItems(getAdminBanners)

  async function addBanner() {
    const title = window.prompt('Banner title')
    const imageUrl = title ? window.prompt('Image URL') : ''
    if (!title || !imageUrl) return
    await createBanner({ title, imageUrl, placement: 'HOME', active: true }).then(() => { setSuccess('Banner added.'); load() }).catch((error) => setError(error.message))
  }

  return (
    <>
      {message && <Alert type={messageType} message={message} />}
      <AdminSimplePage
        title="Banners"
        subtitle="Manage advertising placements across the website."
        items={items.map((item) => ({ ...item, label: `${item.placement}: ${item.title}` }))}
        onAdd={addBanner}
        onEdit={(item) => {
          const title = window.prompt('Banner title', item.title)
          if (title) updateBanner(item.id, { ...item, title }).then(() => { setSuccess('Banner updated.'); load() }).catch((error) => setError(error.message))
        }}
        onDisable={(item) => deleteBanner(item.id).then(() => { setSuccess('Banner deleted.'); load() }).catch((error) => setError(error.message))}
      />
    </>
  )
}

export function AdminUsersPage() {
  usePageTitle('Admin Users')
  const { items, message, messageType, setSuccess, setError, load } = useAdminItems(getAdminUsers)
  return (
    <>
      {message && <Alert type={messageType} message={message} />}
      <AdminSimplePage
        title="Users"
        subtitle="Manage account status and roles."
        items={items.map((item) => ({ ...item, label: `${item.email} - ${item.role} - ${item.active ? 'Active' : 'Disabled'}` }))}
        onEdit={(item) => {
          const action = item.active ? deactivateUser : activateUser
          action(item.id).then(() => { setSuccess('User updated.'); load() }).catch((error) => setError(error.message))
        }}
      />
    </>
  )
}
