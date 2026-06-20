import { Link } from '../ui/link'

export function DashboardCard({ title, value, text, to }) {
  return (
    <Link className="dashboard-card" to={to}>
      <span>{value}</span>
      <strong>{title}</strong>
      <p>{text}</p>
    </Link>
  )
}
