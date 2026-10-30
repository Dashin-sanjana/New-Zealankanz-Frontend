import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react'
import type { SelectOption } from '../../types/marketplace'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  name?: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  name?: string
  options: Array<SelectOption | string>
}

export function Input({ label, name = label, type = 'text', ...props }: InputProps) {
  const id = props.id || `${name}`.replace(/\s+/g, '-').toLowerCase()
  return (
    <label htmlFor={id}>
      {label}
      <input id={id} name={name} type={type} placeholder={label} {...props} />
    </label>
  )
}

export function Select({ label, name = label, options, ...props }: SelectProps) {
  const id = props.id || `${name}`.replace(/\s+/g, '-').toLowerCase()
  return (
    <label htmlFor={id}>
      {label}
      <select id={id} name={name} aria-label={label} {...props}>
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => {
          const value = typeof option === 'string' ? option : option.value
          const optionLabel = typeof option === 'string' ? option : option.label
          return (
          <option key={value} value={value}>
            {optionLabel}
          </option>
          )
        })}
      </select>
    </label>
  )
}
