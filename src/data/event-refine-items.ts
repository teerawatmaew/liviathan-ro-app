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
   * อัตราสำเร็จ 0–100 ต่อขั้น (แร่ธรรมดา)
   * index = fromLevel (0 = ตี +0→+1)
   * ต้องมีครบ maxLevel entries
   */
  rates: number[]
  /**
   * อัตราสำเร็จ 0–100 ต่อขั้น (Enriched/HD ore)
   * หากไม่ระบุ จะใช้ rates[] แทน
   */
  enrichedRates?: number[]
  /**
   * RefineEquipType ของอุปกรณ์พื้นฐาน
   * ระบุเมื่อ event item นี้ใช้กลไกมาตรฐาน (break / level loss) และ ore ปกติ
   * เช่น event_rateup_weapon_lv4 → baseEquipType = 'weapon_lv4'
   */
  baseEquipType?: string
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

  // ── [Rate Up Event] Grade & Refine Rate Up + BSB (10–24 มิ.ย. 2569) ─────
  // กลไกมาตรฐาน (break / level-loss / BSB) ยังคงใช้อยู่
  // rates[]       = อัตราด้วยแร่ธรรมดา (ไอเท็มทั่วไปภายในเกม)
  // enrichedRates = อัตราด้วยแร่ Cash (Enriched/HD)
  {
    id: 'event_rateup_armor_lv1',
    name: '[Rate Up] Armor Lv.1',
    maxLevel: 20,
    safetyLevel: 4,
    noBreak: false,
    noLevelLoss: false,
    zenyCost: 0,
    oreLabel: 'Elunium / Carnium',
    oreCount: () => 1,
    baseEquipType: 'armor_lv1',
    //              +0   +1   +2   +3  +4  +5  +6  +7  +8  +9 +10 +11 +12 +13 +14 +15 +16 +17 +18 +19
    rates:     [100, 100, 100, 100,  60, 40, 40, 20, 20,  9, 20, 20, 16, 16, 15, 15, 14, 14, 10, 10],
    enrichedRates: [100, 100, 100, 100,  95, 80, 80, 60, 50, 35, 20, 20, 16, 16, 15, 15, 14, 14, 10, 10],
  },
  {
    id: 'event_rateup_armor_lv2',
    name: '[Rate Up] Armor Lv.2',
    maxLevel: 20,
    safetyLevel: 3,
    noBreak: false,
    noLevelLoss: false,
    zenyCost: 0,
    oreLabel: 'Ethernium / HD Ether Carnium',
    oreCount: () => 1,
    baseEquipType: 'armor_lv2',
    //              +0   +1   +2  +3  +4  +5  +6  +7  +8  +9 +10 +11 +12 +13 +14 +15 +16 +17 +18 +19
    rates:     [100, 100, 100,  80, 80, 60, 60, 40, 40, 18, 16, 16, 16, 16, 14, 14, 14, 14, 10, 10],
    enrichedRates: [100, 100, 100,  95, 85, 70, 65, 55, 45, 25, 20, 20, 20, 20, 15, 15, 15, 15, 10, 10],
  },
  {
    id: 'event_rateup_weapon_lv1',
    name: '[Rate Up] อาวุธ Lv.1',
    maxLevel: 20,
    safetyLevel: 7,
    noBreak: false,
    noLevelLoss: false,
    zenyCost: 0,
    oreLabel: 'Oridecon / Bradium',
    oreCount: () => 1,
    baseEquipType: 'weapon_lv1',
    //              +0   +1   +2   +3   +4   +5   +6  +7  +8  +9 +10 +11 +12 +13 +14 +15 +16 +17 +18 +19
    rates:     [100, 100, 100, 100, 100, 100, 100,  60, 40, 19, 40, 40, 35, 35, 30, 30, 20, 20, 15, 15],
    enrichedRates: [100, 100, 100, 100, 100, 100, 100,  95, 85, 55, 40, 40, 35, 35, 30, 30, 20, 20, 15, 15],
  },
  {
    id: 'event_rateup_weapon_lv2',
    name: '[Rate Up] อาวุธ Lv.2',
    maxLevel: 20,
    safetyLevel: 6,
    noBreak: false,
    noLevelLoss: false,
    zenyCost: 0,
    oreLabel: 'Oridecon / Bradium',
    oreCount: () => 1,
    baseEquipType: 'weapon_lv2',
    //              +0   +1   +2   +3   +4   +5  +6  +7  +8  +9 +10 +11 +12 +13 +14 +15 +16 +17 +18 +19
    rates:     [100, 100, 100, 100, 100, 100,  60, 50, 20, 19, 40, 40, 35, 35, 30, 30, 20, 20, 15, 15],
    enrichedRates: [100, 100, 100, 100, 100, 100,  95, 85, 60, 45, 40, 40, 35, 35, 30, 30, 20, 20, 15, 15],
  },
  {
    id: 'event_rateup_weapon_lv3',
    name: '[Rate Up] อาวุธ Lv.3',
    maxLevel: 20,
    safetyLevel: 5,
    noBreak: false,
    noLevelLoss: false,
    zenyCost: 0,
    oreLabel: 'Oridecon / Bradium',
    oreCount: () => 1,
    baseEquipType: 'weapon_lv3',
    //              +0   +1   +2   +3   +4  +5  +6  +7  +8  +9 +10 +11 +12 +13 +14 +15 +16 +17 +18 +19
    rates:     [100, 100, 100, 100, 100,  60, 50, 20, 20, 19, 40, 40, 35, 35, 30, 30, 20, 20, 15, 15],
    enrichedRates: [100, 100, 100, 100, 100,  95, 90, 70, 60, 45, 40, 40, 35, 35, 30, 30, 20, 20, 15, 15],
  },
  {
    id: 'event_rateup_weapon_lv4',
    name: '[Rate Up] อาวุธ Lv.4',
    maxLevel: 20,
    safetyLevel: 4,
    noBreak: false,
    noLevelLoss: false,
    zenyCost: 0,
    oreLabel: 'Oridecon / Bradium',
    oreCount: () => 1,
    baseEquipType: 'weapon_lv4',
    //              +0   +1   +2   +3  +4  +5  +6  +7  +8  +9 +10 +11 +12 +13 +14 +15 +16 +17 +18 +19
    rates:     [100, 100, 100, 100,  60, 40, 40, 20, 20,  9, 20, 20, 16, 16, 15, 15, 14, 14, 10, 10],
    enrichedRates: [100, 100, 100, 100,  95, 80, 80, 60, 50, 35, 20, 20, 16, 16, 15, 15, 14, 14, 10, 10],
  },
  {
    id: 'event_rateup_weapon_lv5',
    name: '[Rate Up] อาวุธ Lv.5',
    maxLevel: 20,
    safetyLevel: 3,
    noBreak: false,
    noLevelLoss: false,
    zenyCost: 0,
    oreLabel: 'Etherdeocon / HD Ether Bradium',
    oreCount: () => 1,
    baseEquipType: 'weapon_lv5',
    //              +0   +1   +2  +3  +4  +5  +6  +7  +8  +9 +10 +11 +12 +13 +14 +15 +16 +17 +18 +19
    rates:     [100, 100, 100,  80, 80, 60, 60, 40, 40, 18, 16, 16, 16, 16, 14, 14, 14, 14, 10, 10],
    enrichedRates: [100, 100, 100,  95, 85, 70, 65, 55, 45, 25, 20, 20, 20, 20, 15, 15, 15, 15, 10, 10],
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
 * @param oreType  ประเภทแร่ — ถ้า item มี enrichedRates จะใช้เมื่อ oreType = 'enrichedHd'
 */
export function getEffectiveEventRate(
  item: EventRefineItem,
  fromLevel: number,
  pityStack: number,
  oreType: 'normal' | 'enrichedHd' = 'normal',
): number {
  // Rate Up items: ใช้ enrichedRates เมื่อ oreType = enrichedHd
  if (oreType === 'enrichedHd' && item.enrichedRates) {
    return item.enrichedRates[fromLevel] ?? 100
  }
  const base = item.rates[fromLevel] ?? 100
  if (!item.pityPerFail || !item.pityCaps) return base
  const cap = item.pityCaps[fromLevel] ?? null
  if (cap === null) return base
  return Math.min(base + pityStack, cap)
}
