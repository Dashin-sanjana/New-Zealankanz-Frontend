import { useEffect, useState } from 'react'
import { usePageTitle } from '../../../hooks/use-page-title'
import { getAds } from '../../../services/ads.service'
import { AdGrid } from '../../../components/marketplace/ad-grid'
import { SearchBar } from '../../../components/marketplace/search-bar'
import { Alert, ResultSummary } from '../../../components/ui/feedback'
import { PageFrame } from '../../../components/ui/page-frame'

export default function SearchPage({ query }) {
  usePageTitle('Search')
  const keyword = query.get('q') || query.get('keyword') || ''
  const category = query.get('category') || ''
  const subcategory = query.get('subcategory') || ''
  const location = query.get('location') || ''
  const [ads, setAds] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    getAds({ keyword, category, subcategory, location })
      .then((items) => {
        setAds(items)
        setError('')
      })
      .catch((err) => setError(err.message))
  }, [keyword, category, subcategory, location])

  return (
    <PageFrame title="Search marketplace" subtitle="Search approved ads by keyword, category, and NZ city.">
      <SearchBar defaultKeyword={keyword} defaultCategory={category} defaultSubcategory={subcategory} defaultLocation={location} />
      {error && <Alert type="info" message={error} />}
      <ResultSummary count={ads.length} />
      <AdGrid ads={ads} />
    </PageFrame>
  )
}
