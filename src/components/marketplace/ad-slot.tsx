import { Banner } from './banner'
import { getStoredAuth } from '../../services/api'
import { shouldShowAdPreview } from '../../lib/homepage-behavior.mjs'

const adSlots: Record<string, { placement?: string; compact?: boolean; fallbackPlacements: string[] }> = {
  HOME_AFTER_HERO: { placement: 'HOME', fallbackPlacements: [] },
  HOME_AFTER_CATEGORIES: { placement: 'HOME', fallbackPlacements: [] },
  HOME_SIDEBAR: { placement: 'SIDEBAR', compact: true, fallbackPlacements: [] },
  CATEGORY_TOP: { placement: 'CATEGORY', fallbackPlacements: [] },
  CATEGORY_AFTER_SEARCH: { placement: 'SIDEBAR', fallbackPlacements: [] },
  SEARCH_TOP: { placement: 'SIDEBAR', fallbackPlacements: [] },
  LISTING_SIDEBAR: { placement: 'LISTING', compact: true, fallbackPlacements: [] },
  FOOTER_TOP: { placement: 'FOOTER', fallbackPlacements: [] },
}

interface AdSlotProps {
  name: string
  compact?: boolean
  className?: string
  emptyMessage?: string
  preview?: boolean
}

export function AdSlot({ name, compact, className = '', emptyMessage, preview = false }: AdSlotProps) {
  const slot = adSlots[name] || { placement: name, fallbackPlacements: [] }
  let adminPreview = false
  try { adminPreview = getStoredAuth()?.user.role === 'ADMIN' } catch { /* Storage can be unavailable. */ }
  const showPreview = shouldShowAdPreview({ explicitPreview: preview, admin: adminPreview, query: window.location.search })

  return (
    <div className={`ad-slot ad-slot-${name.toLowerCase().replace(/_/g, '-')}${className ? ` ${className}` : ''}`}>
      <Banner
        placement={slot.placement || name}
        compact={compact ?? slot.compact}
        fallbackPlacements={slot.fallbackPlacements}
        emptyMessage={emptyMessage}
        preview={showPreview}
        slotName={name}
      />
    </div>
  )
}
