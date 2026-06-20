import { useEffect, useMemo, useState } from 'react'
import { Alert } from '../ui/feedback'
import { Input, Select } from '../forms/fields'
import { getCategories, getLocations } from '../../services/marketplace.service'
import { adminUpdateAd } from '../../services/admin.service'

function buildCategoryOptions(items) {
  return items.flatMap((category) => [
    { value: category.id, label: category.name },
    ...(category.children || []).map((child) => ({
      value: child.id || child,
      label: `${category.name} / ${child.name || child}`,
    })),
  ])
}

export function AdminEditAdModal({ ad, onClose, onSaved }) {
  const [categories, setCategories] = useState([])
  const [locations, setLocations] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {})
    getLocations().then(setLocations).catch(() => {})
  }, [])

  const categoryOptions = useMemo(() => buildCategoryOptions(categories), [categories])
  const locationOptions = locations.map((item) => ({ value: item.id, label: item.name }))

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    const form = new FormData(event.currentTarget)
    const payload = {
      title: form.get('title'),
      price: String(form.get('price') || '').replace(/[^0-9.]/g, '') || undefined,
      categoryId: form.get('categoryId'),
      locationId: form.get('locationId'),
      contactName: form.get('contactName'),
      contactEmail: form.get('contactEmail'),
      description: form.get('description'),
    }
    try {
      await adminUpdateAd(ad.id, payload)
      onSaved()
    } catch (err: any) {
      setError(err.message || 'Could not save changes.')
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Edit ad">
      <div className="modal-box">
        <div className="modal-header">
          <h2>Edit ad</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <p className="modal-subtitle">
          Admin edits do not change the approval status.
        </p>
        {error && <Alert type="error" message={error} />}
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <Input label="Title" name="title" defaultValue={ad.title} required />
            <Input
              label="Price"
              name="price"
              defaultValue={ad.price ? String(ad.price).replace(/[^0-9.]/g, '') : ''}
              inputMode="decimal"
            />
            <Select
              label="Category"
              name="categoryId"
              options={categoryOptions}
              defaultValue={ad.categoryId || ''}
              required
            />
            <Select
              label="Location"
              name="locationId"
              options={locationOptions}
              defaultValue={ad.locationId || ''}
              required
            />
            <Input label="Contact name" name="contactName" defaultValue={ad.contactName} />
            <Input label="Contact email" name="contactEmail" type="email" defaultValue={ad.contactEmail} required />
          </div>
          <label>
            Description
            <textarea name="description" rows={6} required defaultValue={ad.description} />
          </label>
          <div className="modal-actions">
            <button type="button" className="ghost-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary-button" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
