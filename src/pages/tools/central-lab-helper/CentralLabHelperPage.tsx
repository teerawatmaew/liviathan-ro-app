import { useState } from 'react'
import { Separator } from '@/components/ui/separator'
import CountdownTimer from '@/features/centrallab/CountdownTimer'
import BossLookup from '@/features/centrallab/BossLookup'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface SwitchBit {
  index: number   // 7 = MSB, 0 = LSB
  label: string   // SW8 .. SW1
  value: 0 | 1
}

function decimalToBits(decimal: number): SwitchBit[] {
  const clamped = Math.max(0, Math.min(255, Math.floor(decimal)))
  return Array.from({ length: 8 }, (_, i) => {
    const bit = 7 - i // bit 7 (MSB) first
    return {
      index: bit,
      label: `SW${8 - i}`,
      value: ((clamped >> bit) & 1) as 0 | 1,
    }
  })
}

export default function CentralLabHelperPage() {
  const [inputValue, setInputValue] = useState('')
  const [bits, setBits] = useState<SwitchBit[] | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    if (raw === '') {
      setInputValue('')
      setBits(null)
      return
    }
    const num = parseInt(raw, 10)
    if (isNaN(num)) return
    const clamped = Math.max(1, Math.min(255, num))
    setInputValue(String(clamped))
    setBits(decimalToBits(clamped))
  }

  function handleReset() {
    setInputValue('')
    setBits(null)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Central Lab Helper</h1>
        <p className="text-muted-foreground text-sm mt-1">
          เครื่องมือช่วยเล่น Central Lab
        </p>
      </div>

      {/* Input Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">ป้อนค่าเลขฐาน 10</CardTitle>
          <CardDescription>ค่าที่รองรับ: 1 – 255</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 items-end">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="decimal-input">Decimal Value</Label>
              <Input
                id="decimal-input"
                type="number"
                min={1}
                max={255}
                placeholder="เช่น 170"
                value={inputValue}
                onChange={handleChange}
                onWheel={(e) => e.currentTarget.blur()}
              />
            </div>
            <Button type="button" variant="outline" onClick={handleReset}>
              รีเซ็ต
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Switch Visualization */}
      {bits && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">สถานะสวิทช์</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-8 gap-3">
              {bits.map((bit) => (
                <div key={bit.index} className="flex flex-col items-center gap-2">
                  {/* Switch body */}
                  <div
                    className={`
                      relative w-10 h-20 rounded-md border-2 flex flex-col justify-between
                      py-1.5 items-center select-none
                      ${bit.value === 1
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-muted/40'}
                    `}
                  >
                    {/* ON label */}
                    <span
                      className={`text-[10px] font-bold leading-none
                        ${bit.value === 1 ? 'text-primary' : 'text-muted-foreground/40'}`}
                    >
                      ON
                    </span>

                    {/* Toggle thumb */}
                    <div
                      className={`
                        absolute w-7 h-7 rounded-sm border transition-all duration-200
                        ${bit.value === 1
                          ? 'top-2 border-primary bg-primary text-primary-foreground'
                          : 'bottom-2 border-border bg-background text-muted-foreground'}
                        flex items-center justify-center text-[10px] font-bold
                      `}
                    >
                      {bit.value}
                    </div>

                    {/* OFF label */}
                    <span
                      className={`text-[10px] font-bold leading-none
                        ${bit.value === 0 ? 'text-foreground' : 'text-muted-foreground/40'}`}
                    >
                      OFF
                    </span>
                  </div>

                  {/* Switch label */}
                  <span className="text-xs font-medium text-muted-foreground">
                    {bit.label}
                  </span>
                  {/* Bit position */}
                  <span className="text-[10px] text-muted-foreground/60">
                    bit {bit.index}
                  </span>
                </div>
              ))}
            </div>

          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Phase Timers */}
      <div>
        <h2 className="text-lg font-semibold mb-1">Phase Timer</h2>
        <p className="text-muted-foreground text-sm mb-4">
          จับเวลาแต่ละ phase — เมื่อหมดเวลาจะมีเสียงแจ้งเตือน
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <CountdownTimer label="Phase 1" initialSeconds={110} />
          <CountdownTimer label="Phase 2" initialSeconds={80} />
          <CountdownTimer label="Phase 3" initialSeconds={140} />
        </div>
      </div>

      <Separator />

      {/* Boss Lookup */}
      <BossLookup />
    </div>
  )
}
