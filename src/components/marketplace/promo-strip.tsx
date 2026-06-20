import { Link } from '../ui/link'

const promos = [
  ['List a vehicle', 'Reach buyers across New Zealand'],
  ['Marketplace', 'Shop fresh local finds'],
  ['New feature', 'Shared watchlists for favourites'],
]

export function PromoStrip() {
  return (
    <section className="promo-strip" aria-label="Promotions">
      {promos.map(([title, text]) => (
        <Link key={title} to="/search" className="promo-tile">
          <span>{title}</span>
          <strong>{text}</strong>
        </Link>
      ))}
    </section>
  )
}
