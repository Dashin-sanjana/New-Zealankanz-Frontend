export function navigate(to) {
  window.history.pushState({}, '', to)
  document.dispatchEvent(new Event('app:navigate'))
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
