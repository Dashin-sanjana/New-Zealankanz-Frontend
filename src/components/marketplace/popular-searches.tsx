import { popularSearches } from '../../data/marketplace'
import { Link } from '../ui/link'
import { SectionHeader } from '../ui/section-header'

export function PopularSearches() {
  return (
    <section className="content-section popular-searches">
      <SectionHeader title="Popular searches" />
      <div className="popular-grid">
        {Object.entries(popularSearches).map(([group, links]) => (
          <div className="popular-column" key={group}>
            <h3>{group}</h3>
            {links.map((label) => (
              <Link key={label} to={`/search?q=${encodeURIComponent(label)}`}>
                {label}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
