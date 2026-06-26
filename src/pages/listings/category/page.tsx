import { useEffect, useState } from 'react'
import { categories } from '../../../data/marketplace'
import { usePageTitle } from '../../../hooks/use-page-title'
import { getAds } from '../../../services/ads.service'
import { getCategories } from '../../../services/marketplace.service'
import { AdGrid } from '../../../components/marketplace/ad-grid'
import { AdSlot } from '../../../components/marketplace/ad-slot'
import { SearchBar } from '../../../components/marketplace/search-bar'
import { Alert, ResultSummary } from '../../../components/ui/feedback'
import { PageFrame } from '../../../components/ui/page-frame'
import NotFoundPage from '../../not-found/page'

export default function CategoryPage({ slug, query }: { slug: string; query: any }) {
  const [category, setCategory] = useState<any>(() => categories.find((item) => item.slug === slug))
  const [loaded, setLoaded] = useState(false)
  const keyword = query?.get('q') || query?.get('keyword') || ''
  const subcategory = query?.get('subcategory') || ''
  const location = query?.get('location') || ''
  const minPrice = query?.get('minPrice') || ''
  const maxPrice = query?.get('maxPrice') || ''
  const sort = query?.get('sort') || ''
  usePageTitle(category?.name || 'Category', {
    description: category?.description
      ? category.description
      : `Browse ${category?.name ?? ''} listings on NewZealankans Marketplace across all NZ cities.`,
  })
  const [ads, setAds] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    setLoaded(false)
    const localCat = categories.find((item) => item.slug === slug)
    setCategory(localCat || null)

    getCategories()
      .then((items: any[]) => {
        const foundCategory = items.find((item: any) => item.slug === slug)
        setCategory(foundCategory || localCat)
        setLoaded(true)
      })
      .catch((err) => {
        setError(err.message)
        setLoaded(true)
      })
    if (slug) {
      getAds({ keyword, category: slug, subcategory, location, minPrice, maxPrice, sort })
        .then((items) => {
          setAds(items)
          setError('')
        })
        .catch((err) => setError(err.message))
    }
  }, [slug, keyword, subcategory, location, minPrice, maxPrice, sort])

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
      />
      <AdSlot name="CATEGORY_AFTER_SEARCH" />
      {error && <Alert type="info" message={error} />}
      <ResultSummary count={ads.length} />
      <AdGrid ads={ads} />
    </PageFrame>
  )
}
