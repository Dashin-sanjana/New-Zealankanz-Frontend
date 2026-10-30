import { Link } from './link'

interface SectionHeaderProps {
  title: string
  actionLabel?: string
  actionTo?: string
}

export function SectionHeader({ title, actionLabel, actionTo }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <h2>{title}</h2>
      {actionTo && <Link to={actionTo}>{actionLabel}</Link>}
    </div>
  )
}
