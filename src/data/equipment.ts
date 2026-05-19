import type { EquipSlotData } from '@/types'

/**
 * ช่องอุปกรณ์ทั้งหมดใน Ragnarok Online
 *
 * category:
 *   - 'normal'  — อุปกรณ์ปกติ
 *   - 'costume' — อุปกรณ์ Costume (ไม่มี stat ส่งผลต่อรูปร่างเท่านั้น)
 *   - 'shadow'  — อุปกรณ์ Shadow (ให้ bonus เพิ่มเติม)
 *
 * allowCard: รองรับการใส่ Card ได้หรือไม่
 */
export const equipSlots: EquipSlotData[] = [
  // ── Normal ──────────────────────────────────────────────────────────────
  { id: 'weapon',         name: 'Weapon',                label: 'อาวุธ',                    category: 'normal',  allowCard: true  },
  { id: 'shield',         name: 'Shield',                label: 'โล่ / มือซ้าย',            category: 'normal',  allowCard: true  },
  { id: 'head_upper',     name: 'Upper Headgear',        label: 'หมวก (บน)',                category: 'normal',  allowCard: true  },
  { id: 'head_mid',       name: 'Middle Headgear',       label: 'หมวก (กลาง)',              category: 'normal',  allowCard: true  },
  { id: 'head_lower',     name: 'Lower Headgear',        label: 'หมวก (ล่าง)',              category: 'normal',  allowCard: true  },
  { id: 'armor',          name: 'Armor',                 label: 'เกราะ',                    category: 'normal',  allowCard: true  },
  { id: 'garment',        name: 'Garment',               label: 'เสื้อคลุม',                category: 'normal',  allowCard: true  },
  { id: 'footgear',       name: 'Footgear',              label: 'รองเท้า',                  category: 'normal',  allowCard: true  },
  { id: 'acc_right',      name: 'Right Accessory',       label: 'เครื่องประดับ (ขวา)',      category: 'normal',  allowCard: true  },
  { id: 'acc_left',       name: 'Left Accessory',        label: 'เครื่องประดับ (ซ้าย)',     category: 'normal',  allowCard: true  },

  // ── Costume ─────────────────────────────────────────────────────────────
  { id: 'costume_upper',    name: 'Costume Upper',       label: 'Costume (บน)',             category: 'costume', allowCard: false },
  { id: 'costume_mid',      name: 'Costume Middle',      label: 'Costume (กลาง)',           category: 'costume', allowCard: false },
  { id: 'costume_lower',    name: 'Costume Lower',       label: 'Costume (ล่าง)',           category: 'costume', allowCard: false },
  { id: 'costume_garment',  name: 'Costume Garment',     label: 'Costume เสื้อคลุม',       category: 'costume', allowCard: false },

  // ── Shadow ──────────────────────────────────────────────────────────────
  { id: 'shadow_weapon',    name: 'Shadow Weapon',       label: 'Shadow อาวุธ',             category: 'shadow',  allowCard: false },
  { id: 'shadow_armor',     name: 'Shadow Armor',        label: 'Shadow เกราะ',             category: 'shadow',  allowCard: false },
  { id: 'shadow_shield',    name: 'Shadow Shield',       label: 'Shadow โล่',               category: 'shadow',  allowCard: false },
  { id: 'shadow_shoes',     name: 'Shadow Shoes',        label: 'Shadow รองเท้า',           category: 'shadow',  allowCard: false },
  { id: 'shadow_acc_right', name: 'Shadow Right Acc.',   label: 'Shadow เครื่องประดับ (ขวา)', category: 'shadow', allowCard: false },
  { id: 'shadow_acc_left',  name: 'Shadow Left Acc.',    label: 'Shadow เครื่องประดับ (ซ้าย)', category: 'shadow', allowCard: false },
]

/** กรองเฉพาะ slot ของ category ที่ระบุ */
export function getSlotsByCategory(category: EquipSlotData['category']) {
  return equipSlots.filter((s) => s.category === category)
}
