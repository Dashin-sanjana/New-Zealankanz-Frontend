import { useEffect, useState } from 'react'
import { categories } from '../../data/marketplace'
import { getCategories } from '../../services/marketplace.service'
import { Link } from '../ui/link'

interface CategoryMetaItem {
  description: string
}

const categoryMeta: Partial<Record<string, CategoryMetaItem>> = {
  property: { description: 'Homes, rentals and flatmates across NZ' },
  motor: { description: 'Cars, bikes, parts and accessories' },
  jobs: { description: 'Local roles and flexible work' },
  services: { description: 'Trades, repairs and local help' },
}

const iconPaths: Record<string, string> = {
  property: 'M3 10.5 12 3l9 7.5M5.5 9v11h13V9M9 20v-6h6v6',
  motor: 'M4 15h16l-1.5-5h-13L4 15Zm1.5-5 1-3h11l1 3M4 15v3h2v-2h12v2h2v-3M7 13h.01M17 13h.01',
  jobs: 'M3 8h18v12H3zM8 8V5h8v3M3 12h18M10 12v2h4v-2',
  services: 'm14.7 6.3 3 3M4 20l5.5-5.5m-2-2 5.2-5.2a4 4 0 0 0 5.5 5.5L12 19a3 3 0 0 1-4.5-4.5Z',
}

function CategoryIcon({ slug }: { slug: string }) {
  return (
    <svg className="category-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={iconPaths[slug] || 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z'} />
    </svg>
  )
}

interface Category {
  id: string
  name: string
  slug: string
  children?: Array<string | { id?: string; name: string }>
}

export function CategoryGrid() {
  const [items, setItems] = useState<Category[]>(categories)

  useEffect(() => {
    let active = true
    getCategories()
      .then((result) => { if (active) setItems(result.length ? result : categories) })
      .catch(() => {})
    return () => { active = false }
  }, [])

  return (
    <div className="category-grid">
      {items.map((category) => (
        <Link
          className="category-card"
          key={category.id}
          to={`/category/${category.slug}`}
        >
          <div className="category-card-bg" aria-hidden="true" />
          <span className="category-card-top">
            <CategoryIcon slug={category.slug} />
          </span>
          <strong>{category.name}</strong>
          {category.children?.length ? <span className="category-tags" aria-label={`${category.name} subcategories`}>
            {category.children.slice(0, 3).map((item) => (
              <small key={typeof item === 'string' ? item : item.id || item.name}>
                {typeof item === 'string' ? item : item.name}
              </small>
            ))}
          </span> : <span className="category-description">
            {categoryMeta[category.slug]?.description || 'Browse local listings'}
          </span>}
        </Link>
      ))}
    </div>
  )
}
