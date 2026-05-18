// ─── Element ──────────────────────────────────────────────────────────────────

export const ELEMENTS = [
  'Neutral',
  'Water',
  'Earth',
  'Fire',
  'Wind',
  'Poison',
  'Holy',
  'Shadow',
  'Ghost',
  'Undead',
] as const

export type ElementType = (typeof ELEMENTS)[number]
export type ElementLevel = 1 | 2 | 3 | 4

// ─── Race ─────────────────────────────────────────────────────────────────────

export const RACES = [
  'Angel',
  'Brute',
  'Demi-Human',
  'Demon',
  'Dragon',
  'Fish',
  'Formless',
  'Insect',
  'Plant',
  'Undead',
] as const

export type RaceType = (typeof RACES)[number]

// ─── Size ─────────────────────────────────────────────────────────────────────

export type SizeType = 'Small' | 'Medium' | 'Large'

// ─── Stage ────────────────────────────────────────────────────────────────────

export type StageType = 'mini' | 1 | 2 | 3

// ─── Boss ─────────────────────────────────────────────────────────────────────

export interface Boss {
  /** Unique identifier (slugified name) */
  id: string
  /** Display name */
  name: string
  /** Defending element type */
  element: ElementType
  /** Defending element level (1–4) */
  elementLevel: ElementLevel
  /** Monster race */
  race: RaceType
  /** Monster size */
  size: SizeType
  /** Which stage this boss can appear in */
  stage: StageType
  /** Short tip shown in the UI */
  notes?: string
}

// ─── ElementTable ─────────────────────────────────────────────────────────────

/**
 * elementTables[level][defenderElement][attackerElement] = damage %
 *
 * Row  → defender element
 * Col  → attacker element
 * Source: https://irowiki.org/wiki/Elements
 */
export type ElementTable = Record<ElementType, Record<ElementType, number>>
export type ElementTables = Record<ElementLevel, ElementTable>
