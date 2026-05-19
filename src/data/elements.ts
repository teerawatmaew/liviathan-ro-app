import type { ElementTables, ElementType, ElementLevel } from '@/types'

/**
 * Element damage table for all defender levels (1–4).
 *
 * Usage:
 *   elementTables[defenderLevel][defenderElement][attackerElement]
 *   → damage multiplier in %
 *
 * e.g. Boss is Water Lv 4, player uses Fire weapon:
 *   elementTables[4]['Water']['Fire'] → 60  (60% damage, Fire is weak vs Water)
 *
 * Source: https://irowiki.org/wiki/Elements
 */
export const elementTables: ElementTables = {
  // ── Level 1 ──────────────────────────────────────────────────────────────
  1: {
    //            Neutral  Water  Earth  Fire  Wind  Poison  Holy  Shadow  Ghost  Undead
    Neutral: { Neutral: 100, Water: 100, Earth: 100, Fire: 100, Wind: 100, Poison: 100, Holy: 100, Shadow: 100, Ghost:  90, Undead: 100 },
    Water:   { Neutral: 100, Water:  25, Earth: 100, Fire:  90, Wind: 150, Poison: 150, Holy: 100, Shadow: 100, Ghost: 100, Undead: 100 },
    Earth:   { Neutral: 100, Water: 100, Earth:  25, Fire: 150, Wind:  90, Poison: 150, Holy: 100, Shadow: 100, Ghost: 100, Undead: 100 },
    Fire:    { Neutral: 100, Water: 150, Earth:  90, Fire:  25, Wind: 100, Poison: 150, Holy: 100, Shadow: 100, Ghost: 100, Undead:  90 },
    Wind:    { Neutral: 100, Water:  90, Earth: 150, Fire: 100, Wind:  25, Poison: 150, Holy: 100, Shadow: 100, Ghost: 100, Undead: 100 },
    Poison:  { Neutral: 100, Water: 150, Earth: 150, Fire: 150, Wind: 150, Poison:   0, Holy:  75, Shadow:  75, Ghost:  75, Undead:  75 },
    Holy:    { Neutral: 100, Water: 100, Earth: 100, Fire: 100, Wind: 100, Poison:  75, Holy:   0, Shadow: 125, Ghost:  90, Undead: 125 },
    Shadow:  { Neutral: 100, Water: 100, Earth: 100, Fire: 100, Wind: 100, Poison:  75, Holy: 125, Shadow:   0, Ghost:  90, Undead:   0 },
    Ghost:   { Neutral:  90, Water: 100, Earth: 100, Fire: 100, Wind: 100, Poison:  75, Holy: 100, Shadow: 100, Ghost: 125, Undead: 100 },
    Undead:  { Neutral: 100, Water: 100, Earth: 100, Fire: 125, Wind: 100, Poison:  75, Holy: 125, Shadow:   0, Ghost: 100, Undead:   0 },
  },

  // ── Level 2 ──────────────────────────────────────────────────────────────
  2: {
    Neutral: { Neutral: 100, Water: 100, Earth: 100, Fire: 100, Wind: 100, Poison: 100, Holy: 100, Shadow: 100, Ghost:  70, Undead: 100 },
    Water:   { Neutral: 100, Water:   0, Earth: 100, Fire:  80, Wind: 175, Poison: 150, Holy: 100, Shadow: 100, Ghost: 100, Undead: 100 },
    Earth:   { Neutral: 100, Water: 100, Earth:   0, Fire: 175, Wind:  80, Poison: 150, Holy: 100, Shadow: 100, Ghost: 100, Undead: 100 },
    Fire:    { Neutral: 100, Water: 175, Earth:  80, Fire:   0, Wind: 100, Poison: 150, Holy: 100, Shadow: 100, Ghost: 100, Undead:  80 },
    Wind:    { Neutral: 100, Water:  80, Earth: 175, Fire: 100, Wind:   0, Poison: 150, Holy: 100, Shadow: 100, Ghost: 100, Undead: 100 },
    Poison:  { Neutral: 100, Water: 150, Earth: 150, Fire: 150, Wind: 150, Poison:   0, Holy:  75, Shadow:  75, Ghost:  75, Undead:  50 },
    Holy:    { Neutral: 100, Water: 100, Earth: 100, Fire: 100, Wind: 100, Poison:  75, Holy:   0, Shadow: 150, Ghost:  80, Undead: 150 },
    Shadow:  { Neutral: 100, Water: 100, Earth: 100, Fire: 100, Wind: 100, Poison:  75, Holy: 150, Shadow:   0, Ghost:  80, Undead:   0 },
    Ghost:   { Neutral:  70, Water: 100, Earth: 100, Fire: 100, Wind: 100, Poison:  75, Holy: 100, Shadow: 100, Ghost: 150, Undead: 125 },
    Undead:  { Neutral: 100, Water: 100, Earth: 100, Fire: 150, Wind: 100, Poison:  50, Holy: 150, Shadow:   0, Ghost: 125, Undead:   0 },
  },

  // ── Level 3 ──────────────────────────────────────────────────────────────
  3: {
    Neutral: { Neutral: 100, Water: 100, Earth: 100, Fire: 100, Wind: 100, Poison: 100, Holy: 100, Shadow: 100, Ghost:  50, Undead: 100 },
    Water:   { Neutral: 100, Water:   0, Earth: 100, Fire:  70, Wind: 200, Poison: 125, Holy: 100, Shadow: 100, Ghost: 100, Undead: 100 },
    Earth:   { Neutral: 100, Water: 100, Earth:   0, Fire: 200, Wind:  70, Poison: 125, Holy: 100, Shadow: 100, Ghost: 100, Undead: 100 },
    Fire:    { Neutral: 100, Water: 200, Earth:  70, Fire:   0, Wind: 100, Poison: 125, Holy: 100, Shadow: 100, Ghost: 100, Undead:  70 },
    Wind:    { Neutral: 100, Water:  70, Earth: 200, Fire: 100, Wind:   0, Poison: 125, Holy: 100, Shadow: 100, Ghost: 100, Undead: 100 },
    Poison:  { Neutral: 100, Water: 125, Earth: 125, Fire: 125, Wind: 125, Poison:   0, Holy:  50, Shadow:  50, Ghost:  50, Undead:  25 },
    Holy:    { Neutral: 100, Water: 100, Earth: 100, Fire: 100, Wind: 100, Poison:  50, Holy:   0, Shadow: 175, Ghost:  70, Undead: 175 },
    Shadow:  { Neutral: 100, Water: 100, Earth: 100, Fire: 100, Wind: 100, Poison:  50, Holy: 175, Shadow:   0, Ghost:  70, Undead:   0 },
    Ghost:   { Neutral:  50, Water: 100, Earth: 100, Fire: 100, Wind: 100, Poison:  50, Holy: 100, Shadow: 100, Ghost: 175, Undead: 150 },
    Undead:  { Neutral: 100, Water: 100, Earth: 100, Fire: 175, Wind: 100, Poison:  25, Holy: 175, Shadow:   0, Ghost: 150, Undead:   0 },
  },

  // ── Level 4 ──────────────────────────────────────────────────────────────
  4: {
    Neutral: { Neutral: 100, Water: 100, Earth: 100, Fire: 100, Wind: 100, Poison: 100, Holy: 100, Shadow: 100, Ghost:   0, Undead: 100 },
    Water:   { Neutral: 100, Water:   0, Earth: 100, Fire:  60, Wind: 200, Poison: 125, Holy: 100, Shadow: 100, Ghost: 100, Undead: 100 },
    Earth:   { Neutral: 100, Water: 100, Earth:   0, Fire: 200, Wind:  60, Poison: 125, Holy: 100, Shadow: 100, Ghost: 100, Undead: 100 },
    Fire:    { Neutral: 100, Water: 200, Earth:  60, Fire:   0, Wind: 100, Poison: 125, Holy: 100, Shadow: 100, Ghost: 100, Undead:  60 },
    Wind:    { Neutral: 100, Water:  60, Earth: 200, Fire: 100, Wind:   0, Poison: 125, Holy: 100, Shadow: 100, Ghost: 100, Undead: 100 },
    Poison:  { Neutral: 100, Water: 125, Earth: 125, Fire: 125, Wind: 125, Poison:   0, Holy:  50, Shadow:  50, Ghost:  50, Undead:   0 },
    Holy:    { Neutral: 100, Water: 100, Earth: 100, Fire: 100, Wind: 100, Poison:  50, Holy:   0, Shadow: 200, Ghost:  60, Undead: 200 },
    Shadow:  { Neutral: 100, Water: 100, Earth: 100, Fire: 100, Wind: 100, Poison:  50, Holy: 200, Shadow:   0, Ghost:  60, Undead:   0 },
    Ghost:   { Neutral:   0, Water: 100, Earth: 100, Fire: 100, Wind: 100, Poison:  50, Holy: 100, Shadow: 100, Ghost: 200, Undead: 175 },
    Undead:  { Neutral: 100, Water: 100, Earth: 100, Fire: 200, Wind: 100, Poison:   0, Holy: 200, Shadow:   0, Ghost: 175, Undead:   0 },
  },
}

/**
 * Returns the best attacker elements against a given defender.
 * Sorted descending by damage %.
 */
export function getBestAttackerElements(
  defenderElement: ElementType,
  defenderLevel: ElementLevel,
) {
  const row = elementTables[defenderLevel][defenderElement]
  return (Object.entries(row) as [ElementType, number][]).sort((a, b) => b[1] - a[1])
}
