import { useState } from 'react'
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

export default function CentralLabSwitchPage() {
  const [inputValue, setInputValue] = useState('')
  const [bits, setBits] = useState<SwitchBit[] | null>(null)
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const num = parseInt(inputValue, 10)
    if (isNaN(num) || inputValue.trim() === '') {
      setError('กรุณากรอกตัวเลขที่ถูกต้อง')
      setBits(null)
      return
    }
    if (num < 0 || num > 255) {
      setError('ค่าต้องอยู่ระหว่าง 0 – 255 (8-bit)')
      setBits(null)
      return
    }
    setError('')
    setBits(decimalToBits(num))
  }

  function handleReset() {
    setInputValue('')
    setBits(null)
    setError('')
  }

  const decimal = bits !== null ? parseInt(inputValue, 10) : null
  const binary = decimal !== null ? decimal.toString(2).padStart(8, '0') : null
  const hex = decimal !== null ? decimal.toString(16).toUpperCase().padStart(2, '0') : null

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Central Lab Switch</h1>
        <p className="text-muted-foreground text-sm mt-1">
          กรอกค่าเลขฐาน 10 (0–255) เพื่อดูสถานะสวิทช์ 8 ตัว
        </p>
      </div>

      {/* Input Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">ป้อนค่าเลขฐาน 10</CardTitle>
          <CardDescription>ค่าที่รองรับ: 0 – 255</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-3 items-end">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="decimal-input">Decimal Value</Label>
              <Input
                id="decimal-input"
                type="number"
                min={0}
                max={255}
                placeholder="เช่น 170"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value)
                  setError('')
                }}
              />
              {error && (
                <p className="text-destructive text-xs">{error}</p>
              )}
            </div>
            <Button type="submit">ดูผล</Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              รีเซ็ต
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Switch Visualization */}
      {bits && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">สถานะสวิทช์</CardTitle>
            <CardDescription className="font-mono text-xs space-x-3">
              <span>DEC: {decimal}</span>
              <span>BIN: {binary}</span>
              <span>HEX: 0x{hex}</span>
            </CardDescription>
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

            {/* Legend */}
            <div className="mt-6 flex gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-primary" />
                <span>ON = 1 (สวิทช์ขึ้น)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm border bg-background" />
                <span>OFF = 0 (สวิทช์ลง)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
