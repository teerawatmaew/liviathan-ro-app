import { useLocalStorage } from '@/hooks/use-local-storage'
import { Eraser, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  type GradeCalcItem, type GradeMaterial, type GradeRecipeName, type GradeMaterialPrices,
  GRADE_MATERIAL_INPUTS, GRADE_RECIPE_NAMES, GRADE_RECIPES,
  calcGradeItemCost, formatZeny, nextId,
} from './types'

export default function GradeSection() {
  const [gradePrices, setGradePrices] = useLocalStorage<GradeMaterialPrices>(
    'lro-grade-prices',
    Object.fromEntries(GRADE_MATERIAL_INPUTS.map(m => [m.key, ''])) as GradeMaterialPrices,
  )
  const [calcEtelFromDust, setCalcEtelFromDust] = useLocalStorage('lro-grade-calcEtelFromDust', false)
  const [storedGradeItems, setGradeItems] = useLocalStorage<GradeCalcItem[]>('lro-grade-items', [
    { id: 1, recipe: 'Etel Stone', qty: 1 },
  ])
  // ค่าจาก localStorage อาจเป็นสูตรที่ถูกถอดออกไปแล้ว — กรองทิ้งก่อนคำนวณ
  const gradeItems = storedGradeItems.filter(i => i.recipe in GRADE_RECIPES)

  function setGradePrice(key: GradeMaterial, val: string) {
    setGradePrices(prev => ({ ...prev, [key]: val }))
  }
  function addGradeItem() {
    setGradeItems(prev => [...prev, { id: nextId(prev), recipe: 'Etel Stone', qty: 1 }])
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

  // วัตถุดิบที่ยังไม่ได้ใส่ราคา (ไม่ถูกรวมในยอด)
  const unpriced = new Map<string, number>()
  for (const item of gradeItems) {
    for (const line of calcGradeItemCost(item.recipe, item.qty, gradePrices, calcEtelFromDust).materialLines) {
      if (line.unitPrice === 0) unpriced.set(line.label, (unpriced.get(line.label) ?? 0) + line.qty)
    }
  }

  return (
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
        <CardHeader className="pb-2 flex flex-row flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base">รายการ Item</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={addGradeItem}>
              <Plus className="size-4 mr-1" />
              เพิ่ม Item
            </Button>
            {gradeItems.length > 0 && (
              <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={() => setGradeItems([])}>
                <Eraser className="size-4 mr-1" />
                ล้าง
              </Button>
            )}
          </div>
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

            {unpriced.size > 0 && (
              <p className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
                ยอดรวมยังไม่รวมวัตถุดิบที่ไม่ได้ใส่ราคา:{' '}
                {[...unpriced].map(([label, qty]) => `${label} × ${qty.toLocaleString()}`).join(', ')}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </>
  )
}
