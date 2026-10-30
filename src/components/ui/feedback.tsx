interface AlertProps {
  type: string
  message: string
  onRetry?: () => void
  retryLabel?: string
  compact?: boolean
}

export function Alert({ type, message, onRetry, retryLabel = 'Try again', compact = false }: AlertProps) {
  return (
    <div className={`alert ${type}${compact ? ' alert-compact' : ''}`} role={type === 'error' ? 'alert' : 'status'}>
      <span>{message}</span>
      {onRetry && <button className="alert-retry" type="button" onClick={onRetry}>{retryLabel}</button>}
    </div>
  )
}

interface EmptyStateProps {
  message: string
}

export function EmptyState({ message }: EmptyStateProps) {
  return <div className="empty-state">{message}</div>
}

interface ResultSummaryProps {
  count: number
  failed?: boolean
  loading?: boolean
}

export function ResultSummary({ count, failed = false, loading = false }: ResultSummaryProps) {
  if ((failed || loading) && count === 0) return null
  return (
    <p className="result-summary">
      {failed ? `Showing ${count} previously loaded listing${count === 1 ? '' : 's'}` : `${count} approved listing${count === 1 ? '' : 's'} found`}
    </p>
  )
}

interface LocalFilterNoticeProps {
  scope: { complete: boolean; scanned: number; baseTotal: number }
}

export function LocalFilterNotice({ scope }: LocalFilterNoticeProps) {
  const message = scope.complete
    ? `Price filters and sorting were applied across all ${scope.baseTotal} matching listings.`
    : `Price filters and sorting were applied to ${scope.scanned} of ${scope.baseTotal} matching listings. Narrow your search to see a more complete result set.`
  return <Alert type="info" message={message} />
}
