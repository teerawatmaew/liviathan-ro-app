import { useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { usePageTitle } from '@/hooks/use-page-title'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { BOXES, calcBox } from './mpJigsawLogic'

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MpJigsawCalculatorPage() {
  usePageTitle('MP Jigsaw Calculator')
  const [levelInput, setLevelInput] = useLocalStorage('lro-mp-level', '')

  const level = parseInt(levelInput) || 0

  const isInvalid = levelInput !== '' && level <= 100
  const showResult = level > 100

  const rows = useMemo(
    () => (showResult ? BOXES.map((box) => ({ ...box, ...calcBox(level, box) })) : null),
    [level, showResult],
  )

  const totalJigsaw = rows ? rows.reduce((sum, r) => sum + r.totalJigsaw, 0) : 0

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">MP Jigsaw Calculator</h1>
        <p className="text-muted-foreground text-sm mt-1">
          คำนวณจำนวน Jigsaw ที่ได้รับจาก Mystical Pass ตามเลเวลปัจจุบัน
        </p>
      </div>

      {/* Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">เลเวลปัจจุบัน</CardTitle>
          <CardDescription>กรอกเลเวลที่ถึงแล้ว (ต้องมากกว่า 100)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 max-w-xs">
            <Label htmlFor="level-input" className="shrink-0">
              เลเวล
            </Label>
            <Input
              id="level-input"
              type="number"
              min={101}
              placeholder="เช่น 240"
              value={levelInput}
              onChange={(e) => setLevelInput(e.target.value)}
              className={isInvalid ? 'border-destructive focus-visible:ring-destructive' : ''}
            />
          </div>
          {isInvalid && (
            <p className="text-destructive text-sm mt-2">เลเวลต้องมากกว่า 100</p>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {showResult && rows && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">สรุปผลการคำนวณ</CardTitle>
            <CardDescription>เลเวล {level}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Breakdown table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground border-b">
                    <th className="text-left pb-2 pr-4 font-medium">กล่อง</th>
                    <th className="text-right pb-2 px-3 font-medium whitespace-nowrap">
                      100 เวลแรก
                    </th>
                    <th className="text-right pb-2 px-3 font-medium whitespace-nowrap">
                      เกิน 100 เวล
                    </th>
                    <th className="text-right pb-2 px-3 font-medium whitespace-nowrap">
                      โบนัสพิเศษ
                    </th>
                    <th className="text-right pb-2 px-3 font-medium whitespace-nowrap">
                      รวมกล่อง
                    </th>
                    <th className="text-right pb-2 px-3 font-medium whitespace-nowrap">
                      Jigsaw/กล่อง
                    </th>
                    <th className="text-right pb-2 pl-3 font-medium whitespace-nowrap">
                      รวม Jigsaw
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-b last:border-0">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <span className={`inline-block w-3 h-3 rounded-sm ${row.color}`} />
                          <span className="font-medium">{row.label}</span>
                          {row.fromBonus > 0 && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0">
                              โบนัส ✓
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="text-right py-3 px-3 tabular-nums">{row.fromFirst100}</td>
                      <td className="text-right py-3 px-3 tabular-nums">{row.fromAbove100}</td>
                      <td className="text-right py-3 px-3 tabular-nums">
                        {row.fromBonus > 0 ? (
                          <span className="text-green-600 dark:text-green-400 font-medium">
                            +{row.fromBonus}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="text-right py-3 px-3 tabular-nums font-semibold">
                        {row.totalBoxes}
                      </td>
                      <td className="text-right py-3 px-3 tabular-nums text-muted-foreground">
                        ×{row.jigsawPerBox}
                      </td>
                      <td className="text-right py-3 pl-3 tabular-nums font-bold">
                        {row.totalJigsaw}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Separator />

            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">ผลรวม Jigsaw ทั้งหมด</span>
              <span className="text-3xl font-bold tabular-nums text-primary">{totalJigsaw}</span>
            </div>

            {/* Upcoming bonus hint */}
            <UpcomingBonusHint level={level} />
          </CardContent>
        </Card>
      )}

      {/* Info card */}
      <Card className="bg-muted/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">ข้อมูลอ้างอิง</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-1">
          <p>• Box 1 (สีน้ำตาล): ได้ 1 กล่องทุกๆ 7 เวล ที่เกิน 100 | โบนัส +30 กล่อง เมื่อถึงเวล 350</p>
          <p>• Box 2 (สีน้ำเงิน): ได้ 1 กล่องทุกๆ 19 เวล ที่เกิน 100 | โบนัส +30 กล่อง เมื่อถึงเวล 800</p>
          <p>• Box 3 (สีทอง): ได้ 1 กล่องทุกๆ 41 เวล ที่เกิน 100 | โบนัส +30 กล่อง เมื่อถึงเวล 1500</p>
          <p>• Jigsaw ต่อกล่อง: Box 1 = 2 | Box 2 = 3 | Box 3 = 5</p>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Helper: upcoming bonus hint ─────────────────────────────────────────────

function UpcomingBonusHint({ level }: { level: number }) {
  const upcoming = BOXES.filter((box) => level < box.specialLevel).map((box) => ({
    label: box.label,
    specialLevel: box.specialLevel,
    remaining: box.specialLevel - level,
  }))

  if (upcoming.length === 0) return null

  return (
    <div className="rounded-md border border-dashed p-3 space-y-1">
      <p className="text-xs font-medium text-muted-foreground">โบนัสพิเศษที่กำลังจะถึง</p>
      {upcoming.map((u) => (
        <p key={u.label} className="text-xs">
          {u.label}: เวล {u.specialLevel.toLocaleString()} (+30 กล่อง) —{' '}
          <span className="font-medium">อีก {u.remaining.toLocaleString()} เวล</span>
        </p>
      ))}
    </div>
  )
}
