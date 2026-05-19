import type { JobClass } from '@/types'

/**
 * ข้อมูลอาชีพทั้งหมดในเกม Ragnarok Online (Class 1–4)
 * ใช้ร่วมกันได้ทุก feature — import โดยตรงจากที่นี่
 *
 * hpModifier / spModifier: มีเฉพาะ job ที่มีข้อมูลสูตรยืนยันแล้ว
 */
export const jobClasses: JobClass[] = [
  // ── Novice ──────────────────────────────────────────────────────────────
  { id: 'novice',         name: 'Novice',         tier: 'novice', hpModifier: 35, spModifier: 10 },
  { id: 'super_novice',   name: 'Super Novice',   tier: 'novice' },

  // ── Class 1 ─────────────────────────────────────────────────────────────
  { id: 'swordman',       name: 'Swordman',       tier: 'class1', hpModifier: 55, spModifier: 10 },
  { id: 'mage',           name: 'Mage',           tier: 'class1', hpModifier: 30, spModifier: 20 },
  { id: 'archer',         name: 'Archer',         tier: 'class1', hpModifier: 40, spModifier: 15 },
  { id: 'acolyte',        name: 'Acolyte',        tier: 'class1', hpModifier: 35, spModifier: 25 },
  { id: 'merchant',       name: 'Merchant',       tier: 'class1', hpModifier: 45, spModifier: 10 },
  { id: 'thief',          name: 'Thief',          tier: 'class1', hpModifier: 45, spModifier: 10 },
  { id: 'gunslinger',     name: 'Gunslinger',     tier: 'class1' },
  { id: 'ninja',          name: 'Ninja',          tier: 'class1' },
  { id: 'taekwon',        name: 'Taekwon',        tier: 'class1' },

  // ── Class 2 ─────────────────────────────────────────────────────────────
  { id: 'knight',         name: 'Knight',         tier: 'class2', hpModifier: 77, spModifier: 10 },
  { id: 'crusader',       name: 'Crusader',       tier: 'class2' },
  { id: 'wizard',         name: 'Wizard',         tier: 'class2', hpModifier: 32, spModifier: 22 },
  { id: 'sage',           name: 'Sage',           tier: 'class2' },
  { id: 'hunter',         name: 'Hunter',         tier: 'class2', hpModifier: 48, spModifier: 18 },
  { id: 'bard',           name: 'Bard',           tier: 'class2' },
  { id: 'dancer',         name: 'Dancer',         tier: 'class2' },
  { id: 'priest',         name: 'Priest',         tier: 'class2', hpModifier: 42, spModifier: 28 },
  { id: 'monk',           name: 'Monk',           tier: 'class2' },
  { id: 'blacksmith',     name: 'Blacksmith',     tier: 'class2', hpModifier: 55, spModifier: 10 },
  { id: 'alchemist',      name: 'Alchemist',      tier: 'class2' },
  { id: 'assassin',       name: 'Assassin',       tier: 'class2', hpModifier: 55, spModifier: 10 },
  { id: 'rogue',          name: 'Rogue',          tier: 'class2' },
  { id: 'star_gladiator', name: 'Star Gladiator', tier: 'class2' },
  { id: 'soul_linker',    name: 'Soul Linker',    tier: 'class2' },

  // ── Transcendent (Rebirth) ───────────────────────────────────────────────
  { id: 'lord_knight',    name: 'Lord Knight',    tier: 'trans' },
  { id: 'paladin',        name: 'Paladin',        tier: 'trans' },
  { id: 'high_wizard',    name: 'High Wizard',    tier: 'trans' },
  { id: 'professor',      name: 'Professor',      tier: 'trans' },
  { id: 'sniper',         name: 'Sniper',         tier: 'trans' },
  { id: 'clown',          name: 'Clown',          tier: 'trans' },
  { id: 'gypsy',          name: 'Gypsy',          tier: 'trans' },
  { id: 'high_priest',    name: 'High Priest',    tier: 'trans' },
  { id: 'champion',       name: 'Champion',       tier: 'trans' },
  { id: 'whitesmith',     name: 'Whitesmith',     tier: 'trans' },
  { id: 'creator',        name: 'Creator',        tier: 'trans' },
  { id: 'assassin_cross', name: 'Assassin Cross', tier: 'trans' },
  { id: 'stalker',        name: 'Stalker',        tier: 'trans' },

  // ── Class 3 ─────────────────────────────────────────────────────────────
  { id: 'rune_knight',    name: 'Rune Knight',    tier: 'class3' },
  { id: 'royal_guard',    name: 'Royal Guard',    tier: 'class3' },
  { id: 'warlock',        name: 'Warlock',        tier: 'class3' },
  { id: 'sorcerer',       name: 'Sorcerer',       tier: 'class3' },
  { id: 'ranger',         name: 'Ranger',         tier: 'class3' },
  { id: 'minstrel',       name: 'Minstrel',       tier: 'class3' },
  { id: 'wanderer',       name: 'Wanderer',       tier: 'class3' },
  { id: 'arch_bishop',    name: 'Arch Bishop',    tier: 'class3' },
  { id: 'sura',           name: 'Sura',           tier: 'class3' },
  { id: 'mechanic',       name: 'Mechanic',       tier: 'class3' },
  { id: 'genetic',        name: 'Genetic',        tier: 'class3' },
  { id: 'shadow_chaser',  name: 'Shadow Chaser',  tier: 'class3' },
  { id: 'guillotine_cross', name: 'Guillotine Cross', tier: 'class3' },
  { id: 'kagerou',        name: 'Kagerou',        tier: 'class3' },
  { id: 'oboro',          name: 'Oboro',          tier: 'class3' },
  { id: 'rebellion',      name: 'Rebellion',      tier: 'class3' },

  // ── Class 4 ─────────────────────────────────────────────────────────────
  { id: 'dragon_knight',    name: 'Dragon Knight',    tier: 'class4' },
  { id: 'imperial_guard',   name: 'Imperial Guard',   tier: 'class4' },
  { id: 'arch_mage',        name: 'Arch Mage',        tier: 'class4' },
  { id: 'elemental_master', name: 'Elemental Master', tier: 'class4' },
  { id: 'wind_hawk',        name: 'Wind Hawk',        tier: 'class4' },
  { id: 'troubadour',       name: 'Troubadour',       tier: 'class4' },
  { id: 'trouvere',         name: 'Trouvère',         tier: 'class4' },
  { id: 'inquisitor',       name: 'Inquisitor',       tier: 'class4' },
  { id: 'astra',            name: 'Astra',            tier: 'class4' },
  { id: 'biolo',            name: 'Biolo',            tier: 'class4' },
  { id: 'meister',          name: 'Meister',          tier: 'class4' },
  { id: 'abyss_chaser',     name: 'Abyss Chaser',     tier: 'class4' },
  { id: 'night_watch',      name: 'Night Watch',      tier: 'class4' },
  { id: 'hyper_novice',     name: 'Hyper Novice',     tier: 'class4' },
  { id: 'sky_emperor',      name: 'Sky Emperor',      tier: 'class4' },
]
