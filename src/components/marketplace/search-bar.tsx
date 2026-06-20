import { useEffect, useState } from 'react'
import { categories, locations } from '../../data/marketplace'
import { navigate } from '../../lib/navigation'
import { getCategories, getLocations } from '../../services/marketplace.service'

function getSubcategoryOptions(items) {
  return items.flatMap((category) =>
    (category.children || []).map((child) => ({
      value: child.slug || child,
      label: `${category.name} / ${child.name || child}`,
    })),
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
}) {
  const [categoryOptions, setCategoryOptions] = useState(categories)
  const [locationOptions, setLocationOptions] = useState(locations)

  useEffect(() => {
    getCategories().then(setCategoryOptions).catch(() => setCategoryOptions([]))
    getLocations().then(setLocationOptions).catch(() => setLocationOptions([]))
  }, [])

  return (
    <form
      className="search-bar"
      onSubmit={(event) => {
        event.preventDefault()
        const form = new FormData(event.currentTarget)
        const params = new URLSearchParams()
        for (const [key, value] of form.entries()) {
          if (value) params.set(key, value)
        }
        navigate(`/search?${params.toString()}`)
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

        <div className="search-field">
          <label htmlFor="sb-category" className="search-label">Category</label>
          <select id="sb-category" name="category" defaultValue={defaultCategory}>
            <option value="">All categories</option>
            {categoryOptions.map((item) => (
              <option key={item.id} value={item.slug}>{item.name}</option>
            ))}
          </select>
        </div>

        <div className="search-field">
          <label htmlFor="sb-location" className="search-label">Location</label>
          <select id="sb-location" name="location" defaultValue={defaultLocation}>
            <option value="">All NZ cities</option>
            {locationOptions.map((item) => (
              <option key={item.id} value={item.slug}>{item.name}</option>
            ))}
          </select>
        </div>

        <button className="primary-button search-submit" type="submit">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          Search
        </button>
      </div>

      {/* Row 2 — filters */}
      <div className="search-row-filters">
        <div className="search-field">
          <label htmlFor="sb-subcategory" className="search-label">Subcategory</label>
          <select id="sb-subcategory" name="subcategory" defaultValue={defaultSubcategory}>
            <option value="">All subcategories</option>
            {getSubcategoryOptions(categoryOptions).map((item) => (
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
    </form>
  )
}
