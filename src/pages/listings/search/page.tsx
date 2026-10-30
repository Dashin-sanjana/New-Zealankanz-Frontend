import { useEffect, useState } from 'react'
import { usePageTitle } from '../../../hooks/use-page-title'
import { getAdsPage } from '../../../services/ads.service'
import type { AdsPage, MarketplaceAd } from '../../../services/ads.service'
import { AdGrid } from '../../../components/marketplace/ad-grid'
import { AdSlot } from '../../../components/marketplace/ad-slot'
import { SearchBar } from '../../../components/marketplace/search-bar'
import { Alert, LocalFilterNotice, ResultSummary } from '../../../components/ui/feedback'
import { PageFrame } from '../../../components/ui/page-frame'
import { navigateToPage } from '../../../lib/navigation'

export default function SearchPage({ query }: { query: URLSearchParams }) {
  usePageTitle('Search')
  const keyword = query.get('q') || query.get('keyword') || ''
  const category = query.get('category') || ''
  const subcategory = query.get('subcategory') || ''
  const location = query.get('location') || ''
  const minPrice = query.get('minPrice') || ''
  const maxPrice = query.get('maxPrice') || ''
  const sort = query.get('sort') || ''
  const page = Math.max(Number.parseInt(query.get('page') || '1', 10) || 1, 1)
  const [ads, setAds] = useState<MarketplaceAd[]>([])
  const [pageInfo, setPageInfo] = useState<AdsPage['meta']>({ total: 0, page, limit: 12, pages: 0 })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    getAdsPage({ keyword, category, subcategory, location, minPrice, maxPrice, sort, page })
      .then((result) => {
        if (active) {
          setAds(result.ads)
          setPageInfo(result.meta)
        }
      })
      .catch((err) => { if (active) setError(err.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [keyword, category, subcategory, location, minPrice, maxPrice, sort, page, retry])

  return (
    <PageFrame title="Search marketplace" subtitle="Search approved ads by keyword, category, and NZ city.">
      <AdSlot name="SEARCH_TOP" />
      <SearchBar
        defaultKeyword={keyword}
        defaultCategory={category}
        defaultSubcategory={subcategory}
        defaultLocation={location}
        defaultMinPrice={minPrice}
        defaultMaxPrice={maxPrice}
        defaultSort={sort}
      />
      {error && <Alert type="error" message={error} onRetry={() => setRetry((value) => value + 1)} />}
      {loading && ads.length === 0 && <p role="status">Loading listings…</p>}
      <ResultSummary count={pageInfo.total} failed={Boolean(error)} loading={loading} />
      {pageInfo.localFilterScope && <LocalFilterNotice scope={pageInfo.localFilterScope} />}
      <AdGrid
        ads={ads}
        showEmptyState={!loading && !error}
        pagination={pageInfo}
        onPageChange={(nextPage) => navigateToPage('/search', query, nextPage)}
      />
    </PageFrame>
  )
}
