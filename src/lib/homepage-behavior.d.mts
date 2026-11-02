export function nextSlideIndex(index: number, direction: number, slideCount: number): number
export function shouldAutoplay(state: { paused: boolean; reducedMotion: boolean }): boolean
export function shouldShowAdPreview(state: { explicitPreview: boolean; admin: boolean; query: string }): boolean
export function emptyBannerState(state: { hasBanner: boolean; preview: boolean; loading: boolean; error: string; emptyMessage: string }): 'banner' | 'preview' | 'loading' | 'error' | 'message' | 'hidden'
