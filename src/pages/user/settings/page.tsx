import { useState } from 'react'
import { Alert } from '../../../components/ui/feedback'
import { PageFrame } from '../../../components/ui/page-frame'
import { Input } from '../../../components/forms/fields'
import { usePageTitle } from '../../../hooks/use-page-title'
import { changePassword, updateProfile } from '../../../services/user.service'

export default function SettingsPage({ auth }) {
  usePageTitle('Account Settings')
  const [profileMessage, setProfileMessage] = useState('')
  const [profileError, setProfileError] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')

  async function handleProfileSubmit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = (form.get('name') as string || '').trim()
    if (!name) { setProfileError('Name is required.'); return }
    setProfileError('')
    try {
      await updateProfile({ name })
      setProfileMessage('Name updated successfully.')
    } catch (err: any) {
      setProfileError(err.message || 'Could not update profile.')
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const currentPassword = form.get('currentPassword') as string
    const newPassword = form.get('newPassword') as string
    const confirmPassword = form.get('confirmPassword') as string
    if (!currentPassword || !newPassword) { setPasswordError('All fields are required.'); return }
    if (newPassword.length < 8) { setPasswordError('New password must be at least 8 characters.'); return }
    if (newPassword !== confirmPassword) { setPasswordError('Passwords do not match.'); return }
    setPasswordError('')
    try {
      await changePassword({ currentPassword, newPassword })
      setPasswordMessage('Password changed successfully.')
      ;(event.target as HTMLFormElement).reset()
    } catch (err: any) {
      setPasswordError(err.message || 'Could not change password.')
    }
  }

  return (
    <PageFrame title="Account settings" subtitle="Update your display name or change your password.">
      <div className="settings-grid">
        <section className="settings-section">
          <h2>Profile</h2>
          {profileMessage && <Alert type="success" message={profileMessage} />}
          {profileError && <Alert type="error" message={profileError} />}
          <form className="settings-form" onSubmit={handleProfileSubmit}>
            <Input
              label="Display name"
              name="name"
              type="text"
              defaultValue={auth.user?.name || ''}
              autoComplete="name"
            />
            <button className="primary-button" type="submit">Save name</button>
          </form>
        </section>

        <section className="settings-section">
          <h2>Change password</h2>
          {passwordMessage && <Alert type="success" message={passwordMessage} />}
          {passwordError && <Alert type="error" message={passwordError} />}
          <form className="settings-form" onSubmit={handlePasswordSubmit} autoComplete="off">
            <Input label="Current password" name="currentPassword" type="password" autoComplete="current-password" />
            <Input label="New password" name="newPassword" type="password" autoComplete="new-password" />
            <Input label="Confirm new password" name="confirmPassword" type="password" autoComplete="new-password" />
            <button className="primary-button" type="submit">Change password</button>
          </form>
        </section>
      </div>
    </PageFrame>
  )
}
