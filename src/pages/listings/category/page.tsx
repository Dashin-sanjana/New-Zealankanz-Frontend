import { useEffect, useState } from 'react'
import { categories } from '../../../data/marketplace'
import { usePageTitle } from '../../../hooks/use-page-title'
import { getAdsPage } from '../../../services/ads.service'
import type { AdsPage, MarketplaceAd } from '../../../services/ads.service'
import { getCategories } from '../../../services/marketplace.service'
import { AdGrid } from '../../../components/marketplace/ad-grid'
import { AdSlot } from '../../../components/marketplace/ad-slot'
import { DesktopFilterSidebar } from '../../../components/marketplace/desktop-filter-sidebar'
import { SearchBar } from '../../../components/marketplace/search-bar'
import { ActiveFilterChips } from '../../../components/marketplace/active-filter-chips'
import { Alert, LocalFilterNotice, ResultSummary } from '../../../components/ui/feedback'
import { PageFrame } from '../../../components/ui/page-frame'
import NotFoundPage from '../../not-found/page'
import { navigateToPage } from '../../../lib/navigation'

interface CategoryOption {
  id: string
  name: string
  slug: string
  description?: string
  children?: Array<string | CategoryOption>
}

export default function CategoryPage({ slug, query }: { slug: string; query: URLSearchParams }) {
  const [category, setCategory] = useState<CategoryOption | null>(() => categories.find((item) => item.slug === slug) || null)
  const [loaded, setLoaded] = useState(false)
  const keyword = query?.get('q') || query?.get('keyword') || ''
  const subcategory = query?.get('subcategory') || ''
  const location = query?.get('location') || ''
  const minPrice = query?.get('minPrice') || ''
  const maxPrice = query?.get('maxPrice') || ''
  const sort = query?.get('sort') || ''
  const attributes = query?.get('attributes') || ''
  const page = Math.max(Number.parseInt(query?.get('page') || '1', 10) || 1, 1)
  usePageTitle(category?.name || 'Category', {
    description: category?.description
      ? category.description
      : `Browse ${category?.name ?? ''} listings on NewZealankans Marketplace across all NZ cities.`,
  })
  const [ads, setAds] = useState<MarketplaceAd[]>([])
  const [pageInfo, setPageInfo] = useState<AdsPage['meta']>({ total: 0, page, limit: 12, pages: 0 })
  const [error, setError] = useState('')
  const [adsLoading, setAdsLoading] = useState(true)
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    setLoaded(false)
    setAdsLoading(true)
    setError('')
    let active = true
    const localCat = categories.find((item) => item.slug === slug)
    setCategory(localCat || null)

    const loadAds = (activeCategory: CategoryOption | null | undefined) => {
      if (!activeCategory || !slug) return
      getAdsPage({ keyword, category: slug, subcategory, location, minPrice, maxPrice, sort, attributes, page })
        .then((result) => {
          if (active) {
            setAds(result.ads)
            setPageInfo(result.meta)
          }
        })
        .catch((err) => { if (active) setError(err.message) })
        .finally(() => { if (active) setAdsLoading(false) })
    }

    getCategories()
      .then((items) => {
        const activeCategory = (items as CategoryOption[]).find((item) => item.slug === slug) || localCat || null
        if (active) {
          setCategory(activeCategory)
          setLoaded(true)
        }
        loadAds(activeCategory)
      })
      .catch(() => {
        if (active) {
          setLoaded(true)
        }
        loadAds(localCat)
      })
    return () => { active = false }
  }, [slug, keyword, subcategory, location, minPrice, maxPrice, sort, attributes, page, retry])

  if (loaded && !category) return <NotFoundPage />
  if (!category) return <PageFrame title="Loading category" subtitle="Fetching category details." />

  return (
    <PageFrame title={category.name} subtitle="Browse approved listings in this marketplace category.">
      <AdSlot name="CATEGORY_TOP" />
      <SearchBar
        actionPath={`/category/${category.slug}`}
        fixedCategory
        defaultKeyword={keyword}
        defaultCategory={category.slug}
        defaultSubcategory={subcategory}
        defaultLocation={location}
        defaultMinPrice={minPrice}
        defaultMaxPrice={maxPrice}
        defaultSort={sort}
        defaultAttributes={attributes}
      />
      <AdSlot name="CATEGORY_AFTER_SEARCH" />
      <div className="marketplace-results-layout">
        <DesktopFilterSidebar query={query} actionPath={`/category/${slug}`} fixedCategory={category.slug} />
        <div className="marketplace-results-main">
          <ActiveFilterChips path={`/category/${slug}`} query={query} />
          {error && <Alert type="error" message={error} onRetry={() => setRetry((value) => value + 1)} />}
          {adsLoading && ads.length === 0 && <p role="status">Loading listings…</p>}
          <ResultSummary count={pageInfo.total} failed={Boolean(error)} loading={adsLoading} />
          {pageInfo.localFilterScope && <LocalFilterNotice scope={pageInfo.localFilterScope} />}
          <AdGrid
            ads={ads}
            showEmptyState={!adsLoading && !error}
            pagination={pageInfo}
            onPageChange={(nextPage) => navigateToPage(`/category/${slug}`, query, nextPage)}
          />
        </div>
      </div>
    </PageFrame>
  )
}
