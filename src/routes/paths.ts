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
  TOOLS_CENTRAL_LAB: '/tools/central-lab-helper',
  TOOLS_ITEM_COST: '/tools/item-cost-calculator',
  TOOLS_MP_JIGSAW: '/tools/mp-jigsaw-calculator',
  TOOLS_REFINE_SIMULATOR: '/tools/refine-simulator',
  TOOLS_ZENY_CALCULATOR: '/tools/zeny-calculator',
  // Misc
  CHANGELOG: '/changelog',
  COMING_SOON: '/coming-soon',
} as const

export type AppPath = (typeof PATHS)[keyof typeof PATHS]
