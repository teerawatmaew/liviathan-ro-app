export type ChangelogType = 'feat' | 'fix' | 'improve'

export interface ChangelogChange {
  type: ChangelogType
  description: string
}

export interface ChangelogEntry {
  version: string
  date: string
  changes: ChangelogChange[]
}

/**
 * บันทึกการเปลี่ยนแปลงของ LiviathaN RO
 * วิธีเพิ่ม entry ใหม่: เพิ่มที่หัว array (เรียง version ใหม่สุดก่อน)
 *
 * type:
 *   'feat'    — ฟีเจอร์ใหม่
 *   'fix'     — แก้ bug
 *   'improve' — ปรับปรุง / UI / performance
 */
export const changelog: ChangelogEntry[] = [
  {
    version: '0.1.0',
    date: '2026-05-20',
    changes: [
      { type: 'feat', description: 'เพิ่มหน้า Changelog' },
      { type: 'feat', description: 'Refine Simulator — จำลองการ refine อาวุธ/เกราะพร้อมสถิติ' },
      { type: 'feat', description: 'MP Jigsaw Calculator — คำนวณ Jigsaw จาก Mystical Pass' },
      { type: 'feat', description: 'Item Cost Calculator — คำนวณ Zeny / วัตถุดิบ Enhancement' },
      { type: 'feat', description: 'Central Lab Helper — แปลง Switch + Boss Lookup + Countdown' },
      { type: 'feat', description: 'เปิดตัว LiviathaN RO เว็บเครื่องมือ Ragnarok Online' },
    ],
  },
]
