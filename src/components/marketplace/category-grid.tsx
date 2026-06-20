import { useEffect, useState } from 'react'
import { categories } from '../../data/marketplace'
import { getCategories } from '../../services/marketplace.service'
import { Link } from '../ui/link'

const categoryMeta = {
  property: {
    description: 'Homes, rentals, and flatmates',
    icon: 'Home',
    accent: 'coral',
    highlights: ['Sale', 'Rent', 'Flatmates'],
  },
  motor: {
    description: 'Cars, bikes, parts, and accessories',
    icon: 'Auto',
    accent: 'gold',
    highlights: ['Cars', 'Bikes', 'Parts'],
  },
  jobs: {
    description: 'Local roles, shifts, and flexible work',
    icon: 'Work',
    accent: 'blue',
    highlights: ['Full-time', 'Part-time', 'Casual'],
  },
  services: {
    description: 'Trades, cleaning, repairs, and local help',
    icon: 'Help',
    accent: 'green',
    highlights: ['Trades', 'Cleaning', 'Repairs'],
  },
}

export function CategoryGrid() {
  const [items, setItems] = useState(categories)

  useEffect(() => {
    getCategories().then(setItems).catch(() => setItems([]))
  }, [])

  return (
    <div className="category-grid">
      {items.map((category) => (
        <Link
          className={`category-card category-card-${categoryMeta[category.id]?.accent || 'coral'}`}
          key={category.id}
          to={`/category/${category.slug}`}
        >
          <span className="category-card-top">
            <span className="category-icon" aria-hidden="true">
              {categoryMeta[category.id]?.icon || category.name}
            </span>
            <span className="category-count">{category.count} live</span>
          </span>
          <strong>{category.name}</strong>
          <span className="category-description">
            {categoryMeta[category.id]?.description || `${category.count} listings`}
          </span>
          <span className="category-tags" aria-label={`${category.name} subcategories`}>
            {(categoryMeta[category.id]?.highlights || category.children).slice(0, 3).map((item) => (
              <small key={item.id || item}>{item.name || item}</small>
            ))}
          </span>
        </Link>
      ))}
    </div>
  )
}
