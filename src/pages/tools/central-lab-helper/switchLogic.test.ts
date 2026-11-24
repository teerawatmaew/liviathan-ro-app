import { describe, it, expect } from 'vitest'
import { decimalToBits, parseSwitchInput } from './switchLogic'

describe('decimalToBits', () => {
  it('เรียง SW8 → SW1 (MSB ก่อน)', () => {
    expect(decimalToBits(1).map((b) => b.label)).toEqual(['SW8', 'SW7', 'SW6', 'SW5', 'SW4', 'SW3', 'SW2', 'SW1'])
  })

  it('170 = 10101010', () => {
    expect(decimalToBits(170).map((b) => b.value).join('')).toBe('10101010')
  })

  it('1 เปิดเฉพาะ SW1, 255 เปิดทุกตัว', () => {
    expect(decimalToBits(1).filter((b) => b.value === 1).map((b) => b.label)).toEqual(['SW1'])
    expect(decimalToBits(255).every((b) => b.value === 1)).toBe(true)
  })
})

describe('parseSwitchInput', () => {
  it('ค่าว่าง', () => {
    expect(parseSwitchInput('  ')).toEqual({ kind: 'empty' })
  })

  it('ค่าในช่วง 1–255', () => {
    expect(parseSwitchInput('170')).toEqual({ kind: 'ok', value: 170 })
  })

  it('นอกช่วงหรือไม่ใช่จำนวนเต็ม = invalid (ไม่ clamp เงียบ)', () => {
    expect(parseSwitchInput('0').kind).toBe('invalid')
    expect(parseSwitchInput('256').kind).toBe('invalid')
    expect(parseSwitchInput('12.5').kind).toBe('invalid')
  })
})
