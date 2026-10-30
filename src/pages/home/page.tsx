import { useEffect, useState } from 'react'
import { AdGrid } from '../../components/marketplace/ad-grid'
import { AdSlot } from '../../components/marketplace/ad-slot'
import { CategoryGrid } from '../../components/marketplace/category-grid'
import { LocationFilter } from '../../components/marketplace/location-filter'
import { PopularSearches } from '../../components/marketplace/popular-searches'
import { SearchBar } from '../../components/marketplace/search-bar'
import { Alert } from '../../components/ui/feedback'
import { SectionHeader } from '../../components/ui/section-header'
import { usePageTitle } from '../../hooks/use-page-title'
import { getAds, getFeaturedAds } from '../../services/ads.service'
import type { MarketplaceAd } from '../../services/ads.service'

export default function HomePage() {
  usePageTitle('Home')
  const [featuredAds, setFeaturedAds] = useState<MarketplaceAd[]>([])
  const [latestAds, setLatestAds] = useState<MarketplaceAd[]>([])
  const [featuredError, setFeaturedError] = useState('')
  const [latestError, setLatestError] = useState('')
  const [loading, setLoading] = useState(true)
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setFeaturedError('')
    setLatestError('')
    Promise.allSettled([getFeaturedAds(), getAds({ limit: 6 })])
      .then(([featuredResult, latestResult]) => {
        const featured = featuredResult.status === 'fulfilled' ? featuredResult.value : []
        if (active && featuredResult.status === 'fulfilled') setFeaturedAds(featured)
        else if (active && featuredResult.status === 'rejected') setFeaturedError(featuredResult.reason instanceof Error ? featuredResult.reason.message : 'Featured listings are temporarily unavailable.')

        if (active && latestResult.status === 'fulfilled') {
          const featuredIds = new Set(featured.map((ad: MarketplaceAd) => ad.id))
          setLatestAds(latestResult.value.filter((ad: MarketplaceAd) => !featuredIds.has(ad.id)).slice(0, 4))
        } else if (active && latestResult.status === 'rejected') {
          setLatestError(latestResult.reason instanceof Error ? latestResult.reason.message : 'Latest listings are temporarily unavailable.')
        }
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [retry])

  return (
    <>
      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="eyebrow">Aotearoa's community marketplace</p>
          <h1>Good finds start close to home.</h1>
          <p>Discover homes, vehicles, jobs and services from people across New Zealand.</p>
        </div>
        <SearchBar preserveKeyword />
      </section>

      <section className="content-section home-categories" aria-label="Browse categories">
        <SectionHeader title="Browse categories" actionLabel="View all listings" actionTo="/search" />
        <CategoryGrid />
      </section>

      <section className="content-section home-listings">
        {(featuredError || latestError) && <Alert type="error" message="Some listing sections couldn’t be loaded. Please try again." onRetry={() => setRetry((value) => value + 1)} />}
        <SectionHeader title="Featured listings" actionLabel="See all listings" actionTo="/search" />
        {loading && featuredAds.length === 0 ? <p className="home-listings-status" role="status">Loading featured listings…</p> : <AdGrid ads={featuredAds} showEmptyState={!featuredError} />}
      </section>

      <section className="content-section home-listings">
        <SectionHeader title="Latest listings" actionLabel="Browse all listings" actionTo="/search" />
        {loading && latestAds.length === 0 ? <p className="home-listings-status" role="status">Loading latest listings…</p> : <AdGrid ads={latestAds} showEmptyState={!latestError} />}
      </section>

      <section className="home-advertising" aria-labelledby="home-advertising-title">
        <div className="home-advertising-heading">
          <div>
            <p className="eyebrow">For local businesses</p>
            <h2 id="home-advertising-title">Local advertising</h2>
          </div>
          <span>SPONSORED</span>
        </div>
        <div className="home-advertising-grid">
          <AdSlot name="HOME_AFTER_HERO" />
          <AdSlot name="HOME_SIDEBAR" />
        </div>
      </section>

      <section className="content-section home-locations">
        <LocationFilter />
      </section>

      <PopularSearches ads={latestAds} />
    </>
  )
}
