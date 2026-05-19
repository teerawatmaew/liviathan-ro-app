// ─── Element ──────────────────────────────────────────────────────────────────
// Types moved to src/types/index.ts — imported for internal use + re-exported for backward compat
import type { ElementType, ElementLevel, RaceType, SizeType } from '@/types'
export type { ELEMENTS, ElementType, ElementLevel, ElementTable, ElementTables } from '@/types'

// ─── Race & Size ──────────────────────────────────────────────────────────────
export type { RACES, RaceType, SizeType } from '@/types'

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
// (ElementTable and ElementTables types moved to src/types/index.ts)
