import { useEffect, useState } from 'react'
import { AdForm } from '../../../components/forms/ad-form'
import { Alert } from '../../../components/ui/feedback'
import { PageFrame } from '../../../components/ui/page-frame'
import { usePageTitle } from '../../../hooks/use-page-title'
import { getAdBySlug, getMyAds } from '../../../services/ads.service'

export default function EditAdPage({ slug }) {
  const [ad, setAd] = useState(null)
  usePageTitle('Edit Ad')

  useEffect(() => {
    getAdBySlug(slug)
      .then(setAd)
      .catch(() => getMyAds().then((items) => setAd(items.find((item) => item.slug === slug) || null)))
  }, [slug])

  return (
    <PageFrame title="Edit ad" subtitle="Edited approved ads return to pending approval.">
      <Alert type="info" message="After saving changes, this listing status will become Pending Approval." />
      {ad ? <AdForm mode="edit" ad={ad} /> : <Alert type="info" message="Loading ad details from the API." />}
    </PageFrame>
  )
}
