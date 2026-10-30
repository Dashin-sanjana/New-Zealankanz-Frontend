import { useEffect, useState, type ReactNode } from 'react'
import { handleImageError } from '../../lib/images'
import { getBanners } from '../../services/marketplace.service'
import { Alert } from '../ui/feedback'
import { Link } from '../ui/link'

interface MarketplaceBanner {
  sponsor: string
  title: string
  description: string
  imageUrl: string
  linkUrl: string
}

interface BannerProps {
  placement: string
  compact?: boolean
  fallbackPlacements?: string[]
  emptyMessage?: string
}

function BannerLink({ to, className, children }: { to: string; className: string; children: ReactNode }) {
  if (/^https?:\/\//i.test(to)) {
    return <a className={className} href={to} target="_blank" rel="noreferrer">{children}</a>
  }
  const destination = to.replace(/^\/categories\//, '/category/').replace(/^\/ads\/create$/, '/post-ad')
  return <Link to={destination} className={className}>{children}</Link>
}

export function Banner({ placement, compact = false, fallbackPlacements = [], emptyMessage = '' }: BannerProps) {
  const [banners, setBanners] = useState<MarketplaceBanner[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [retry, setRetry] = useState(0)
  const banner = banners[0]
  const placementKey = [placement, ...fallbackPlacements].filter(Boolean).join('|')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    const placements = placementKey.split('|').filter(Boolean)
    async function loadBanners() {
      let requestFailed = false
      for (const item of placements) {
        try {
          const nextBanners = await getBanners(item)
          if (nextBanners.length > 0) {
            if (active) {
              setBanners(nextBanners)
              setError('')
              setLoading(false)
            }
            return
          }
        } catch {
          requestFailed = true
          // Try the next configured placement before hiding the slot.
        }
      }
      if (active) {
        if (!requestFailed || banners.length === 0) setBanners([])
        setError(requestFailed ? 'Sponsored placements are temporarily unavailable.' : '')
        setLoading(false)
      }
    }

    loadBanners()
    return () => {
      active = false
    }
  }, [placementKey, retry])

  if (!banner) {
    if (loading) return emptyMessage ? <p className="banner-empty" role="status">Loading sponsored placement…</p> : null
    if (error) return <Alert type="error" message={error} onRetry={() => setRetry((value) => value + 1)} compact />
    return emptyMessage ? <p className="banner-empty">{emptyMessage}</p> : null
  }
  const sponsorLabel = banner.sponsor ? `Sponsored · ${banner.sponsor}` : 'Sponsored'

  if (!compact && banners.length > 1) {
    return (
      <>
        {error && <Alert type="error" message={error} onRetry={() => setRetry((value) => value + 1)} compact />}
        <section className="sample-ad-grid" aria-label="Sponsored advertisements">
          {banners.map((item) => (
            <BannerLink to={item.linkUrl} className="sample-ad-card" key={`${item.sponsor}-${item.title}`}>
              <img src={item.imageUrl} alt={item.title} onError={(event) => handleImageError(event, item.title)} />
              <span>{item.sponsor ? `Sponsored · ${item.sponsor}` : 'Sponsored'}</span>
              <strong>{item.title}</strong>
              <small>{item.description}</small>
            </BannerLink>
          ))}
        </section>
      </>
    )
  }

  return (
    <>
      {error && <Alert type="error" message={error} onRetry={() => setRetry((value) => value + 1)} compact />}
      <BannerLink to={banner.linkUrl} className={compact ? 'banner compact' : 'banner'}>
        {banner.imageUrl && (
          <img src={banner.imageUrl} alt={banner.title} onError={(event) => handleImageError(event, banner.title)} />
        )}
        <span>
          <small>{sponsorLabel}</small>
          <strong>{banner.title}</strong>
          <em>{banner.description}</em>
        </span>
      </BannerLink>
    </>
  )
}
