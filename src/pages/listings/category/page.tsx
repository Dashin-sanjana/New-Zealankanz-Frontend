import { useEffect, useState } from 'react'
import { categories } from '../../../data/marketplace'
import { usePageTitle } from '../../../hooks/use-page-title'
import { getAds } from '../../../services/ads.service'
import { getCategories } from '../../../services/marketplace.service'
import { AdGrid } from '../../../components/marketplace/ad-grid'
import { Banner } from '../../../components/marketplace/banner'
import { Alert, ResultSummary } from '../../../components/ui/feedback'
import { Link } from '../../../components/ui/link'
import { PageFrame } from '../../../components/ui/page-frame'
import NotFoundPage from '../../not-found/page'

export default function CategoryPage({ slug }) {
  const [category, setCategory] = useState(() => categories.find((item) => item.slug === slug))
  const [loaded, setLoaded] = useState(false)
  usePageTitle(category?.name || 'Category', {
    description: category?.description
      ? category.description
      : `Browse ${category?.name ?? ''} listings on NewZealankans Marketplace across all NZ cities.`,
  })
  const [ads, setAds] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    setLoaded(false)
    getCategories()
      .then((items) => {
        const foundCategory = items.find((item) => item.slug === slug)
        setCategory(foundCategory || categories.find((item) => item.slug === slug))
        setLoaded(true)
      })
      .catch((err) => {
        setError(err.message)
        setLoaded(true)
      })
    if (slug) getAds({ category: slug }).then(setAds).catch((err) => setError(err.message))
  }, [slug])

  if (loaded && !category) return <NotFoundPage />
  if (!category) return <PageFrame title="Loading category" subtitle="Fetching category details." />

  return (
    <PageFrame title={category.name} subtitle="Browse approved listings in this marketplace category.">
      <Banner placement="CATEGORY" />
      {category.children.length > 0 && (
        <div className="pill-row">
          {category.children.map((child) => (
            <Link key={child.id || child} to={`/search?category=${category.slug}&subcategory=${child.slug || child}`} className="pill">
              {child.name || child}
            </Link>
          ))}
        </div>
      )}
      {error && <Alert type="info" message={error} />}
      <ResultSummary count={ads.length} />
      <AdGrid ads={ads} />
    </PageFrame>
  )
}
