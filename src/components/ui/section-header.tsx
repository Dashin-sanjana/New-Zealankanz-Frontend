import { Link } from './link'

export function SectionHeader({ title, actionLabel, actionTo }) {
  return (
    <div className="section-header">
      <h2>{title}</h2>
      {actionTo && <Link to={actionTo}>{actionLabel}</Link>}
    </div>
  )
}
