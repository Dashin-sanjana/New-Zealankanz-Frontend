export function Input({ label, name = label, type = 'text', ...props }) {
  const id = props.id || `${name}`.replace(/\s+/g, '-').toLowerCase()
  return (
    <label htmlFor={id}>
      {label}
      <input id={id} name={name} type={type} placeholder={label} {...props} />
    </label>
  )
}

export function Select({ label, name = label, options, ...props }) {
  const id = props.id || `${name}`.replace(/\s+/g, '-').toLowerCase()
  return (
    <label htmlFor={id}>
      {label}
      <select id={id} name={name} aria-label={label} {...props}>
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option.value || option} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
    </label>
  )
}
