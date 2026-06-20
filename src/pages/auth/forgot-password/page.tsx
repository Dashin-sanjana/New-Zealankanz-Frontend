import { AuthForm } from '../../../components/forms/auth-form'
import { usePageTitle } from '../../../hooks/use-page-title'
import { requestPasswordReset } from '../../../services/auth.service'

export default function ForgotPasswordPage() {
  usePageTitle('Forgot Password')
  return (
    <AuthForm
      title="Forgot password"
      subtitle="Enter your email and we'll send you a reset link."
      buttonLabel="Send reset link"
      fields={['Email']}
      successMessage="If that email is registered, a reset link has been sent. Check your inbox."
      onSubmit={(form) => requestPasswordReset(form.Email)}
    />
  )
}
