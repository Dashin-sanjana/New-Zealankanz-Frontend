import { useEffect, useState } from 'react'
import { quickTabs } from '../../data/marketplace'

const heroImage = 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1200&q=80'
import { getFeaturedAds } from '../../services/ads.service'
import { handleImageError } from '../../lib/images'
import { usePageTitle } from '../../hooks/use-page-title'
import { AdGrid } from '../../components/marketplace/ad-grid'
import { Banner } from '../../components/marketplace/banner'
import { CategoryGrid } from '../../components/marketplace/category-grid'
import { LocationFilter } from '../../components/marketplace/location-filter'
import { PopularSearches } from '../../components/marketplace/popular-searches'
import { PromoStrip } from '../../components/marketplace/promo-strip'
import { SearchBar } from '../../components/marketplace/search-bar'
import { Link } from '../../components/ui/link'
import { Alert } from '../../components/ui/feedback'
import { SectionHeader } from '../../components/ui/section-header'

const marketplaceStats = [
  ['216+', 'live listings'],
  ['11', 'NZ regions'],
  ['24h', 'review target'],
]

export default function HomePage() {
  usePageTitle('Home')
  const [ads, setAds] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    getFeaturedAds()
      .then((items) => {
        setAds(items)
        setError('')
      })
      .catch((err) => {
        setAds([])
        setError(err.message)
      })
  }, [])

  return (
    <>
      <section className="hero-section marketplace-hero">
        <div className="hero-copy">
          <p className="eyebrow">New Zealand community classifieds</p>
          <h1>Buy, sell, hire, and find local opportunities.</h1>
          <p className="hero-intro">
            A brighter local marketplace for homes, vehicles, jobs, services, and neighbourhood finds.
          </p>
          <SearchBar />
          <div className="hero-stats" aria-label="Marketplace highlights">
            {marketplaceStats.map(([value, label]) => (
              <span key={label}>
                <strong>{value}</strong>
                {label}
              </span>
            ))}
          </div>
          <div className="quick-tabs" aria-label="Popular sections">
            {quickTabs.map(([label, to]) => (
              <Link key={label} to={to}>
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div className="hero-panel hero-listings">
          <div className="hero-panel-cover">
            <img src={heroImage} alt="NewZealankans — New Zealand marketplace" />
            <div className="hero-panel-overlay">
              <span className="hero-panel-badge">🇳🇿 New Zealand's local marketplace</span>
            </div>
          </div>
          {ads.slice(0, 3).map((ad) => (
            <Link className="mini-listing" key={ad.id} to={`/ads/${ad.slug}`}>
              <img src={ad.image} alt={ad.title} onError={(event) => handleImageError(event, ad.title)} />
              <span>
                <strong>{ad.title}</strong>
                <small>{ad.location} · {ad.price}</small>
              </span>
            </Link>
          ))}
        </div>
      </section>
      <Banner placement="HOME" />
      <PromoStrip />
      <section className="content-section">
        <SectionHeader title="Browse by category" actionLabel="View all ads" actionTo="/search" />
        <CategoryGrid />
      </section>
      <section className="content-section two-column">
        <div>
          <SectionHeader title="Trade picks" actionLabel="Search listings" actionTo="/search" />
          {error && <Alert type="error" message={error} />}
          <AdGrid ads={ads.filter((ad) => ad.featured)} />
        </div>
        <aside className="sidebar">
          <LocationFilter />
          <Banner placement="SIDEBAR" compact />
        </aside>
      </section>
      <PopularSearches />
    </>
  )
}
