import type { RefineEquipType } from '@/types'
import { BSB_COSTS, BSB_EVENT_COSTS, getRefineSuccessRate } from '@/data/refine-rates'
import { getEventRefineItem, getEventOreLabel, getEffectiveEventRate, isEventRefineType } from '@/data/event-refine-items'

export interface RollResult {
  newLevel: number
  broke: boolean
  success: boolean
  bsbUsed: number
  oreName: string
  successRate: number
  /** อัปเดต pity bonus หลัง roll นี้ (เฉพาะ event items ที่มี pityPerFail) */
  newPityStack?: number
}

export interface RollParams {
  /** RefineEquipType หรือ event item id (string) */
  equipType: string
  oreType: 'normal' | 'enrichedHd'
  noBreak: boolean
  noLevelLoss: boolean
  useEventBsb?: boolean
  /** pity bonus ที่สะสมไว้ที่ level นี้ (เฉพาะ event items ที่มี pityPerFail) */
  pityStack?: number
}

export function getOreName(
  equipType: string,
  fromLevel: number,
  oreType: 'normal' | 'enrichedHd',
): string {
  // Event items มี ore ของตัวเอง
  const eventItem = getEventRefineItem(equipType)
  if (eventItem) return getEventOreLabel(eventItem, fromLevel)

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

  // ── Event item ────────────────────────────────────────────────────────────
  if (isEventRefineType(equipType)) {
    const eventItem = getEventRefineItem(equipType)!
    const pityStack = params.pityStack ?? 0
    const effectiveRate = getEffectiveEventRate(eventItem, lvl, pityStack, oreType)
    // Ore name: Rate Up items ใช้ชื่อ ore มาตรฐานจาก baseEquipType
    const oreName = eventItem.baseEquipType
      ? getOreName(eventItem.baseEquipType, lvl, oreType)
      : getEventOreLabel(eventItem, lvl)
    const success = Math.random() * 100 < effectiveRate

    if (success) {
      return { newLevel: lvl + 1, broke: false, success: true, bsbUsed: 0, oreName, successRate: effectiveRate, newPityStack: 0 }
    }

    // Built-in no-break + no-level-loss (เช่น Ayothaya Helm, MP Shadow items)
    if (eventItem.noBreak && eventItem.noLevelLoss) {
      let newPityStack: number | undefined
      const perFail = eventItem.pityPerFail ?? 0
      if (perFail > 0 && eventItem.pityCaps) {
        const cap = eventItem.pityCaps[lvl] ?? null
        const baseRate = eventItem.rates[lvl] ?? 100
        newPityStack = cap !== null ? Math.min(pityStack + perFail, cap - baseRate) : pityStack + perFail
      }
      return { newLevel: lvl, broke: false, success: false, bsbUsed: 0, oreName, successRate: effectiveRate, newPityStack }
    }

    // Rate Up items: กลไกมาตรฐาน (BSB / ether drop / break)
    const isEtherBase = eventItem.baseEquipType === 'weapon_lv5' || eventItem.baseEquipType === 'armor_lv2'
    if (noLevelLoss) {
      const bsbTable = params.useEventBsb ? BSB_EVENT_COSTS : BSB_COSTS
      const bsbUsed = bsbTable[lvl] ?? 0
      return { newLevel: lvl, broke: false, success: false, bsbUsed, oreName, successRate: effectiveRate }
    }
    if (isEtherBase && lvl < 10) {
      const drop = oreType === 'normal' ? 3 : 1
      return { newLevel: Math.max(0, lvl - drop), broke: false, success: false, bsbUsed: 0, oreName, successRate: effectiveRate }
    }
    if (noBreak) {
      return { newLevel: Math.max(0, lvl - 1), broke: false, success: false, bsbUsed: 0, oreName, successRate: effectiveRate }
    }
    return { newLevel: 0, broke: true, success: false, bsbUsed: 0, oreName, successRate: effectiveRate }
  }

  // ── Standard equipment ────────────────────────────────────────────────────
  const isEtherType = equipType === 'weapon_lv5' || equipType === 'armor_lv2'
  const rate = getRefineSuccessRate(equipType as RefineEquipType, lvl, oreType) ?? 100
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
