import { AuthForm } from '../../../components/forms/auth-form'
import { getReturnPath, navigate } from '../../../lib/navigation'
import { usePageTitle } from '../../../hooks/use-page-title'
import { registerAccount, loginAccount, verifyEmail } from '../../../services/auth.service'
import type { AuthState } from '../../../types/auth'

export default function RegisterPage({ auth }: { auth: AuthState }) {
  usePageTitle('Register')
  const isDemoMode = import.meta.env.MODE === 'demo' && import.meta.env.VITE_DEMO_MODE === 'true'
  return (
    <AuthForm
      title="Create account"
      subtitle="Register to post and manage marketplace ads."
      buttonLabel="Create account"
      fields={['Full name', 'Email', 'Password']}
      disableAutofill
      eyebrow="Join NewZealankans"
      panelTitle="Turn local finds into fresh listings."
      panelText="Create a seller profile, publish reviewed ads, and keep every marketplace conversation close."
      footerText="Already have an account?"
      footerLinkLabel="Login"
      footerLinkTo={`/login?returnTo=${encodeURIComponent(getReturnPath())}`}
      successMessage={isDemoMode ? 'Demo account created and verified locally. No email was sent.' : 'Account created! Check your email to verify your address, then continue to your dashboard.'}
      onSubmit={async (form: Record<string, string>) => {
        const registration = await registerAccount({
          firstName: form['Full name'],
          lastName: '',
          email: form.Email,
          password: form.Password,
        })
        if (registration.demoVerificationToken) await verifyEmail(registration.demoVerificationToken)
        // Auto-login so user lands on dashboard with email-verify banner
        const result = await loginAccount({ email: form.Email, password: form.Password })
        auth.login(result)
        // Short delay lets the success message render before navigating
        setTimeout(() => navigate(getReturnPath()), 1500)
      }}
    />
  )
}
