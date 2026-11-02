const SOURCE_EVENTS = [
  {
    title: 'ආයු – ayu – New Zealand Screenings',
    detail: 'Auckland · 21 November 2026, 4:00 pm',
    date: '2026-11-21',
    href: 'https://newzealankans.co.nz/events-nz/2182/',
  },
  {
    title: 'එදා රෑ – Eda Ra – New Zealand Screenings',
    detail: 'Auckland · 7, 8, 14 & 15 November 2026',
    date: '2026-11-15',
    href: 'https://newzealankans.co.nz/events-nz/1795/',
  },
  {
    title: 'Infinity “අනන්තේ” Live in Auckland',
    detail: 'Auckland · 5 February 2027',
    date: '2027-02-05',
    href: 'https://newzealankans.co.nz/events-nz/1962/',
  },
] as const

export function CommunityEvents() {
  const upcoming = SOURCE_EVENTS.filter((event) => new Date(`${event.date}T23:59:59+13:00`).getTime() >= Date.now())
  if (upcoming.length === 0) return null

  return (
    <section className="content-section community-events" aria-labelledby="community-events-title">
      <div className="community-events-heading">
        <h2 id="community-events-title">Community events</h2>
        <a href="https://newzealankans.co.nz/events-nz/" target="_blank" rel="noreferrer">More from Newzealankans</a>
      </div>
      <div className="community-event-grid">
        {upcoming.map((event) => (
          <article className="community-event-card" key={event.href}>
            <span className="community-event-source">From Newzealankans</span>
            <h3>{event.title}</h3>
            <p>{event.detail}</p>
            <a href={event.href} target="_blank" rel="noreferrer">View original event</a>
          </article>
        ))}
      </div>
    </section>
  )
}
