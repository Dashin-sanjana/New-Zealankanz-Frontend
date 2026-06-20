import { PageFrame } from '../../components/ui/page-frame'
import { usePageTitle } from '../../hooks/use-page-title'

export default function PrivacyPage() {
  usePageTitle('Privacy Policy')
  return (
    <PageFrame title="Privacy policy" subtitle="How NewZealankans Marketplace collects and uses your information.">
      <div className="prose-page">
        <p>Last updated: June 2026</p>

        <h2>1. Information we collect</h2>
        <p>
          When you register, we collect your name and email address. When you post an ad, we collect the listing
          content you provide. We also collect standard server logs including IP addresses and browser information.
        </p>

        <h2>2. How we use your information</h2>
        <p>
          We use your information to operate the marketplace — creating your account, publishing your ads, sending
          account-related emails (verification, password reset, enquiry notifications), and communicating with you
          about your listings.
        </p>

        <h2>3. Sharing of information</h2>
        <p>
          We do not sell or rent your personal information to third parties. Your contact name is displayed on your
          listings. Your email address is only shared with other users through the enquiry system, and only when
          you choose to list it.
        </p>

        <h2>4. Data retention</h2>
        <p>
          We retain your account information and listings for as long as your account is active. You may request
          deletion of your account and associated data by contacting us.
        </p>

        <h2>5. Cookies</h2>
        <p>
          We use a single session cookie to keep you logged in. We do not use tracking cookies or third-party
          advertising cookies.
        </p>

        <h2>6. Your rights</h2>
        <p>
          Under the New Zealand Privacy Act 2020, you have the right to access and correct personal information
          we hold about you. To exercise these rights, <a href="/contact">contact us</a>.
        </p>

        <h2>7. Changes to this policy</h2>
        <p>
          We may update this policy from time to time. We will notify registered users of significant changes by email.
        </p>
      </div>
    </PageFrame>
  )
}
