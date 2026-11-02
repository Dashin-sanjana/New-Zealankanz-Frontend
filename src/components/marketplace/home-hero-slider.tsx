import { useEffect, useState } from 'react'
import { nextSlideIndex, shouldAutoplay } from '../../lib/homepage-behavior.mjs'
import { SearchBar } from './search-bar'
import coastalImage from '../../assets/home-hero/coastal.jpg'
import countrysideImage from '../../assets/home-hero/countryside.jpg'
import neighbourhoodImage from '../../assets/home-hero/neighbourhood.jpg'

const slides = [
  { eyebrow: "Aotearoa's community marketplace", title: 'Good finds start close to home.', text: 'Discover homes, vehicles, jobs and services from people across New Zealand.', image: coastalImage },
  { eyebrow: 'Make room for what’s next', title: 'Find your next favourite.', text: 'Explore thoughtful finds and everyday essentials from local sellers.', image: countrysideImage },
  { eyebrow: 'Local buying, made simple', title: 'Your next chapter starts here.', text: 'Search trusted community listings across New Zealand.', image: neighbourhoodImage },
]

export function HomeHeroSlider() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!shouldAutoplay({ paused, reducedMotion })) return
    const timer = window.setInterval(() => setActive((index) => (index + 1) % slides.length), 6500)
    return () => window.clearInterval(timer)
  }, [paused, reducedMotion])

  const move = (direction: number) => setActive((index) => nextSlideIndex(index, direction, slides.length))
  const slide = slides[active]

  return (
    <section className="home-hero" aria-label="Marketplace introduction" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false) }} onTouchStart={() => setPaused(true)}>
      <div className="home-hero-media" aria-hidden="true">
        {slides.map((item, index) => <img key={item.image} className={active === index ? 'is-active' : ''} src={item.image} alt="" />)}
      </div>
      <div className="home-hero-copy" aria-live="polite" aria-atomic="true">
        <p className="eyebrow">{slide.eyebrow}</p>
        <h1 key={active}>{slide.title}</h1>
        <p>{slide.text}</p>
        <div className="home-hero-controls" aria-label="Hero slides">
          <button type="button" className="hero-arrow" aria-label="Previous slide" onClick={() => move(-1)}>‹</button>
          {slides.map((item, index) => <button key={item.title} type="button" className={`hero-dot${active === index ? ' is-active' : ''}`} aria-label={`Go to slide ${index + 1}`} aria-current={active === index ? 'true' : undefined} onClick={() => setActive(index)} />)}
          <button type="button" className="hero-arrow" aria-label="Next slide" onClick={() => move(1)}>›</button>
        </div>
      </div>
      <SearchBar preserveKeyword />
    </section>
  )
}
