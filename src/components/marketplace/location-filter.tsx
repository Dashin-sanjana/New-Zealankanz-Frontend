import { useEffect, useState } from 'react'
import { locations } from '../../data/marketplace'
import { getLocations } from '../../services/marketplace.service'
import { Link } from '../ui/link'

export function LocationFilter() {
  const [items, setItems] = useState(locations)

  useEffect(() => {
    getLocations().then(setItems).catch(() => setItems([]))
  }, [])

  return (
    <div className="panel">
      <h2>Browse by location</h2>
      <div className="location-list">
        {items.map((location) => (
          <Link key={location.id} to={`/location/${location.slug}`}>{location.name}</Link>
        ))}
      </div>
    </div>
  )
}
