import { useEffect, useState, type FormEvent } from 'react'
import { categories, locations } from '../../data/marketplace'
import { navigate } from '../../lib/navigation'
import { slugify } from '../../lib/slugify'
import { getCategories, getLocations } from '../../services/marketplace.service'
import type { CategoryField, CategoryOption, LocationOption } from '../../types/marketplace'

interface DesktopFilterSidebarProps {
  query: URLSearchParams
  actionPath: string
  fixedCategory?: string
  initialLocation?: string
}

function readAttributes(value: string): Record<string, string> {
  try {
    const parsed: unknown = JSON.parse(value)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    return Object.entries(parsed).reduce<Record<string, string>>((result, [key, entry]) => {
      if (typeof entry === 'string' || typeof entry === 'number') result[key] = String(entry)
      else if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
        const range = entry as Record<string, unknown>
        if (typeof range.min === 'number') result[`${key}:min`] = String(range.min)
        if (typeof range.max === 'number') result[`${key}:max`] = String(range.max)
      }
      return result
    }, {})
  } catch { return {} }
}

function subcategories(items: CategoryOption[], category: string) {
  return items.filter((item) => item.slug === category).flatMap((item) => item.children.map((child) => {
    const name = typeof child === 'string' ? child : child.name
    const value = typeof child === 'string' ? slugify(child) : child.slug || slugify(name)
    return { value, label: name }
  }))
}

function filterAttributes(fields: CategoryField[], values: Record<string, string>) {
  const result: Record<string, string | { min?: number; max?: number }> = {}
  fields.forEach((field) => {
    const value = values[field.key]?.trim()
    const min = values[`${field.key}:min`]?.trim()
    const max = values[`${field.key}:max`]?.trim()
    if (value) result[field.key] = value
    else if (min || max) result[field.key] = { ...(min ? { min: Number(min) } : {}), ...(max ? { max: Number(max) } : {}) }
  })
  return result
}

export function DesktopFilterSidebar({ query, actionPath, fixedCategory = '', initialLocation = '' }: DesktopFilterSidebarProps) {
  const queryKey = query.toString()
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>(categories as CategoryOption[])
  const [locationOptions, setLocationOptions] = useState<LocationOption[]>(locations)
  const [category, setCategory] = useState(fixedCategory || query.get('category') || '')
  const [subcategory, setSubcategory] = useState(query.get('subcategory') || '')
  const [location, setLocation] = useState(query.get('location') || initialLocation)
  const [minPrice, setMinPrice] = useState(query.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(query.get('maxPrice') || '')
  const [sort, setSort] = useState(query.get('sort') || '')
  const [attributes, setAttributes] = useState(() => readAttributes(query.get('attributes') || ''))
  const selectedFields = categoryOptions.find((item) => item.slug === category)?.fields?.filter((field) => field.filterable) || []

  useEffect(() => {
    getCategories().then((items) => { if (items.length) setCategoryOptions(items) }).catch(() => {})
    getLocations().then((items) => { if (items.length) setLocationOptions(items) }).catch(() => {})
  }, [])

  useEffect(() => {
    setCategory(fixedCategory || query.get('category') || '')
    setSubcategory(query.get('subcategory') || '')
    setLocation(query.get('location') || initialLocation)
    setMinPrice(query.get('minPrice') || '')
    setMaxPrice(query.get('maxPrice') || '')
    setSort(query.get('sort') || '')
    setAttributes(readAttributes(query.get('attributes') || ''))
  }, [queryKey, fixedCategory, initialLocation])

  const activeCount = [!fixedCategory && category, subcategory, location && !initialLocation, minPrice, maxPrice, sort, ...Object.values(attributes).filter(Boolean)].filter(Boolean).length
  const categoryFields = filterAttributes(selectedFields, attributes)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const params = new URLSearchParams(query)
    ;['page', 'category', 'subcategory', 'location', 'minPrice', 'maxPrice', 'sort', 'attributes'].forEach((key) => params.delete(key))
    if (!fixedCategory && category) params.set('category', category)
    if (subcategory) params.set('subcategory', subcategory)
    if (location) params.set('location', location)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (sort) params.set('sort', sort)
    if (Object.keys(categoryFields).length) params.set('attributes', JSON.stringify(categoryFields))
    const search = params.toString()
    navigate(search ? `${actionPath}?${search}` : actionPath)
  }

  function clearAll() {
    const params = new URLSearchParams()
    const keyword = query.get('q') || query.get('keyword')
    if (keyword) params.set('q', keyword)
    const search = params.toString()
    navigate(search ? `${actionPath}?${search}` : actionPath)
  }

  return (
    <aside className="desktop-filter-sidebar" aria-labelledby="desktop-filter-title">
      <form onSubmit={submit}>
        <div className="desktop-filter-heading">
          <h2 id="desktop-filter-title">Filters</h2>
          {activeCount > 0 && <span aria-label={`${activeCount} active filters`}>{activeCount}</span>}
        </div>
        {!fixedCategory && <label>Category<select value={category} onChange={(event) => { setCategory(event.target.value); setSubcategory(''); setAttributes({}) }}><option value="">All categories</option>{categoryOptions.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}</select></label>}
        <label>Subcategory<select value={subcategory} onChange={(event) => setSubcategory(event.target.value)}><option value="">All subcategories</option>{subcategories(categoryOptions, category).map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
        <label>Location<select value={location} onChange={(event) => setLocation(event.target.value)}><option value="">All NZ cities</option>{locationOptions.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}</select></label>
        {selectedFields.map((field) => <label key={field.key}>{field.label}{field.unit ? ` (${field.unit})` : ''}{field.type === 'select' ? <select value={attributes[field.key] || ''} onChange={(event) => setAttributes((current) => ({ ...current, [field.key]: event.target.value }))}><option value="">Any</option>{field.options?.map((option) => <option key={option}>{option}</option>)}</select> : field.type === 'number' ? <span className="desktop-filter-range"><input type="number" aria-label={`${field.label} minimum`} placeholder="Min" value={attributes[`${field.key}:min`] || ''} onChange={(event) => setAttributes((current) => ({ ...current, [`${field.key}:min`]: event.target.value }))}/><input type="number" aria-label={`${field.label} maximum`} placeholder="Max" value={attributes[`${field.key}:max`] || ''} onChange={(event) => setAttributes((current) => ({ ...current, [`${field.key}:max`]: event.target.value }))}/></span> : <input type="text" value={attributes[field.key] || ''} onChange={(event) => setAttributes((current) => ({ ...current, [field.key]: event.target.value }))}/>}</label>)}
        <div className="desktop-filter-price"><label>Minimum price (NZD)<input type="number" min="0" max={maxPrice || undefined} value={minPrice} placeholder="No minimum" onChange={(event) => setMinPrice(event.target.value)}/></label><label>Maximum price (NZD)<input type="number" min={minPrice || 0} value={maxPrice} placeholder="No maximum" onChange={(event) => setMaxPrice(event.target.value)}/></label></div>
        <label>Sort by<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="">Newest first</option><option value="price_asc">Price: low → high</option><option value="price_desc">Price: high → low</option><option value="oldest">Oldest first</option></select></label>
        <div className="desktop-filter-actions"><button type="button" className="text-button" onClick={clearAll}>Clear all</button><button type="submit" className="primary-button">Apply</button></div>
      </form>
    </aside>
  )
}
