import { Link } from '../ui/link'
import type { ReactNode } from 'react'

interface DashboardCardProps {
  title: string
  value: ReactNode
  text: string
  to: string
}

export function DashboardCard({ title, value, text, to }: DashboardCardProps) {
  return (
    <Link className="dashboard-card" to={to}>
      <span>{value}</span>
      <strong>{title}</strong>
      <p>{text}</p>
    </Link>
  )
}
