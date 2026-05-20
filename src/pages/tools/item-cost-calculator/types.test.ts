import { describe, it, expect } from 'vitest'
import {
  calcBreakdown,
  calcReformTotal,
  calcGradeItemCost,
  formatZeny,
  CRAFT_ZENY,
} from './types'
import type { GradeMaterialPrices } from './types'

// ─── formatZeny ──────────────────────────────────────────────────────────────

describe('formatZeny', () => {
  it('formats with commas and z suffix', () => {
    expect(formatZeny(1_000_000)).toBe('1,000,000z')
    expect(formatZeny(999)).toBe('999z')
    expect(formatZeny(0)).toBe('0z')
  })
})

// ─── calcBreakdown ───────────────────────────────────────────────────────────

describe('calcBreakdown', () => {
  it('Low grade qty=1: only Low entry, shadowdecon=1', () => {
    const bd = calcBreakdown('Low', 1)
    expect(bd.crafts.Low).toBe(1)
    expect(bd.crafts.Medium).toBeUndefined()
    expect(bd.crafts.High).toBeUndefined()
    expect(bd.crafts.Supreme).toBeUndefined()
    expect(bd.shadowdecon).toBe(1)
    expect(bd.zenyCraft).toBe(CRAFT_ZENY.Low)
  })

  it('Medium grade qty=1: Medium=1, Low=3 (×3)', () => {
    const bd = calcBreakdown('Medium', 1)
    expect(bd.crafts.Medium).toBe(1)
    expect(bd.crafts.Low).toBe(3)
    expect(bd.shadowdecon).toBe(3)
    expect(bd.zenyCraft).toBe(1 * CRAFT_ZENY.Medium + 3 * CRAFT_ZENY.Low)
  })

  it('High grade qty=1: High=1, Medium=3, Low=9', () => {
    const bd = calcBreakdown('High', 1)
    expect(bd.crafts.High).toBe(1)
    expect(bd.crafts.Medium).toBe(3)
    expect(bd.crafts.Low).toBe(9)
    expect(bd.shadowdecon).toBe(9)
    expect(bd.zenyCraft).toBe(
      1 * CRAFT_ZENY.High + 3 * CRAFT_ZENY.Medium + 9 * CRAFT_ZENY.Low,
    )
  })

  it('Supreme grade qty=1: Supreme=1, High=3, Medium=9, Low=27', () => {
    const bd = calcBreakdown('Supreme', 1)
    expect(bd.crafts.Supreme).toBe(1)
    expect(bd.crafts.High).toBe(3)
    expect(bd.crafts.Medium).toBe(9)
    expect(bd.crafts.Low).toBe(27)
    expect(bd.shadowdecon).toBe(27)
    expect(bd.zenyCraft).toBe(
      1 * CRAFT_ZENY.Supreme +
      3 * CRAFT_ZENY.High +
      9 * CRAFT_ZENY.Medium +
      27 * CRAFT_ZENY.Low,
    )
  })

  it('Supreme grade qty=2: all quantities scale linearly', () => {
    const bd = calcBreakdown('Supreme', 2)
    expect(bd.crafts.Supreme).toBe(2)
    expect(bd.crafts.High).toBe(6)
    expect(bd.crafts.Medium).toBe(18)
    expect(bd.crafts.Low).toBe(54)
    expect(bd.shadowdecon).toBe(54)
    expect(bd.zenyCraft).toBe(
      2 * CRAFT_ZENY.Supreme +
      6 * CRAFT_ZENY.High +
      18 * CRAFT_ZENY.Medium +
      54 * CRAFT_ZENY.Low,
    )
  })

  it('shadowdecon always equals Low count', () => {
    const grades = ['Low', 'Medium', 'High', 'Supreme'] as const
    for (const g of grades) {
      const bd = calcBreakdown(g, 1)
      expect(bd.shadowdecon).toBe(bd.crafts.Low ?? 0)
    }
  })
})

// ─── calcReformTotal ─────────────────────────────────────────────────────────

