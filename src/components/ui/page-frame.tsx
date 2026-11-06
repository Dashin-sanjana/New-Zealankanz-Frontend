import React from 'react'

interface PageFrameProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
  className?: string
}

export function PageFrame({ title, subtitle, children, className = '' }: PageFrameProps) {
  return (
    <section className={`page-frame${className ? ` ${className}` : ''}`}>
      <div className="page-heading">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}
