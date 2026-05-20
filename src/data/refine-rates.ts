import type { RefineEquipType } from '@/types'

/**
 * อัตราสำเร็จในการ Refine อุปกรณ์ใน Ragnarok Online
 * ข้อมูลจาก iRO Wiki: https://irowiki.org/wiki/Refine_System
 *
 * โครงสร้าง array (index = current refine level ก่อน attempt):
 *   index 0 = +0 → +1
 *   index 1 = +1 → +2
 *   ...
 *   index 19 = +19 → +20
 *
 * material:
 *   normal     = Oridecon/Elunium สำหรับ +1~+10, Bradium/Carnium สำหรับ +10+
 *   enrichedHd = Enriched/HD Oridecon/Elunium สำหรับ +1~+10, HD Bradium/HD Carnium สำหรับ +10+
 *
 * Shadow gear: refine สูงสุดที่ +10 (array มีแค่ 10 entries)
 * Wlv5 / Armor Lv2: normal ore คือ Etherdeocon / Ethernium
 */

interface RefineRateSet {
  /** อัตราสำเร็จกับ ore ทั่วไป (0–100) */
  normal: readonly number[]
  /** อัตราสำเร็จกับ Enriched/HD ore (0–100) */
  enrichedHd: readonly number[]
  /** refine level สูงสุด */
  maxLevel: number
  /**
   * Safety Level — ถึง refine level นี้รับประกันสำเร็จ 100%
   * (attempt ที่ safetyLevel หรือต่ำกว่าไม่มีโอกาส fail/break)
   */
  safetyLevel: number
}

export const REFINE_RATES: Record<RefineEquipType, RefineRateSet> = {
  // ── Weapon Level 1 ──────────────────────────────────────────────────────
  // Safety: +7  |  Ore: Oridecon / Enriched Oridecon
  weapon_lv1: {
    //              +0   +1   +2   +3   +4   +5   +6   +7  +8  +9  +10 +11 +12 +13 +14 +15 +16 +17 +18 +19
    normal:     [100, 100, 100, 100, 100, 100, 100,  60,  40, 19, 18, 18, 18, 18, 17, 17, 17, 17, 15, 15],
    enrichedHd: [100, 100, 100, 100, 100, 100, 100,  90,  70, 30, 18, 18, 18, 18, 18, 17, 17, 17, 15, 15],
    maxLevel: 20,
    safetyLevel: 7,
  },

  // ── Weapon Level 2 ──────────────────────────────────────────────────────
  // Safety: +6  |  Ore: Oridecon / Enriched Oridecon
  weapon_lv2: {
    //              +0   +1   +2   +3   +4   +5   +6  +7  +8  +9  +10 +11 +12 +13 +14 +15 +16 +17 +18 +19
    normal:     [100, 100, 100, 100, 100, 100,  60,  40, 20, 19, 18, 18, 18, 18, 17, 17, 17, 17, 15, 15],
    enrichedHd: [100, 100, 100, 100, 100, 100,  90,  70, 40, 30, 18, 18, 18, 18, 18, 17, 17, 17, 15, 15],
    maxLevel: 20,
    safetyLevel: 6,
  },

  // ── Weapon Level 3 ──────────────────────────────────────────────────────
  // Safety: +5  |  Ore: Oridecon / Enriched Oridecon
  weapon_lv3: {
    //              +0   +1   +2   +3   +4   +5  +6  +7  +8  +9  +10 +11 +12 +13 +14 +15 +16 +17 +18 +19
    normal:     [100, 100, 100, 100, 100,  60,  50, 20, 20, 19, 18, 18, 18, 18, 17, 17, 17, 17, 15, 15],
    enrichedHd: [100, 100, 100, 100, 100,  90,  80, 40, 40, 30, 18, 18, 18, 18, 18, 17, 17, 17, 15, 15],
    maxLevel: 20,
    safetyLevel: 5,
  },

  // ── Weapon Level 4 ──────────────────────────────────────────────────────
  // Safety: +4  |  Ore: Oridecon / Enriched Oridecon
  weapon_lv4: {
    //              +0   +1   +2   +3   +4  +5  +6  +7  +8 +9  +10 +11 +12 +13 +14 +15 +16 +17 +18 +19
    normal:     [100, 100, 100, 100,  60,  40, 40, 20, 20,  9,  8,  8,  8,  8,  7,  7,  7,  7,  5,  5],
    enrichedHd: [100, 100, 100, 100,  90,  70, 70, 40, 40, 20,  8,  8,  8,  8,  7,  7,  7,  7,  5,  5],
    maxLevel: 20,
    safetyLevel: 4,
  },

  // ── Weapon Level 5 ──────────────────────────────────────────────────────
  // Safety: +3  |  Ore: Etherdeocon / HD Ether Bradium
  weapon_lv5: {
    //              +0   +1   +2   +3  +4  +5  +6  +7  +8 +9  +10 +11 +12 +13 +14 +15 +16 +17 +18 +19
    normal:     [100, 100, 100,  60,  60, 40, 40, 20, 20,  9,  8,  8,  8,  8,  7,  7,  7,  7,  5,  5],
    enrichedHd: [100, 100, 100,  90,  70, 60, 60, 40, 40, 20, 15, 15, 15, 15, 10, 10, 10, 10,  7,  7],
    maxLevel: 20,
    safetyLevel: 3,
  },

  // ── Armor Level 1 ───────────────────────────────────────────────────────
  // Safety: +4  |  Ore: Elunium / Enriched Elunium → Carnium / HD Carnium (+10+)
  armor_lv1: {
    //              +0   +1   +2   +3   +4  +5  +6  +7  +8 +9  +10 +11 +12 +13 +14 +15 +16 +17 +18 +19
    normal:     [100, 100, 100, 100,  60,  40, 40, 20, 20,  9,  8,  8,  8,  8,  7,  7,  7,  7,  5,  5],
    enrichedHd: [100, 100, 100, 100,  90,  70, 70, 40, 40, 20,  8,  8,  8,  8,  7,  7,  7,  7,  5,  5],
    maxLevel: 20,
    safetyLevel: 4,
  },

  // ── Armor Level 2 ───────────────────────────────────────────────────────
  // Safety: +3  |  Ore: Ethernium / HD Ether Carnium
  armor_lv2: {
    //              +0   +1   +2   +3  +4  +5  +6  +7  +8 +9  +10 +11 +12 +13 +14 +15 +16 +17 +18 +19
    normal:     [100, 100, 100,  60,  60, 40, 40, 20, 20,  9,  8,  8,  8,  8,  7,  7,  7,  7,  5,  5],
    enrichedHd: [100, 100, 100,  90,  70, 60, 60, 40, 40, 20, 15, 15, 15, 15, 10, 10, 10, 10,  7,  7],
    maxLevel: 20,
    safetyLevel: 3,
  },

  // ── Shadow Weapon ────────────────────────────────────────────────────────────
  // Safety: +4  |  Ore: Oridecon / Enriched Oridecon → Bradium / HD Bradium (+10+)
  // อัตราเหมือน weapon_lv4  |  Max refine: +10
  shadow_weapon: {
    //              +0   +1   +2   +3   +4  +5  +6  +7  +8 +9
    normal:     [100, 100, 100, 100,  60,  40, 40, 20, 20,  9],
    enrichedHd: [100, 100, 100, 100,  90,  70, 70, 40, 40, 20],
    maxLevel: 10,
    safetyLevel: 4,
  },

  // ── Shadow Armor ─────────────────────────────────────────────────────────────
  // Safety: +4  |  Ore: Elunium / Enriched Elunium → Carnium / HD Carnium (+10+)
  // อัตราเหมือน armor_lv1  |  Max refine: +10
  shadow_armor: {
    //              +0   +1   +2   +3   +4  +5  +6  +7  +8 +9
    normal:     [100, 100, 100, 100,  60,  40, 40, 20, 20,  9],
    enrichedHd: [100, 100, 100, 100,  90,  70, 70, 40, 40, 20],
    maxLevel: 10,
    safetyLevel: 4,
  },
}

