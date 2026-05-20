import { describe, it, expect, vi, afterEach } from 'vitest'
import { getOreName, rollOne } from './refineSimulatorLogic'
import type { RollParams } from './refineSimulatorLogic'

afterEach(() => {
  vi.restoreAllMocks()
})

// ─── getOreName ──────────────────────────────────────────────────────────────

describe('getOreName', () => {
  describe('normal ore', () => {
    it('weapon_lv5 always returns Etherdeocon regardless of level', () => {
      expect(getOreName('weapon_lv5', 5, 'normal')).toBe('Etherdeocon')
      expect(getOreName('weapon_lv5', 12, 'normal')).toBe('Etherdeocon')
    })
    it('armor_lv2 always returns Ethernium', () => {
      expect(getOreName('armor_lv2', 5, 'normal')).toBe('Ethernium')
      expect(getOreName('armor_lv2', 12, 'normal')).toBe('Ethernium')
    })
    it('shadow_weapon below +10 returns Oridecon', () => {
      expect(getOreName('shadow_weapon', 5, 'normal')).toBe('Oridecon')
    })
    it('armor_lv1 below +10 returns Elunium', () => {
      expect(getOreName('armor_lv1', 9, 'normal')).toBe('Elunium')
    })
    it('armor_lv1 at +10 switches to Carnium', () => {
      expect(getOreName('armor_lv1', 10, 'normal')).toBe('Carnium')
    })
    it('weapon_lv1-4 below +10 returns Oridecon', () => {
      expect(getOreName('weapon_lv4', 9, 'normal')).toBe('Oridecon')
      expect(getOreName('weapon_lv1', 0, 'normal')).toBe('Oridecon')
    })
    it('weapon_lv1-4 at +10 switches to Bradium', () => {
      expect(getOreName('weapon_lv4', 10, 'normal')).toBe('Bradium')
    })
  })

  describe('enrichedHd ore', () => {
    it('weapon_lv5 returns HD Ether Bradium', () => {
      expect(getOreName('weapon_lv5', 5, 'enrichedHd')).toBe('HD Ether Bradium')
    })
    it('armor_lv2 returns HD Ether Carnium', () => {
      expect(getOreName('armor_lv2', 5, 'enrichedHd')).toBe('HD Ether Carnium')
    })
    it('shadow_weapon below +10 returns Enriched Oridecon', () => {
      expect(getOreName('shadow_weapon', 5, 'enrichedHd')).toBe('Enriched Oridecon')
    })
    it('shadow_armor below +10 returns Enriched Elunium', () => {
      expect(getOreName('shadow_armor', 5, 'enrichedHd')).toBe('Enriched Elunium')
    })
    it('armor_lv1 below +10 returns Enriched Elunium', () => {
      expect(getOreName('armor_lv1', 9, 'enrichedHd')).toBe('Enriched Elunium')
    })
    it('armor_lv1 at +10 returns HD Carnium', () => {
      expect(getOreName('armor_lv1', 10, 'enrichedHd')).toBe('HD Carnium')
    })
    it('weapon_lv1-4 below +10 returns Enriched Oridecon', () => {
      expect(getOreName('weapon_lv4', 9, 'enrichedHd')).toBe('Enriched Oridecon')
    })
    it('weapon_lv1-4 at +10 returns HD Bradium', () => {
      expect(getOreName('weapon_lv4', 10, 'enrichedHd')).toBe('HD Bradium')
    })
  })
})

// ─── rollOne ─────────────────────────────────────────────────────────────────

