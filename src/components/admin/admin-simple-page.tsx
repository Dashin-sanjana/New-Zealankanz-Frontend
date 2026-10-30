import { PageFrame } from '../ui/page-frame'
import type { AdminItem } from '../../types/marketplace'

interface AdminSimplePageProps {
  title: string
  subtitle: string
  items: AdminItem[]
  onAdd?: () => void
  onEdit?: (item: AdminItem) => void
  onDisable?: (item: AdminItem) => void
}

export function AdminSimplePage({ title, subtitle, items, onAdd, onEdit, onDisable }: AdminSimplePageProps) {
  return (
    <PageFrame title={title} subtitle={subtitle}>
      <div className="admin-toolbar">
        {onAdd && <button className="primary-button" type="button" onClick={onAdd}>Add new</button>}
      </div>
      <div className="table-card">
        {items.map((item) => (
          <div className="table-row" key={item.id || item.label || item.name || item.title}>
            <strong>{item.label || item.name || item.title}</strong>
            <div className="row-actions">
              {onEdit && <button className="ghost-button" type="button" onClick={() => onEdit(item)}>Edit</button>}
              {onDisable && <button className="ghost-button" type="button" onClick={() => onDisable(item)}>Disable</button>}
            </div>
          </div>
        ))}
      </div>
    </PageFrame>
  )
}
