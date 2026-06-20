import { useEffect, useMemo, useState } from 'react'
import { saveAd } from '../../services/ads.service'
import { getCategories, getLocations } from '../../services/marketplace.service'
import { Alert } from '../ui/feedback'
import { Input, Select } from './fields'

const maxUploadBytes = 5_000_000
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

function buildCategoryOptions(items) {
  return items.flatMap((category) => [
    { value: category.id, label: category.name },
    ...(category.children || []).map((child) => ({
      value: child.id || child,
      label: `${category.name} / ${child.name || child}`,
    })),
  ])
}

export function AdForm({ mode, ad }) {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [categories, setCategories] = useState([])
  const [locations, setLocations] = useState([])
  const [previews, setPreviews] = useState([])

  useEffect(() => {
    getCategories().then(setCategories).catch((err) => setError(err.message))
    getLocations().then(setLocations).catch((err) => setError(err.message))
  }, [])

  const categoryOptions = useMemo(() => buildCategoryOptions(categories), [categories])
  const locationOptions = locations.map((item) => ({ value: item.id, label: item.name }))

  function handleImages(event) {
    const files = Array.from(event.target.files || [])
    const invalidFile = files.find((file) => !allowedTypes.includes(file.type) || file.size > maxUploadBytes)
    if (invalidFile) {
      setError('Images must be JPEG, PNG, WebP, or GIF and 5 MB or smaller.')
      event.target.value = ''
      setPreviews([])
      return
    }
    setError('')
    setPreviews(files.map((file) => ({ name: file.name, url: URL.createObjectURL(file) })))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    const form = event.currentTarget
    const formData = new FormData(form)
    try {
      await saveAd(formData, mode, ad?.id || ad?.slug)
    } catch (err) {
      setSubmitting(false)
      setError(err instanceof Error ? err.message : 'Could not save this ad. Please try again.')
      return
    }

    setSubmitting(false)
    setSubmitted(true)
    form.reset()
    setPreviews([])
  }

  return (
    <>
      {submitted && (
        <Alert
          type="success"
          message={mode === 'edit' ? 'Ad saved and moved to Pending Approval.' : 'Ad submitted for admin approval.'}
        />
      )}
      {error && <Alert type="info" message={error} />}
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <Input label="Title" name="title" defaultValue={ad?.title} required />
          <Input label="Price" name="price" defaultValue={ad?.price ? String(ad.price).replace(/[^0-9.]/g, '') : ''} inputMode="decimal" />
          <Select label="Category" name="categoryId" options={categoryOptions} defaultValue={ad?.categoryId || ''} required />
          <Select label="Location" name="locationId" options={locationOptions} defaultValue={ad?.locationId || ''} required />
          <Input label="Contact name" name="contactName" defaultValue={ad?.contactName} />
          <Input label="Contact email" name="contactEmail" type="email" defaultValue={ad?.contactEmail} required />
        </div>
        <label>
          Description
          <textarea name="description" rows="6" required defaultValue={ad?.description} placeholder="Describe the item, role, property, or service." />
        </label>
        <label>
          Images
          <input name="images" type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImages} />
          <span className="hint">Upload multiple listing images. The backend validates file type and size.</span>
        </label>
        {previews.length > 0 && (
          <div className="preview-strip">
            {previews.map((preview) => (
              <img key={preview.url} src={preview.url} alt={preview.name} />
            ))}
          </div>
        )}
        <button className="primary-button" type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : mode === 'edit' ? 'Save and submit for approval' : 'Submit ad for approval'}
        </button>
      </form>
    </>
  )
}
