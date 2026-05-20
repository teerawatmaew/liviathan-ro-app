import type { RefineEquipType } from '@/types'
import { BSB_COSTS, BSB_EVENT_COSTS, getRefineSuccessRate } from '@/data/refine-rates'

export interface RollResult {
  newLevel: number
  broke: boolean
  success: boolean
  bsbUsed: number
  oreName: string
  successRate: number
}

export interface RollParams {
  equipType: RefineEquipType
  oreType: 'normal' | 'enrichedHd'
  noBreak: boolean
  noLevelLoss: boolean
  useEventBsb?: boolean
}

export function getOreName(
  equipType: RefineEquipType,
  fromLevel: number,
  oreType: 'normal' | 'enrichedHd',
): string {
  const isHigh = fromLevel >= 10
  if (oreType === 'normal') {
    if (equipType === 'weapon_lv5') return 'Etherdeocon'
    if (equipType === 'armor_lv2') return 'Ethernium'
    if (equipType === 'armor_lv1' || equipType === 'shadow_armor') return isHigh ? 'Carnium' : 'Elunium'
    return isHigh ? 'Bradium' : 'Oridecon' // weapon_lv1–4, shadow_weapon
  } else {
    if (equipType === 'weapon_lv5') return 'HD Ether Bradium'
    if (equipType === 'armor_lv2') return 'HD Ether Carnium'
    if (equipType === 'armor_lv1' || equipType === 'shadow_armor') return isHigh ? 'HD Carnium' : 'Enriched Elunium'
    return isHigh ? 'HD Bradium' : 'Enriched Oridecon' // weapon_lv1–4, shadow_weapon
  }
}

/**
 * Simulate a single refine attempt (pure function — no side effects).
 *
 * Priority order on fail:
 *   1. noLevelLoss (BSB) — stays at same level, no break
 *   2. isEtherType && lvl < 10 — drops 3 (normal) or 1 (enrichedHd), no break
 *   3. noBreak — drops 1 level, no break
 *   4. default — breaks, level → 0
 */
export function rollOne(lvl: number, params: RollParams): RollResult {
  const { equipType, oreType, noBreak, noLevelLoss } = params
  const isEtherType = equipType === 'weapon_lv5' || equipType === 'armor_lv2'
  const rate = getRefineSuccessRate(equipType, lvl, oreType) ?? 100
  const success = Math.random() * 100 < rate
  const oreName = getOreName(equipType, lvl, oreType)

  if (success) {
    return { newLevel: lvl + 1, broke: false, success: true, bsbUsed: 0, oreName, successRate: rate }
  }

  // BSB: ไม่ลดขั้นไม่ว่าจะเป็นประเภทไหน
  if (noLevelLoss) {
    const bsbTable = params.useEventBsb ? BSB_EVENT_COSTS : BSB_COSTS
    const bsbUsed = bsbTable[lvl] ?? 0
    return { newLevel: lvl, broke: false, success: false, bsbUsed, oreName, successRate: rate }
  }

  // weapon_lv5 / armor_lv2 ที่ lvl < 10: ลดขั้นตามประเภทแร่ (ไม่ติด)
  if (isEtherType && lvl < 10) {
    const drop = oreType === 'normal' ? 3 : 1
    return {
      newLevel: Math.max(0, lvl - drop),
      broke: false,
      success: false,
      bsbUsed: 0,
      oreName,
      successRate: rate,
    }
  }

  if (noBreak) {
    return {
      newLevel: Math.max(0, lvl - 1),
      broke: false,
      success: false,
      bsbUsed: 0,
      oreName,
      successRate: rate,
    }
  }

  return { newLevel: 0, broke: true, success: false, bsbUsed: 0, oreName, successRate: rate }
}
