import type { JobClass } from '@/types'

export const jobClasses: JobClass[] = [
  { id: 'novice', name: 'Novice', hpModifier: 35, spModifier: 10 },
  { id: 'swordman', name: 'Swordman', hpModifier: 55, spModifier: 10 },
  { id: 'mage', name: 'Mage', hpModifier: 30, spModifier: 20 },
  { id: 'archer', name: 'Archer', hpModifier: 40, spModifier: 15 },
  { id: 'acolyte', name: 'Acolyte', hpModifier: 35, spModifier: 25 },
  { id: 'merchant', name: 'Merchant', hpModifier: 45, spModifier: 10 },
  { id: 'thief', name: 'Thief', hpModifier: 45, spModifier: 10 },
  { id: 'knight', name: 'Knight', hpModifier: 77, spModifier: 10 },
  { id: 'wizard', name: 'Wizard', hpModifier: 32, spModifier: 22 },
  { id: 'hunter', name: 'Hunter', hpModifier: 48, spModifier: 18 },
  { id: 'priest', name: 'Priest', hpModifier: 42, spModifier: 28 },
  { id: 'blacksmith', name: 'Blacksmith', hpModifier: 55, spModifier: 10 },
  { id: 'assassin', name: 'Assassin', hpModifier: 55, spModifier: 10 },
]

/**
 * Calculate HP
 * Formula (simplified): (BaseLevel + VIT) * (hpModifier + BaseLevel * 0.5)
 */
export function calcHP(
  baseLevel: number,
  vit: number,
  job: JobClass,
): number {
  return Math.floor((baseLevel + vit) * (job.hpModifier + baseLevel * 0.5))
}

/**
 * Calculate SP
 * Formula (simplified): (BaseLevel + INT) * (spModifier + BaseLevel * 0.1)
 */
export function calcSP(
  baseLevel: number,
  int: number,
  job: JobClass,
): number {
  return Math.floor((baseLevel + int) * (job.spModifier + baseLevel * 0.1))
}

/** ATK = STR + (STR / 10)^2 + WeaponATK  (base, no weapon) */
export function calcATK(str: number): number {
  return str + Math.floor((str / 10) ** 2)
}

/** MATK range = INT^2 / 7  (simplified) */
export function calcMATK(int: number): number {
  return Math.floor((int * int) / 7)
}

/** HIT = DEX + BaseLevel */
export function calcHIT(dex: number, baseLevel: number): number {
  return dex + baseLevel
}

/** FLEE = AGI + BaseLevel */
export function calcFLEE(agi: number, baseLevel: number): number {
  return agi + baseLevel
}

/** DEF (soft) = VIT / 2 */
export function calcDEF(vit: number): number {
  return Math.floor(vit / 2)
}

/** MDEF (soft) = INT / 4 */
export function calcMDEF(int: number): number {
  return Math.floor(int / 4)
}
