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
    version: '0.5.1',
    date: '2026-05-21',
    changes: [
      { type: 'improve', description: 'เพิ่ม Open Graph image (og:image) ขนาด 1200×630 สำหรับการแสดงผลตอนแชร์ลิงก์บน Facebook, LINE และ Discord' },
      { type: 'improve', description: 'เพิ่ม og:url และปรับปรุง Twitter Card เป็น summary_large_image พร้อม twitter:image' },
    ],
  },
  {
    version: '0.5.0',
    date: '2026-05-21',
    changes: [
      { type: 'feat', description: 'เพิ่มแสดงยอด Zeny ที่ใช้รวมในสถิติ Refine Simulator (Event Item)' },
      { type: 'feat', description: 'เพิ่มคอลัมน์ Zeny/ครั้ง ในตารางอัตราสำหรับ Event Item' },
      { type: 'fix', description: 'แก้ไขการนับจำนวนวัตถุดิบใน "แร่ที่ใช้ทั้งหมด" ให้ใช้จำนวนจริงต่อ attempt แทนการนับแค่จำนวนครั้ง' },
    ],
  },
  {
    version: '0.4.0',
    date: '2026-05-21',
    changes: [
      { type: 'feat', description: 'เพิ่มระบบ Event Item ใน Refine Simulator — รองรับไอเทม event ที่มีกลไกพิเศษแยกจากอุปกรณ์มาตรฐาน' },
      { type: 'feat', description: 'เพิ่ม [Event] Ayothaya Helm — ล้มเหลวไม่ลดขั้น ไม่เสียหาย ใช้ [Event] เหล็กไหลอโยธยา' },
      { type: 'feat', description: 'เพิ่ม [MP] Snow Flower Shadow และ [MP] Varmundt Shadow — รองรับ Pity mechanic (+1% ต่อครั้งที่ล้มเหลว สูงสุดตาม cap)' },
      { type: 'feat', description: 'เพิ่ม [MP] Nebula Shadow — อัตราและวัตถุดิบเดียวกับ MP Shadow แต่ไม่มี Pity' },
      { type: 'feat', description: 'รองรับ BSB กิจกรรม (BSB Event Costs) ใน Refine Simulator — ปุ่มสลับและแสดงในตารางอัตรา' },
      { type: 'improve', description: 'ปรับปุ่ม batch refine จาก ×100/×1000 เป็น ×10/×50 และลด cap การตีจนถึงเป้าเหลือ 5,000 ครั้ง' },
      { type: 'fix', description: 'แก้ไขค่า test stale ใน MP Jigsaw Calculator ให้ตรงกับ logic ปัจจุบัน' },
    ],
  },
  {
    version: '0.3.0',
    date: '2026-05-21',
    changes: [
      { type: 'feat', description: 'เพิ่ม Dark/Light mode toggle ใน header — บันทึก preference ใน localStorage, default เป็น Dark mode' },
      { type: 'feat', description: 'เพิ่ม Breadcrumb ใน header แสดงชื่อหน้าปัจจุบันแบบ dynamic ตาม route' },
      { type: 'improve', description: 'เพิ่ม Tooltip บน stat labels ใน Stat Calculator — แสดงสูตรคำนวณเมื่อ hover' },
      { type: 'fix', description: 'แก้ไข import useState ที่ขาดหายใน GradeSection และ ReformSection' },
      { type: 'fix', description: 'แก้ไขราคา Shadowdecon ไม่ถูก set เมื่อเพิ่มจาก preset ใน Reform Section' },
    ],
  },
  {
    version: '0.2.0',
    date: '2026-05-21',
    changes: [
      { type: 'feat', description: 'เพิ่มเครื่องมือ Zeny ↔ Baht Calculator — แปลง Zeny เป็นเงินบาทและย้อนกลับ รองรับหน่วย M (ล้าน) และ Zeny พร้อมกรอกอัตราตลาดปัจจุบันเอง' },
    ],
  },
  {
    version: '0.1.1',
    date: '2026-05-21',
    changes: [
      { type: 'improve', description: 'อัปเดตข้อมูลบอสใน Central Lab Helper ตาม patch 6 พฤษภาคม 2569 — แทนที่ 18 บอสด้วยรายชื่อใหม่พร้อม race/element/size ที่ถูกต้อง' },
    ],
  },
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
