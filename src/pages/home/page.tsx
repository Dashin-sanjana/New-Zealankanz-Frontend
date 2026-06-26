import { useEffect, useState } from 'react'
import { quickTabs } from '../../data/marketplace'

const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1800&q=80',
    title: 'New Zealand community marketplace',
    text: 'Find homes, vehicles, jobs, services, and local deals in one trusted place.',
  },
  {
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1800&q=80',
    title: 'Property, motors, jobs, services',
    text: 'Browse approved listings from communities across Aotearoa.',
  },
  {
    image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1800&q=80',
    title: 'Promote and discover locally',
    text: 'Simple classifieds for buyers, sellers, and local businesses.',
  },
]
import { getFeaturedAds } from '../../services/ads.service'
import { usePageTitle } from '../../hooks/use-page-title'
import { AdGrid } from '../../components/marketplace/ad-grid'
import { AdSlot } from '../../components/marketplace/ad-slot'
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

const homeCategoryTabs = [
  ['🛍️', quickTabs[0][0], quickTabs[0][1]],
  ['🏠', quickTabs[1][0], quickTabs[1][1]],
  ['🚙', quickTabs[2][0], quickTabs[2][1]],
  ['💼', quickTabs[3][0], quickTabs[3][1]],
  ['🔧', quickTabs[4][0], quickTabs[4][1]],
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
      <section className="home-slider" aria-label="Marketplace highlights">
        {heroSlides.map((slide) => (
          <article className="home-slide" key={slide.title}>
            <img src={slide.image} alt="" />
            <div className="home-slide-copy">
              <p className="eyebrow">New Zealand community classifieds</p>
              <h1>{slide.title}</h1>
              <p>{slide.text}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="home-search-section">
        <div className="home-search-inner">
          <SearchBar showAdvancedFilters={false} simple />
          <nav className="home-category-tabs" aria-label="Popular categories">
            {homeCategoryTabs.map(([icon, label, to]) => (
              <Link key={label} to={to}>
                <span aria-hidden="true">{icon}</span>
                {label}
              </Link>
            ))}
          </nav>
          <div className="hero-stats" aria-label="Marketplace highlights">
            {marketplaceStats.map(([value, label]) => (
              <span key={label}>
                <strong>{value}</strong>
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <AdSlot name="HOME_AFTER_HERO" />
      <PromoStrip />
      <section className="content-section two-column">
        <div>
          <SectionHeader title="Trade picks" actionLabel="Search listings" actionTo="/search" />
          {error && <Alert type="error" message={error} />}
          <AdGrid ads={ads.filter((ad) => ad.featured)} />
        </div>
        <aside className="sidebar">
          <LocationFilter />
          <AdSlot name="HOME_SIDEBAR" />
        </aside>
      </section>
      <PopularSearches />
    </>
  )
}
