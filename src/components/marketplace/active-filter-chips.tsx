import { navigate } from '../../lib/navigation'

const labels: Record<string, string> = {
  q: 'Search', keyword: 'Search', category: 'Category', subcategory: 'Subcategory', location: 'Location',
  minPrice: 'Min price', maxPrice: 'Max price', sort: 'Sort', attributes: 'Details',
}

export function ActiveFilterChips({ path, query }: { path: string; query: URLSearchParams }) {
  const filters = Array.from(query.entries()).filter(([key, value]) => key !== 'page' && Boolean(value))
  if (!filters.length) return null

  function change(remove: string) {
    const next = new URLSearchParams(query)
    next.delete(remove)
    if (remove === 'category') next.delete('subcategory')
    next.delete('page')
    const search = next.toString()
    navigate(search ? `${path}?${search}` : path)
  }

  return <div className="active-filter-chips" aria-label="Active filters">
    {filters.map(([key, value]) => <button type="button" className="filter-chip" key={key} onClick={() => change(key)} aria-label={`Remove ${labels[key] || key} filter`}>
      {labels[key] || key}: {key === 'attributes' ? 'Selected' : value} <span aria-hidden="true">×</span>
    </button>)}
    <button type="button" className="text-button clear-filters" onClick={() => navigate(path)}>Clear all</button>
  </div>
}
