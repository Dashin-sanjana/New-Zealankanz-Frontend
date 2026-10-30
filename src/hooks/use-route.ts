import { useEffect, useState } from 'react'

export function useRoute() {
  const [path, setPath] = useState(window.location.pathname + window.location.search)

  useEffect(() => {
    window.history.scrollRestoration = 'manual'
    const update = () => {
      setPath(window.location.pathname + window.location.search)
      const targetY = Number(window.history.state?.scrollY) || 0
      window.requestAnimationFrame(() => window.scrollTo({ top: targetY, behavior: 'instant' }))
    }
    window.addEventListener('popstate', update)
    document.addEventListener('app:navigate', update)
    return () => {
      window.removeEventListener('popstate', update)
      document.removeEventListener('app:navigate', update)
    }
  }, [])

  return path
}
