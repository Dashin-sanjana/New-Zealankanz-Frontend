import { useEffect, useState } from 'react'
import { EmptyState } from '../ui/feedback'
import { Pagination, PAGE_SIZE } from '../ui/pagination'
import { AdCard } from './ad-card'
import type { AdsPage, MarketplaceAd } from '../../services/ads.service'

interface AdGridProps {
  ads: MarketplaceAd[]
  showEmptyState?: boolean
  pagination?: AdsPage['meta']
  onPageChange?: (page: number) => void
  onRemove?: (adId: string) => void
  emptyMessage?: string
}

export function AdGrid({ ads, showEmptyState = true, pagination, onPageChange, onRemove, emptyMessage = 'No approved ads match this view yet.' }: AdGridProps) {
  const [page, setPage] = useState(1)

  useEffect(() => setPage(1), [ads])

  if (!ads.length) return showEmptyState ? <EmptyState message={emptyMessage} /> : null

  const start = (page - 1) * PAGE_SIZE
  const pageAds = pagination ? ads : ads.slice(start, start + PAGE_SIZE)

  function handlePage(next: number) {
    setPage(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <div className="ad-grid">
        {pageAds.map((ad) => <AdCard key={ad.id} ad={ad} onRemove={onRemove ? () => onRemove(ad.id) : undefined} />)}
      </div>
      <Pagination
        total={pagination?.total ?? ads.length}
        page={pagination?.page ?? page}
        pageSize={pagination?.limit ?? PAGE_SIZE}
        onPage={onPageChange ?? handlePage}
      />
    </>
  )
}
