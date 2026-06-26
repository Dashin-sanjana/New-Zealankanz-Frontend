import { Banner } from './banner'

const adSlots: Record<string, { compact?: boolean; fallbackPlacements: string[] }> = {
  HOME_AFTER_HERO: { fallbackPlacements: ['HOME'] },
  HOME_SIDEBAR: { compact: true, fallbackPlacements: ['SIDEBAR'] },
  CATEGORY_TOP: { fallbackPlacements: ['CATEGORY'] },
  CATEGORY_AFTER_SEARCH: { fallbackPlacements: [] },
  SEARCH_TOP: { fallbackPlacements: [] },
  LISTING_SIDEBAR: { compact: true, fallbackPlacements: ['LISTING'] },
  FOOTER_TOP: { fallbackPlacements: ['FOOTER'] },
}

interface AdSlotProps {
  name: string
  compact?: boolean
  className?: string
}

export function AdSlot({ name, compact, className = '' }: AdSlotProps) {
  const slot = adSlots[name] || {}

  return (
    <div className={`ad-slot ad-slot-${name.toLowerCase().replaceAll('_', '-')}${className ? ` ${className}` : ''}`}>
      <Banner
        placement={name}
        compact={compact ?? slot.compact}
        fallbackPlacements={slot.fallbackPlacements}
      />
    </div>
  )
}
