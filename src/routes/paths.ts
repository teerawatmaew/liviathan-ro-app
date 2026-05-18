/**
 * Centralised route path constants.
 * Import PATHS everywhere instead of hardcoding URL strings.
 */
export const PATHS = {
  HOME: '/',
  // Content
  CONTENT: '/content',
  CONTENT_DETAIL: '/content/:slug',
  // Gallery
  GALLERY: '/gallery',
  // Tools / Calculators
  TOOLS: '/tools',
  TOOLS_STAT: '/tools/stat',
  TOOLS_DAMAGE: '/tools/damage',
  TOOLS_SWITCH: '/tools/switch',
  TOOLS_ENHANCEMENT: '/tools/enhancement',
} as const

export type AppPath = (typeof PATHS)[keyof typeof PATHS]
