export function navigate(to: string): void {
  const currentState = window.history.state && typeof window.history.state === 'object'
    ? window.history.state as Record<string, unknown>
    : {}
  window.history.replaceState({ ...currentState, scrollY: window.scrollY }, '', window.location.href)
  window.history.pushState({ scrollY: 0 }, '', to)
  document.dispatchEvent(new Event('app:navigate'))
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export function getReturnPath(fallback = '/dashboard'): string {
  const path = new URLSearchParams(window.location.search).get('returnTo')
  return path?.startsWith('/') && !path.startsWith('//') && !path.includes('\\') && path !== '/login'
    ? path
    : fallback
}

export function navigateToPage(path: string, currentQuery: URLSearchParams, page: number): void {
  const query = new URLSearchParams(currentQuery)
  if (page > 1) query.set('page', String(page))
  else query.delete('page')
  const queryString = query.toString()
  navigate(queryString ? `${path}?${queryString}` : path)
}
