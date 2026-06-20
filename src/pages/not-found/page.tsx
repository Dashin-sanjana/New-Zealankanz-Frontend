import { usePageTitle } from '../../hooks/use-page-title'
import { Link } from '../../components/ui/link'
import { PageFrame } from '../../components/ui/page-frame'

export default function NotFoundPage() {
  usePageTitle('Not Found')
  return (
    <PageFrame title="Page not found" subtitle="The marketplace page you requested is not available.">
      <Link to="/" className="primary-button">Go home</Link>
    </PageFrame>
  )
}
