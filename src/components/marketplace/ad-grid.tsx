import { EmptyState } from '../ui/feedback'
import { AdCard } from './ad-card'

export function AdGrid({ ads }) {
  if (!ads.length) return <EmptyState message="No approved ads match this view yet." />
  return (
    <div className="ad-grid">
      {ads.map((ad) => <AdCard key={ad.id} ad={ad} />)}
    </div>
  )
}
