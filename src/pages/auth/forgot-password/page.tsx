import { AuthForm } from '../../../components/forms/auth-form'
import { usePageTitle } from '../../../hooks/use-page-title'
import { requestPasswordReset } from '../../../services/auth.service'

export default function ForgotPasswordPage() {
  usePageTitle('Forgot Password')
  return (
    <AuthForm
      title="Forgot password"
      subtitle="Request a password reset email from the backend."
      buttonLabel="Send reset link"
      fields={['Email']}
      onSubmit={(form) => requestPasswordReset(form.Email)}
    />
  )
}
