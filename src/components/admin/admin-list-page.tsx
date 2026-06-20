import { PageFrame } from '../ui/page-frame'

export function AdminListPage({ title, subtitle, rows, actions, onAction }) {
  return (
    <PageFrame title={title} subtitle={subtitle}>
      <div className="table-card">
        {rows.map((row) => (
          <div className="table-row admin-row" key={row.id}>
            <div>
              <strong>{row.title}</strong>
              <span>{row.category} / {row.location}</span>
            </div>
            <span className={`status ${row.status.toLowerCase()}`}>{row.status}</span>
            <div className="row-actions">
              {actions.map((action) => (
                <button key={action} type="button" className="ghost-button" onClick={() => onAction?.(action, row)}>
                  {action}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageFrame>
  )
}
