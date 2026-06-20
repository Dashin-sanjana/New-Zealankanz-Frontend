import { Link } from '../ui/link'

const promos = [
  { icon: '📸', label: 'Free to list', text: 'Post ads in minutes — no fees, no catch', to: '/post-ad' },
  { icon: '✅', label: 'Admin reviewed', text: 'Every listing is checked before going live', to: '/search' },
  { icon: '⭐', label: 'Watchlist', text: 'Save and track your favourite finds', to: '/watchlist' },
]

export function PromoStrip() {
  return (
    <section className="promo-strip" aria-label="Promotions">
      {promos.map((promo) => (
        <Link key={promo.label} to={promo.to} className="promo-tile">
          <span className="promo-icon" aria-hidden="true">{promo.icon}</span>
          <span className="promo-label">{promo.label}</span>
          <strong>{promo.text}</strong>
        </Link>
      ))}
    </section>
  )
}
