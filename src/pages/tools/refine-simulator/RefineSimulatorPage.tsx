import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Play, StepForward, Shield, Hammer } from 'lucide-react'
import { cn } from '@/lib/utils'

import type { RefineEquipType } from '@/types'
import { REFINE_RATES, BSB_COSTS, getRefineSuccessRate } from '@/data/refine-rates'
import RefineHistoryTable from './RefineHistoryTable'

export interface SimAttempt {
  id: number
  fromLevel: number
  successRate: number
  success: boolean
  toLevel: number
  broke: boolean
  oreName: string
  bsbUsed: number
}

const EQUIP_TYPE_OPTIONS: { value: RefineEquipType; label: string }[] = [
  { value: 'weapon_lv1', label: 'อาวุธ Lv.1 (Oridecon)' },
  { value: 'weapon_lv2', label: 'อาวุธ Lv.2 (Oridecon)' },
  { value: 'weapon_lv3', label: 'อาวุธ Lv.3 (Oridecon)' },
  { value: 'weapon_lv4', label: 'อาวุธ Lv.4 (Oridecon)' },
  { value: 'weapon_lv5', label: 'อาวุธ Lv.5 (Etherdeocon)' },
  { value: 'armor_lv1', label: 'เกราะ Lv.1 (Elunium)' },
  { value: 'armor_lv2', label: 'เกราะ Lv.2 (Ethernium)' },
  { value: 'shadow', label: 'Shadow Gear (Shadow Orb)' },
]

function getOreName(
  equipType: RefineEquipType,
  fromLevel: number,
  oreType: 'normal' | 'enrichedHd',
): string {
  const isHigh = fromLevel >= 10
  if (oreType === 'normal') {
    if (equipType === 'weapon_lv5') return 'Etherdeocon'
    if (equipType === 'armor_lv2') return 'Ethernium'
    if (equipType === 'shadow') return 'Shadow Orb'
    if (equipType === 'armor_lv1') return isHigh ? 'Carnium' : 'Elunium'
    return isHigh ? 'Bradium' : 'Oridecon'
  } else {
    if (equipType === 'weapon_lv5') return 'HD Ether Bradium'
    if (equipType === 'armor_lv2') return 'HD Ether Carnium'
    if (equipType === 'shadow') return 'Shadow Crystal'
    if (equipType === 'armor_lv1') return isHigh ? 'HD Carnium' : 'Enriched Elunium'
    return isHigh ? 'HD Bradium' : 'Enriched Oridecon'
  }
}

function StatTile({
  label,
  value,
  color,
}: {
  label: string
  value: string
  color?: 'green' | 'orange' | 'red' | 'amber'
}) {
  return (
    <div className="rounded-lg border p-3 text-center">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div
        className={cn(
          'text-xl font-bold tabular-nums',
          color === 'green'
            ? 'text-green-400'
            : color === 'orange'
              ? 'text-orange-400'
              : color === 'red'
                ? 'text-red-400'
                : color === 'amber'
                  ? 'text-amber-400'
                  : '',
        )}
      >
        {value}
      </div>
    </div>
  )
}

