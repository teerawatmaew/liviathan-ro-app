import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  type CalcItem, type EnhancementItem, type ItemType, type Grade,
  TYPES, GRADES, CRAFT_ZENY, PREV_GRADE_NEEDED, PRESET_ITEMS,
  calcBreakdown, calcReformTotal, formatZeny, nextId,
} from './types'

const presetGroups = PRESET_ITEMS.reduce<Record<string, typeof PRESET_ITEMS>>(
  (acc, p) => { ;(acc[p.group] ??= []).push(p); return acc },
  {},
)

export default function ReformSection() {
  const [sdPriceRaw, setSdPriceRaw] = useState('')
  const [items, setItems] = useState<CalcItem[]>([
    { id: nextId(), category: 'enhancement', type: 'Armor', grade: 'Supreme', qty: 1 },
  ])

  const sdPrice = Math.max(0, parseInt(sdPriceRaw) || 0)

  function addEnhancement() {
    setItems(prev => [...prev, { id: nextId(), category: 'enhancement', type: 'Weapon', grade: 'Supreme', qty: 1 }])
  }
  function addOther() {
    setItems(prev => [...prev, { id: nextId(), category: 'other', name: '', price: 0, qty: 1 }])
  }
  function addPreset(preset: { name: string }) {
    setItems(prev => [...prev, { id: nextId(), category: 'other', name: preset.name, price: 0, qty: 1 }])
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
          low:         acc.low         + (bd.crafts.Low     ?? 0),
          medium:      acc.medium      + (bd.crafts.Medium  ?? 0),
          high:        acc.high        + (bd.crafts.High    ?? 0),
          supreme:     acc.supreme     + (bd.crafts.Supreme ?? 0),
          shadowdecon: acc.shadowdecon + bd.shadowdecon,
          zenyCraft:   acc.zenyCraft   + bd.zenyCraft,
        }
      },
      { low: 0, medium: 0, high: 0, supreme: 0, shadowdecon: 0, zenyCraft: 0 },
    )

  const chain: Grade[] = ['Supreme', 'High', 'Medium', 'Low']

  return (
    <>
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
          {/* Price input + grouped presets */}
          <div className="rounded-lg border bg-muted/20 p-3 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground whitespace-nowrap">💠 Shadowdecon ราคา/ชิ้น</span>
              <div className="relative">
                <Input
                  id="sd-price"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={sdPriceRaw}
                  onChange={e => setSdPriceRaw(e.target.value)}
                  className="w-36 pr-6 h-8 text-sm"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">z</span>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">เพิ่มวัตถุดิบด่วน:</p>
              {Object.entries(presetGroups).map(([group, items]) => (
                <div key={group} className="flex items-start gap-2">
                  <span className="text-xs text-muted-foreground whitespace-nowrap pt-0.5 w-20 shrink-0">{group}</span>
                  <div className="flex flex-wrap gap-1">
                    {items.map(p => (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => addPreset(p)}
                        className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md border bg-background hover:bg-accent transition-colors"
                      >
                        <span>{p.emoji}</span>
                        <span>{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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
                  {aggregate.supreme > 0     && <p>ค่าทำ Supreme รวม: {aggregate.supreme} ครั้ง — {formatZeny(aggregate.supreme * CRAFT_ZENY.Supreme)}</p>}
                  {aggregate.high > 0        && <p>ค่าทำ High รวม: {aggregate.high} ครั้ง — {formatZeny(aggregate.high * CRAFT_ZENY.High)}</p>}
                  {aggregate.medium > 0      && <p>ค่าทำ Medium รวม: {aggregate.medium} ครั้ง — {formatZeny(aggregate.medium * CRAFT_ZENY.Medium)}</p>}
                  {aggregate.low > 0         && <p>ค่าทำ Low รวม: {aggregate.low} ครั้ง — {formatZeny(aggregate.low * CRAFT_ZENY.Low)}</p>}
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
  )
}
