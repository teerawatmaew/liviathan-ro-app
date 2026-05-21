import { useState } from 'react'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { usePageTitle } from '@/hooks/use-page-title'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeftRight } from 'lucide-react'

type InputUnit = 'M' | 'zeny'

function parseRate(val: string): number | null {
  const r = parseFloat(val)
  return isNaN(r) || r <= 0 ? null : r
}

function toZeny(raw: number, unit: InputUnit): number {
  return unit === 'M' ? raw * 1_000_000 : raw
}

function fromZeny(zeny: number, unit: InputUnit): number {
  return unit === 'M' ? zeny / 1_000_000 : zeny
}

function trimNumber(val: number, unit: InputUnit): string {
  return unit === 'M'
    ? String(parseFloat(val.toFixed(6)))
    : String(Math.round(val))
}

function formatZeny(z: number): string {
  if (z >= 1_000_000_000) return `${+(z / 1_000_000_000).toFixed(3)}B`
  if (z >= 1_000_000)     return `${+(z / 1_000_000).toFixed(3)}M`
  if (z >= 1_000)         return `${+(z / 1_000).toFixed(2)}K`
  return z.toLocaleString()
}

export default function ZenyCalculatorPage() {
  usePageTitle('Zeny ↔ Baht Calculator')

  const [rateInput, setRateInput] = useLocalStorage('lro-zeny-rate', '')
  const [zenyInput, setZenyInput] = useState('')
  const [bahtInput, setBahtInput] = useState('')
  const [unit, setUnit] = useLocalStorage<InputUnit>('lro-zeny-unit', 'M')

  const rate = parseRate(rateInput)

  // ── Handlers ────────────────────────────────────────────────────────────────

  function handleRateChange(val: string) {
    setRateInput(val)
    const r = parseRate(val)
    if (r === null) return
    // Recalculate baht from whatever zeny is currently set
    if (zenyInput !== '') {
      const raw = parseFloat(zenyInput)
      if (!isNaN(raw) && raw >= 0) {
        const z = toZeny(raw, unit)
        setBahtInput(String(parseFloat(((z / 1_000_000) * r).toFixed(4))))
      }
    }
  }

  function handleZenyChange(val: string) {
    setZenyInput(val)
    if (rate === null || val === '') { setBahtInput(''); return }
    const raw = parseFloat(val)
    if (isNaN(raw) || raw < 0) { setBahtInput(''); return }
    const z = toZeny(raw, unit)
    setBahtInput(String(parseFloat(((z / 1_000_000) * rate).toFixed(4))))
  }

  function handleBahtChange(val: string) {
    setBahtInput(val)
    if (rate === null || val === '') { setZenyInput(''); return }
    const baht = parseFloat(val)
    if (isNaN(baht) || baht < 0) { setZenyInput(''); return }
    const z = (baht / rate) * 1_000_000
    setZenyInput(trimNumber(fromZeny(z, unit), unit))
  }

  function handleUnitChange(newUnit: InputUnit) {
    if (zenyInput !== '') {
      const raw = parseFloat(zenyInput)
      if (!isNaN(raw)) {
        const z = toZeny(raw, unit)
        setZenyInput(trimNumber(fromZeny(z, newUnit), newUnit))
      }
    }
    setUnit(newUnit)
  }

  // ── Derived display ──────────────────────────────────────────────────────────

  const zenyRaw = parseFloat(zenyInput)
  const zenyFull = !isNaN(zenyRaw) && zenyRaw >= 0 ? toZeny(zenyRaw, unit) : null
  const showHint = zenyFull !== null && unit === 'M'

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Zeny ↔ Baht Calculator</h1>
        <p className="text-muted-foreground text-sm mt-1">
          แปลง Zeny ↔ เงินบาท — กรอกอัตราตลาดปัจจุบันก่อนคำนวณ
        </p>
      </div>

      {/* Rate */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">อัตราแลกเปลี่ยน (ตลาดปัจจุบัน)</CardTitle>
          <CardDescription>กรอกราคา 1M Zeny ที่ซื้อ/ขายอยู่ในตลาดตอนนี้</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 max-w-xs">
            <Label htmlFor="rate-input" className="shrink-0 text-sm">1M Zeny =</Label>
            <Input
              id="rate-input"
              type="number"
              min={0}
              step={0.5}
              placeholder="เช่น 7"
              value={rateInput}
              onChange={(e) => handleRateChange(e.target.value)}
            />
            <span className="shrink-0 text-sm text-muted-foreground">บาท</span>
          </div>
        </CardContent>
      </Card>

      {/* Converter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">แปลงค่า</CardTitle>
          <CardDescription>กรอกฝั่งใดฝั่งหนึ่ง อีกฝั่งจะคำนวณอัตโนมัติ</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">

          {/* Zeny row */}
          <div className="space-y-1.5">
            <Label htmlFor="zeny-input">Zeny</Label>
            <div className="flex gap-2">
              <Input
                id="zeny-input"
                type="number"
                min={0}
                step={unit === 'M' ? 0.1 : 1}
                placeholder={unit === 'M' ? 'เช่น 56' : 'เช่น 56000000'}
                value={zenyInput}
                onChange={(e) => handleZenyChange(e.target.value)}
                disabled={rate === null}
              />
              <Select value={unit} onValueChange={(v) => handleUnitChange(v as InputUnit)}>
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">M (ล้าน)</SelectItem>
                  <SelectItem value="zeny">Zeny</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {showHint && (
              <p className="text-xs text-muted-foreground pl-0.5">
                = {zenyFull!.toLocaleString()} Zeny ({formatZeny(zenyFull!)})
              </p>
            )}
          </div>

          {/* Swap icon */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="flex-1 border-t" />
            <ArrowLeftRight className="size-4 shrink-0" />
            <div className="flex-1 border-t" />
          </div>

          {/* Baht row */}
          <div className="space-y-1.5">
            <Label htmlFor="baht-input">บาท (฿)</Label>
            <div className="flex gap-2">
              <Input
                id="baht-input"
                type="number"
                min={0}
                step={0.01}
                placeholder="เช่น 392"
                value={bahtInput}
                onChange={(e) => handleBahtChange(e.target.value)}
                disabled={rate === null}
              />
              <div className="w-28 flex items-center justify-center rounded-md border bg-muted/40 text-sm text-muted-foreground">
                บาท
              </div>
            </div>
          </div>

          {rate === null && (
            <p className="text-xs text-amber-500">กรุณากรอกอัตราแลกเปลี่ยนก่อน</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

