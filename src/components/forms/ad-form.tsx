import { useEffect, useMemo, useRef, useState } from 'react'
import { navigate } from '../../lib/navigation'
import { saveAd } from '../../services/ads.service'
import { getCategories, getLocations } from '../../services/marketplace.service'
import { Alert } from '../ui/feedback'
import { Input, Select } from './fields'
import type { ChangeEvent, FormEvent } from 'react'
import type { MarketplaceAd } from '../../services/ads.service'
import type { CategoryOption, LocationOption, SelectOption } from '../../types/marketplace'

const maxUploadBytes = 5_000_000
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

interface FilePreview { name: string; url: string }

function buildCategoryOptions(items: CategoryOption[]): SelectOption[] {
  return items.flatMap((category) => [
    { value: category.id, label: category.name },
    ...(category.children || []).map((child) => typeof child === 'string'
      ? { value: child, label: `${category.name} / ${child}` }
      : { value: child.id, label: `${category.name} / ${child.name}` }),
  ])
}

interface AdFormProps {
  mode: 'create' | 'edit'
  ad?: MarketplaceAd | null
}

export function AdForm({ mode, ad }: AdFormProps) {
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [locations, setLocations] = useState<LocationOption[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState(ad?.categoryId || '')
  const [selectedLocationId, setSelectedLocationId] = useState(ad?.locationId || '')
  const [optionsError, setOptionsError] = useState('')
  const [optionsLoading, setOptionsLoading] = useState(true)
  const [optionsRetry, setOptionsRetry] = useState(0)
  const [previews, setPreviews] = useState<FilePreview[]>([])
  const submittingRef = useRef(false)

  useEffect(() => () => previews.forEach(({ url }) => URL.revokeObjectURL(url)), [previews])

  useEffect(() => {
    setSelectedCategoryId(ad?.categoryId || '')
    setSelectedLocationId(ad?.locationId || '')
  }, [ad?.id, ad?.categoryId, ad?.locationId])

  useEffect(() => {
    let active = true
    setOptionsLoading(true)
    setOptionsError('')
    Promise.allSettled([getCategories(), getLocations()]).then(([categoryResult, locationResult]) => {
      if (!active) return
      if (categoryResult.status === 'fulfilled') setCategories(categoryResult.value)
      if (locationResult.status === 'fulfilled') setLocations(locationResult.value)
      if (categoryResult.status === 'rejected' || locationResult.status === 'rejected') {
        setOptionsError('Category or location choices couldn’t be loaded. Retry before submitting your ad.')
      } else if (!categoryResult.value.length || !locationResult.value.length) {
        setOptionsError('Category or location choices are currently unavailable. Please try again shortly.')
      }
      setOptionsLoading(false)
    })
    return () => { active = false }
  }, [optionsRetry])

  const categoryOptions = useMemo(() => buildCategoryOptions(categories), [categories])
  const locationOptions = locations.map((item) => ({ value: item.id, label: item.name }))

  function handleImages(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.currentTarget.files || [])
    if (files.length > 10) {
      setError('Choose up to 10 images.')
      event.currentTarget.value = ''
      return
    }
    const invalidFile = files.find((file) => !allowedTypes.includes(file.type) || file.size > maxUploadBytes)
    if (invalidFile) {
      setError('Images must be JPEG, PNG, WebP, or GIF and 5 MB or smaller.')
      event.currentTarget.value = ''
      setPreviews([])
      return
    }
    setError('')
    setPreviews(files.map((file) => ({ name: file.name, url: URL.createObjectURL(file) })))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submittingRef.current || optionsLoading || optionsError) return
    submittingRef.current = true
    setError('')
    setSubmitting(true)

    const form = event.currentTarget
    const formData = new FormData(form)
    try {
      await saveAd(formData, mode, ad?.id || ad?.slug)
    } catch (err) {
      submittingRef.current = false
      setSubmitting(false)
      setError(err instanceof Error ? err.message : 'Could not save this ad. Please try again.')
      return
    }

    navigate('/my-ads?submitted=1')
  }

  return (
    <>
      {optionsError && <Alert type="error" message={optionsError} onRetry={() => setOptionsRetry((value) => value + 1)} />}
      {error && <Alert type="error" message={error} />}
      <form className="form-card" onSubmit={handleSubmit}>
        <section className="ad-form-section" aria-labelledby="ad-form-location-heading">
          <div className="ad-form-section-heading">
            <span>1</span>
            <div><h2 id="ad-form-location-heading">Choose a category and location</h2><p>Help buyers find your ad in the right place.</p></div>
          </div>
          <div className="form-grid">
          <Select label="Category" name="categoryId" options={categoryOptions} value={selectedCategoryId} onChange={(event) => setSelectedCategoryId(event.target.value)} required />
          <Select label="Location" name="locationId" options={locationOptions} value={selectedLocationId} onChange={(event) => setSelectedLocationId(event.target.value)} required />
          </div>
        </section>
        <section className="ad-form-section" aria-labelledby="ad-form-details-heading">
          <div className="ad-form-section-heading">
            <span>2</span>
            <div><h2 id="ad-form-details-heading">Add listing details</h2><p>Describe what you’re offering and how to contact you.</p></div>
          </div>
          <div className="form-grid">
          <Input label="Title" name="title" defaultValue={ad?.title} required />
          <Input label="Price" name="price" defaultValue={ad?.price ? String(ad.price).replace(/[^0-9.]/g, '') : ''} inputMode="decimal" />
          <Input label="Contact name" name="contactName" defaultValue={ad?.contactName} />
          <Input label="Contact email" name="contactEmail" type="email" defaultValue={ad?.contactEmail} required />
          <Input label="Contact phone (optional)" name="contactPhone" type="tel" autoComplete="tel" defaultValue={ad?.contactPhone} />
          </div>
          <label className="ad-form-description">
            Description
            <textarea name="description" rows={6} required defaultValue={ad?.description} placeholder="Describe the item, role, property, or service." />
          </label>
        </section>
        <section className="ad-form-section" aria-labelledby="ad-form-photos-heading">
          <div className="ad-form-section-heading">
            <span>3</span>
            <div><h2 id="ad-form-photos-heading">Add photos</h2><p>Clear photos help buyers understand your listing.</p></div>
          </div>
          {mode === 'edit' && Boolean(ad?.images?.length) && (
            <div className="preview-strip" aria-label="Current listing photos">
              {ad?.images?.map((image, index) => (
                <img key={`${image.url}-${index}`} src={image.url} alt={`${ad.title}, current photo ${index + 1}`} />
              ))}
              <p className="hint">Current photos stay on the listing. New uploads are added after them.</p>
            </div>
          )}
          <label>
            Photos
            <input name="images" type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImages} />
            <span className="hint">Upload up to 10 JPEG, PNG, WebP, or GIF images, 5 MB each. Existing photos are kept when editing.</span>
          </label>
        </section>
        {previews.length > 0 && (
          <div className="preview-strip">
            {previews.map((preview) => (
              <img key={preview.url} src={preview.url} alt={preview.name} />
            ))}
          </div>
        )}
        <button className="primary-button" type="submit" disabled={submitting || optionsLoading || !categoryOptions.length || !locationOptions.length}>
          {submitting ? 'Saving...' : optionsLoading ? 'Loading choices…' : mode === 'edit' ? 'Save and submit for approval' : 'Submit ad for approval'}
        </button>
      </form>
    </>
  )
}
