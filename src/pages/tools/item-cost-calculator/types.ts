// ─── Shared utility ────────────────────────────────────────────────────────────

let _uid = 1
export function nextId() { return _uid++ }

export function formatZeny(n: number): string {
  return n.toLocaleString('en-US') + 'z'
}

// ─── Reform & Craft ────────────────────────────────────────────────────────────

export type ItemType = 'Weapon' | 'Armor' | 'Accessory'
export type Grade = 'Low' | 'Medium' | 'High' | 'Supreme'

export interface EnhancementItem {
  id: number
  category: 'enhancement'
  type: ItemType
  grade: Grade
  qty: number
}

export interface OtherItem {
  id: number
  category: 'other'
  name: string
  price: number
  qty: number
}

export type CalcItem = EnhancementItem | OtherItem

export const TYPES: ItemType[] = ['Weapon', 'Armor', 'Accessory']
export const GRADES: Grade[] = ['Low', 'Medium', 'High', 'Supreme']

export const CRAFT_ZENY: Record<Grade, number> = {
  Low: 20_000,
  Medium: 10_000,
  High: 20_000,
  Supreme: 50_000,
}

export const PREV_GRADE_NEEDED: Partial<Record<Grade, number>> = {
  Medium: 3,
  High: 3,
  Supreme: 3,
}

export const PRESET_ITEMS: { name: string; emoji: string; group: string }[] = [
  { name: 'Shadowdecon',                      emoji: '💠', group: 'ทั่วไป' },
  { name: 'Reform Stone',                     emoji: '🪨', group: 'ทั่วไป' },
  { name: 'Zelunium',                         emoji: '💎', group: 'ทั่วไป' },
  { name: 'Blacksmith Blessing',              emoji: '⚔️', group: 'ทั่วไป' },
  { name: 'Gray Shard',                       emoji: '🩶', group: 'Thanos' },
  { name: 'Temporal Spell',                   emoji: '✨', group: 'Temporal' },
  { name: 'Temporal Gemstone',                emoji: '🔮', group: 'Temporal' },
  { name: 'Somatology Research Document',     emoji: '📄', group: 'Patent / OS' },
  { name: 'Somatology Experimental Fragment', emoji: '🧪', group: 'Patent / OS' },
  { name: 'Unknown Part',                     emoji: '⚙️', group: 'Patent / OS' },
  { name: 'Cor Core',                         emoji: '🔩', group: 'Patent / OS' },
]

export interface Breakdown {
  crafts: Partial<Record<Grade, number>>
  shadowdecon: number
  zenyCraft: number
}

export function calcBreakdown(grade: Grade, qty: number): Breakdown {
  const chain: Grade[] = ['Supreme', 'High', 'Medium', 'Low']
  const startIdx = chain.indexOf(grade)

  const crafts: Partial<Record<Grade, number>> = {}
  let q = qty
  for (let i = startIdx; i < chain.length; i++) {
    crafts[chain[i]] = q
    if (i < chain.length - 1) q *= 3
  }

  const shadowdecon = crafts.Low ?? 0
  const zenyCraft = (Object.entries(crafts) as [Grade, number][]).reduce(
    (sum, [g, n]) => sum + n * CRAFT_ZENY[g],
    0,
  )

  return { crafts, shadowdecon, zenyCraft }
}

export function calcReformTotal(breakdown: Breakdown, shadowdeconPrice: number): number {
  return breakdown.zenyCraft + breakdown.shadowdecon * shadowdeconPrice
}

// ─── Grade Item ────────────────────────────────────────────────────────────────

export type GradeRecipeName =
  | 'Etel Stone'
  | 'Blessed Etel Dust'
  | 'Etel Aquamarine'
  | 'Etel Topaz'
  | 'Etel Amethyst'
  | 'Etel Amber'

export type GradeMaterial =
  | 'Etel Dust'
  | 'Etel Stone'
  | 'Blacksmith Blessing'
  | 'Aquamarine'
  | 'Topaz'
  | 'Amethyst'
  | 'Amber'

export interface GradeRecipe {
  npcZeny: number
  materials: { item: GradeMaterial; qty: number }[]
}

export const GRADE_RECIPES: Record<GradeRecipeName, GradeRecipe> = {
  'Etel Stone':        { npcZeny: 100_000, materials: [{ item: 'Etel Dust', qty: 5 }] },
  'Blessed Etel Dust': { npcZeny: 100_000, materials: [{ item: 'Etel Dust', qty: 5 }, { item: 'Blacksmith Blessing', qty: 1 }] },
  'Etel Aquamarine':   { npcZeny: 100_000, materials: [{ item: 'Etel Stone', qty: 3 }, { item: 'Aquamarine', qty: 1 }] },
  'Etel Topaz':        { npcZeny: 200_000, materials: [{ item: 'Etel Stone', qty: 6 }, { item: 'Topaz', qty: 1 }] },
  'Etel Amethyst':     { npcZeny: 300_000, materials: [{ item: 'Etel Stone', qty: 10 }, { item: 'Amethyst', qty: 1 }] },
  'Etel Amber':        { npcZeny: 500_000, materials: [{ item: 'Etel Stone', qty: 15 }, { item: 'Amber', qty: 1 }] },
}

export const GRADE_RECIPE_NAMES = Object.keys(GRADE_RECIPES) as GradeRecipeName[]

export const GRADE_MATERIAL_INPUTS: { key: GradeMaterial; label: string; emoji: string }[] = [
  { key: 'Etel Dust',           label: 'Etel Dust',           emoji: '🌫️' },
  { key: 'Etel Stone',          label: 'Etel Stone',          emoji: '🟦' },
  { key: 'Blacksmith Blessing', label: 'Blacksmith Blessing',  emoji: '⚔️' },
  { key: 'Aquamarine',          label: 'Aquamarine',          emoji: '🔵' },
  { key: 'Topaz',               label: 'Topaz',               emoji: '🟡' },
  { key: 'Amethyst',            label: 'Amethyst',            emoji: '🟣' },
  { key: 'Amber',               label: 'Amber',               emoji: '🟠' },
]

export type GradeMaterialPrices = Record<GradeMaterial, string>

export interface GradeCalcItem {
  id: number
  recipe: GradeRecipeName
  qty: number
}

export function calcGradeItemCost(
  recipe: GradeRecipeName,
  qty: number,
  prices: GradeMaterialPrices,
  calcEtelFromDust: boolean,
): { total: number; npcZeny: number; materialLines: { label: string; qty: number; unitPrice: number; subtotal: number }[] } {
  const r = GRADE_RECIPES[recipe]
  const effectivePrice = (mat: GradeMaterial): number => {
    if (mat === 'Etel Stone' && calcEtelFromDust) {
      const dustPrice = parseInt(prices['Etel Dust']) || 0
      return GRADE_RECIPES['Etel Stone'].npcZeny + 5 * dustPrice
    }
    return parseInt(prices[mat]) || 0
  }
  const npcZeny = r.npcZeny * qty
  const materialLines = r.materials.map(m => {
    const totalQty = m.qty * qty
    const unitPrice = effectivePrice(m.item)
    return {
      label: m.item === 'Etel Stone' && calcEtelFromDust ? `${m.item} (คำนวณ)` : m.item,
      qty: totalQty,
      unitPrice,
      subtotal: totalQty * unitPrice,
    }
  })
  const total = npcZeny + materialLines.reduce((s, l) => s + l.subtotal, 0)
  return { total, npcZeny, materialLines }
}
