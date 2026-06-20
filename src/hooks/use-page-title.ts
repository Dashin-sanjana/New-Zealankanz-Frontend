import { useEffect } from 'react'

const SITE_NAME = 'NewZealankans Marketplace'
const DEFAULT_DESCRIPTION =
  'Browse, post, and manage New Zealand marketplace ads — property, motors, jobs, and services across all NZ cities.'
const DEFAULT_IMAGE = 'https://newzealankans.nz/og-default.jpg'

type OgOptions = {
  description?: string
  image?: string
  type?: 'website' | 'article' | 'product'
  url?: string
}

function setMeta(name: string, content: string, property = false) {
  const attr = property ? 'property' : 'name'
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function usePageTitle(title: string, og?: OgOptions) {
  useEffect(() => {
    const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`
    document.title = fullTitle

    const description = og?.description ?? DEFAULT_DESCRIPTION
    const image = og?.image ?? DEFAULT_IMAGE
    const url = og?.url ?? window.location.href
    const type = og?.type ?? 'website'

    // Standard meta
    setMeta('description', description)

    // Open Graph
    setMeta('og:site_name', SITE_NAME, true)
    setMeta('og:title', fullTitle, true)
    setMeta('og:description', description, true)
    setMeta('og:image', image, true)
    setMeta('og:url', url, true)
    setMeta('og:type', type, true)

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', fullTitle)
    setMeta('twitter:description', description)
    setMeta('twitter:image', image)
  }, [title, og?.description, og?.image, og?.url, og?.type])
}