export default function RefineSimulatorPage() {
  // ── Settings ─────────────────────────────────────────────────────────────
  const [equipType, setEquipType] = useState<RefineEquipType>('weapon_lv4')
  const [oreType, setOreType] = useState<'normal' | 'enrichedHd'>('enrichedHd')
  const [startLevel, setStartLevel] = useState(0)
  const [targetLevel, setTargetLevel] = useState(10)
  const [noBreak, setNoBreak] = useState(false)
  const [noLevelLoss, setNoLevelLoss] = useState(false)

  // ── Simulation State ──────────────────────────────────────────────────────
  const [currentLevel, setCurrentLevel] = useState(0)
  const [attempts, setAttempts] = useState<SimAttempt[]>([])
  const [isBroken, setIsBroken] = useState(false)
  const [counter, setCounter] = useState(0)
  const [lastResult, setLastResult] = useState<'success' | 'fail' | 'break' | null>(null)

  // ── Derived ───────────────────────────────────────────────────────────────
  const rateData = REFINE_RATES[equipType]
  const maxLevel = rateData.maxLevel
  const safetyLevel = rateData.safetyLevel
  const isEtherType = equipType === 'weapon_lv5' || equipType === 'armor_lv2'
  const reachedTarget = currentLevel >= targetLevel
  const reachedMax = currentLevel >= maxLevel
  const canAttempt = !isBroken && !reachedTarget && !reachedMax

  const nextRate =
    canAttempt ? (getRefineSuccessRate(equipType, currentLevel, oreType) ?? null) : null

  const stats = useMemo(() => {
    const total = attempts.length
    const successCount = attempts.filter((a) => a.success).length
    const failCount = total - successCount
    const breakCount = attempts.filter((a) => a.broke).length
    const totalBsb = attempts.reduce((sum, a) => sum + a.bsbUsed, 0)
    const rate = total > 0 ? ((successCount / total) * 100).toFixed(1) : '0.0'
    const oreBreakdown = attempts.reduce<Record<string, number>>((acc, a) => {
      acc[a.oreName] = (acc[a.oreName] ?? 0) + 1
      return acc
    }, {})
    return { total, successCount, failCount, breakCount, totalBsb, rate, oreBreakdown }
  }, [attempts])

  const rateTableData = useMemo(() => {
    return Array.from({ length: maxLevel }, (_, i) => ({
      fromLevel: i,
      normalRate: rateData.normal[i] ?? 0,
      enrichedRate: rateData.enrichedHd[i] ?? 0,
      isSafe: i < safetyLevel,
      bsbCost: BSB_COSTS[i] ?? null,
    }))
  }, [maxLevel, safetyLevel, rateData])

  // ── Core Roll Function ────────────────────────────────────────────────────
  function rollOne(lvl: number) {
    const rate = getRefineSuccessRate(equipType, lvl, oreType) ?? 100
    const success = Math.random() * 100 < rate
    const oreName = getOreName(equipType, lvl, oreType)

    if (success) {
      return { newLevel: lvl + 1, broke: false, success: true, bsbUsed: 0, oreName, successRate: rate }
    }

    // BSB: ไม่ลดขั้นไม่ว่าจะเป็นประเภทไหน
    if (noLevelLoss) {
      const bsbUsed = BSB_COSTS[lvl] ?? 0
      return { newLevel: lvl, broke: false, success: false, bsbUsed, oreName, successRate: rate }
    }

    // weapon_lv5 / armor_lv2 ที่ lvl < 10: ลดขั้นตามประเภทแร่ (ไม่ติด)
    if (isEtherType && lvl < 10) {
      const drop = oreType === 'normal' ? 3 : 1
      return {
        newLevel: Math.max(0, lvl - drop),
        broke: false,
        success: false,
        bsbUsed: 0,
        oreName,
        successRate: rate,
      }
    }

    if (noBreak) {
      return {
        newLevel: Math.max(0, lvl - 1),
        broke: false,
        success: false,
        bsbUsed: 0,
        oreName,
        successRate: rate,
      }
    }
    return { newLevel: 0, broke: true, success: false, bsbUsed: 0, oreName, successRate: rate }
  }

  // ── Handlers ──────────────────────────────────────────────────────────────
  function handleSingleAttempt() {
    if (!canAttempt) return
    const result = rollOne(currentLevel)
    const newId = counter + 1
    const attempt: SimAttempt = {
      id: newId,
      fromLevel: currentLevel,
      successRate: result.successRate,
      success: result.success,
      toLevel: result.newLevel,
      broke: result.broke,
      oreName: result.oreName,
      bsbUsed: result.bsbUsed,
    }
    setCounter(newId)
    setCurrentLevel(result.newLevel)
    setAttempts((prev) => [attempt, ...prev].slice(0, 500))
    setLastResult(result.broke ? 'break' : result.success ? 'success' : 'fail')
    if (result.broke) setIsBroken(true)
  }

  function handleAutoRun() {
    if (!canAttempt) return
    let lvl = currentLevel
    let broken = false
    let cnt = counter
    const newAttempts: SimAttempt[] = []
    const MAX_ITER = 50000

    while (lvl < targetLevel && !broken && newAttempts.length < MAX_ITER) {
      const result = rollOne(lvl)
      cnt++
      newAttempts.push({
        id: cnt,
        fromLevel: lvl,
        successRate: result.successRate,
        success: result.success,
        toLevel: result.newLevel,
        broke: result.broke,
        oreName: result.oreName,
        bsbUsed: result.bsbUsed,
      })
      lvl = result.newLevel
      if (result.broke) broken = true
    }

    setCounter(cnt)
    setCurrentLevel(lvl)
    setAttempts((prev) => [...[...newAttempts].reverse(), ...prev].slice(0, 500))
    setLastResult(broken ? 'break' : lvl >= targetLevel ? 'success' : 'fail')
    if (broken) setIsBroken(true)
  }

  function resetSim(resetHistory = false) {
    setCurrentLevel(startLevel)
    setIsBroken(false)
    setLastResult(null)
    if (resetHistory) {
      setAttempts([])
      setCounter(0)
    }
  }

  function handleEquipTypeChange(val: string) {
    const newType = val as RefineEquipType
    const newMax = REFINE_RATES[newType].maxLevel
    setEquipType(newType)
    const newStart = Math.min(startLevel, newMax - 1)
    const newTarget = Math.min(Math.max(targetLevel, newStart + 1), newMax)
    setStartLevel(newStart)
    setTargetLevel(newTarget)
    setCurrentLevel(newStart)
    setIsBroken(false)
    setAttempts([])
    setCounter(0)
    setLastResult(null)
  }

  function handleStartLevelChange(val: string) {
    const lvl = parseInt(val)
    setStartLevel(lvl)
    const newTarget = targetLevel <= lvl ? Math.min(lvl + 1, maxLevel) : targetLevel
    setTargetLevel(newTarget)
    setCurrentLevel(lvl)
    setIsBroken(false)
    setLastResult(null)
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Refine Simulator</h1>
        <p className="text-muted-foreground text-sm mt-1">
          จำลองการ Refine อุปกรณ์ — เลือกแร่ ตั้งค่าการป้องกัน แล้วดูว่าต้องใช้กี่ครั้งถึงจะถึงเป้า
        </p>
      </div>

      {/* ── Settings Card ──────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">ตั้งค่าการจำลอง</CardTitle>
          <CardDescription>
            Safety Level: ≤+{safetyLevel} (สำเร็จ 100%) · สูงสุด: +{maxLevel}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>ประเภทอุปกรณ์</Label>
              <Select value={equipType} onValueChange={handleEquipTypeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EQUIP_TYPE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>เริ่มจาก</Label>
              <Select value={String(startLevel)} onValueChange={handleStartLevelChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: maxLevel }, (_, i) => (
                    <SelectItem key={i} value={String(i)}>
                      +{i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>เป้าหมาย</Label>
              <Select
                value={String(targetLevel)}
                onValueChange={(v) => setTargetLevel(parseInt(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(
                    { length: maxLevel - startLevel },
                    (_, i) => startLevel + i + 1,
                  ).map((lvl) => (
                    <SelectItem key={lvl} value={String(lvl)}>
                      +{lvl}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* ── Simulator + Stats ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Simulator */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Hammer className="size-4" />
              จำลองการตีบวก
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Live controls: ore + protection */}
            <div className="rounded-lg border p-3 space-y-3 bg-muted/20">
              <div className="space-y-1.5">
                <div className="text-xs font-medium text-muted-foreground">แร่ที่ใช้</div>
                <div className="flex gap-2">
                  <Button
                    variant={oreType === 'normal' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1 text-xs h-8"
                    onClick={() => setOreType('normal')}
                  >
                    ธรรมดา
                  </Button>
                  <Button
                    variant={oreType === 'enrichedHd' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1 text-xs h-8"
                    onClick={() => setOreType('enrichedHd')}
                  >
                    Enriched / HD
                  </Button>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="text-xs font-medium text-muted-foreground">การป้องกันเมื่อล้มเหลว</div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setNoBreak(!noBreak)}
                    className={cn(
                      'flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors cursor-pointer select-none',
                      noBreak
                        ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                        : 'border-border text-muted-foreground hover:border-muted-foreground',
                    )}
                  >
                    <Shield className="size-3.5" />
                    ไม่ติด (No Break)
                  </button>
                  <button
                    onClick={() => setNoLevelLoss(!noLevelLoss)}
                    className={cn(
                      'flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors cursor-pointer select-none',
                      noLevelLoss
                        ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                        : 'border-border text-muted-foreground hover:border-muted-foreground',
                    )}
                  >
                    <Shield className="size-3.5" />
                    ไม่ลดขั้น (BSB)
                  </button>
                </div>
                <div className="min-h-[1rem] text-xs leading-relaxed">
                  {isEtherType && !noLevelLoss && (
                    <span className="text-sky-400/80">
                      {equipType === 'weapon_lv5' ? 'อาวุธ Lv.5' : 'เกราะ Lv.2'} (&lt;+10):
                      {' '}ธรรมดา −3 ขั้น · Enriched/HD −1 ขั้น
                    </span>
                  )}
                  {!isEtherType && !noBreak && !noLevelLoss && (
                    <span className="text-red-400/70">ไม่เลือกป้องกัน = ไอเทมติด (หาย)</span>
                  )}
                  {!isEtherType && noBreak && !noLevelLoss && (
                    <span className="text-blue-400/70">ล้มเหลว = ลดลง 1 ขั้น (ไม่ติด)</span>
                  )}
                  {noLevelLoss && (
                    <span className="text-amber-400/70">
                      BSB จะถูกนับเฉพาะเมื่อ ≥+{safetyLevel} · มีข้อมูลถึง +13
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Current level */}
            <div className="flex flex-col items-center py-4 gap-2">
              {isBroken ? (
                <>
                  <div className="text-6xl">💥</div>
                  <div className="text-red-400 font-semibold text-lg">ไอเทมติด!</div>
                  <div className="text-xs text-muted-foreground">กดรีเซ็ตไอเทมเพื่อเริ่มใหม่</div>
                </>
              ) : (
                <>
                  <div
                    className={cn(
                      'text-7xl font-bold tabular-nums',
                      reachedTarget ? 'text-green-400' : '',
                    )}
                  >
                    +{currentLevel}
                  </div>
                  {reachedTarget && (
                    <Badge className="bg-green-600 hover:bg-green-700">
                      ✓ ถึงเป้าหมาย +{targetLevel}!
                    </Badge>
                  )}
                  {!reachedTarget && nextRate !== null && (
                    <div
                      className={cn(
                        'text-sm font-medium',
                        nextRate === 100
                          ? 'text-green-400'
                          : nextRate >= 50
                            ? 'text-yellow-400'
                            : 'text-red-400',
                      )}
                    >
                      โอกาสสำเร็จ: {nextRate}%
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Last result */}
            {lastResult && (
              <div
                className={cn(
                  'rounded-md border px-3 py-2 text-sm text-center font-medium',
                  lastResult === 'success'
                    ? 'border-green-500/40 bg-green-500/10 text-green-400'
                    : lastResult === 'break'
                      ? 'border-red-500/40 bg-red-500/10 text-red-400'
                      : 'border-orange-500/40 bg-orange-500/10 text-orange-400',
                )}
              >
                {lastResult === 'success'
                  ? '✓ Refine สำเร็จ!'
                  : lastResult === 'break'
                    ? '✕ ไอเทมติด!'
                    : '✕ Refine ล้มเหลว'}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <Button onClick={handleSingleAttempt} disabled={!canAttempt} className="gap-2">
                <StepForward className="size-4" />
                ตีครั้งเดียว
              </Button>
              <Button
                onClick={handleAutoRun}
                disabled={!canAttempt}
                variant="secondary"
                className="gap-2"
              >
                <Play className="size-4" />
                ตีจนถึง +{targetLevel}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => resetSim(false)}
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs"
              >
                <RefreshCw className="size-3" />
                รีเซ็ตไอเทม
              </Button>
              <Button
                onClick={() => resetSim(true)}
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs text-destructive hover:text-destructive"
              >
                <RefreshCw className="size-3" />
                รีเซ็ตทั้งหมด
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">สถิติรวม</CardTitle>
            <CardDescription>ตั้งแต่เริ่มจำลอง (กด "รีเซ็ตทั้งหมด" เพื่อล้าง)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <StatTile label="ครั้งทั้งหมด" value={stats.total.toLocaleString()} />
              <StatTile label="อัตราสำเร็จจริง" value={`${stats.rate}%`} />
              <StatTile
                label="สำเร็จ"
                value={stats.successCount.toLocaleString()}
                color="green"
              />
              <StatTile
                label="ล้มเหลว"
                value={stats.failCount.toLocaleString()}
                color="orange"
              />
              <StatTile
                label="ติด (หาย)"
                value={stats.breakCount.toLocaleString()}
                color={stats.breakCount > 0 ? 'red' : undefined}
              />
              <StatTile
                label="BSB ที่ใช้"
                value={stats.totalBsb.toLocaleString()}
                color={stats.totalBsb > 0 ? 'amber' : undefined}
              />
            </div>

            {Object.keys(stats.oreBreakdown).length > 0 && (
              <div className="border-t pt-3 space-y-1.5">
                <div className="text-xs font-medium text-muted-foreground">แร่ที่ใช้ทั้งหมด</div>
                <div className="space-y-1">
                  {Object.entries(stats.oreBreakdown)
                    .sort(([, a], [, b]) => b - a)
                    .map(([ore, count]) => (
                      <div key={ore} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground text-xs">{ore}</span>
                        <span className="font-bold tabular-nums text-sm">
                          {count.toLocaleString()}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Rate Table ──────────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">ตารางอัตราสำเร็จ</CardTitle>
          <CardDescription>
            <span className="text-green-400">✓ สีเขียว = Safety Zone (100% สำเร็จ)</span>
            {' · '}◀ = ระดับปัจจุบันในการจำลอง
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                    ระดับ
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-muted-foreground">
                    แร่ธรรมดา
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-muted-foreground">
                    Enriched / HD
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-muted-foreground">
                    BSB ต่อครั้ง
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-muted-foreground">
                    แร่ที่ใช้
                  </th>
                </tr>
              </thead>
              <tbody>
                {rateTableData.map((row) => (
                  <tr
                    key={row.fromLevel}
                    className={cn(
                      'border-b transition-colors',
                      row.fromLevel === currentLevel && !isBroken
                        ? 'bg-primary/10 outline outline-1 outline-primary/30 outline-offset-[-1px]'
                        : row.isSafe
                          ? 'bg-green-500/5'
                          : '',
                    )}
                  >
                    <td className="px-3 py-1.5 tabular-nums font-medium whitespace-nowrap">
                      +{row.fromLevel} → +{row.fromLevel + 1}
                      {row.isSafe && <span className="ml-1 text-green-500 text-xs">✓</span>}
                      {row.fromLevel === currentLevel && !isBroken && (
                        <span className="ml-1 text-primary text-xs font-bold">◀</span>
                      )}
                    </td>
                    <td
                      className={cn(
                        'px-3 py-1.5 text-center tabular-nums',
                        row.normalRate === 100
                          ? 'text-green-400'
                          : row.normalRate < 20
                            ? 'text-red-400'
                            : 'text-yellow-400',
                      )}
                    >
                      {row.normalRate}%
                    </td>
                    <td
                      className={cn(
                        'px-3 py-1.5 text-center tabular-nums',
                        row.enrichedRate === 100
                          ? 'text-green-400'
                          : row.enrichedRate < 20
                            ? 'text-red-400'
                            : 'text-yellow-400',
                      )}
                    >
                      {row.enrichedRate}%
                    </td>
                    <td className="px-3 py-1.5 text-center text-xs tabular-nums">
                      {row.bsbCost !== null ? (
                        <span className="text-amber-400 font-medium">{row.bsbCost}</span>
                      ) : row.fromLevel >= safetyLevel ? (
                        <span className="text-muted-foreground/40">?</span>
                      ) : (
                        <span className="text-muted-foreground/40">—</span>
                      )}
                    </td>
                    <td className="px-3 py-1.5 text-center text-xs text-muted-foreground whitespace-nowrap">
                      {getOreName(equipType, row.fromLevel, 'normal')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── History Table ───────────────────────────────────────────────────── */}
      {attempts.length > 0 && <RefineHistoryTable attempts={attempts} />}
    </div>
  )
}
