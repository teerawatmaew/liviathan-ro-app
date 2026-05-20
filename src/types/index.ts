// Shared application-wide TypeScript types

export interface NavItem {
  title: string
  url: string
  icon?: React.ComponentType<{ className?: string }>
  children?: NavItem[]
}

// ─── Content ────────────────────────────────────────────────────────────────

export type ArticleCategory = 'guide' | 'news' | 'update' | 'showcase'

export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: ArticleCategory
  tags: string[]
  thumbnail?: string
  images?: string[]
  publishedAt: string
  author?: string
}

// ─── Gallery ────────────────────────────────────────────────────────────────

export interface GalleryItem {
  id: string
  url: string
  name: string
  caption?: string
  category?: string
}

// ─── Calculator ─────────────────────────────────────────────────────────────

export interface StatSet {
  str: number
  agi: number
  vit: number
  int: number
  dex: number
  luk: number
}

export type JobTier = 'novice' | 'class1' | 'class2' | 'trans' | 'class3' | 'class4'

export interface JobClass {
  id: string
  name: string
  tier: JobTier
  hpModifier?: number
  spModifier?: number
}

// ─── Elements ────────────────────────────────────────────────────────────────

export const ELEMENTS = [
  'Neutral',
  'Water',
  'Earth',
  'Fire',
  'Wind',
  'Poison',
  'Holy',
  'Shadow',
  'Ghost',
  'Undead',
] as const

export type ElementType = (typeof ELEMENTS)[number]
export type ElementLevel = 1 | 2 | 3 | 4
export type ElementTable = Record<ElementType, Record<ElementType, number>>
export type ElementTables = Record<ElementLevel, ElementTable>

// ─── Weapons ─────────────────────────────────────────────────────────────────

/** Level ของอาวุธ (กำหนดโบนัส ATK ต่อ refine และความยากในการ refine) */
export type WeaponLevel = 1 | 2 | 3 | 4 | 5

/** ขนาด monster */
export type SizeType = 'Small' | 'Medium' | 'Large'

export const RACES = [
  'Angel',
  'Brute',
  'Demi-Human',
  'Demon',
  'Dragon',
  'Fish',
  'Formless',
  'Insect',
  'Plant',
  'Undead',
] as const

export type RaceType = (typeof RACES)[number]

export interface WeaponTypeData {
  id: string
  name: string
  /** % damage multiplier ต่อขนาด monster */
  sizeModifier: Record<SizeType, number>
}

// ─── Equipment ───────────────────────────────────────────────────────────────

export type EquipCategory = 'normal' | 'costume' | 'shadow'

export interface EquipSlotData {
  id: string
  name: string
  label: string
  category: EquipCategory
  /** รองรับการใส่ Card ได้หรือไม่ */
  allowCard: boolean
}

// ─── Cities ──────────────────────────────────────────────────────────────────

export type CityRegion =
  | 'rune-midgarts'   // ราชอาณาจักร Rune-Midgarts
  | 'schwarzwald'     // สาธารณรัฐ Schwarzwald
  | 'arunafeltz'      // รัฐ Arunafeltz
  | 'new-world'       // โลกใหม่ (Midgard Continent 2)
  | 'issgard'         // ทวีป Issgard (EP19 — Land of Snow Flowers)
  | 'other'           // เมืองธีมพิเศษ / เกาะ / มิติอื่น

export interface CityData {
  id: string
  name: string
  region: CityRegion
}

// ─── Episodes ─────────────────────────────────────────────────────────────────

export interface EpisodeData {
  /** ID ที่ใช้ reference เช่น '12', '13.1', '14.2', '19' */
  id: string
  /** หมายเลข episode หลัก เช่น 12, 13, 14 */
  episode: number
  /** หมายเลข sub-episode (null ถ้าไม่มี sub) */
  sub: number | null
  /** ชื่อ episode */
  name: string
}

// ─── Status Effects ───────────────────────────────────────────────────────────

export interface StatusEffectData {
  id: string
  name: string
  /** คำอธิบายสั้น ๆ ถึงผลกระทบ */
  description: string
  /** debuff = สถานะร้าย, special = สถานะพิเศษที่ไม่ใช่แค่ debuff */
  type: 'debuff' | 'special'
  /** Stat ที่ช่วย resist หรือลด duration เช่น 'VIT', 'INT/LUK' */
  statResist?: string
}

// ─── MVP ──────────────────────────────────────────────────────────────────────

export type MvpDifficulty = 'low' | 'medium' | 'mid-high' | 'high'

export interface MvpData {
  id: string
  name: string
  /** ชื่อ map ที่แสดง */
  location: string
  /** RO map ID เช่น 'pay_fild10' */
  mapId: string
  /** respawn minimum (นาที) */
  respawnMin: number
  /** respawn maximum = respawnMin + 10 variance (นาที) */
  respawnMax: number
  difficulty: MvpDifficulty
  /** normal = spawn อัตโนมัติตามเวลา, special = spawn พิเศษ/quest/instance */
  spawnType: 'normal' | 'special'
}

// ─── Refine ───────────────────────────────────────────────────────────────────

/**
 * ประเภทอุปกรณ์สำหรับ refine rate
 * (แยกตาม weapon level / armor level / shadow)
 */
export type RefineEquipType =
  | 'weapon_lv1'
  | 'weapon_lv2'
  | 'weapon_lv3'
  | 'weapon_lv4'
  | 'weapon_lv5'
  | 'armor_lv1'
  | 'armor_lv2'
  | 'shadow_weapon'
  | 'shadow_armor'
