import { AuthForm } from '../../../components/forms/auth-form'
import { usePageTitle } from '../../../hooks/use-page-title'
import { requestPasswordReset } from '../../../services/auth.service'

export default function ForgotPasswordPage() {
  usePageTitle('Forgot Password')
  const isDemoMode = import.meta.env.MODE === 'demo' && import.meta.env.VITE_DEMO_MODE === 'true'
  return (
    <AuthForm
      title="Forgot password"
      subtitle={isDemoMode ? 'Password reset email is disabled in this demo. Use a seeded demo account.' : "Enter your email and we'll send you a reset link."}
      buttonLabel="Send reset link"
      fields={['Email']}
      successMessage={isDemoMode ? 'Email delivery is disabled. Use a seeded demo account to continue.' : 'If that email is registered, a reset link has been sent. Check your inbox.'}
      onSubmit={(form) => requestPasswordReset(form.Email)}
    />
  )
}
