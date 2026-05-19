import { useState } from 'react'
import { Plus, Trash2, FlaskConical, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

// ─── Types ────────────────────────────────────────────────────────────────────

type ItemType = 'Weapon' | 'Armor' | 'Accessory'
type Grade = 'Low' | 'Medium' | 'High' | 'Supreme'

interface EnhancementItem {
  id: number
  category: 'enhancement'
  type: ItemType
  grade: Grade
  qty: number
}

interface OtherItem {
  id: number
  category: 'other'
  name: string
  price: number
  qty: number
}

type CalcItem = EnhancementItem | OtherItem

// ─── Constants ────────────────────────────────────────────────────────────────

const TYPES: ItemType[] = ['Weapon', 'Armor', 'Accessory']
const GRADES: Grade[] = ['Low', 'Medium', 'High', 'Supreme']

/** Zeny paid to the NPC per crafting action at each grade */
const CRAFT_ZENY: Record<Grade, number> = {
  Low: 20_000,
  Medium: 10_000,
  High: 20_000,
  Supreme: 50_000,
}

/** How many of the previous grade are required to craft one of the next grade */
const PREV_GRADE_NEEDED: Partial<Record<Grade, number>> = {
  Medium: 3,
  High: 3,
  Supreme: 3,
}

// ─── Formulas ─────────────────────────────────────────────────────────────────

interface Breakdown {
  /** Crafting actions at each level (=stones produced at each level) */
  crafts: Partial<Record<Grade, number>>
  /** Total Shadowdecon required (1 per Low craft) */
  shadowdecon: number
  /** Total NPC zeny cost (excluding Shadowdecon) */
  zenyCraft: number
}

function calcBreakdown(grade: Grade, qty: number): Breakdown {
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

function calcReformTotal(breakdown: Breakdown, shadowdeconPrice: number): number {
  return breakdown.zenyCraft + breakdown.shadowdecon * shadowdeconPrice
}

function formatZeny(n: number): string {
  return n.toLocaleString('en-US') + 'z'
}
// ─── Presets ──────────────────────────────────────────────────────────────────

const PRESET_ITEMS: { name: string; emoji: string }[] = [
  { name: 'Shadowdecon',         emoji: '💠' },
  { name: 'Reform Stone',        emoji: '🪨' },
  { name: 'Zelunium',            emoji: '💎' },
  { name: 'Blacksmith Blessing', emoji: '⚔️' },
]

// ═══════════════════════════════════════════════════════════════════
// ─── GRADE ITEM ────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════

type GradeRecipeName =
  | 'Etel Stone'
  | 'Blessed Etel Dust'
  | 'Etel Aquamarine'
  | 'Etel Topaz'
  | 'Etel Amethyst'
  | 'Etel Amber'

type GradeMaterial =
  | 'Etel Dust'
  | 'Etel Stone'
  | 'Blacksmith Blessing'
  | 'Aquamarine'
  | 'Topaz'
  | 'Amethyst'
  | 'Amber'

interface GradeRecipe {
  npcZeny: number
  materials: { item: GradeMaterial; qty: number }[]
}

const GRADE_RECIPES: Record<GradeRecipeName, GradeRecipe> = {
  'Etel Stone':        { npcZeny: 100_000, materials: [{ item: 'Etel Dust', qty: 5 }] },
  'Blessed Etel Dust': { npcZeny: 100_000, materials: [{ item: 'Etel Dust', qty: 5 }, { item: 'Blacksmith Blessing', qty: 1 }] },
  'Etel Aquamarine':   { npcZeny: 100_000, materials: [{ item: 'Etel Stone', qty: 3 }, { item: 'Aquamarine', qty: 1 }] },
  'Etel Topaz':        { npcZeny: 200_000, materials: [{ item: 'Etel Stone', qty: 6 }, { item: 'Topaz', qty: 1 }] },
  'Etel Amethyst':     { npcZeny: 300_000, materials: [{ item: 'Etel Stone', qty: 10 }, { item: 'Amethyst', qty: 1 }] },
  'Etel Amber':        { npcZeny: 500_000, materials: [{ item: 'Etel Stone', qty: 15 }, { item: 'Amber', qty: 1 }] },
}

const GRADE_RECIPE_NAMES = Object.keys(GRADE_RECIPES) as GradeRecipeName[]

const GRADE_MATERIAL_INPUTS: { key: GradeMaterial; label: string; emoji: string }[] = [
  { key: 'Etel Dust',           label: 'Etel Dust',           emoji: '🌫️' },
  { key: 'Etel Stone',          label: 'Etel Stone',           emoji: '🟦' },
  { key: 'Blacksmith Blessing', label: 'Blacksmith Blessing',  emoji: '⚔️' },
  { key: 'Aquamarine',          label: 'Aquamarine',           emoji: '🔵' },
  { key: 'Topaz',               label: 'Topaz',                emoji: '🟡' },
  { key: 'Amethyst',            label: 'Amethyst',             emoji: '🟣' },
  { key: 'Amber',               label: 'Amber',                emoji: '🟠' },
]

type GradeMaterialPrices = Record<GradeMaterial, string>

interface GradeCalcItem {
  id: number
  recipe: GradeRecipeName
  qty: number
}

function calcGradeItemCost(
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

// ─── Component ────────────────────────────────────────────────────────────────

let _uid = 1

export default function ItemCostCalculatorPage() {
  const [section, setSection] = useState<'reform' | 'grade'>('reform')

  // ── Reform & Craft state ─────────────────────────────────────────────────
  const [sdPriceRaw, setSdPriceRaw] = useState('')
  const [items, setItems] = useState<CalcItem[]>([
    { id: _uid++, category: 'enhancement', type: 'Armor', grade: 'Supreme', qty: 1 },
  ])

  // ── Grade Item state ──────────────────────────────────────────────────────
  const initialGradePrices = Object.fromEntries(
    GRADE_MATERIAL_INPUTS.map(m => [m.key, ''])
  ) as GradeMaterialPrices
  const [gradePrices, setGradePrices] = useState<GradeMaterialPrices>(initialGradePrices)
  const [calcEtelFromDust, setCalcEtelFromDust] = useState(false)
  const [gradeItems, setGradeItems] = useState<GradeCalcItem[]>([
    { id: _uid++, recipe: 'Etel Stone', qty: 1 },
  ])

  function setGradePrice(key: GradeMaterial, val: string) {
    setGradePrices(prev => ({ ...prev, [key]: val }))
  }
  function addGradeItem() {
    setGradeItems(prev => [...prev, { id: _uid++, recipe: 'Etel Stone', qty: 1 }])
  }
  function removeGradeItem(id: number) {
    setGradeItems(prev => prev.filter(i => i.id !== id))
  }
  function updateGradeItem(id: number, patch: Partial<GradeCalcItem>) {
    setGradeItems(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i))
  }

  const gradeGrandTotal = gradeItems.reduce((sum, item) => {
    const { total } = calcGradeItemCost(item.recipe, item.qty, gradePrices, calcEtelFromDust)
    return sum + total
  }, 0)

  const sdPrice = Math.max(0, parseInt(sdPriceRaw) || 0)

  function addEnhancement() {
    setItems(prev => [...prev, { id: _uid++, category: 'enhancement', type: 'Weapon', grade: 'Supreme', qty: 1 }])
  }
  function addOther() {
    setItems(prev => [...prev, { id: _uid++, category: 'other', name: '', price: 0, qty: 1 }])
  }
  function addPreset(preset: { name: string }) {
    setItems(prev => [...prev, { id: _uid++, category: 'other', name: preset.name, price: 0, qty: 1 }])
  }
  function removeItem(id: number) {
    setItems(prev => prev.filter(item => item.id !== id))
  }
  function updateItem(id: number, patch: Partial<Record<string, unknown>>) {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...patch } as CalcItem : item))
  }

  const grandTotal = items.reduce((sum, item) => {
    if (item.category === 'other') return sum + item.price * item.qty
    const bd = calcBreakdown(item.grade, item.qty)
    return sum + calcReformTotal(bd, sdPrice)
  }, 0)

  const aggregate = items
    .filter((i): i is EnhancementItem => i.category === 'enhancement')
    .reduce(
      (acc, item) => {
        const bd = calcBreakdown(item.grade, item.qty)
        return {
          low:        acc.low        + (bd.crafts.Low     ?? 0),
          medium:     acc.medium     + (bd.crafts.Medium  ?? 0),
          high:       acc.high       + (bd.crafts.High    ?? 0),
          supreme:    acc.supreme    + (bd.crafts.Supreme ?? 0),
          shadowdecon:acc.shadowdecon + bd.shadowdecon,
          zenyCraft:  acc.zenyCraft  + bd.zenyCraft,
        }
      },
      { low: 0, medium: 0, high: 0, supreme: 0, shadowdecon: 0, zenyCraft: 0 },
    )

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Enhancement Cost</h1>
        <p className="text-sm text-muted-foreground mt-1">
          คำนวณค่าใช้จ่ายในการทำ Enhancement
        </p>
      </div>

      {/* Section Toggle */}
      <div className="flex gap-1 p-1 rounded-lg bg-muted w-fit">
        <button
          type="button"
          onClick={() => setSection('reform')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            section === 'reform'
              ? 'bg-background shadow text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <FlaskConical className="size-4" />
          Reform &amp; Craft
        </button>
        <button
          type="button"
          onClick={() => setSection('grade')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            section === 'grade'
              ? 'bg-background shadow text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Layers className="size-4" />
          Grade Item
        </button>
      </div>

      <Separator />

      {/* ──────────────────── REFORM & CRAFT ──────────────────── */}
      {section === 'reform' && (
        <>
          {/* Shadowdecon Price */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">ราคาวัตถุดิบ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg select-none">
                  💎
                </div>
                <div className="max-w-xs w-full">
                  <Label htmlFor="sd-price" className="text-sm font-medium">
                    Shadowdecon — ราคา/ชิ้น
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="sd-price"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={sdPriceRaw}
                      onChange={e => setSdPriceRaw(e.target.value)}
                      className="pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                      z
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Item List */}
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base">รายการ Item</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={addEnhancement}>
                  <Plus className="size-4 mr-1" />
                  Enhancement Stone
                </Button>
                <Button size="sm" variant="outline" onClick={addOther}>
                  <Plus className="size-4 mr-1" />
                  Other
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Preset quick-add */}
              <div className="flex flex-wrap gap-1.5 pb-1">
                <span className="text-xs text-muted-foreground self-center mr-1">ไอเทมบ่อย:</span>
                {PRESET_ITEMS.map(p => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => addPreset(p)}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border bg-background hover:bg-muted transition-colors"
                  >
                    <span>{p.emoji}</span>
                    <span>{p.name}</span>
                    <Plus className="size-3 opacity-60" />
                  </button>
                ))}
              </div>

              {items.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  เลือกไอเทมด้านบน หรือกด "+ Enhancement Stone" / "+ Other"
                </p>
              )}

              {items.map(item => {
                if (item.category === 'other') {
                  const cost = item.price * item.qty
                  return (
                    <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30 flex-wrap">
                      <div className="flex items-center gap-2 flex-1 flex-wrap min-w-0">
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full shrink-0">Other</span>
                        <Input
                          placeholder="ชื่อ Item"
                          value={item.name}
                          onChange={e => updateItem(item.id, { name: e.target.value })}
                          className="w-44"
                        />
                        <div className="flex items-center gap-1.5">
                          <Label className="text-xs text-muted-foreground whitespace-nowrap">ราคา/ชิ้น</Label>
                          <div className="relative">
                            <Input
                              type="number"
                              min="0"
                              placeholder="0"
                              value={item.price || ''}
                              onChange={e => {
                                const n = parseInt(e.target.value)
                                updateItem(item.id, { price: isNaN(n) ? 0 : Math.max(0, n) })
                              }}
                              className="w-32 pr-6"
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">z</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Label className="text-xs text-muted-foreground whitespace-nowrap">จำนวน</Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={e => {
                              const n = parseInt(e.target.value)
                              if (!isNaN(n) && n >= 1) updateItem(item.id, { qty: n })
                            }}
                            className="w-20 text-center"
                          />
                        </div>
                      </div>
                      <div className="text-right shrink-0 min-w-28">
                        <p className="text-sm font-semibold">{formatZeny(cost)}</p>
                        {item.qty > 1 && item.price > 0 && (
                          <p className="text-xs text-muted-foreground">{formatZeny(item.price)}/ชิ้น</p>
                        )}
                      </div>
                      <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive shrink-0" onClick={() => removeItem(item.id)}>
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  )
                }

                const breakdown = calcBreakdown(item.grade, item.qty)
                const cost = calcReformTotal(breakdown, sdPrice)
                return (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30 flex-wrap">
                    <div className="flex items-center gap-2 flex-1 flex-wrap min-w-0">
                      <Select value={item.type} onValueChange={v => updateItem(item.id, { type: v as ItemType })}>
                        <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Select value={item.grade} onValueChange={v => updateItem(item.id, { grade: v as Grade })}>
                        <SelectTrigger className="w-38"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {GRADES.map(g => <SelectItem key={g} value={g}>{g} Grade</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <div className="flex items-center gap-1.5">
                        <Label className="text-xs text-muted-foreground whitespace-nowrap">จำนวน</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={e => {
                            const n = parseInt(e.target.value)
                            if (!isNaN(n) && n >= 1) updateItem(item.id, { qty: n })
                          }}
                          className="w-20 text-center"
                        />
                      </div>
                    </div>
                    <div className="text-right shrink-0 min-w-28">
                      <p className="text-sm font-semibold">{formatZeny(cost)}</p>
                      {item.qty > 1 && (
                        <p className="text-xs text-muted-foreground">{formatZeny(Math.round(cost / item.qty))}/ชิ้น</p>
                      )}
                    </div>
                    <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive shrink-0" onClick={() => removeItem(item.id)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Reform Breakdown */}
          {items.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">รายละเอียดค่าใช้จ่าย</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {items.map((item, idx) => {
                  const chain: Grade[] = ['Supreme', 'High', 'Medium', 'Low']
                  if (item.category === 'other') {
                    const cost = item.price * item.qty
                    return (
                      <div key={item.id}>
                        {idx > 0 && <Separator className="mb-5" />}
                        <p className="text-sm font-semibold mb-2">{item.name || '(ไม่มีชื่อ)'}{item.qty > 1 ? ` × ${item.qty}` : ''}</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between text-muted-foreground"><span>ราคา/ชิ้น</span><span>{formatZeny(item.price)}</span></div>
                          {item.qty > 1 && <div className="flex justify-between text-muted-foreground"><span>จำนวน</span><span>× {item.qty}</span></div>}
                          <div className="flex justify-between font-semibold text-foreground pt-2 border-t mt-2"><span>รวม</span><span>{formatZeny(cost)}</span></div>
                        </div>
                      </div>
                    )
                  }
                  const breakdown = calcBreakdown(item.grade, item.qty)
                  const cost = calcReformTotal(breakdown, sdPrice)
                  return (
                    <div key={item.id}>
                      {idx > 0 && <Separator className="mb-5" />}
                      <p className="text-sm font-semibold mb-2">
                        {item.type} Enhancement Stone ({item.grade} Grade){item.qty > 1 ? ` × ${item.qty}` : ''}
                      </p>
                      <div className="space-y-1 text-sm">
                        {chain.map(g => {
                          const n = breakdown.crafts[g]
                          if (!n) return null
                          return (
                            <div key={g} className="flex justify-between text-muted-foreground">
                              <span>
                                ค่าทำ {g} Grade × {n}
                                {g === 'Low'
                                  ? ` (Shadowdecon × ${n})`
                                  : ` (${PREV_GRADE_NEEDED[g] ?? 3} ${chain[chain.indexOf(g) + 1]} Grade/ชิ้น)`}
                              </span>
                              <span>{formatZeny(n * CRAFT_ZENY[g])}</span>
                            </div>
                          )
                        })}
                        {breakdown.shadowdecon > 0 && (
                          <div className="flex justify-between text-muted-foreground">
                            <span>Shadowdecon × {breakdown.shadowdecon} @ {sdPrice > 0 ? formatZeny(sdPrice) : '?z'}</span>
                            <span>{sdPrice > 0 ? formatZeny(breakdown.shadowdecon * sdPrice) : `${breakdown.shadowdecon} ชิ้น`}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-semibold text-foreground pt-2 border-t mt-2">
                          <span>รวม</span><span>{formatZeny(cost)}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {items.length > 1 && (
                  <>
                    <Separator />
                    <div className="space-y-1 text-sm text-muted-foreground">
                      {aggregate.supreme > 0    && <p>ค่าทำ Supreme รวม: {aggregate.supreme} ครั้ง — {formatZeny(aggregate.supreme * CRAFT_ZENY.Supreme)}</p>}
                      {aggregate.high > 0       && <p>ค่าทำ High รวม: {aggregate.high} ครั้ง — {formatZeny(aggregate.high * CRAFT_ZENY.High)}</p>}
                      {aggregate.medium > 0     && <p>ค่าทำ Medium รวม: {aggregate.medium} ครั้ง — {formatZeny(aggregate.medium * CRAFT_ZENY.Medium)}</p>}
                      {aggregate.low > 0        && <p>ค่าทำ Low รวม: {aggregate.low} ครั้ง — {formatZeny(aggregate.low * CRAFT_ZENY.Low)}</p>}
                      {aggregate.shadowdecon > 0 && <p>Shadowdecon รวม: {aggregate.shadowdecon} ชิ้น</p>}
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-1">
                      <span>ยอดรวมทั้งหมด</span>
                      <span className="text-primary">{formatZeny(grandTotal)}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* ──────────────────── GRADE ITEM ──────────────────── */}
      {section === 'grade' && (
        <>
          {/* Material Prices */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">ราคาวัตถุดิบ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
                {GRADE_MATERIAL_INPUTS.filter(m => m.key !== 'Etel Stone').map(m => (
                  <div key={m.key}>
                    <Label className="text-xs font-medium text-muted-foreground">
                      {m.emoji} {m.label}
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={gradePrices[m.key]}
                        onChange={e => setGradePrice(m.key, e.target.value)}
                        className="pr-6"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">z</span>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Etel Stone toggle */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-muted-foreground">🟦 Etel Stone</span>
                  <div className="flex gap-0.5 p-0.5 rounded-md bg-muted text-xs">
                    <button
                      type="button"
                      onClick={() => setCalcEtelFromDust(false)}
                      className={`px-2.5 py-1 rounded transition-colors ${!calcEtelFromDust ? 'bg-background shadow font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      ราคาตลาด
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalcEtelFromDust(true)}
                      className={`px-2.5 py-1 rounded transition-colors ${calcEtelFromDust ? 'bg-background shadow font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      คำนวณจาก Etel Dust
                    </button>
                  </div>
                </div>
                {!calcEtelFromDust ? (
                  <div className="max-w-xs">
                    <div className="relative">
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={gradePrices['Etel Stone']}
                        onChange={e => setGradePrice('Etel Stone', e.target.value)}
                        className="pr-6"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">z</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    ใช้สูตร: 100,000z + Etel Dust × 5 ={' '}
                    <span className="font-medium text-foreground">
                      {formatZeny(100_000 + 5 * (parseInt(gradePrices['Etel Dust']) || 0))}
                    </span>
                    /ชิ้น
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Grade Item List */}
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base">รายการ Item</CardTitle>
              <Button size="sm" variant="outline" onClick={addGradeItem}>
                <Plus className="size-4 mr-1" />
                เพิ่ม Item
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {gradeItems.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">
                  กด "+ เพิ่ม Item" เพื่อเริ่มคำนวณ
                </p>
              )}
              {gradeItems.map(item => {
                const { total } = calcGradeItemCost(item.recipe, item.qty, gradePrices, calcEtelFromDust)
                return (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30 flex-wrap">
                    <div className="flex items-center gap-2 flex-1 flex-wrap min-w-0">
                      <Select value={item.recipe} onValueChange={v => updateGradeItem(item.id, { recipe: v as GradeRecipeName })}>
                        <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {GRADE_RECIPE_NAMES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <div className="flex items-center gap-1.5">
                        <Label className="text-xs text-muted-foreground whitespace-nowrap">จำนวน</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={e => {
                            const n = parseInt(e.target.value)
                            if (!isNaN(n) && n >= 1) updateGradeItem(item.id, { qty: n })
                          }}
                          className="w-20 text-center"
                        />
                      </div>
                    </div>
                    <div className="text-right shrink-0 min-w-28">
                      <p className="text-sm font-semibold">{formatZeny(total)}</p>
                      {item.qty > 1 && (
                        <p className="text-xs text-muted-foreground">{formatZeny(Math.round(total / item.qty))}/ชิ้น</p>
                      )}
                    </div>
                    <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive shrink-0" onClick={() => removeGradeItem(item.id)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Grade Breakdown */}
          {gradeItems.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">รายละเอียดค่าใช้จ่าย</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {gradeItems.map((item, idx) => {
                  const { total, npcZeny, materialLines } = calcGradeItemCost(item.recipe, item.qty, gradePrices, calcEtelFromDust)
                  return (
                    <div key={item.id}>
                      {idx > 0 && <Separator className="mb-5" />}
                      <p className="text-sm font-semibold mb-2">
                        {item.recipe}{item.qty > 1 ? ` × ${item.qty}` : ''}
                      </p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between text-muted-foreground">
                          <span>ค่าดำเนินการ NPC{item.qty > 1 ? ` × ${item.qty}` : ''}</span>
                          <span>{formatZeny(npcZeny)}</span>
                        </div>
                        {materialLines.map((line, i) => (
                          <div key={i} className="flex justify-between text-muted-foreground">
                            <span>{line.label} × {line.qty}{line.unitPrice > 0 ? ` @ ${formatZeny(line.unitPrice)}` : ''}</span>
                            <span>{line.unitPrice > 0 ? formatZeny(line.subtotal) : `${line.qty} ชิ้น`}</span>
                          </div>
                        ))}
                        <div className="flex justify-between font-semibold text-foreground pt-2 border-t mt-2">
                          <span>รวม</span><span>{formatZeny(total)}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {gradeItems.length > 1 && (
                  <>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold pt-1">
                      <span>ยอดรวมทั้งหมด</span>
                      <span className="text-primary">{formatZeny(gradeGrandTotal)}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
