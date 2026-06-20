import React from 'react'
import { navigate } from '../../lib/navigation'

interface LinkProps {
  to: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function Link({ to, children, className, onClick }: LinkProps) {
  return (
    <a
      className={className}
      href={to}
      onClick={(event) => {
        event.preventDefault()
        onClick?.()
        navigate(to)
      }}
    >
      {children}
    </a>
  )
}
