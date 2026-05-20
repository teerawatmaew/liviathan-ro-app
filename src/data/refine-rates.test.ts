import { describe, it, expect } from 'vitest'
import {
  getRefineSuccessRate,
  isSafeRefine,
  getSafetyLevel,
  BSB_COSTS,
} from './refine-rates'

describe('getRefineSuccessRate', () => {
  describe('weapon_lv4 (safety=4)', () => {
    it('returns 100 for safe levels (0–3)', () => {
      expect(getRefineSuccessRate('weapon_lv4', 0, 'normal')).toBe(100)
      expect(getRefineSuccessRate('weapon_lv4', 3, 'normal')).toBe(100)
    })
    it('returns 60 normal / 90 enrichedHd at level 4', () => {
      expect(getRefineSuccessRate('weapon_lv4', 4, 'normal')).toBe(60)
      expect(getRefineSuccessRate('weapon_lv4', 4, 'enrichedHd')).toBe(90)
    })
    it('returns correct low rates at level 9', () => {
      expect(getRefineSuccessRate('weapon_lv4', 9, 'normal')).toBe(9)
      expect(getRefineSuccessRate('weapon_lv4', 9, 'enrichedHd')).toBe(20)
    })
  })

  describe('shadow gear (maxLevel=10)', () => {
    it('returns rate for +9 → +10 (last valid attempt)', () => {
      expect(getRefineSuccessRate('shadow_weapon', 9, 'normal')).toBe(9)
    })
    it('returns null for +10 (exceeds maxLevel)', () => {
      expect(getRefineSuccessRate('shadow_weapon', 10, 'normal')).toBeNull()
    })
  })

  describe('boundary conditions', () => {
    it('returns null for fromLevel < 0', () => {
      expect(getRefineSuccessRate('weapon_lv1', -1, 'normal')).toBeNull()
    })
    it('returns null for fromLevel >= maxLevel (20)', () => {
      expect(getRefineSuccessRate('weapon_lv1', 20, 'normal')).toBeNull()
    })
    it('returns value for fromLevel = maxLevel - 1 (+19 → +20)', () => {
      expect(getRefineSuccessRate('weapon_lv1', 19, 'normal')).toBe(15)
    })
  })

  describe('weapon_lv5 (safety=3)', () => {
    it('returns 100 for levels 0–2', () => {
      expect(getRefineSuccessRate('weapon_lv5', 2, 'normal')).toBe(100)
    })
    it('returns correct rate at level 3', () => {
      expect(getRefineSuccessRate('weapon_lv5', 3, 'normal')).toBe(60)
      expect(getRefineSuccessRate('weapon_lv5', 3, 'enrichedHd')).toBe(90)
    })
  })
})

describe('isSafeRefine', () => {
  it('returns true when fromLevel < safetyLevel', () => {
    expect(isSafeRefine('weapon_lv4', 0)).toBe(true)
    expect(isSafeRefine('weapon_lv4', 3)).toBe(true) // 3 < 4
  })
  it('returns false at safetyLevel itself (first risky attempt)', () => {
    expect(isSafeRefine('weapon_lv4', 4)).toBe(false)
  })
  it('returns false above safetyLevel', () => {
    expect(isSafeRefine('weapon_lv4', 10)).toBe(false)
  })
})

describe('getSafetyLevel', () => {
  it('returns correct safety levels for all equip types', () => {
    expect(getSafetyLevel('weapon_lv1')).toBe(7)
    expect(getSafetyLevel('weapon_lv2')).toBe(6)
    expect(getSafetyLevel('weapon_lv3')).toBe(5)
    expect(getSafetyLevel('weapon_lv4')).toBe(4)
    expect(getSafetyLevel('weapon_lv5')).toBe(3)
    expect(getSafetyLevel('armor_lv1')).toBe(4)
    expect(getSafetyLevel('armor_lv2')).toBe(3)
    expect(getSafetyLevel('shadow_weapon')).toBe(4)
    expect(getSafetyLevel('shadow_armor')).toBe(4)
  })
})

describe('BSB_COSTS', () => {
  it('has correct values for +7 through +13', () => {
    expect(BSB_COSTS[7]).toBe(1)
    expect(BSB_COSTS[8]).toBe(2)
    expect(BSB_COSTS[9]).toBe(4)
    expect(BSB_COSTS[10]).toBe(7)
    expect(BSB_COSTS[11]).toBe(11)
    expect(BSB_COSTS[12]).toBe(16)
    expect(BSB_COSTS[13]).toBe(22)
  })
  it('returns undefined for levels outside +7–+13 range', () => {
    expect(BSB_COSTS[6]).toBeUndefined()
    expect(BSB_COSTS[14]).toBeUndefined()
  })
})
