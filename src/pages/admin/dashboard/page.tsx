import { adminCards } from '../../../data/marketplace'
import { DashboardCard } from '../../../components/user/dashboard-card'
import { PageFrame } from '../../../components/ui/page-frame'
import { usePageTitle } from '../../../hooks/use-page-title'

export default function AdminDashboardPage() {
  usePageTitle('Admin')
  return (
    <PageFrame title="Admin dashboard" subtitle="Moderate listings and manage marketplace configuration.">
      <div className="dashboard-grid">
        {adminCards.map(([title, to, text]) => (
          <DashboardCard key={to} title={title} value="Manage" text={text} to={to} />
        ))}
      </div>
    </PageFrame>
  )
}
