import { useState } from 'react'
import { Input } from '../../components/forms/fields'
import { Alert } from '../../components/ui/feedback'
import { PageFrame } from '../../components/ui/page-frame'
import { usePageTitle } from '../../hooks/use-page-title'
import { submitContact } from '../../services/contact.service'
import type { ContactPayload } from '../../services/contact.service'
import type { FormEvent } from 'react'

export default function ContactPage() {
  usePageTitle('Contact')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  return (
    <PageFrame title="Contact" subtitle="Send a marketplace support or advertising enquiry.">
      {submitted && <Alert type="success" message="Message submitted. Admin has been notified." />}
      {error && <Alert type="error" message={error} />}
      <form
        className="form-card"
        onSubmit={async (event: FormEvent<HTMLFormElement>) => {
          event.preventDefault()
          setSubmitting(true)
          setError('')
          setSubmitted(false)
          const form = new FormData(event.currentTarget)
          const payload: ContactPayload = {
            name: String(form.get('name') || ''),
            email: String(form.get('email') || ''),
            subject: String(form.get('subject') || ''),
            message: String(form.get('message') || ''),
          }
          try {
            await submitContact(payload)
            setSubmitted(true)
            event.currentTarget.reset()
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not submit this message.')
          } finally {
            setSubmitting(false)
          }
        }}
      >
        <Input label="Name" name="name" required />
        <Input label="Email" name="email" type="email" required />
        <Input label="Subject" name="subject" required />
        <label>
          Message
          <textarea name="message" rows={5} required placeholder="How can we help?" />
        </label>
        <button className="primary-button" type="submit" disabled={submitting}>
          {submitting ? 'Sending...' : 'Send message'}
        </button>
      </form>
    </PageFrame>
  )
}
