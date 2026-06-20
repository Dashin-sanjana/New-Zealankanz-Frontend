import { PageFrame } from '../../components/ui/page-frame'
import { usePageTitle } from '../../hooks/use-page-title'

export default function AboutPage() {
  usePageTitle('About')
  return (
    <PageFrame title="About NewZealankans" subtitle="A local marketplace built for New Zealand communities.">
      <div className="prose-page">
        <p>
          NewZealankans Marketplace is a free classifieds platform connecting buyers and sellers across New Zealand.
          Whether you're looking for property, a second-hand car, local jobs, or everyday services, you'll find
          reviewed, approved listings from people in your community.
        </p>
        <h2>Our mission</h2>
        <p>
          We believe local trading should be simple, safe, and accessible. Every ad submitted to NewZealankans
          is reviewed by our moderation team before it goes live, keeping the marketplace clean and trustworthy.
        </p>
        <h2>What we cover</h2>
        <p>
          Our four main categories — Property, Motors, Jobs, and Services — cover the most common needs of
          New Zealanders. Listings are filtered by city, so you always see results relevant to where you are.
        </p>
        <h2>Get in touch</h2>
        <p>
          Have a question, feedback, or need to report a listing? Visit our <a href="/contact">contact page</a> and
          we'll get back to you as soon as possible.
        </p>
      </div>
    </PageFrame>
  )
}
