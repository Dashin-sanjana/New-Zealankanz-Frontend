import { PageFrame } from '../ui/page-frame'
import type { MarketplaceAd } from '../../services/ads.service'

interface AdminListPageProps {
  title: string
  subtitle: string
  rows: MarketplaceAd[]
  loading?: boolean
  error?: boolean
  actions: string[]
  onAction?: (action: string, row: MarketplaceAd) => void
}

export function AdminListPage({ title, subtitle, rows, loading = false, error = false, actions, onAction }: AdminListPageProps) {
  return (
    <PageFrame title={title} subtitle={subtitle}>
      <div className="table-card">
        {loading ? <p role="status" aria-live="polite">Loading listings…</p> : null}
        {!loading && !error && rows.length === 0 ? <p>No listings in this view yet.</p> : null}
        {!loading && !error && rows.map((row) => (
          <div className="table-row admin-row" key={row.id}>
            <div>
              <strong>{row.title}</strong>
              <span>{row.category} / {row.location}</span>
            </div>
            <span className={`status ${row.status.toLowerCase()}`}>{row.status}</span>
            <div className="row-actions">
              {actions.map((action) => (
                <button key={action} type="button" className="ghost-button" onClick={() => onAction?.(action, row)}>
                  {action}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageFrame>
  )
}
