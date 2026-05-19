import { useState, useMemo } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  jobClasses,
  calcHP,
  calcSP,
  calcATK,
  calcMATK,
  calcHIT,
  calcFLEE,
  calcDEF,
  calcMDEF,
} from '@/features/calculator/formulas'
import type { StatSet } from '@/types'

const jobsWithStats = jobClasses.filter(
  (j) => j.hpModifier !== undefined && j.spModifier !== undefined,
)

const statKeys: (keyof StatSet)[] = ['str', 'agi', 'vit', 'int', 'dex', 'luk']
const statLabel: Record<keyof StatSet, string> = {
  str: 'STR',
  agi: 'AGI',
  vit: 'VIT',
  int: 'INT',
  dex: 'DEX',
  luk: 'LUK',
}

const initialStats: StatSet = { str: 1, agi: 1, vit: 1, int: 1, dex: 1, luk: 1 }

export default function StatCalculatorPage() {
  const [baseLevel, setBaseLevel] = useState(1)
  const [jobId, setJobId] = useState(jobsWithStats[0].id)
  const [stats, setStats] = useState<StatSet>(initialStats)

  const job = useMemo(() => jobsWithStats.find((j) => j.id === jobId)!, [jobId])

  const result = useMemo(
    () => ({
      hp: calcHP(baseLevel, stats.vit, job),
      sp: calcSP(baseLevel, stats.int, job),
      atk: calcATK(stats.str),
      matk: calcMATK(stats.int),
      hit: calcHIT(stats.dex, baseLevel),
      flee: calcFLEE(stats.agi, baseLevel),
      def: calcDEF(stats.vit),
      mdef: calcMDEF(stats.int),
    }),
    [baseLevel, stats, job],
  )

  function handleStat(key: keyof StatSet, raw: string) {
    const val = Math.min(99, Math.max(1, parseInt(raw) || 1))
    setStats((prev) => ({ ...prev, [key]: val }))
  }

  function handleReset() {
    setStats(initialStats)
    setBaseLevel(1)
    setJobId(jobsWithStats[0].id)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">คำนวณ Stat</h1>
        <p className="text-sm text-muted-foreground mt-1">
          ใส่ค่า Stat เพื่อดูผลลัพธ์ HP, SP, ATK และอื่น ๆ (สูตรพื้นฐาน)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">ตั้งค่าตัวละคร</CardTitle>
            <CardDescription>กรอก Base Level, Job และค่า Stat</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="base-level">Base Level</Label>
                <Input
                  id="base-level"
                  type="number"
                  min={1}
                  max={99}
                  value={baseLevel}
                  onChange={(e) =>
                    setBaseLevel(Math.min(99, Math.max(1, parseInt(e.target.value) || 1)))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="job">Job Class</Label>
                <Select value={jobId} onValueChange={setJobId}>
                  <SelectTrigger id="job" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {jobsWithStats.map((j) => (
                      <SelectItem key={j.id} value={j.id}>
                        {j.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-3">
              {statKeys.map((key) => (
                <div key={key} className="space-y-1.5">
                  <Label htmlFor={key}>{statLabel[key]}</Label>
                  <Input
                    id={key}
                    type="number"
                    min={1}
                    max={99}
                    value={stats[key]}
                    onChange={(e) => handleStat(key, e.target.value)}
                  />
                </div>
              ))}
            </div>

            <Button variant="outline" size="sm" onClick={handleReset} className="w-full">
              รีเซ็ต
            </Button>
          </CardContent>
        </Card>

        {/* Result Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">ผลลัพธ์</CardTitle>
            <CardDescription>
              {job.name} — Lv. {baseLevel}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {[
                { label: 'HP', value: result.hp.toLocaleString(), color: 'text-red-500' },
                { label: 'SP', value: result.sp.toLocaleString(), color: 'text-blue-500' },
                { label: 'ATK', value: result.atk.toLocaleString(), color: 'text-orange-500' },
                { label: 'MATK', value: result.matk.toLocaleString(), color: 'text-purple-500' },
                { label: 'HIT', value: result.hit.toLocaleString(), color: 'text-yellow-600' },
                { label: 'FLEE', value: result.flee.toLocaleString(), color: 'text-teal-500' },
                { label: 'DEF', value: result.def.toLocaleString(), color: 'text-zinc-500' },
                { label: 'MDEF', value: result.mdef.toLocaleString(), color: 'text-indigo-500' },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <span className="text-sm text-muted-foreground w-16">{label}</span>
                  <span className={`text-lg font-semibold tabular-nums ${color}`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
