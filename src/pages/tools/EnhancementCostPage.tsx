import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
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

interface CalcItem {
  id: number
  type: ItemType
  grade: Grade
  qty: number
}

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

function calcTotal(breakdown: Breakdown, shadowdeconPrice: number): number {
  return breakdown.zenyCraft + breakdown.shadowdecon * shadowdeconPrice
}

function formatZeny(n: number): string {
  return n.toLocaleString('en-US') + 'z'
}

// ─── Component ────────────────────────────────────────────────────────────────

let _uid = 1

export default function EnhancementCostPage() {
  const [sdPriceRaw, setSdPriceRaw] = useState('')
  const [items, setItems] = useState<CalcItem[]>([
    { id: _uid++, type: 'Armor', grade: 'Supreme', qty: 1 },
  ])

  const sdPrice = Math.max(0, parseInt(sdPriceRaw) || 0)

  function addItem() {
    setItems(prev => [...prev, { id: _uid++, type: 'Weapon', grade: 'Supreme', qty: 1 }])
  }

  function removeItem(id: number) {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  function updateItem(id: number, patch: Partial<CalcItem>) {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...patch } : item))
  }

  const rows = items.map(item => ({
    item,
    breakdown: calcBreakdown(item.grade, item.qty),
  }))

  const grandTotal = rows.reduce((sum, { breakdown }) => sum + calcTotal(breakdown, sdPrice), 0)

  const aggregate = rows.reduce(
    (acc, { breakdown }) => ({
      low: acc.low + (breakdown.crafts.Low ?? 0),
      medium: acc.medium + (breakdown.crafts.Medium ?? 0),
      high: acc.high + (breakdown.crafts.High ?? 0),
      supreme: acc.supreme + (breakdown.crafts.Supreme ?? 0),
      shadowdecon: acc.shadowdecon + breakdown.shadowdecon,
      zenyCraft: acc.zenyCraft + breakdown.zenyCraft,
    }),
    { low: 0, medium: 0, high: 0, supreme: 0, shadowdecon: 0, zenyCraft: 0 },
  )

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Enhancement Stone Cost</h1>
        <p className="text-sm text-muted-foreground mt-1">
          คำนวณค่าใช้จ่ายในการทำ Enhancement Stone โดยคำนวณย้อนกลับจากวัตถุดิบ
        </p>
      </div>

      <Separator />

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
          <Button size="sm" variant="outline" onClick={addItem}>
            <Plus className="size-4 mr-1" />
            เพิ่ม Item
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">
              กด "เพิ่ม Item" เพื่อเริ่มคำนวณ
            </p>
          )}

          {rows.map(({ item, breakdown }) => {
            const cost = calcTotal(breakdown, sdPrice)
            return (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30 flex-wrap"
              >
                {/* Selectors */}
                <div className="flex items-center gap-2 flex-1 flex-wrap min-w-0">
                  <Select
                    value={item.type}
                    onValueChange={v => updateItem(item.id, { type: v as ItemType })}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TYPES.map(t => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={item.grade}
                    onValueChange={v => updateItem(item.id, { grade: v as Grade })}
                  >
                    <SelectTrigger className="w-38">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GRADES.map(g => (
                        <SelectItem key={g} value={g}>
                          {g} Grade
                        </SelectItem>
                      ))}
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

                {/* Cost display */}
                <div className="text-right shrink-0 min-w-28">
                  <p className="text-sm font-semibold">{formatZeny(cost)}</p>
                  {item.qty > 1 && (
                    <p className="text-xs text-muted-foreground">
                      {formatZeny(Math.round(cost / item.qty))}/ชิ้น
                    </p>
                  )}
                </div>

                {/* Delete */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive hover:text-destructive shrink-0"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Breakdown Summary */}
      {items.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">รายละเอียดค่าใช้จ่าย</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {rows.map(({ item, breakdown }, idx) => {
              const cost = calcTotal(breakdown, sdPrice)
              const chain: Grade[] = ['Supreme', 'High', 'Medium', 'Low']
              return (
                <div key={item.id}>
                  {idx > 0 && <Separator className="mb-5" />}
                  <p className="text-sm font-semibold mb-2">
                    {item.type} Enhancement Stone ({item.grade} Grade)
                    {item.qty > 1 ? ` × ${item.qty}` : ''}
                  </p>
                  <div className="space-y-1 text-sm">
                    {chain.map(g => {
                      const n = breakdown.crafts[g]
                      if (!n) return null
                      const zenyCost = n * CRAFT_ZENY[g]
                      return (
                        <div key={g} className="flex justify-between text-muted-foreground">
                          <span>
                            ค่าทำ {g} Grade × {n}
                            {g === 'Low'
                              ? ` (Shadowdecon × ${n})`
                              : ` (${PREV_GRADE_NEEDED[g] ?? 3} ${chain[chain.indexOf(g) + 1]} Grade/ชิ้น)`}
                          </span>
                          <span>{formatZeny(zenyCost)}</span>
                        </div>
                      )
                    })}
                    {/* Shadowdecon cost row */}
                    {breakdown.shadowdecon > 0 && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Shadowdecon × {breakdown.shadowdecon} @ {sdPrice > 0 ? formatZeny(sdPrice) : '?z'}</span>
                        <span>
                          {sdPrice > 0
                            ? formatZeny(breakdown.shadowdecon * sdPrice)
                            : `${breakdown.shadowdecon} ชิ้น`}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-foreground pt-2 border-t mt-2">
                      <span>รวม</span>
                      <span>{formatZeny(cost)}</span>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Grand total (multiple items) */}
            {items.length > 1 && (
              <>
                <Separator />
                <div className="space-y-1 text-sm text-muted-foreground">
                  {aggregate.supreme > 0 && <p>ค่าทำ Supreme รวม: {aggregate.supreme} ครั้ง — {formatZeny(aggregate.supreme * CRAFT_ZENY.Supreme)}</p>}
                  {aggregate.high > 0 && <p>ค่าทำ High รวม: {aggregate.high} ครั้ง — {formatZeny(aggregate.high * CRAFT_ZENY.High)}</p>}
                  {aggregate.medium > 0 && <p>ค่าทำ Medium รวม: {aggregate.medium} ครั้ง — {formatZeny(aggregate.medium * CRAFT_ZENY.Medium)}</p>}
                  {aggregate.low > 0 && <p>ค่าทำ Low รวม: {aggregate.low} ครั้ง — {formatZeny(aggregate.low * CRAFT_ZENY.Low)}</p>}
                  <p>Shadowdecon รวม: {aggregate.shadowdecon} ชิ้น</p>
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
    </div>
  )
}
