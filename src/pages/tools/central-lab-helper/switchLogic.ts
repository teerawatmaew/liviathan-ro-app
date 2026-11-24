export interface SwitchBit {
  /** 7 = MSB (SW8), 0 = LSB (SW1) */
  index: number
  /** SW8 .. SW1 */
  label: string
  value: 0 | 1
}

export const SWITCH_MIN = 1
export const SWITCH_MAX = 255

/** แปลงเลขฐาน 10 เป็นสวิทช์ 8 ตัว เรียงจาก SW8 (bit 7) → SW1 (bit 0) */
export function decimalToBits(decimal: number): SwitchBit[] {
  const clamped = Math.max(0, Math.min(SWITCH_MAX, Math.floor(decimal)))
  return Array.from({ length: 8 }, (_, i) => {
    const bit = 7 - i
    return {
      index: bit,
      label: `SW${bit + 1}`,
      value: ((clamped >> bit) & 1) as 0 | 1,
    }
  })
}

export type ParseResult =
  | { kind: 'empty' }
  | { kind: 'invalid'; message: string }
  | { kind: 'ok'; value: number }

/** ตรวจค่าที่ผู้ใช้พิมพ์ — ไม่ clamp ระหว่างพิมพ์ เพื่อให้แก้ตัวเลขได้ตามปกติ */
export function parseSwitchInput(raw: string): ParseResult {
  const trimmed = raw.trim()
  if (trimmed === '') return { kind: 'empty' }
  if (!/^\d+$/.test(trimmed)) return { kind: 'invalid', message: 'กรอกได้เฉพาะตัวเลขจำนวนเต็ม' }
  const value = Number(trimmed)
  if (value < SWITCH_MIN || value > SWITCH_MAX) {
    return { kind: 'invalid', message: `ค่าต้องอยู่ระหว่าง ${SWITCH_MIN} – ${SWITCH_MAX}` }
  }
  return { kind: 'ok', value }
}