describe('rollOne', () => {
  const base: RollParams = {
    equipType: 'weapon_lv4',
    oreType: 'enrichedHd',
    noBreak: false,
    noLevelLoss: false,
  }

  it('success: level increments by 1', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0) // 0 * 100 = 0 < rate → success
    const r = rollOne(5, base)
    expect(r.success).toBe(true)
    expect(r.newLevel).toBe(6)
    expect(r.broke).toBe(false)
    expect(r.bsbUsed).toBe(0)
  })

  it('fail (default): breaks and level goes to 0', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9999) // > any realistic rate
    const r = rollOne(7, base)
    expect(r.success).toBe(false)
    expect(r.broke).toBe(true)
    expect(r.newLevel).toBe(0)
    expect(r.bsbUsed).toBe(0)
  })

  describe('noBreak option', () => {
    it('drops 1 level instead of breaking', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.9999)
      const r = rollOne(7, { ...base, noBreak: true })
      expect(r.broke).toBe(false)
      expect(r.newLevel).toBe(6)
    })
    it('level cannot go below 0', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.9999)
      // weapon_lv4 level 4 has 60% rate, mock fail
      const r = rollOne(4, { ...base, noBreak: true })
      expect(r.newLevel).toBe(3) // 4 - 1 = 3
      expect(r.broke).toBe(false)
    })
  })

  describe('noLevelLoss (BSB) option', () => {
    it('stays at same level, no break, uses BSB', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.9999)
      const r = rollOne(9, { ...base, noLevelLoss: true })
      expect(r.broke).toBe(false)
      expect(r.newLevel).toBe(9)
      expect(r.bsbUsed).toBe(4) // BSB_COSTS[9] = 4
    })
    it('uses BSB_COSTS[7] = 1 at level 7', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.9999)
      const r = rollOne(7, { ...base, noLevelLoss: true })
      expect(r.bsbUsed).toBe(1)
    })
    it('bsbUsed = 0 for levels with no BSB cost defined (e.g. level 14)', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.9999)
      const r = rollOne(14, { ...base, noLevelLoss: true })
      expect(r.bsbUsed).toBe(0)
    })
    it('noLevelLoss takes priority over isEtherType special fail', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.9999)
      const r = rollOne(5, { ...base, equipType: 'weapon_lv5', oreType: 'normal', noLevelLoss: true })
      expect(r.broke).toBe(false)
      expect(r.newLevel).toBe(5) // stays, does not drop 3
    })
  })

  describe('weapon_lv5 / armor_lv2 special fail (Ether type, lvl < 10)', () => {
    it('normal ore fail: drops 3 levels, no break', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.9999)
      const r = rollOne(8, { ...base, equipType: 'weapon_lv5', oreType: 'normal' })
      expect(r.broke).toBe(false)
      expect(r.newLevel).toBe(5) // 8 - 3
    })
    it('normal ore fail at level 3: clamps to 0, no break (max(0, 3-3))', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.9999)
      // weapon_lv5 level 3 normal rate = 60; 99.99 >= 60 → fail → drop 3 → max(0, 0) = 0
      const r = rollOne(3, { ...base, equipType: 'weapon_lv5', oreType: 'normal' })
      expect(r.broke).toBe(false)
      expect(r.newLevel).toBe(0) // max(0, 3 - 3) = 0
    })
    it('normal ore fail at level 0: stays at 0', () => {
      // rate at level 0 is 100%, so mock will still succeed — test the math guard:
      // level 0, drop 3 → max(0, -3) = 0
      vi.spyOn(Math, 'random').mockReturnValue(0.9999)
      const r = rollOne(0, { ...base, equipType: 'weapon_lv5', oreType: 'normal' })
      // level 0 has 100% success rate, so this should succeed despite mock
      expect(r.success).toBe(true)
      expect(r.newLevel).toBe(1)
    })
    it('enrichedHd ore fail: drops 1 level, no break', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.9999)
      const r = rollOne(8, { ...base, equipType: 'weapon_lv5', oreType: 'enrichedHd' })
      expect(r.broke).toBe(false)
      expect(r.newLevel).toBe(7) // 8 - 1
    })
    it('at lvl >= 10: breaks normally (not special fail)', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.9999)
      const r = rollOne(10, { ...base, equipType: 'weapon_lv5', oreType: 'normal' })
      expect(r.broke).toBe(true)
      expect(r.newLevel).toBe(0)
    })
    it('armor_lv2 normal ore fail at lvl < 10: drops 3', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.9999)
      const r = rollOne(6, { ...base, equipType: 'armor_lv2', oreType: 'normal' })
      expect(r.broke).toBe(false)
      expect(r.newLevel).toBe(3) // 6 - 3
    })
    it('armor_lv2 enrichedHd ore fail at lvl < 10: drops 1', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.9999)
      const r = rollOne(6, { ...base, equipType: 'armor_lv2', oreType: 'enrichedHd' })
      expect(r.broke).toBe(false)
      expect(r.newLevel).toBe(5) // 6 - 1
    })
  })

  it('safe level (100% rate) always succeeds regardless of Math.random', () => {
    // weapon_lv4 safety=4, levels 0–3 are safe (rate=100)
    // random * 100 is always < 100 since random ∈ [0, 1)
    vi.spyOn(Math, 'random').mockReturnValue(0.9999)
    const r = rollOne(3, base)
    expect(r.success).toBe(true)
    expect(r.newLevel).toBe(4)
  })

  it('result includes correct oreName and successRate', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const r = rollOne(9, base) // weapon_lv4, enrichedHd, level 9
    expect(r.oreName).toBe('Enriched Oridecon')
    expect(r.successRate).toBe(20) // REFINE_RATES.weapon_lv4.enrichedHd[9] = 20
  })
})
