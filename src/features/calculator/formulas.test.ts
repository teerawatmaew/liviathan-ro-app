import { describe, it, expect } from 'vitest'
import { calcHP, calcSP, calcATK, calcMATK, calcHIT, calcFLEE, calcDEF, calcMDEF } from './formulas'
import type { JobClass } from '@/types'

const mockJob: JobClass = { id: 'test', name: 'Test', tier: 'class1', hpModifier: 5, spModifier: 2 }
const noModJob: JobClass = { id: 'test2', name: 'Test2', tier: 'novice' }

describe('calcHP', () => {
  it('computes with modifier: (baseLevel+vit) * (hpModifier + baseLevel*0.5)', () => {
    // (50 + 30) * (5 + 50*0.5) = 80 * 30 = 2400
    expect(calcHP(50, 30, mockJob)).toBe(2400)
  })
  it('uses 0 when hpModifier is undefined', () => {
    // (50 + 0) * (0 + 50*0.5) = 50 * 25 = 1250
    expect(calcHP(50, 0, noModJob)).toBe(1250)
  })
  it('floors fractional results', () => {
    // (1 + 1) * (5 + 1*0.5) = 2 * 5.5 = 11.0 → 11
    expect(calcHP(1, 1, mockJob)).toBe(11)
  })
  it('handles baseLevel=1 vit=0', () => {
    // (1 + 0) * (0 + 1*0.5) = 1 * 0.5 = 0.5 → floor = 0
    expect(calcHP(1, 0, noModJob)).toBe(0)
  })
})

describe('calcSP', () => {
  it('computes with modifier: (baseLevel+int) * (spModifier + baseLevel*0.1)', () => {
    // (50 + 20) * (2 + 50*0.1) = 70 * 7 = 490
    expect(calcSP(50, 20, mockJob)).toBe(490)
  })
  it('uses 0 when spModifier is undefined', () => {
    // (50 + 0) * (0 + 50*0.1) = 50 * 5 = 250
    expect(calcSP(50, 0, noModJob)).toBe(250)
  })
})

describe('calcATK', () => {
  it('returns str + 0 when str < 10', () => {
    // 9 + floor((9/10)^2) = 9 + 0 = 9
    expect(calcATK(9)).toBe(9)
  })
  it('computes bonus at str=10', () => {
    // 10 + floor((10/10)^2) = 10 + 1 = 11
    expect(calcATK(10)).toBe(11)
  })
  it('computes bonus at str=100', () => {
    // 100 + floor((100/10)^2) = 100 + 100 = 200
    expect(calcATK(100)).toBe(200)
  })
  it('handles str=0', () => {
    expect(calcATK(0)).toBe(0)
  })
  it('handles str=99: 99 + floor((9.9)^2) = 99 + floor(98.01) = 99 + 98 = 197', () => {
    expect(calcATK(99)).toBe(197)
  })
})

describe('calcMATK', () => {
  it('floor(int^2 / 7)', () => {
    expect(calcMATK(0)).toBe(0)
    expect(calcMATK(7)).toBe(7)   // floor(49/7) = 7
    expect(calcMATK(100)).toBe(1428) // floor(10000/7) = 1428
    expect(calcMATK(99)).toBe(1400)  // floor(9801/7) = 1400
  })
})

describe('calcHIT', () => {
  it('returns dex + baseLevel', () => {
    expect(calcHIT(77, 99)).toBe(176)
    expect(calcHIT(0, 0)).toBe(0)
  })
})

describe('calcFLEE', () => {
  it('returns agi + baseLevel', () => {
    expect(calcFLEE(90, 99)).toBe(189)
    expect(calcFLEE(0, 0)).toBe(0)
  })
})

describe('calcDEF', () => {
  it('returns floor(vit / 2)', () => {
    expect(calcDEF(100)).toBe(50)
    expect(calcDEF(99)).toBe(49)
    expect(calcDEF(1)).toBe(0)
    expect(calcDEF(0)).toBe(0)
  })
})

describe('calcMDEF', () => {
  it('returns floor(int / 4)', () => {
    expect(calcMDEF(100)).toBe(25)
    expect(calcMDEF(99)).toBe(24)
    expect(calcMDEF(3)).toBe(0)
    expect(calcMDEF(4)).toBe(1)
  })
})