describe('calcReformTotal', () => {
  it('returns zenyCraft + shadowdecon * sdPrice', () => {
    const bd = calcBreakdown('Supreme', 1)
    const sdPrice = 1_000_000
    expect(calcReformTotal(bd, sdPrice)).toBe(bd.zenyCraft + bd.shadowdecon * sdPrice)
  })
  it('returns zenyCraft when sdPrice=0', () => {
    const bd = calcBreakdown('High', 1)
    expect(calcReformTotal(bd, 0)).toBe(bd.zenyCraft)
  })
})

// ─── calcGradeItemCost ───────────────────────────────────────────────────────

const zeroPrices: GradeMaterialPrices = {
  'Etel Dust': '0',
  'Etel Stone': '0',
  'Blacksmith Blessing': '0',
  'Aquamarine': '0',
  'Topaz': '0',
  'Amethyst': '0',
  'Amber': '0',
}

describe('calcGradeItemCost', () => {
  it('Etel Stone qty=1: 100k npcZeny + 5 Etel Dust × price', () => {
    const { total, npcZeny, materialLines } = calcGradeItemCost('Etel Stone', 1, zeroPrices, false)
    expect(npcZeny).toBe(100_000)
    expect(materialLines[0].qty).toBe(5)
    expect(materialLines[0].unitPrice).toBe(0)
    expect(total).toBe(100_000)
  })

  it('Etel Stone qty=2: all quantities and npcZeny scale ×2', () => {
    const { total, npcZeny, materialLines } = calcGradeItemCost('Etel Stone', 2, zeroPrices, false)
    expect(npcZeny).toBe(200_000)
    expect(materialLines[0].qty).toBe(10) // 5 × 2
    expect(total).toBe(200_000)
  })

  it('includes material cost in total', () => {
    const prices = { ...zeroPrices, 'Etel Dust': '10000' }
    const { total } = calcGradeItemCost('Etel Stone', 1, prices, false)
    // 100k npcZeny + 5 × 10000 = 150000
    expect(total).toBe(150_000)
  })

  it('calcEtelFromDust=true: Etel Stone cost = 100k + 5 × dustPrice', () => {
    const prices = { ...zeroPrices, 'Etel Dust': '10000' }
    // Etel Stone computed cost = 100000 + 5 × 10000 = 150000
    // Etel Aquamarine: 100k npcZeny + 3 EtelStone + 1 Aquamarine
    const { total } = calcGradeItemCost('Etel Aquamarine', 1, prices, true)
    expect(total).toBe(100_000 + 3 * 150_000 + 0)
  })

  it('calcEtelFromDust=false: uses market price for Etel Stone', () => {
    const prices = { ...zeroPrices, 'Etel Stone': '200000' }
    const { total } = calcGradeItemCost('Etel Aquamarine', 1, prices, false)
    expect(total).toBe(100_000 + 3 * 200_000 + 0)
  })

  it('Etel Amber: 500k npcZeny + 15 Etel Stone + 1 Amber', () => {
    const prices = { ...zeroPrices, 'Etel Stone': '100000', 'Amber': '50000' }
    const { total } = calcGradeItemCost('Etel Amber', 1, prices, false)
    expect(total).toBe(500_000 + 15 * 100_000 + 50_000)
  })

  it('Blessed Etel Dust includes Blacksmith Blessing cost', () => {
    const prices = { ...zeroPrices, 'Etel Dust': '5000', 'Blacksmith Blessing': '100000' }
    const { total } = calcGradeItemCost('Blessed Etel Dust', 1, prices, false)
    // 100k npcZeny + 5 × 5000 + 1 × 100000 = 100000 + 25000 + 100000 = 225000
    expect(total).toBe(225_000)
  })

  it('materialLines subtotals sum to total minus npcZeny', () => {
    const prices = { ...zeroPrices, 'Etel Stone': '50000', 'Topaz': '30000' }
    const { total, npcZeny, materialLines } = calcGradeItemCost('Etel Topaz', 1, prices, false)
    const materialTotal = materialLines.reduce((s, l) => s + l.subtotal, 0)
    expect(materialTotal).toBe(total - npcZeny)
  })
})