/**
 * จำนวน Blacksmith's Blessing (BSB) ที่ต้องใช้ต่อ attempt
 * เพื่อป้องกันไม่ให้ตก refine level เมื่อล้มเหลว (ไม่รวม HD ore)
 *
 * Key = from-level (refine level ก่อน attempt)
 * ใช้ตั้งแต่ level +7 ขึ้นไปเท่านั้น
 */
export const BSB_COSTS: Record<number, number> = {
   7:  1,
   8:  2,
   9:  4,
  10:  7,
  11: 11,
  12: 16,
  13: 22,
}

/**
 * BSB ช่วงกิจกรรม (Blacksmith’s Blessing Event) — อัตราลดเมื่อเปิดอิเวนท์
 * ข้อมูลจากภาพ Blacksmith Blessing Event ที่ใช้ในเสิร์ฟเวอร์ ROlimit
 */
export const BSB_EVENT_COSTS: Record<number, number> = {
   7:  1,
   8:  2,
   9:  3,
  10:  4,
  11:  7,
  12: 11,
  13: 16,
}

// ── Helper Functions ─────────────────────────────────────────────────────────

/**
 * ดึงอัตราสำเร็จ (0–100) สำหรับ equipment type, level ปัจจุบัน และ material
 *
 * @param equipType - ประเภทอุปกรณ์
 * @param fromLevel - refine level ปัจจุบัน (จะ attempt upgrade ไป fromLevel+1)
 * @param material  - ประเภท ore ที่ใช้
 * @returns อัตราสำเร็จ 0–100, หรือ null ถ้า fromLevel เกิน maxLevel
 */
export function getRefineSuccessRate(
  equipType: RefineEquipType,
  fromLevel: number,
  material: 'normal' | 'enrichedHd',
): number | null {
  const table = REFINE_RATES[equipType]
  if (fromLevel < 0 || fromLevel >= table.maxLevel) return null
  return table[material][fromLevel] ?? null
}

/** ดึง safety level ของอุปกรณ์ประเภทนั้น */
export function getSafetyLevel(equipType: RefineEquipType): number {
  return REFINE_RATES[equipType].safetyLevel
}

/** ตรวจสอบว่า attempt นี้อยู่ใน safety zone (100% guaranteed) หรือไม่ */
export function isSafeRefine(equipType: RefineEquipType, fromLevel: number): boolean {
  return fromLevel < REFINE_RATES[equipType].safetyLevel
}
