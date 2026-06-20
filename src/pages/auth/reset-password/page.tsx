import { AuthForm } from '../../../components/forms/auth-form'
import { usePageTitle } from '../../../hooks/use-page-title'
import { resetPassword } from '../../../services/auth.service'

export default function ResetPasswordPage() {
  usePageTitle('Reset Password')
  return (
    <AuthForm
      title="Reset password"
      subtitle="Set a new password using the reset token from email."
      buttonLabel="Reset password"
      fields={['Token', 'New password']}
      onSubmit={(form) => resetPassword({ token: form.Token, password: form['New password'] })}
    />
  )
}
