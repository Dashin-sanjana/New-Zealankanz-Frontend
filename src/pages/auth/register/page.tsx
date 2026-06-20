import { AuthForm } from '../../../components/forms/auth-form'
import { navigate } from '../../../lib/navigation'
import { usePageTitle } from '../../../hooks/use-page-title'

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
      onSubmit={(form) => {
        auth.login({ name: form['Full name'] || 'Marketplace User', email: form.Email, role: 'USER' })
        navigate('/dashboard')
      }}
    />
  )
}
