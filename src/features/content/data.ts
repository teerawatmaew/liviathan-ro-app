import type { Article } from '@/types'

export const articles: Article[] = [
  {
    id: '1',
    slug: 'beginner-guide',
    title: 'คู่มือเริ่มต้นสำหรับมือใหม่',
    excerpt:
      'ก้าวแรกใน Ragnarok Online เรียนรู้ระบบพื้นฐาน การสร้างตัวละคร และการเลือก Job ที่เหมาะกับสไตล์การเล่นของคุณ',
    content: '',
    category: 'guide',
    tags: ['beginner', 'job', 'stat'],
    thumbnail: '',
    publishedAt: '2026-05-01',
    author: 'LiviathaN',
  },
  {
    id: '2',
    slug: 'stat-guide',
    title: 'คู่มือการแจก Stat ทุก Job',
    excerpt:
      'อธิบายความหมายของ STR, AGI, VIT, INT, DEX, LUK และแนวทางการแจก Stat ที่เหมาะสมสำหรับแต่ละ Job Class',
    content: '',
    category: 'guide',
    tags: ['stat', 'build', 'job'],
    thumbnail: '',
    publishedAt: '2026-05-05',
    author: 'LiviathaN',
  },
  {
    id: '3',
    slug: 'farming-spots',
    title: 'แหล่ง Farm ที่ดีที่สุด ตาม Level',
    excerpt:
      'รวมแหล่ง Farm แนะนำตั้งแต่ Level 1–99 พร้อม Monster ที่น่าสนใจและ Drop Item สำคัญ',
    content: '',
    category: 'guide',
    tags: ['farm', 'level', 'monster'],
    thumbnail: '',
    publishedAt: '2026-05-10',
    author: 'LiviathaN',
  },
  {
    id: '4',
    slug: 'update-v2',
    title: 'อัปเดต Patch v2.0 — สิ่งที่เปลี่ยนแปลง',
    excerpt:
      'สรุปการเปลี่ยนแปลงทั้งหมดในแพตช์ล่าสุด: Job ใหม่, Map ใหม่, บาลานซ์ Skill และ Item ที่ถูกปรับ',
    content: '',
    category: 'update',
    tags: ['patch', 'update', 'new-content'],
    thumbnail: '',
    publishedAt: '2026-05-15',
    author: 'LiviathaN',
  },
]

export const categoryLabel: Record<Article['category'], string> = {
  guide: 'คู่มือ',
  news: 'ข่าวสาร',
  update: 'อัปเดต',
  showcase: 'Showcase',
}
