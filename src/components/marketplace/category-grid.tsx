import { useEffect, useState } from 'react'
import { categories } from '../../data/marketplace'
import { getCategories } from '../../services/marketplace.service'
import { Link } from '../ui/link'

interface CategoryMetaItem {
  description: string
  icon: string
  accent: string
  highlights: string[]
}

const categoryMeta: Record<string, CategoryMetaItem> = {
  property: {
    description: 'Homes, rentals, and flatmates across NZ',
    icon: '🏠',
    accent: 'gold',
    highlights: ['Sale', 'Rent', 'Flatmates'],
  },
  motor: {
    description: 'Cars, bikes, parts, and accessories',
    icon: '🚗',
    accent: 'gold',
    highlights: ['Cars', 'Bikes', 'Parts'],
  },
  jobs: {
    description: 'Local roles, shifts, and flexible work',
    icon: '💼',
    accent: 'gold',
    highlights: ['Full-time', 'Part-time', 'Casual'],
  },
  services: {
    description: 'Trades, cleaning, repairs, and local help',
    icon: '🔧',
    accent: 'gold',
    highlights: ['Trades', 'Cleaning', 'Repairs'],
  },
}

interface Category {
  id: string
  name: string
  slug: string
  count: number
  children?: Array<any>
}

export function CategoryGrid() {
  const [items, setItems] = useState<Category[]>(categories)

  useEffect(() => {
    getCategories().then(setItems).catch(() => setItems([]))
  }, [])

  return (
    <div className="category-grid">
      {items.map((category) => (
        <Link
          className={`category-card category-card-${categoryMeta[category.id]?.accent || 'gold'}`}
          key={category.id}
          to={`/category/${category.slug}`}
        >
          <div className="category-card-bg" aria-hidden="true" />
          <span className="category-card-top">
            <span className="category-icon" aria-hidden="true">
              {categoryMeta[category.id]?.icon || '📦'}
            </span>
            <span className="category-count">{category.count} live</span>
          </span>
          <strong>{category.name}</strong>
          <span className="category-description">
            {categoryMeta[category.id]?.description || `${category.count} listings`}
          </span>
          <span className="category-tags" aria-label={`${category.name} subcategories`}>
            {(categoryMeta[category.id]?.highlights || category.children || []).slice(0, 3).map((item: any) => (
              <small key={item.id || item}>{item.name || item}</small>
            ))}
          </span>
        </Link>
      ))}
    </div>
  )
}
