import { useEffect, useState } from 'react'

export function useRoute() {
  const [path, setPath] = useState(window.location.pathname + window.location.search)

  useEffect(() => {
    const update = () => setPath(window.location.pathname + window.location.search)
    window.addEventListener('popstate', update)
    document.addEventListener('app:navigate', update)
    return () => {
      window.removeEventListener('popstate', update)
      document.removeEventListener('app:navigate', update)
    }
  }, [])

  return path
}
