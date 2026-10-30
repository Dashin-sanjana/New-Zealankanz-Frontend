import { useEffect, useState } from 'react'
import { AdminSimplePage } from '../../../components/admin/admin-simple-page'
import { adPlacementOptions } from '../../../data/marketplace'
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
import type { AdminItem, AdminUser, Banner, CategoryOption, LocationOption } from '../../../types/marketplace'

function useAdminItems<Item>(loader: () => Promise<Item[]>) {
  const [items, setItems] = useState<Item[]>([])
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'info' | 'success' | 'error'>('info')

  function load() {
    loader()
      .then((result) => {
        setItems(result)
        setMessage('')
      })
      .catch((error: unknown) => {
        setMessageType('error')
        setMessage(error instanceof Error ? error.message : 'Could not load configuration.')
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
  const rows: AdminItem[] = items.flatMap((item: CategoryOption) => [
    { ...item, label: `${item.name}${item.children.length ? `: ${item.children.map((child) => typeof child === 'string' ? child : child.name).join(', ')}` : ''}` },
    ...item.children.map((child) => typeof child === 'string'
      ? { id: undefined, name: child, label: `${item.name} / ${child}` }
      : { ...child, label: `${item.name} / ${child.name}` }),
  ])

  async function addCategory() {
    const name = window.prompt('Category name')
    if (!name) return
    await createCategory({ name }).then(() => { setSuccess('Category added.'); load() }).catch((error) => setError(error.message))
  }

  async function editCategory(item: AdminItem) {
    const name = window.prompt('Category name', item.name)
    if (!name || !item.id) return
    await updateCategory(item.id, { name }).then(() => { setSuccess('Category updated.'); load() }).catch((error) => setError(error.message))
  }

  return (
    <>
      {message && <Alert type={messageType} message={message} onRetry={messageType === 'error' ? load : undefined} />}
      <AdminSimplePage
        title="Categories"
        subtitle="Manage parent and child category structure."
        items={rows}
        onAdd={addCategory}
        onEdit={editCategory}
        onDisable={(item) => item.id && deleteCategory(item.id).then(() => { setSuccess('Category deleted.'); load() }).catch((error) => setError(error instanceof Error ? error.message : 'Could not delete category.'))}
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
      {message && <Alert type={messageType} message={message} onRetry={messageType === 'error' ? load : undefined} />}
      <AdminSimplePage
        title="Locations"
        subtitle="Manage city and region filters."
        items={items.map((item) => ({ ...item, label: item.name }))}
        onAdd={addLocation}
        onEdit={(item: AdminItem) => {
          const name = window.prompt('Location name', item.name)
          if (name && item.id) updateLocation(item.id, { name }).then(() => { setSuccess('Location updated.'); load() }).catch((error) => setError(error instanceof Error ? error.message : 'Could not update location.'))
        }}
        onDisable={(item) => item.id && deleteLocation(item.id).then(() => { setSuccess('Location deleted.'); load() }).catch((error) => setError(error instanceof Error ? error.message : 'Could not delete location.'))}
      />
    </>
  )
}

export function AdminBannersPage() {
  usePageTitle('Admin Banners')
  const { items, message, messageType, setSuccess, setError, load } = useAdminItems(getAdminBanners)

  async function addBanner() {
    const title = window.prompt('Banner title')
    const sponsor = title ? window.prompt('Advertiser name (optional)') || '' : ''
    const description = title ? window.prompt('Short banner description (optional)') || '' : ''
    const imageUrl = title ? window.prompt('Image URL') : ''
    const placement = imageUrl
      ? window.prompt(`Placement key\n\n${adPlacementOptions.map(([key, label]) => `${key} - ${label}`).join('\n')}`, 'HOME')
      : ''
    if (!title || !imageUrl || !placement) return
    await createBanner({ title, sponsor, description, imageUrl, placement, active: true }).then(() => { setSuccess('Banner added.'); load() }).catch((error) => setError(error.message))
  }

  return (
    <>
      {message && <Alert type={messageType} message={message} onRetry={messageType === 'error' ? load : undefined} />}
      <AdminSimplePage
        title="Banners"
        subtitle="Manage advertising placements across the website."
        items={items.map((item) => ({ ...item, label: `${item.placement}: ${item.title}` }))}
        onAdd={addBanner}
        onEdit={(item: AdminItem) => {
          const title = window.prompt('Banner title', item.title)
          const sponsor = title ? window.prompt('Advertiser name (optional)', item.sponsor || '') || '' : ''
          const description = title ? window.prompt('Short banner description (optional)', item.description || '') || '' : ''
          const placement = title ? window.prompt('Placement key', item.placement || 'HOME') : ''
          if (title && placement && item.id) updateBanner(item.id, { ...item, title, sponsor, description, placement, imageUrl: item.imageUrl || '' }).then(() => { setSuccess('Banner updated.'); load() }).catch((error) => setError(error instanceof Error ? error.message : 'Could not update banner.'))
        }}
        onDisable={(item) => item.id && deleteBanner(item.id).then(() => { setSuccess('Banner deleted.'); load() }).catch((error) => setError(error instanceof Error ? error.message : 'Could not delete banner.'))}
      />
    </>
  )
}

export function AdminUsersPage() {
  usePageTitle('Admin Users')
  const { items, message, messageType, setSuccess, setError, load } = useAdminItems(getAdminUsers)
  return (
    <>
      {message && <Alert type={messageType} message={message} onRetry={messageType === 'error' ? load : undefined} />}
      <AdminSimplePage
        title="Users"
        subtitle="Manage account status and roles."
        items={items.map((item) => ({ ...item, label: `${item.email} - ${item.role} - ${item.active ? 'Active' : 'Disabled'}` }))}
        onEdit={(item: AdminItem) => {
          const action = item.active ? deactivateUser : activateUser
          if (item.id) action(item.id).then(() => { setSuccess('User updated.'); load() }).catch((error) => setError(error instanceof Error ? error.message : 'Could not update user.'))
        }}
      />
    </>
  )
}
