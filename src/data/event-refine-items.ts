/**
 * Event Refine Items — ไอเทม event ที่มีระบบ refine พิเศษ
 *
 * หากต้องการเพิ่ม event item ใหม่:
 *   1. เพิ่ม object ลงใน EVENT_REFINE_ITEMS
 *   2. ระบุ id ที่ไม่ซ้ำกัน เช่น 'event_<name>'
 *   3. ระบุ rates[] ให้ครบตาม maxLevel (index = fromLevel)
 */

export interface EventRefineItem {
  id: string
  /** ชื่อที่แสดงใน dropdown */
  name: string
  /** level สูงสุดที่ refine ได้ */
  maxLevel: number
  /**
   * ต่ำกว่า safetyLevel = สำเร็จ 100% เสมอ
   * (เช่น safetyLevel=4 หมายความว่า +0→+4 ปลอดภัย)
   */
  safetyLevel: number
  /** ล้มเหลว = ไม่เสียหาย (built-in, ไม่ต้องใช้ไอเทมเพิ่มเติม) */
  noBreak: boolean
  /** ล้มเหลว = ไม่ลดขั้น (built-in, ไม่ต้องใช้ BSB) */
  noLevelLoss: boolean
  /** Zeny ต่อ 1 attempt */
  zenyCost: number
  /** ชื่อ ore ที่ใช้ — string คงที่ หรือ function ตาม fromLevel */
  oreLabel: string | ((fromLevel: number) => string)
  /** จำนวน ore ต่อ 1 attempt */
  oreCount: (fromLevel: number) => number
  /**
   * อัตราสำเร็จ 0–100 ต่อขั้น
   * index = fromLevel (0 = ตี +0→+1)
   * ต้องมีครบ maxLevel entries
   */
  rates: number[]
  /**
   * ระบบ Pity: ทุกครั้งที่ล้มเหลวที่ level เดิม อัตราสำเร็จจะเพิ่มขึ้น N%
   * ต้องใช้คู่กับ pityCaps เพื่อกำหนดอัตราสูงสุดต่อ level
   */
  pityPerFail?: number
  /**
   * อัตราสำเร็จสูงสุดเมื่อ pity สะสมเต็ม (per level)
   * index = fromLevel, null = ไม่มี pity cap ที่ level นั้น (หรือ level นั้นไม่มี pity)
   */
  pityCaps?: (number | null)[]
}

export const EVENT_REFINE_ITEMS: EventRefineItem[] = [
  {
    id: 'event_ayothaya_helm',
    name: '[Event] Ayothaya Helm',
    maxLevel: 20,
    safetyLevel: 4,
    noBreak: true,
    noLevelLoss: true,
    zenyCost: 100_000,
    oreLabel: '[Event] เหล็กไหลอโยธยา',
    oreCount: (fromLevel) => (fromLevel >= 9 ? 2 : 1),
    // อัตราจากข้อมูลในเกม
    // หมายเหตุ: 10→11 ไม่ปรากฏในตารางต้นฉบับ ประมาณไว้ที่ 40% (เท่ากับ 9→10)
    rates: [100, 100, 100, 100, 90, 80, 70, 60, 50, 40, 40, 35, 30, 25, 20, 15, 10, 5, 5, 1],
  },
  // ── [MP] Mystical Pass Shadow items ──────────────────────────────────────
  // oreCount formula: +0–+3 = (level+1)*20, +4–+9 = 100 + (level-4)*50
  {
    id: 'event_mp_snow_flower_shadow',
    name: '[MP] Snow Flower Shadow',
    maxLevel: 10,
    safetyLevel: 4,
    noBreak: true,
    noLevelLoss: true,
    zenyCost: 100_000,
    oreLabel: '[MP] Material',
    oreCount: (fromLevel) =>
      fromLevel < 4 ? (fromLevel + 1) * 20 : 100 + (fromLevel - 4) * 50,
    rates: [100, 100, 100, 100, 40, 30, 20, 15, 10, 5],
    // Pity: ทุกครั้งที่ล้มเหลวที่ level เดิม อัตราเพิ่ม +1% (สูงสุดตาม cap)
    pityPerFail: 1,
    pityCaps: [null, null, null, null, 80, 70, 60, 50, 40, 30],
  },
  {
    id: 'event_mp_varmundt_shadow',
    name: '[MP] Varmundt Shadow',
    maxLevel: 10,
    safetyLevel: 4,
    noBreak: true,
    noLevelLoss: true,
    zenyCost: 100_000,
    oreLabel: '[MP] Material',
    oreCount: (fromLevel) =>
      fromLevel < 4 ? (fromLevel + 1) * 20 : 100 + (fromLevel - 4) * 50,
    rates: [100, 100, 100, 100, 40, 30, 20, 15, 10, 5],
    pityPerFail: 1,
    pityCaps: [null, null, null, null, 80, 70, 60, 50, 40, 30],
  },
  {
    id: 'event_mp_nebula_shadow',
    name: '[MP] Nebula Shadow',
    maxLevel: 10,
    safetyLevel: 4,
    noBreak: true,
    noLevelLoss: true,
    zenyCost: 100_000,
    oreLabel: '[MP] Material',
    oreCount: (fromLevel) =>
      fromLevel < 4 ? (fromLevel + 1) * 20 : 100 + (fromLevel - 4) * 50,
    rates: [100, 100, 100, 100, 40, 30, 20, 15, 10, 5],
    // ไม่มี pity mechanic
  },
]

/** ดึง EventRefineItem ตาม id; คืน undefined หากไม่พบ */
export function getEventRefineItem(id: string): EventRefineItem | undefined {
  return EVENT_REFINE_ITEMS.find((item) => item.id === id)
}

/** ตรวจสอบว่า id นี้คือ event refine item หรือไม่ */
export function isEventRefineType(id: string): boolean {
  return EVENT_REFINE_ITEMS.some((item) => item.id === id)
}

/** ดึงชื่อ ore สำหรับ event item ตาม fromLevel */
export function getEventOreLabel(item: EventRefineItem, fromLevel: number): string {
  return typeof item.oreLabel === 'function' ? item.oreLabel(fromLevel) : item.oreLabel
}

/**
 * คำนวณอัตราสำเร็จจริงที่ level นี้ รวม pity bonus ที่สะสมไว้
 * @param pityStack จำนวน % ที่สะสมจากการล้มเหลวก่อนหน้า (0 = ยังไม่มี pity)
 */
export function getEffectiveEventRate(
  item: EventRefineItem,
  fromLevel: number,
  pityStack: number,
): number {
  const base = item.rates[fromLevel] ?? 100
  if (!item.pityPerFail || !item.pityCaps) return base
  const cap = item.pityCaps[fromLevel] ?? null
  if (cap === null) return base
  return Math.min(base + pityStack, cap)
}
