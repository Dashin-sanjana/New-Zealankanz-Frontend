import { PageFrame } from '../../components/ui/page-frame'
import { usePageTitle } from '../../hooks/use-page-title'

export default function TermsPage() {
  usePageTitle('Terms of Service')
  return (
    <PageFrame title="Terms of service" subtitle="Please read these terms before using the NewZealankans Marketplace.">
      <div className="prose-page">
        <p>Last updated: June 2026</p>

        <h2>1. Acceptance of terms</h2>
        <p>
          By accessing or using the NewZealankans Marketplace ("the Service"), you agree to be bound by these Terms
          of Service. If you do not agree to these terms, you may not use the Service.
        </p>

        <h2>2. User accounts</h2>
        <p>
          You must register for an account to post ads. You are responsible for maintaining the confidentiality of your
          account credentials and for all activity that occurs under your account. You must provide accurate and complete
          information when registering.
        </p>

        <h2>3. Listing rules</h2>
        <p>
          All ads submitted to the marketplace are reviewed by our moderation team. You must not post listings that:
          are false, misleading, or fraudulent; infringe any third-party intellectual property rights; advertise illegal
          goods or services; contain offensive, threatening, or abusive content; or duplicate existing listings.
        </p>

        <h2>4. No guarantee of transactions</h2>
        <p>
          NewZealankans Marketplace is a platform for connecting buyers and sellers. We are not a party to any
          transaction between users and do not guarantee the quality, safety, or legality of items advertised.
        </p>

        <h2>5. Termination</h2>
        <p>
          We reserve the right to suspend or terminate any account, or remove any listing, that we determine in our
          sole discretion violates these terms or is otherwise inappropriate.
        </p>

        <h2>6. Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, NewZealankans Marketplace shall not be liable for any indirect,
          incidental, special, or consequential damages arising from your use of, or inability to use, the Service.
        </p>

        <h2>7. Changes to terms</h2>
        <p>
          We may update these Terms from time to time. Continued use of the Service after changes are posted
          constitutes your acceptance of the revised Terms.
        </p>

        <h2>8. Contact</h2>
        <p>
          Questions about these Terms? <a href="/contact">Contact us</a>.
        </p>
      </div>
    </PageFrame>
  )
}
