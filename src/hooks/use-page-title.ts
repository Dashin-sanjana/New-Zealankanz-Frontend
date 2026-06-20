import { useEffect } from 'react'

export function usePageTitle(title) {
  useEffect(() => {
    document.title = `${title} | NewZealankans Marketplace`
    const description =
      document.querySelector('meta[name="description"]') || document.createElement('meta')
    description.setAttribute('name', 'description')
    description.setAttribute(
      'content',
      'Browse, post, and manage New Zealand marketplace ads with categories, city filters, and admin approval.',
    )
    document.head.appendChild(description)
  }, [title])
}
