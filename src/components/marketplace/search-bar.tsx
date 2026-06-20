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

export function SearchBar({ defaultKeyword = '', defaultCategory = '', defaultSubcategory = '', defaultLocation = '' }) {
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
      <input name="q" defaultValue={defaultKeyword} placeholder="Search all listings" />
      <select name="category" defaultValue={defaultCategory}>
        <option value="">All categories</option>
        {categoryOptions.map((item) => (
          <option key={item.id} value={item.slug}>{item.name}</option>
        ))}
      </select>
      <select name="subcategory" defaultValue={defaultSubcategory}>
        <option value="">All subcategories</option>
        {getSubcategoryOptions(categoryOptions).map((item) => (
          <option key={item.value} value={item.value}>{item.label}</option>
        ))}
      </select>
      <select name="location" defaultValue={defaultLocation}>
        <option value="">All locations</option>
        {locationOptions.map((item) => (
          <option key={item.id} value={item.slug}>{item.name}</option>
        ))}
      </select>
      <button className="primary-button search-submit" type="submit">Search</button>
    </form>
  )
}
