import { useEffect, useState } from 'react'
import { locations } from '../../data/marketplace'
import { getLocations } from '../../services/marketplace.service'
import { Link } from '../ui/link'

export function LocationFilter() {
  const [items, setItems] = useState(locations)

  useEffect(() => {
    let active = true
    getLocations()
      .then((result) => { if (active) setItems(result.length ? result : locations) })
      .catch(() => {})
    return () => { active = false }
  }, [])

  return (
    <div className="panel location-panel">
      <div className="location-panel-heading">
        <div>
          <p className="eyebrow">Find listings near you</p>
          <h2>Browse by location</h2>
        </div>
        <span aria-hidden="true">NZ</span>
      </div>
      <div className="location-list">
        {items.map((location) => (
          <Link key={location.id} to={`/location/${location.slug}`}>{location.name}</Link>
        ))}
      </div>
    </div>
  )
}
