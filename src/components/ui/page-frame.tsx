import React from 'react'

interface PageFrameProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
}

export function PageFrame({ title, subtitle, children }: PageFrameProps) {
  return (
    <section className="page-frame">
      <div className="page-heading">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}
