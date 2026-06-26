import { useEffect, useState } from 'react'
import { handleImageError } from '../../lib/images'
import { getBanners } from '../../services/marketplace.service'
import { Link } from '../ui/link'

export function Banner({ placement, compact = false, fallbackPlacements = [] }) {
  const [banners, setBanners] = useState([])
  const banner = banners[0]
  const placementKey = [placement, ...fallbackPlacements].filter(Boolean).join('|')

  useEffect(() => {
    let active = true
    const placements = placementKey.split('|').filter(Boolean)

    async function loadBanners() {
      for (const item of placements) {
        try {
          const nextBanners = await getBanners(item)
          if (nextBanners.length > 0) {
            if (active) setBanners(nextBanners)
            return
          }
        } catch {
          // Try the next configured placement before hiding the slot.
        }
      }
      if (active) setBanners([])
    }

    loadBanners()
    return () => {
      active = false
    }
  }, [placementKey])

  if (!banner) return null

  if (!compact && banners.length > 1) {
    return (
      <section className="sample-ad-grid" aria-label="Sponsored advertisements">
        {banners.map((item) => (
          <Link to={item.linkUrl} className="sample-ad-card" key={`${item.sponsor}-${item.title}`}>
            <img src={item.imageUrl} alt={item.title} onError={(event) => handleImageError(event, item.title)} />
            <span>{item.sponsor}</span>
            <strong>{item.title}</strong>
            <small>{item.description}</small>
          </Link>
        ))}
      </section>
    )
  }

  return (
    <Link to={banner.linkUrl} className={compact ? 'banner compact' : 'banner'}>
      {banner.imageUrl && (
        <img src={banner.imageUrl} alt={banner.title} onError={(event) => handleImageError(event, banner.title)} />
      )}
      <span>
        <small>{banner.sponsor}</small>
        <strong>{banner.title}</strong>
        <em>{banner.description}</em>
      </span>
    </Link>
  )
}
