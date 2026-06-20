import { AuthForm } from '../../../components/forms/auth-form'
import { navigate } from '../../../lib/navigation'
import { usePageTitle } from '../../../hooks/use-page-title'
import { registerAccount, loginAccount } from '../../../services/auth.service'

export default function RegisterPage({ auth }) {
  usePageTitle('Register')
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
      footerLinkTo="/login"
      successMessage="Account created! Check your email to verify your address, then continue to your dashboard."
      onSubmit={async (form) => {
        await registerAccount({
          firstName: form['Full name'],
          lastName: '',
          email: form.Email,
          password: form.Password,
        })
        // Auto-login so user lands on dashboard with email-verify banner
        const result = await loginAccount({ email: form.Email, password: form.Password })
        auth.login(result)
        // Short delay lets the success message render before navigating
        setTimeout(() => navigate('/dashboard'), 1500)
      }}
    />
  )
}
