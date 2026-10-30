import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { categories, locations } from '../../data/marketplace'
import { navigate } from '../../lib/navigation'
import { slugify } from '../../lib/slugify'
import { getCategories, getLocations } from '../../services/marketplace.service'
import type { CategoryOption, CategoryField, LocationOption } from '../../types/marketplace'
import { getAdsPage, type MarketplaceAd } from '../../services/ads.service'
import { Alert } from '../ui/feedback'

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
  preserveKeyword?: boolean
  defaultAttributes?: string
}

const RECENT_SEARCHES_KEY = 'nzk-recent-searches'
function readAttributeFilters(serialized: string): Record<string, string> {
  try {
    const parsed: unknown = JSON.parse(serialized)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    return Object.entries(parsed).reduce<Record<string, string>>((result, [key, value]) => {
      if (typeof value === 'string' || typeof value === 'number') result[key] = String(value)
      else if (value && typeof value === 'object' && !Array.isArray(value)) {
        const range = value as Record<string, unknown>
        if (typeof range.min === 'number') result[`${key}:min`] = String(range.min)
        if (typeof range.max === 'number') result[`${key}:max`] = String(range.max)
      }
      return result
    }, {})
  } catch { return {} }
}

const readRecentSearches = () => {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]')
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string').slice(0, 5) : []
  } catch { return [] }
}
const getHistoryKeyword = () => {
  const state = window.history.state
  return state && typeof state.searchKeyword === 'string' ? state.searchKeyword : ''
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
  preserveKeyword = false,
  defaultAttributes = '{}',
}: SearchBarProps) {
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>(categories)
  const [locationOptions, setLocationOptions] = useState<LocationOption[]>(locations)
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory)
  const [selectedSubcategory, setSelectedSubcategory] = useState(defaultSubcategory)
  const [selectedLocation, setSelectedLocation] = useState(defaultLocation)
  const [keyword, setKeyword] = useState(() => defaultKeyword || (preserveKeyword ? getHistoryKeyword() : ''))
  const [suggestions, setSuggestions] = useState<MarketplaceAd[]>([])
  const [suggestionsStatus, setSuggestionsStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [recentSearches, setRecentSearches] = useState<string[]>(readRecentSearches)
  const [suggestionsOpen, setSuggestionsOpen] = useState(false)
  const [activeSuggestion, setActiveSuggestion] = useState(-1)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const filtersDialogRef = useRef<HTMLDialogElement>(null)
  const filtersTriggerRef = useRef<HTMLButtonElement>(null)
  const restoreFilterFocus = useRef(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [minPrice, setMinPrice] = useState(defaultMinPrice)
  const [maxPrice, setMaxPrice] = useState(defaultMaxPrice)
  const [sort, setSort] = useState(defaultSort)
  const [optionsError, setOptionsError] = useState('')
  const [optionsRetry, setOptionsRetry] = useState(0)
  const [attributes, setAttributes] = useState<Record<string, string>>(() => readAttributeFilters(defaultAttributes))
  const selectedCategoryFields: CategoryField[] = categoryOptions.find((item) => item.slug === selectedCategory)?.fields?.filter((field) => field.filterable) || []
  const activeFilterCount = useMemo(() => [
    !fixedCategory && selectedCategory,
    selectedSubcategory,
    selectedLocation,
    minPrice,
    maxPrice,
    sort,
    ...Object.values(attributes).filter(Boolean),
  ].filter(Boolean).length, [attributes, fixedCategory, maxPrice, minPrice, selectedCategory, selectedLocation, selectedSubcategory, sort])

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

  useEffect(() => setAttributes(readAttributeFilters(defaultAttributes)), [defaultAttributes])

  useEffect(() => {
    setMinPrice(defaultMinPrice)
    setMaxPrice(defaultMaxPrice)
    setSort(defaultSort)
  }, [defaultMinPrice, defaultMaxPrice, defaultSort])

  useEffect(() => {
    const dialog = filtersDialogRef.current
    if (!dialog) return
    if (filtersOpen && !dialog.open) {
      restoreFilterFocus.current = true
      const oldOverflow = document.body.style.overflow
      dialog.showModal()
      document.body.style.overflow = 'hidden'
      return () => {
        if (dialog.open) dialog.close()
        document.body.style.overflow = oldOverflow
      }
    }
    if (!filtersOpen && dialog.open) dialog.close()
    if (!filtersOpen && restoreFilterFocus.current) {
      restoreFilterFocus.current = false
      filtersTriggerRef.current?.focus()
    }
    return undefined
  }, [filtersOpen])

  useEffect(() => setKeyword(defaultKeyword || (preserveKeyword ? getHistoryKeyword() : '')), [defaultKeyword, preserveKeyword])

  useEffect(() => {
    const term = keyword.trim()
    if (term.length < 2) { setSuggestions([]); setSuggestionsStatus('idle'); return }
    let active = true
    const timer = window.setTimeout(() => {
      setSuggestionsStatus('loading')
      getAdsPage({ keyword: term, category: selectedCategory || undefined, location: selectedLocation || undefined, page: 1, limit: 6 })
        .then((result) => { if (active) { setSuggestions(result.ads); setSuggestionsStatus('ready') } })
        .catch(() => { if (active) { setSuggestions([]); setSuggestionsStatus('error') } })
    }, 250)
    return () => { active = false; window.clearTimeout(timer) }
  }, [keyword, selectedCategory, selectedLocation])

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!suggestionsRef.current?.contains(event.target as Node)) setSuggestionsOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    return () => document.removeEventListener('mousedown', closeOnOutsideClick)
  }, [])

  function rememberSearch(term: string) {
    const normalized = term.trim()
    if (!normalized) return
    const next = [normalized, ...recentSearches.filter((item) => item.toLowerCase() !== normalized.toLowerCase())].slice(0, 5)
    setRecentSearches(next)
    try { localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next)) } catch { /* search still works without storage */ }
  }

  function persistKeyword(term: string) {
    if (!preserveKeyword) return
    const state = window.history.state && typeof window.history.state === 'object' ? window.history.state as Record<string, unknown> : {}
    window.history.replaceState({ ...state, searchKeyword: term }, '', window.location.href)
  }

  function cancelFilterChanges() {
    setSelectedCategory(defaultCategory)
    setSelectedSubcategory(defaultSubcategory)
    setSelectedLocation(defaultLocation)
    setMinPrice(defaultMinPrice)
    setMaxPrice(defaultMaxPrice)
    setSort(defaultSort)
    setAttributes(readAttributeFilters(defaultAttributes))
    setFiltersOpen(false)
  }

  function selectSuggestion(ad: MarketplaceAd) {
    setSuggestionsOpen(false)
    navigate(`/ads/${ad.slug}`)
  }

  function handleSuggestionKeys(event: KeyboardEvent<HTMLInputElement>) {
    const options: Array<{ title: string; slug?: string }> = keyword.trim().length >= 2
      ? suggestions
      : recentSearches.map((title) => ({ title }))
    if (event.key === 'ArrowDown' && options.length) { event.preventDefault(); setSuggestionsOpen(true); setActiveSuggestion((index) => (index + 1) % options.length) }
    if (event.key === 'ArrowUp' && options.length) { event.preventDefault(); setActiveSuggestion((index) => (index <= 0 ? options.length - 1 : index - 1)) }
    if (event.key === 'Escape') { setSuggestionsOpen(false); setActiveSuggestion(-1) }
    if (event.key === 'Enter' && suggestionsOpen && activeSuggestion >= 0 && options[activeSuggestion]) {
      event.preventDefault()
      const selected = options[activeSuggestion]
      if (selected.slug) { setSuggestionsOpen(false); navigate(`/ads/${selected.slug}`) }
      else { setKeyword(selected.title); persistKeyword(selected.title); setSuggestionsOpen(false) }
    }
  }

  return (
    <form
      className={`search-bar${fixedCategory ? ' search-bar-fixed-category' : ''}${simple ? ' search-bar-simple' : ''}`}
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const params = new URLSearchParams()
        if (keyword.trim()) params.set('q', keyword.trim())
        if (selectedCategory) params.set('category', selectedCategory)
        if (selectedSubcategory) params.set('subcategory', selectedSubcategory)
        if (selectedLocation) params.set('location', selectedLocation)
        if (minPrice) params.set('minPrice', minPrice)
        if (maxPrice) params.set('maxPrice', maxPrice)
        if (sort) params.set('sort', sort)
        const activeAttributes: Record<string, string | { min?: number; max?: number }> = {}
        for (const field of selectedCategoryFields) {
          const value = attributes[field.key]?.trim()
          const min = attributes[`${field.key}:min`]?.trim()
          const max = attributes[`${field.key}:max`]?.trim()
          if (value) activeAttributes[field.key] = value
          else if (min || max) activeAttributes[field.key] = { ...(min ? { min: Number(min) } : {}), ...(max ? { max: Number(max) } : {}) }
        }
        if (Object.keys(activeAttributes).length) params.set('attributes', JSON.stringify(activeAttributes))
        rememberSearch(keyword)
        setSuggestionsOpen(false)
        setFiltersOpen(false)
        if (filtersDialogRef.current?.open) filtersDialogRef.current.close()
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
          <div className="search-autocomplete" ref={suggestionsRef}>
            <input id="sb-q" name="q" value={keyword} autoComplete="off" placeholder="Search listings, e.g. Toyota, 2-bed flat…"
              role="combobox" aria-autocomplete="list" aria-expanded={suggestionsOpen}
              aria-controls="sb-suggestions" aria-activedescendant={activeSuggestion >= 0 ? `sb-option-${activeSuggestion}` : undefined}
              onFocus={() => setSuggestionsOpen(true)} onChange={(event) => { setKeyword(event.target.value); persistKeyword(event.target.value); setSuggestions([]); setSuggestionsStatus('idle'); setActiveSuggestion(-1); setSuggestionsOpen(true) }} onKeyDown={handleSuggestionKeys} />
            {keyword && <button className="search-clear" type="button" aria-label="Clear search" onClick={() => { setKeyword(''); persistKeyword(''); setSuggestions([]); setSuggestionsStatus('idle'); setSuggestionsOpen(true) }}>×</button>}
            {suggestionsOpen && (suggestions.length > 0 || suggestionsStatus === 'loading' || suggestionsStatus === 'ready' || suggestionsStatus === 'error' || (!keyword.trim() && recentSearches.length > 0)) && (
              <div className="search-suggestions">
                {!keyword.trim() && recentSearches.length > 0 && <div className="search-suggestion-heading">Recent searches <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => { setRecentSearches([]); try { localStorage.removeItem(RECENT_SEARCHES_KEY) } catch { /* optional */ } }}>Clear</button></div>}
                <div id="sb-suggestions" role="listbox" aria-label={keyword.trim() ? 'Matching listings' : 'Recent searches'}>
                {suggestions.length ? suggestions.map((ad, index) => (
                  <button key={ad.id} id={`sb-option-${index}`} type="button" role="option" aria-selected={index === activeSuggestion} onMouseDown={(event) => event.preventDefault()} onClick={() => selectSuggestion(ad)}>
                    <span>{ad.title}</span><small>{ad.price} · {ad.location}</small>
                  </button>
                )) : !keyword.trim() ? recentSearches.map((term, index) => <button key={term} id={`sb-option-${index}`} type="button" role="option" aria-selected={index === activeSuggestion} onMouseDown={(event) => event.preventDefault()} onClick={() => { setKeyword(term); persistKeyword(term); setSuggestionsOpen(false) }}>{term}</button>)
                  : suggestionsStatus === 'loading' ? <div className="search-suggestion-message" role="status">Looking for matching listings…</div>
                  : suggestionsStatus === 'error' ? <div className="search-suggestion-message" role="status">Live suggestions are temporarily unavailable. You can still run this search.</div>
                  : <div className="search-suggestion-message" role="status">No matching listings yet. Press Search to see other results.</div>}
                </div>
              </div>
            )}
          </div>
        </div>

        {!simple && !showAdvancedFilters && !fixedCategory && (
          <div className="search-field">
            <label htmlFor="sb-category" className="search-label">Category</label>
            <select id="sb-category" value={selectedCategory} onChange={(event) => { setSelectedCategory(event.target.value); setSelectedSubcategory('') }}>
              <option value="">All categories</option>{categoryOptions.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}
            </select>
          </div>
        )}

        {!simple && !showAdvancedFilters && (
          <div className="search-field">
            <label htmlFor="sb-location" className="search-label">Location</label>
            <select id="sb-location" value={selectedLocation} onChange={(event) => setSelectedLocation(event.target.value)}>
              <option value="">All NZ cities</option>{locationOptions.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}
            </select>
          </div>
        )}

        {!simple && showAdvancedFilters && <button ref={filtersTriggerRef} className="filter-trigger" type="button" aria-haspopup="dialog" aria-expanded={filtersOpen} onClick={() => setFiltersOpen(true)}>
          Filters{activeFilterCount > 0 && <span className="filter-count" aria-label={`${activeFilterCount} active filters`}>{activeFilterCount}</span>}
        </button>}

        <button className="primary-button search-submit" type="submit">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          Search
        </button>
      </div>

      {showAdvancedFilters && (
        <dialog ref={filtersDialogRef} className="filter-dialog" aria-labelledby="filter-dialog-title" onCancel={(event) => { event.preventDefault(); cancelFilterChanges() }} onClick={(event) => { if (event.target === event.currentTarget) cancelFilterChanges() }}>
          <section className="filter-drawer">
            <header className="filter-drawer-header"><div><p className="eyebrow">Refine your search</p><h2 id="filter-dialog-title">Filters</h2></div><button className="filter-drawer-close" type="button" autoFocus onClick={cancelFilterChanges}>Close</button></header>
            <div className="search-row-filters">
            <div className="search-field">
              <label htmlFor="sb-category" className="search-label">Category</label>
              {fixedCategory ? <input id="sb-category" value={categoryOptions.find((item) => item.slug === selectedCategory)?.name || selectedCategory} readOnly aria-readonly="true" /> : (
                <select id="sb-category" value={selectedCategory} onChange={(event) => { setSelectedCategory(event.target.value); setSelectedSubcategory('') }}>
                  <option value="">All categories</option>{categoryOptions.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}
                </select>
              )}
            </div>
            <div className="search-field">
              <label htmlFor="sb-location" className="search-label">Location</label>
              <select id="sb-location" value={selectedLocation} onChange={(event) => setSelectedLocation(event.target.value)}>
                <option value="">All NZ cities</option>{locationOptions.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}
              </select>
            </div>
            <div className="search-field">
              <label htmlFor="sb-subcategory" className="search-label">Subcategory</label>
              <select id="sb-subcategory" value={selectedSubcategory} onChange={(event) => setSelectedSubcategory(event.target.value)}>
                <option value="">All subcategories</option>
                {getSubcategoryOptions(categoryOptions, selectedCategory).map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </div>
            {selectedCategoryFields.map((field) => (
              <div className="search-field" key={field.key}>
                <label htmlFor={`sb-attr-${field.key}`} className="search-label">{field.label}{field.unit ? ` (${field.unit})` : ''}</label>
                {field.type === 'select' ? (
                  <select id={`sb-attr-${field.key}`} value={attributes[field.key] || ''} onChange={(event) => setAttributes((current) => ({ ...current, [field.key]: event.target.value }))}>
                    <option value="">Any</option>{field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                ) : field.type === 'number' ? (
                  <span className="attribute-range">
                    <input id={`sb-attr-${field.key}-min`} type="number" min={field.min} max={field.max} value={attributes[`${field.key}:min`] || ''} onChange={(event) => setAttributes((current) => ({ ...current, [`${field.key}:min`]: event.target.value }))} placeholder="Min" aria-label={`${field.label} minimum`} />
                    <input id={`sb-attr-${field.key}-max`} type="number" min={field.min} max={field.max} value={attributes[`${field.key}:max`] || ''} onChange={(event) => setAttributes((current) => ({ ...current, [`${field.key}:max`]: event.target.value }))} placeholder="Max" aria-label={`${field.label} maximum`} />
                  </span>
                ) : (
                  <input id={`sb-attr-${field.key}`} type="text" value={attributes[field.key] || ''} onChange={(event) => setAttributes((current) => ({ ...current, [field.key]: event.target.value }))} placeholder="Any" />
                )}
              </div>
            ))}
            <div className="search-field">
              <label htmlFor="sb-min" className="search-label">Minimum price (NZD)</label>
              <input id="sb-min" type="number" min="0" max={maxPrice || undefined} inputMode="numeric" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} placeholder="No minimum" />
            </div>

            <div className="search-field">
              <label htmlFor="sb-max" className="search-label">Maximum price (NZD)</label>
              <input id="sb-max" type="number" min={minPrice || 0} inputMode="numeric" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} placeholder="No maximum" />
            </div>

            <div className="search-field">
              <label htmlFor="sb-sort" className="search-label">Sort by</label>
              <select id="sb-sort" value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="">Newest first</option>
                <option value="price_asc">Price: low → high</option>
                <option value="price_desc">Price: high → low</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>
          </div>
            <footer className="filter-drawer-actions">
              <button className="text-button" type="button" onClick={() => {
                setSelectedCategory(fixedCategory ? defaultCategory : '')
                setSelectedSubcategory(''); setSelectedLocation(''); setMinPrice(''); setMaxPrice(''); setSort(''); setAttributes({})
                const params = new URLSearchParams()
                if (keyword.trim()) params.set('q', keyword.trim())
                setFiltersOpen(false)
                navigate(params.toString() ? `${actionPath}?${params.toString()}` : actionPath)
              }}>Clear all</button>
              <button className="ghost-button" type="button" onClick={cancelFilterChanges}>Cancel</button>
              <button className="primary-button" type="submit">Apply filters</button>
            </footer>
          </section>
        </dialog>
      )}
      {optionsError && <Alert type="info" message={optionsError} onRetry={() => setOptionsRetry((value) => value + 1)} compact />}
    </form>
  )
}
