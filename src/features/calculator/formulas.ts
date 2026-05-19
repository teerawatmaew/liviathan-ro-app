import type { JobClass } from '@/types'
export { jobClasses } from '@/data/jobs'

/**
 * Calculate HP
 * Formula (simplified): (BaseLevel + VIT) * (hpModifier + BaseLevel * 0.5)
 */
export function calcHP(
  baseLevel: number,
  vit: number,
  job: JobClass,
): number {
  return Math.floor((baseLevel + vit) * ((job.hpModifier ?? 0) + baseLevel * 0.5))
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
  return Math.floor((baseLevel + int) * ((job.spModifier ?? 0) + baseLevel * 0.1))
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
