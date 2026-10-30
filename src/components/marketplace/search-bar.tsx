import { useEffect, useState, type FormEvent } from 'react'
import { categories, locations } from '../../data/marketplace'
import { navigate } from '../../lib/navigation'
import { slugify } from '../../lib/slugify'
import { getCategories, getLocations } from '../../services/marketplace.service'
import { Alert } from '../ui/feedback'

interface CategoryOption {
  id: string
  name: string
  slug: string
  children?: Array<string | { id?: string; name: string; slug?: string }>
}

interface LocationOption {
  id: string
  name: string
  slug: string
}

interface SearchBarProps {
  defaultKeyword?: string
  defaultCategory?: string
  defaultSubcategory?: string
  defaultLocation?: string
  defaultMinPrice?: string
  defaultMaxPrice?: string
  defaultSort?: string
  actionPath?: string
  fixedCategory?: boolean
  showAdvancedFilters?: boolean
  simple?: boolean
}

function getSubcategoryOptions(items: CategoryOption[], categorySlug = '') {
  return items
    .filter((category) => !categorySlug || category.slug === categorySlug)
    .flatMap((category) =>
      (category.children || []).map((child) => {
        const label = typeof child === 'string' ? child : child.name
        const value = typeof child === 'string' ? slugify(child) : child.slug || slugify(label)
        return { value, label: `${category.name} / ${label}` }
      }),
    )
}

export function SearchBar({
  defaultKeyword = '',
  defaultCategory = '',
  defaultSubcategory = '',
  defaultLocation = '',
  defaultMinPrice = '',
  defaultMaxPrice = '',
  defaultSort = '',
  actionPath = '/search',
  fixedCategory = false,
  showAdvancedFilters = true,
  simple = false,
}: SearchBarProps) {
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>(categories)
  const [locationOptions, setLocationOptions] = useState<LocationOption[]>(locations)
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory)
  const [selectedSubcategory, setSelectedSubcategory] = useState(defaultSubcategory)
  const [selectedLocation, setSelectedLocation] = useState(defaultLocation)
  const [optionsError, setOptionsError] = useState('')
  const [optionsRetry, setOptionsRetry] = useState(0)

  useEffect(() => {
    let active = true
    Promise.allSettled([getCategories(), getLocations()]).then(([categoryResult, locationResult]) => {
      if (!active) return
      if (categoryResult.status === 'fulfilled') setCategoryOptions(categoryResult.value)
      if (locationResult.status === 'fulfilled') setLocationOptions(locationResult.value)
      setOptionsError(categoryResult.status === 'rejected' || locationResult.status === 'rejected'
        ? 'Some search options couldn’t be refreshed. You can retry while using the available options.'
        : '')
    })
    return () => { active = false }
  }, [optionsRetry])

  useEffect(() => {
    setSelectedCategory(defaultCategory)
    setSelectedSubcategory(defaultSubcategory)
    setSelectedLocation(defaultLocation)
  }, [defaultCategory, defaultSubcategory, defaultLocation])

  return (
    <form
      className={`search-bar${fixedCategory ? ' search-bar-fixed-category' : ''}${simple ? ' search-bar-simple' : ''}`}
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const form = new FormData(event.currentTarget)
        const params = new URLSearchParams()
        for (const [key, value] of form.entries()) {
          if (value) params.set(key, String(value))
        }
        navigate(`${actionPath}?${params.toString()}`)
      }}
    >
      {/* Row 1 — primary search */}
      <div className="search-row-primary">
        <div className="search-field search-field-keyword">
          <label htmlFor="sb-q" className="search-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            What are you looking for?
          </label>
          <input id="sb-q" name="q" defaultValue={defaultKeyword} placeholder="Search listings, e.g. Toyota, 2-bed flat…" />
        </div>

        {simple ? null : fixedCategory ? (
          <input type="hidden" name="category" defaultValue={defaultCategory} />
        ) : (
          <div className="search-field">
            <label htmlFor="sb-category" className="search-label">Category</label>
            <select id="sb-category" name="category" value={selectedCategory} onChange={(event) => {
              setSelectedCategory(event.target.value)
              setSelectedSubcategory('')
            }}>
              <option value="">All categories</option>
              {categoryOptions.map((item) => (
                <option key={item.id} value={item.slug}>{item.name}</option>
              ))}
            </select>
          </div>
        )}

        {!simple && (
          <div className="search-field">
            <label htmlFor="sb-location" className="search-label">Location</label>
            <select id="sb-location" name="location" value={selectedLocation} onChange={(event) => setSelectedLocation(event.target.value)}>
              <option value="">All NZ cities</option>
              {locationOptions.map((item) => (
                <option key={item.id} value={item.slug}>{item.name}</option>
              ))}
            </select>
          </div>
        )}

        <button className="primary-button search-submit" type="submit">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          Search
        </button>
      </div>

      {showAdvancedFilters && (
        <details className="search-advanced" open={Boolean(defaultSubcategory || defaultMinPrice || defaultMaxPrice || defaultSort)}>
          <summary>Advanced filters</summary>
          <div className="search-row-filters">
            <div className="search-field">
              <label htmlFor="sb-subcategory" className="search-label">Subcategory</label>
              <select id="sb-subcategory" name="subcategory" value={selectedSubcategory} onChange={(event) => setSelectedSubcategory(event.target.value)}>
                <option value="">All subcategories</option>
                {getSubcategoryOptions(categoryOptions, selectedCategory).map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </div>

            <div className="search-field">
              <label htmlFor="sb-min" className="search-label">Min price ($)</label>
              <input id="sb-min" name="minPrice" type="number" min="0" defaultValue={defaultMinPrice} placeholder="No minimum" />
            </div>

            <div className="search-field">
              <label htmlFor="sb-max" className="search-label">Max price ($)</label>
              <input id="sb-max" name="maxPrice" type="number" min="0" defaultValue={defaultMaxPrice} placeholder="No maximum" />
            </div>

            <div className="search-field">
              <label htmlFor="sb-sort" className="search-label">Sort by</label>
              <select id="sb-sort" name="sort" defaultValue={defaultSort}>
                <option value="">Newest first</option>
                <option value="price_asc">Price: low → high</option>
                <option value="price_desc">Price: high → low</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>
          </div>
        </details>
      )}
      {optionsError && <Alert type="info" message={optionsError} onRetry={() => setOptionsRetry((value) => value + 1)} compact />}
    </form>
  )
}
