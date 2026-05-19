import type { WeaponTypeData, WeaponLevel } from '@/types'

/**
 * ข้อมูลประเภทอาวุธทั้งหมด
 *
 * sizeModifier: % damage ที่ทำได้ต่อขนาด monster (Small / Medium / Large)
 * level: ระดับอาวุธ (กระทบ ATK bonus ต่อ refine และ refinement difficulty)
 *
 * Source: https://irowiki.org/wiki/Weapon_Types
 */
export const weaponTypes: WeaponTypeData[] = [
  // id                  name                         Small  Medium  Large
  { id: 'bare_hand',     name: 'Bare Hand',           sizeModifier: { Small: 100, Medium: 100, Large: 100 } },
  { id: 'dagger',        name: 'Dagger',              sizeModifier: { Small: 100, Medium:  75, Large:  50 } },
  { id: 'sword_1h',      name: 'One-Handed Sword',    sizeModifier: { Small:  75, Medium: 100, Large:  75 } },
  { id: 'sword_2h',      name: 'Two-Handed Sword',    sizeModifier: { Small:  75, Medium:  75, Large: 100 } },
  { id: 'spear_1h',      name: 'One-Handed Spear',    sizeModifier: { Small:  75, Medium:  75, Large: 100 } },
  { id: 'spear_2h',      name: 'Two-Handed Spear',    sizeModifier: { Small:  75, Medium:  75, Large: 100 } },
  { id: 'axe_1h',        name: 'One-Handed Axe',      sizeModifier: { Small:  75, Medium: 100, Large:  75 } },
  { id: 'axe_2h',        name: 'Two-Handed Axe',      sizeModifier: { Small:  50, Medium:  75, Large: 100 } },
  { id: 'mace',          name: 'Mace',                sizeModifier: { Small:  75, Medium: 100, Large:  75 } },
  { id: 'staff_1h',      name: 'One-Handed Staff',    sizeModifier: { Small:  75, Medium:  75, Large:  75 } },
  { id: 'bow',           name: 'Bow',                 sizeModifier: { Small: 100, Medium: 100, Large:  75 } },
  { id: 'knuckle',       name: 'Knuckle',             sizeModifier: { Small: 100, Medium:  75, Large:  50 } },
  { id: 'instrument',    name: 'Musical Instrument',  sizeModifier: { Small:  75, Medium:  75, Large:  75 } },
  { id: 'whip',          name: 'Whip',                sizeModifier: { Small:  75, Medium:  75, Large:  75 } },
  { id: 'book',          name: 'Book',                sizeModifier: { Small: 100, Medium: 100, Large:  75 } },
  { id: 'katar',         name: 'Katar',               sizeModifier: { Small:  75, Medium:  75, Large: 100 } },
  { id: 'revolver',      name: 'Revolver',            sizeModifier: { Small: 100, Medium: 100, Large: 100 } },
  { id: 'rifle',         name: 'Rifle',               sizeModifier: { Small: 100, Medium: 100, Large: 100 } },
  { id: 'gatling_gun',   name: 'Gatling Gun',         sizeModifier: { Small: 100, Medium: 100, Large: 100 } },
  { id: 'shotgun',       name: 'Shotgun',             sizeModifier: { Small: 100, Medium: 100, Large: 100 } },
  { id: 'grenade',       name: 'Grenade Launcher',    sizeModifier: { Small: 100, Medium: 100, Large: 100 } },
  { id: 'shuriken',      name: 'Shuriken',            sizeModifier: { Small: 100, Medium:  75, Large:  50 } },
  { id: 'huuma',         name: 'Huuma Shuriken',      sizeModifier: { Small: 100, Medium: 100, Large:  75 } },
  { id: 'staff_2h',      name: 'Two-Handed Staff',    sizeModifier: { Small:  75, Medium:  75, Large:  75 } },
]

/**
 * ATK bonus ต่อ refine level แต่ละ weapon level (สูตรพื้นฐาน ไม่รวม over-upgrade bonus)
 * Source: https://irowiki.org/wiki/Refining
 */
export const WEAPON_REFINE_ATK: Record<WeaponLevel, number> = {
  1: 2,
  2: 3,
  3: 5,
  4: 7,
  5: 10,
}

/**
 * DEF bonus ต่อ refine level สำหรับ Armor (สูตรพื้นฐาน ไม่รวม over-upgrade bonus)
 */
export const ARMOR_REFINE_DEF = 1 // +1 DEF per refine
