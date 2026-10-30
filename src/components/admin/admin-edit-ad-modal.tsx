import { useEffect, useMemo, useState } from 'react'
import { Alert } from '../ui/feedback'
import { Input, Select } from '../forms/fields'
import { getCategories, getLocations } from '../../services/marketplace.service'
import { adminUpdateAd } from '../../services/admin.service'
import type { MarketplaceAd } from '../../services/ads.service'
import type { CategoryOption, LocationOption, SelectOption } from '../../types/marketplace'
import type { FormEvent } from 'react'

function buildCategoryOptions(items: CategoryOption[]): SelectOption[] {
  return items.flatMap((category) => [
    { value: category.id, label: category.name },
    ...(category.children || []).map((child) => typeof child === 'string'
      ? { value: child, label: `${category.name} / ${child}` }
      : { value: child.id, label: `${category.name} / ${child.name}` }),
  ])
}

interface AdminEditAdModalProps {
  ad: MarketplaceAd
  onClose: () => void
  onSaved: () => void
}

export function AdminEditAdModal({ ad, onClose, onSaved }: AdminEditAdModalProps) {
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [locations, setLocations] = useState<LocationOption[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [optionsError, setOptionsError] = useState('')
  const [optionsLoading, setOptionsLoading] = useState(true)
  const [optionsRetry, setOptionsRetry] = useState(0)

  useEffect(() => {
    let active = true
    setOptionsLoading(true)
    Promise.allSettled([getCategories(), getLocations()]).then(([categoryResult, locationResult]) => {
      if (!active) return
      if (categoryResult.status === 'fulfilled') setCategories(categoryResult.value)
      if (locationResult.status === 'fulfilled') setLocations(locationResult.value)
      const categoriesLoaded = categoryResult.status === 'fulfilled' ? categoryResult.value : []
      const locationsLoaded = locationResult.status === 'fulfilled' ? locationResult.value : []
      setOptionsError(!categoriesLoaded.length || !locationsLoaded.length
        ? 'Category or location choices couldn’t be loaded. Retry before saving.'
        : '')
      setOptionsLoading(false)
    })
    return () => { active = false }
  }, [optionsRetry])

  const categoryOptions = useMemo(() => buildCategoryOptions(categories), [categories])
  const locationOptions = locations.map((item) => ({ value: item.id, label: item.name }))

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError('')
    const form = new FormData(event.currentTarget)
    const payload = {
      title: String(form.get('title') || ''),
      price: String(form.get('price') || '').replace(/[^0-9.]/g, '') || undefined,
      categoryId: String(form.get('categoryId') || ''),
      locationId: String(form.get('locationId') || ''),
      contactName: String(form.get('contactName') || ''),
      contactEmail: String(form.get('contactEmail') || ''),
      description: String(form.get('description') || ''),
    }
    try {
      await adminUpdateAd(ad.id, payload)
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save changes.')
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
        {optionsError && <Alert type="error" message={optionsError} onRetry={() => setOptionsRetry((value) => value + 1)} />}
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
            <button type="submit" className="primary-button" disabled={saving || optionsLoading || !categoryOptions.length || !locationOptions.length}>
              {saving ? 'Saving…' : optionsLoading ? 'Loading choices…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
