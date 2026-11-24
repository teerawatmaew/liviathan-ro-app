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
import { cn } from '@/lib/utils'
import { decimalToBits, parseSwitchInput, SWITCH_MAX, SWITCH_MIN } from './switchLogic'

export default function SwitchDecoder() {
  const [inputValue, setInputValue] = useState('')
  const parsed = parseSwitchInput(inputValue)
  const bits = parsed.kind === 'ok' ? decimalToBits(parsed.value) : null
  const onLabels = bits?.filter((b) => b.value === 1).map((b) => b.label) ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">แปลงเลขเป็นสวิทช์</CardTitle>
        <CardDescription>
          กรอกเลขฐาน 10 ที่เห็นในเกม ({SWITCH_MIN} – {SWITCH_MAX}) แล้วดูว่าต้องเปิดสวิทช์ตัวไหน
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex gap-3 items-end">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="decimal-input">เลขฐาน 10</Label>
            <Input
              id="decimal-input"
              type="number"
              inputMode="numeric"
              min={SWITCH_MIN}
              max={SWITCH_MAX}
              placeholder="เช่น 170"
              value={inputValue}
              aria-invalid={parsed.kind === 'invalid'}
              onChange={(e) => setInputValue(e.target.value)}
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>
          <Button type="button" variant="outline" onClick={() => setInputValue('')} disabled={!inputValue}>
            ล้าง
          </Button>
        </div>
        {parsed.kind === 'invalid' && <p className="text-destructive text-sm -mt-3">{parsed.message}</p>}

        {bits && (
          <div className="space-y-3">
            <div className="grid grid-cols-8 gap-1.5 sm:gap-3">
              {bits.map((bit) => (
                <div key={bit.index} className="flex flex-col items-center gap-1.5">
                  <div
                    className={cn(
                      'relative w-full max-w-11 h-16 sm:h-20 rounded-md border-2 p-1 transition-colors',
                      bit.value === 1 ? 'border-primary bg-primary/10' : 'border-border bg-muted/40',
                    )}
                    aria-label={`${bit.label} ${bit.value === 1 ? 'เปิด' : 'ปิด'}`}
                  >
                    <div
                      className={cn(
                        'absolute inset-x-1 h-[calc(50%-4px)] rounded-sm flex items-center justify-center text-xs font-bold transition-all duration-200',
                        bit.value === 1
                          ? 'top-1 bg-primary text-primary-foreground'
                          : 'bottom-1 bg-background text-muted-foreground border',
                      )}
                    >
                      {bit.value === 1 ? 'ON' : 'OFF'}
                    </div>
                  </div>
                  <span
                    className={cn(
                      'text-[11px] sm:text-xs font-medium',
                      bit.value === 1 ? 'text-primary' : 'text-muted-foreground',
                    )}
                  >
                    {bit.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="rounded-md bg-muted/40 px-3 py-2 text-sm flex flex-wrap gap-x-4 gap-y-1">
              <span>
                <span className="text-muted-foreground">เปิด: </span>
                <span className="font-medium">{onLabels.join(', ')}</span>
              </span>
              <span className="text-muted-foreground font-mono tabular-nums">
                {bits.map((b) => b.value).join('')}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
