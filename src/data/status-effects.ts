import type { StatusEffectData } from '@/types'

/**
 * Status ailments ในเกม Ragnarok Online
 * ข้อมูลจาก iRO Wiki: https://irowiki.org/wiki/Status_Effects
 *
 * รวม classic debuffs + Renewal-era status effects ที่สำคัญ
 */
export const statusEffects: StatusEffectData[] = [
  // ── Classic Debuffs ────────────────────────────────────────────────────────
  {
    id: 'stun',
    name: 'Stun',
    description: 'ไม่สามารถเคลื่อนไหว/โจมตี/ใช้สกิล/ไอเทมได้ FLEE = 0',
    type: 'debuff',
    statResist: 'VIT',
  },
  {
    id: 'poison',
    name: 'Poison',
    description: 'Soft DEF -25%, HP -1.5%MaxHP+2 ต่อวินาที (ถ้า HP > 25%), SP Regen ถูกปิด',
    type: 'debuff',
    statResist: 'VIT',
  },
  {
    id: 'silence',
    name: 'Silence',
    description: 'ใช้ Active Skill ไม่ได้',
    type: 'debuff',
    statResist: 'INT',
  },
  {
    id: 'blind',
    name: 'Blind',
    description: 'HIT และ FLEE -25%',
    type: 'debuff',
    statResist: 'VIT/LUK/INT',
  },
  {
    id: 'frozen',
    name: 'Frozen',
    description: 'DEF -50%, FLEE = 0, ไม่สามารถเคลื่อนไหวได้, armor กลายเป็น Water Lv1',
    type: 'debuff',
    statResist: 'MDEF/LUK',
  },
  {
    id: 'stone',
    name: 'Stone',
    description: 'DEF -50%, ไม่สามารถเคลื่อนไหวได้, HP -1%/5วินาที, armor กลายเป็น Earth Lv1, MDEF +25%',
    type: 'debuff',
    statResist: 'MDEF/LUK',
  },
  {
    id: 'sleep',
    name: 'Sleep',
    description: 'ไม่สามารถเคลื่อนไหวได้, ถูกโจมตีทุกครั้ง (FLEE = 0), ผู้โจมตีมีโอกาส CRIT 2x',
    type: 'debuff',
    statResist: 'INT/LUK',
  },
  {
    id: 'curse',
    name: 'Curse',
    description: 'ATK -25%, LUK = 0, Movement Speed ลดลงอย่างมาก',
    type: 'debuff',
    statResist: 'LUK/VIT',
  },
  {
    id: 'chaos',
    name: 'Chaos',
    description: 'เคลื่อนไหวในทิศทางสุ่ม ไม่สามารถควบคุมได้',
    type: 'debuff',
    statResist: 'VIT/LUK',
  },
  {
    id: 'coma',
    name: 'Coma',
    description: 'HP ลดเหลือ 1 และ SP ลดเหลือ 0 ทันที',
    type: 'debuff',
    statResist: 'LUK',
  },
  {
    id: 'decrease_agi',
    name: 'Decrease AGI',
    description: 'AGI ลดลง, Movement Speed ลดลง',
    type: 'debuff',
    statResist: 'MDEF',
  },

  // ── Renewal Debuffs ────────────────────────────────────────────────────────
  {
    id: 'bleeding',
    name: 'Bleeding',
    description: 'สูญเสีย HP อย่างต่อเนื่อง (สามารถ Kill ได้), Natural HP/SP Regen ถูกปิด',
    type: 'debuff',
    statResist: 'AGI',
  },
  {
    id: 'burning',
    name: 'Burning',
    description: 'รับ (1000 + 3%×MaxHP) ทุก 3 วินาที, MDEF -25%',
    type: 'debuff',
    statResist: 'AGI',
  },
  {
    id: 'freezing',
    name: 'Freezing',
    description: 'Movement Speed -30%, ASPD -30%, Hard DEF -30%, Fixed Cast Time +50%',
    type: 'debuff',
    statResist: 'VIT/DEX',
  },
  {
    id: 'crystallization',
    name: 'Crystallization',
    description: 'ไม่สามารถเคลื่อนไหว/โจมตี/ใช้สกิลได้, HP -2%/SP -1% ต่อวินาที, รับดาเมจจาก Mace/Axe +50%, Wind magic +50%',
    type: 'debuff',
    statResist: 'VIT',
  },
  {
    id: 'deadly_poison',
    name: 'Deadly Poison',
    description: 'MaxHP -10%, HP -4%MaxHP ต่อวินาที',
    type: 'debuff',
    statResist: 'VIT/LUK',
  },
  {
    id: 'deep_sleep',
    name: 'Deep Sleep',
    description: 'ใช้ Chat ไม่ได้, HP/SP Regen +2%/วินาที, ถูก Attack ครั้งแรกรับดาเมจ ×1.5',
    type: 'debuff',
    statResist: 'INT',
  },
  {
    id: 'fear',
    name: 'Fear',
    description: 'ไม่สามารถเคลื่อนไหวได้ 2 วินาที, HIT และ FLEE -20%',
    type: 'debuff',
  },
  {
    id: 'critical_wounds',
    name: 'Critical Wounds',
    description: 'ลด Healing Effect 20% ต่อ Level (สูงสุด 5 ระดับ = -100%), นาน 30 วินาที',
    type: 'debuff',
  },
  {
    id: 'imprison',
    name: 'Imprison',
    description: 'ไม่สามารถโจมตี/เคลื่อนไหว/ใช้สกิลได้, รับดาเมจเฉพาะ Ghost element magic',
    type: 'debuff',
    statResist: 'VIT/LUK',
  },
  {
    id: 'howling',
    name: 'Howling',
    description: 'SP ลดลง, INT ลดลง, Fixed Cast Time เพิ่มขึ้น',
    type: 'debuff',
    statResist: 'VIT/LUK',
  },
  {
    id: 'stasis',
    name: 'Stasis',
    description: 'ปิดการใช้งานสกิลจำนวนมาก',
    type: 'debuff',
    statResist: 'VIT/DEX',
  },
  {
    id: 'hallucination',
    name: 'Hallucination',
    description: 'หน้าจอกลับหัว (ภาพมึนงง)',
    type: 'debuff',
  },
  {
    id: 'break',
    name: 'Break',
    description: 'หลายประเภท: Ankle Break (Speed -50%), Knee Break (Speed -30%, ASPD -10%), Wrist Break (ASPD -25%), Shoulder Break (Soft DEF -50%), Waist Break (Soft DEF -25%, ATK -25%), Neck Break (+dmg, Bleeding)',
    type: 'debuff',
    statResist: 'STR (Ankle), AGI/LUK (duration)',
  },
  {
    id: 'divest',
    name: 'Divest',
    description: 'ไม่สามารถสวมใส่ Equipment ใน slot ที่ถูก Divest ได้อีก',
    type: 'debuff',
    statResist: 'DEX',
  },

  // ── Special Status ────────────────────────────────────────────────────────
  {
    id: 'lex_aeterna',
    name: 'Lex Aeterna',
    description: 'ถูกโจมตีครั้งถัดไปรับดาเมจ ×2',
    type: 'special',
  },
]

/** ค้นหา status effect จาก id */
export function getStatusEffectById(id: string) {
  return statusEffects.find((s) => s.id === id) ?? null
}

/** กรองเฉพาะ debuff */
export function getDebuffs() {
  return statusEffects.filter((s) => s.type === 'debuff')
}
