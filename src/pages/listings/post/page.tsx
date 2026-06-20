import { AdForm } from '../../../components/forms/ad-form'
import { PageFrame } from '../../../components/ui/page-frame'
import { usePageTitle } from '../../../hooks/use-page-title'

export default function PostAdPage() {
  usePageTitle('Post Ad')
  return (
    <PageFrame title="Post an ad" subtitle="Every new ad is submitted for admin approval before publishing.">
      <AdForm mode="create" />
    </PageFrame>
  )
}
