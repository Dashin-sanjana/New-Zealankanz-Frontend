interface AlertProps {
  type: string
  message: string
}

export function Alert({ type, message }: AlertProps) {
  return <div className={`alert ${type}`}>{message}</div>
}

interface EmptyStateProps {
  message: string
}

export function EmptyState({ message }: EmptyStateProps) {
  return <div className="empty-state">{message}</div>
}

interface ResultSummaryProps {
  count: number
}

export function ResultSummary({ count }: ResultSummaryProps) {
  return <p className="result-summary">{count} approved listing{count === 1 ? '' : 's'} found</p>
}
