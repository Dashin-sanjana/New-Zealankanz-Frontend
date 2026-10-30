import { useEffect, useState } from 'react'
import { AdForm } from '../../../components/forms/ad-form'
import { Alert } from '../../../components/ui/feedback'
import { PageFrame } from '../../../components/ui/page-frame'
import { usePageTitle } from '../../../hooks/use-page-title'
import { getAdBySlug, getMyAds } from '../../../services/ads.service'
import type { MarketplaceAd } from '../../../services/ads.service'

export default function EditAdPage({ slug }: { slug?: string }) {
  const [ad, setAd] = useState<MarketplaceAd | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)
  usePageTitle('Edit Ad')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    async function loadAd() {
      try {
        const publicAd = await getAdBySlug(slug || '')
        if (active && publicAd) setAd(publicAd)
        else if (active) throw new Error('Listing not found.')
      } catch {
        try {
          const items = await getMyAds()
          const ownedAd = items.find((item) => item.slug === slug) || null
          if (active) {
            setAd(ownedAd)
            if (!ownedAd) setError('This ad couldn’t be loaded. It may have been removed or is no longer available to your account.')
          }
        } catch (err) {
          if (active) setError(err instanceof Error ? err.message : 'This ad couldn’t be loaded. Please try again.')
        }
      } finally {
        if (active) setLoading(false)
      }
    }
    loadAd()
    return () => { active = false }
  }, [slug, retry])

  return (
    <PageFrame title="Edit ad" subtitle="Edited approved ads return to pending approval.">
      <Alert type="info" message="After saving changes, this listing status will become Pending Approval." />
      {error && <Alert type="error" message={error} onRetry={() => setRetry((value) => value + 1)} />}
      {loading ? <p role="status">Loading ad details…</p> : ad ? <AdForm mode="edit" ad={ad} /> : null}
    </PageFrame>
  )
}
