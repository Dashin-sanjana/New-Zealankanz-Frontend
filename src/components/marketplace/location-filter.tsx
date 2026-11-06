import { useEffect, useState } from 'react'
import { locations } from '../../data/marketplace'
import { getLocations } from '../../services/marketplace.service'
import { Link } from '../ui/link'
import { getPopularLocations, isNewZealandLocation } from '../../lib/marketplace-display.mjs'

export function LocationFilter() {
  const [items, setItems] = useState(locations)
  const localLocations = getPopularLocations(items)
  const visibleLocations = localLocations.length ? localLocations : getPopularLocations(locations)
  const hasOtherLocations = items.some((location) => !isNewZealandLocation(location.slug || location.name))

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
          <h2>Popular New Zealand locations</h2>
        </div>
        {hasOtherLocations && <Link className="location-all-link" to="/search">All locations</Link>}
      </div>
      <div className="location-list">
        {visibleLocations.map((location) => (
          <Link key={location.id} to={`/location/${location.slug}`}>{location.name}</Link>
        ))}
      </div>
    </div>
  )
}
