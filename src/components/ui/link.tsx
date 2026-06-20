import React from 'react'
import { navigate } from '../../lib/navigation'

interface LinkProps {
  to: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
  style?: React.CSSProperties
}

export function Link({ to, children, className, onClick, style }: LinkProps) {
  return (
    <a
      className={className}
      href={to}
      style={style}
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
