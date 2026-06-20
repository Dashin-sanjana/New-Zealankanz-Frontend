import { AuthForm } from '../../../components/forms/auth-form'
import { navigate } from '../../../lib/navigation'
import { usePageTitle } from '../../../hooks/use-page-title'
import { loginAccount } from '../../../services/auth.service'

export default function LoginPage({ auth }) {
  usePageTitle('Login')
  return (
    <AuthForm
      title="Login"
      subtitle="Access your listings, saved searches, and marketplace dashboard."
      buttonLabel="Login"
      fields={['Email', 'Password']}
      disableAutofill
      eyebrow="Welcome back"
      panelTitle="Pick up where your marketplace left off."
      panelText="Review enquiries, manage live ads, and keep your local trading activity moving."
      footerText="New to NewZealankans?"
      footerLinkLabel="Create account"
      footerLinkTo="/register"
      onSubmit={async (form) => {
        const result = await loginAccount({
          email: form.Email,
          password: form.Password,
        })
        auth.login(result)
        navigate('/dashboard')
      }}
    />
  )
}
