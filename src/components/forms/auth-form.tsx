import { useState } from 'react'
import { Input } from './fields'
import { Alert } from '../ui/feedback'
import { Link } from '../ui/link'

function getInputType(field: string): string {
  if (field.toLowerCase().includes('password')) return 'password'
  if (field.toLowerCase().includes('email')) return 'email'
  return 'text'
}

function getAutoComplete(field: string, disableAutofill: boolean): string | undefined {
  if (!disableAutofill) return undefined
  if (field.toLowerCase().includes('password')) return 'new-password'
  return 'off'
}

function validateAuthForm(form: Record<string, any>, fields: string[]): Record<string, string> {
  const errors: Record<string, string> = {}
  const isRegister = fields.includes('Full name')

  fields.forEach((field) => {
    const value = String(form[field] || '').trim()
    const fieldKey = field.toLowerCase()

    if (!value) {
      errors[field] = `${field} is required.`
      return
    }

    if (fieldKey.includes('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors[field] = 'Enter a valid email address.'
    }

    if (field === 'Full name' && value.length < 2) {
      errors[field] = 'Enter your full name.'
    }

    if (isRegister && fieldKey.includes('password') && value.length < 8) {
      errors[field] = 'Password must be at least 8 characters.'
    }
  })

  return errors
}

const authHighlights = [
  ['Post in minutes', 'Create listings for property, motors, jobs, and services.'],
  ['Local reach', 'Connect with buyers and sellers across New Zealand.'],
  ['Admin reviewed', 'Listings stay moderated before they go live.'],
]

interface AuthFormProps {
  title: string
  subtitle: string
  fields: string[]
  buttonLabel: string
  onSubmit: (form: Record<string, any>) => void | Promise<void>
  disableAutofill?: boolean
  eyebrow?: string
  panelTitle?: string
  panelText?: string
  footerText?: string
  footerLinkLabel?: string
  footerLinkTo?: string
  successMessage?: string
}

export function AuthForm({
  title,
  subtitle,
  fields,
  buttonLabel,
  onSubmit,
  disableAutofill = false,
  eyebrow = 'Marketplace account',
  panelTitle = 'A sharper way to trade locally.',
  panelText = 'Manage listings, favourites, and local enquiries from one simple account.',
  footerText,
  footerLinkLabel,
  footerLinkTo,
  successMessage = 'Request submitted successfully.',
}: AuthFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  return (
    <section className="auth-page">
      <div className="auth-panel" aria-hidden="true">
        <span className="auth-eyebrow">{eyebrow}</span>
        <h1>{panelTitle}</h1>
        <p>{panelText}</p>
        <div className="auth-preview">
          <span className="auth-preview-bar" />
          <div>
            <strong>Sunny two bedroom unit</strong>
            <small>Auckland / $620 week</small>
          </div>
          <span className="auth-preview-price">$620</span>
        </div>
        <div className="auth-highlight-grid">
          {authHighlights.map(([label, text]) => (
            <span key={label}>
              <strong>{label}</strong>
              {text}
            </span>
          ))}
        </div>
      </div>
      <div className="auth-card">
        <div className="auth-card-heading">
          <span>{eyebrow}</span>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        {submitted && <Alert type="success" message={successMessage} />}
        {apiError && !submitted && <Alert type="error" message={apiError} />}
        <form
          className="auth-form"
          autoComplete={disableAutofill ? 'off' : undefined}
          noValidate
          onSubmit={async (event) => {
            event.preventDefault()
            const form = Object.fromEntries(new FormData(event.currentTarget))
            const validationErrors = validateAuthForm(form, fields)

            if (Object.keys(validationErrors).length > 0) {
              setErrors(validationErrors)
              setSubmitted(false)
              return
            }

            setErrors({})
            setApiError('')
            setLoading(true)
            try {
              await onSubmit?.(form)
              setSubmitted(true)
            } catch (err) {
              setApiError(err instanceof Error ? err.message : 'An error occurred. Please try again.')
            } finally {
              setLoading(false)
            }
          }}
        >
          {fields.map((field) => (
            <div className="auth-field" key={field}>
              <Input
                label={field}
                name={field}
                type={getInputType(field)}
                autoComplete={getAutoComplete(field, disableAutofill)}
                aria-invalid={errors[field] ? 'true' : undefined}
                aria-describedby={errors[field] ? `${field.replace(/\s+/g, '-').toLowerCase()}-error` : undefined}
                onInput={() => {
                  if (!errors[field]) return
                  setErrors((currentErrors) => {
                    const nextErrors = { ...currentErrors }
                    delete nextErrors[field]
                    return nextErrors
                  })
                }}
              />
              {errors[field] && (
                <small className="auth-error" id={`${field.replace(/\s+/g, '-').toLowerCase()}-error`}>
                  {errors[field]}
                </small>
              )}
            </div>
          ))}
          <button className="primary-button full auth-submit" type="submit" disabled={loading}>
            {loading ? 'Please wait...' : buttonLabel}
          </button>
        </form>
        {footerText && footerLinkTo && (
          <p className="auth-switch">
            {footerText} <Link to={footerLinkTo}>{footerLinkLabel}</Link>
          </p>
        )}
      </div>
    </section>
  )
}
