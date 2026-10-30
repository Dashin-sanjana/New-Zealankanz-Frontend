import { Banner } from './banner'

const adSlots: Record<string, { placement?: string; compact?: boolean; fallbackPlacements: string[] }> = {
  HOME_AFTER_HERO: { placement: 'HOME', fallbackPlacements: [] },
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
}

export function AdSlot({ name, compact, className = '', emptyMessage }: AdSlotProps) {
  const slot = adSlots[name] || { placement: name, fallbackPlacements: [] }

  return (
    <div className={`ad-slot ad-slot-${name.toLowerCase().replace(/_/g, '-')}${className ? ` ${className}` : ''}`}>
      <Banner
        placement={slot.placement || name}
        compact={compact ?? slot.compact}
        fallbackPlacements={slot.fallbackPlacements}
        emptyMessage={emptyMessage}
      />
    </div>
  )
}
