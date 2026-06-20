export function PageFrame({ title, subtitle, children }) {
  return (
    <section className="page-frame">
      <div className="page-heading">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {children}
    </section>
  )
}
