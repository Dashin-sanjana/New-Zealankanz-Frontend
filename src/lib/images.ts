export function fallbackImage(title = 'Listing') {
  const label = encodeURIComponent(title.split(' ').slice(0, 2).join(' ') || 'Listing')
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='620' viewBox='0 0 900 620'%3E%3Crect width='900' height='620' fill='%23eef3f6'/%3E%3Crect x='60' y='70' width='780' height='480' rx='34' fill='%23ffffff' stroke='%23d7e1e8'/%3E%3Ccircle cx='198' cy='220' r='70' fill='%23ffd43d'/%3E%3Cpath d='M112 460 330 296l128 96 92-72 238 140Z' fill='%23e7242e' opacity='.86'/%3E%3Ctext x='450' y='532' text-anchor='middle' font-family='Arial,sans-serif' font-size='44' font-weight='700' fill='%2317212b'%3E${label}%3C/text%3E%3C/svg%3E`
}

export function handleImageError(event, title) {
  event.currentTarget.onerror = null
  event.currentTarget.src = fallbackImage(title)
}
