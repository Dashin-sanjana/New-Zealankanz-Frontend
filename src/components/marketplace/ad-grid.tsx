import { useState } from 'react'
import { EmptyState } from '../ui/feedback'
import { Pagination, PAGE_SIZE } from '../ui/pagination'
import { AdCard } from './ad-card'

export function AdGrid({ ads }) {
  const [page, setPage] = useState(1)

  if (!ads.length) return <EmptyState message="No approved ads match this view yet." />

  const start = (page - 1) * PAGE_SIZE
  const pageAds = ads.slice(start, start + PAGE_SIZE)

  function handlePage(next: number) {
    setPage(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <div className="ad-grid">
        {pageAds.map((ad) => <AdCard key={ad.id} ad={ad} />)}
      </div>
      <Pagination total={ads.length} page={page} onPage={handlePage} />
    </>
  )
}
