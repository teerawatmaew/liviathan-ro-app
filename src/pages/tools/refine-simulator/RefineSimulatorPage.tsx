import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { usePageTitle } from '@/hooks/use-page-title'
import { useLocalStorage } from '@/hooks/use-local-storage'
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
import { RefreshCw, Play, StepForward, Shield, Hammer, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

import type { RefineEquipType } from '@/types'
import { REFINE_RATES, BSB_COSTS, BSB_EVENT_COSTS, getRefineSuccessRate } from '@/data/refine-rates'
import { EVENT_REFINE_ITEMS, getEventRefineItem, isEventRefineType, getEffectiveEventRate } from '@/data/event-refine-items'
import { getOreName, rollOne } from './refineSimulatorLogic'
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

const STANDARD_OPTIONS: { value: string; label: string }[] = [
  { value: 'weapon_lv1', label: 'อาวุธ Lv.1 (Oridecon)' },
  { value: 'weapon_lv2', label: 'อาวุธ Lv.2 (Oridecon)' },
  { value: 'weapon_lv3', label: 'อาวุธ Lv.3 (Oridecon)' },
  { value: 'weapon_lv4', label: 'อาวุธ Lv.4 (Oridecon)' },
  { value: 'weapon_lv5', label: 'อาวุธ Lv.5 (Etherdeocon)' },
  { value: 'armor_lv1', label: 'เกราะ Lv.1 (Elunium)' },
  { value: 'armor_lv2', label: 'เกราะ Lv.2 (Ethernium)' },
  { value: 'shadow_weapon', label: 'Shadow อาวุธ (Oridecon)' },
  { value: 'shadow_armor', label: 'Shadow เกราะ (Elunium)' },
]

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

export default function RefineSimulatorPage() {  usePageTitle('Refine Simulator')  // ── Settings ─────────────────────────────────────────────────────────────
  const [equipType, setEquipType] = useLocalStorage<string>('lro-refine-equipType', 'weapon_lv4')
  const [oreType, setOreType] = useLocalStorage<'normal' | 'enrichedHd'>('lro-refine-oreType', 'enrichedHd')
  const [startLevel, setStartLevel] = useLocalStorage('lro-refine-startLevel', 0)
  const [targetLevel, setTargetLevel] = useLocalStorage('lro-refine-targetLevel', 10)
  const [noBreak, setNoBreak] = useLocalStorage('lro-refine-noBreak', false)
  const [noLevelLoss, setNoLevelLoss] = useLocalStorage('lro-refine-noLevelLoss', false)
  const [useEventBsb, setUseEventBsb] = useLocalStorage('lro-refine-useEventBsb', false)

  // ── Simulation State ──────────────────────────────────────────────────────
  const [currentLevel, setCurrentLevel] = useState(0)
  const [attempts, setAttempts] = useState<SimAttempt[]>([])
  const [isBroken, setIsBroken] = useState(false)
  const [counter, setCounter] = useState(0)
  const [lastResult, setLastResult] = useState<'success' | 'fail' | 'break' | 'limit' | 'ether_pause' | null>(null)
  const [lastRunLimit, setLastRunLimit] = useState<number | null>(null)  /** pity bonus ที่สะสมไว้ต่อ level (key = fromLevel, value = % ที่สะสม) */
  const [pityByLevel, setPityByLevel] = useState<Record<number, number>>({})
  // ── Derived ───────────────────────────────────────────────────────────────
  const isEventType = isEventRefineType(equipType)
  const eventItem = isEventType ? getEventRefineItem(equipType) : undefined
  const rateData = !isEventType ? REFINE_RATES[equipType as RefineEquipType] : null
  const maxLevel = isEventType ? (eventItem?.maxLevel ?? 20) : rateData!.maxLevel
  const safetyLevel = isEventType ? (eventItem?.safetyLevel ?? 0) : rateData!.safetyLevel
  const isEtherType = equipType === 'weapon_lv5' || equipType === 'armor_lv2'
  const reachedTarget = currentLevel >= targetLevel
  const reachedMax = currentLevel >= maxLevel
  const canAttempt = !isBroken && !reachedTarget && !reachedMax

  const nextRate =
    canAttempt
      ? isEventType && eventItem
        ? getEffectiveEventRate(eventItem, currentLevel, pityByLevel[currentLevel] ?? 0)
        : isEventType
          ? null
          : (getRefineSuccessRate(equipType as RefineEquipType, currentLevel, oreType) ?? null)
      : null

  const [totalStats, setTotalStats] = useState({
    total: 0,
    successCount: 0,
    failCount: 0,
    breakCount: 0,
    totalBsb: 0,
    totalZeny: 0,
    oreBreakdown: {} as Record<string, number>,
  })

  const stats = {
    ...totalStats,
    rate:
      totalStats.total > 0
        ? ((totalStats.successCount / totalStats.total) * 100).toFixed(1)
        : '0.0',
  }

  const rateTableData = useMemo(() => {
    if (isEventType && eventItem) {
      return Array.from({ length: eventItem.maxLevel }, (_, i) => ({
        fromLevel: i,
        normalRate: eventItem.rates[i] ?? 0,
        enrichedRate: null as number | null,
        isSafe: i < eventItem.safetyLevel,
        bsbCost: null as number | null,
        oreCount: eventItem.oreCount(i),
        zenyCost: eventItem.zenyCost as number | null,
        pityCap: eventItem.pityCaps?.[i] ?? null,
      }))
    }
    return Array.from({ length: maxLevel }, (_, i) => ({
      fromLevel: i,
      normalRate: rateData!.normal[i] ?? 0,
      enrichedRate: rateData!.enrichedHd[i] ?? 0,
      isSafe: i < safetyLevel,
      bsbCost: BSB_COSTS[i] ?? null,
      oreCount: null as number | null,
      zenyCost: null as number | null,
      pityCap: null as number | null,
    }))
  }, [maxLevel, safetyLevel, rateData, isEventType, eventItem])

  const rollParams = {
    equipType,
    oreType,
    noBreak: isEventType ? true : noBreak,
    noLevelLoss: isEventType ? true : noLevelLoss,
    useEventBsb,
    pityStack: pityByLevel[currentLevel] ?? 0,
  }

  // ── Handlers ──────────────────────────────────────────────────────────────
  function handleSingleAttempt() {
    if (!canAttempt) return
    const result = rollOne(currentLevel, rollParams)
    // update pity bonus เมื่อล้มเหลว
    if (result.newPityStack !== undefined && !result.success) {
      setPityByLevel((prev) => ({ ...prev, [currentLevel]: result.newPityStack! }))
    }
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
    setTotalStats((prev) => ({
      total: prev.total + 1,
      successCount: prev.successCount + (result.success ? 1 : 0),
      failCount: prev.failCount + (result.success ? 0 : 1),
      breakCount: prev.breakCount + (result.broke ? 1 : 0),
      totalBsb: prev.totalBsb + result.bsbUsed,
      totalZeny: prev.totalZeny + (isEventType && eventItem ? eventItem.zenyCost : 0),
      oreBreakdown: {
        ...prev.oreBreakdown,
        [result.oreName]: (prev.oreBreakdown[result.oreName] ?? 0) + (isEventType && eventItem ? eventItem.oreCount(currentLevel) : 1),
      },
    }))
    if (result.broke) setIsBroken(true)
  }

  function handleBatchRun(maxIter: number) {
    if (!canAttempt) return
    let lvl = currentLevel
    // ติดตาม pity bonus แต่ละ level เพื่อใช้ใน batch
    const pityByLvl: Record<number, number> = { ...pityByLevel }
    // ether type ที่เริ่มต่ำกว่า +10: จะ pause อัตโนมัติเมื่อถึง +10
    const startedBelowEther =
      (equipType === 'weapon_lv5' || equipType === 'armor_lv2') &&
      lvl < 10 &&
      targetLevel > 10
    let broken = false
    let hitEtherThreshold = false
    let cnt = counter
    const newAttempts: SimAttempt[] = []

    while (lvl < targetLevel && !broken && newAttempts.length < maxIter) {
      // Pause ก่อนตี +10→+11: transition zone ของ ether type
      if (startedBelowEther && lvl >= 10) {
        hitEtherThreshold = true
        break
      }
      const result = rollOne(lvl, { ...rollParams, pityStack: pityByLvl[lvl] ?? 0 })
      // update pity bonus per level
      if (result.newPityStack !== undefined && !result.success) {
        pityByLvl[lvl] = result.newPityStack
      }
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

    const hitLimit = !broken && !hitEtherThreshold && lvl < targetLevel
    setCounter(cnt)
    setCurrentLevel(lvl)
    setPityByLevel(pityByLvl)
    setAttempts((prev) => [...[...newAttempts].reverse(), ...prev].slice(0, 500))
    setLastResult(
      broken ? 'break'
      : lvl >= targetLevel ? 'success'
      : hitEtherThreshold ? 'ether_pause'
      : hitLimit ? 'limit'
      : 'fail'
    )
    if (hitLimit) setLastRunLimit(maxIter)
    setTotalStats((prev) => {
      const updated = { ...prev, oreBreakdown: { ...prev.oreBreakdown } }
      for (const a of newAttempts) {
        updated.total++
        if (a.success) updated.successCount++
        else updated.failCount++
        if (a.broke) updated.breakCount++
        updated.totalBsb += a.bsbUsed
        updated.oreBreakdown[a.oreName] = (updated.oreBreakdown[a.oreName] ?? 0) + (isEventType && eventItem ? eventItem.oreCount(a.fromLevel) : 1)
      }
      updated.totalZeny += newAttempts.length * (isEventType && eventItem ? eventItem.zenyCost : 0)
      return updated
    })
    if (broken) setIsBroken(true)
  }

  function handleAutoRun() {
    handleBatchRun(5000)
  }

  function resetSim(resetHistory = false) {
    setCurrentLevel(startLevel)
    setIsBroken(false)
    setLastResult(null)
    setPityByLevel({})
    if (resetHistory) {
      setAttempts([])
      setCounter(0)
      setTotalStats({ total: 0, successCount: 0, failCount: 0, breakCount: 0, totalBsb: 0, totalZeny: 0, oreBreakdown: {} })
    }
  }

  function handleEquipTypeChange(val: string) {
    const newEventItem = getEventRefineItem(val)
    const newIsEvent = !!newEventItem
    const newIsEther = val === 'weapon_lv5' || val === 'armor_lv2'
    const newMax = newIsEvent
      ? (newEventItem?.maxLevel ?? 20)
      : REFINE_RATES[val as RefineEquipType].maxLevel
    setEquipType(val)
    setNoBreak(newIsEther)
    setPityByLevel({})
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
    setPityByLevel({})
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
                  {STANDARD_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                  {EVENT_REFINE_ITEMS.length > 0 && (
                    <>
                      <SelectItem value="__sep__" disabled className="text-xs text-muted-foreground/60 font-medium py-1">
                        ── Event Items ──
                      </SelectItem>
                      {EVENT_REFINE_ITEMS.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </>
                  )}
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
                {isEventType ? (
                  <div className="flex items-center gap-2 rounded-md bg-muted/30 border px-3 py-2">
                    <Sparkles className="size-3.5 text-yellow-400 shrink-0" />
                    <span className="text-xs text-yellow-300">
                      {eventItem ? (typeof eventItem.oreLabel === 'string' ? eventItem.oreLabel : eventItem.oreLabel(currentLevel)) : ''}
                    </span>
                  </div>
                ) : (
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
                )}
              </div>
              <div className="space-y-1.5">
                <div className="text-xs font-medium text-muted-foreground">การป้องกันเมื่อล้มเหลว</div>
                {isEventType ? (
                  <div className="flex items-center gap-2 rounded-md bg-green-500/10 border border-green-500/30 px-3 py-2">
                    <Shield className="size-3.5 text-green-400 shrink-0" />
                    <span className="text-xs text-green-400">ล้มเหลว = ไม่ลดขั้น + ไม่เสียหาย (อัตโนมัติ)</span>
                  </div>
                ) : (
                  <>
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
                        ไม่เสียหาย (No Break)
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
                      <button
                        onClick={() => setUseEventBsb(!useEventBsb)}
                        disabled={!noLevelLoss}
                        className={cn(
                          'flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors cursor-pointer select-none',
                          !noLevelLoss
                            ? 'opacity-30 cursor-not-allowed border-border text-muted-foreground'
                            : useEventBsb
                              ? 'border-pink-500 bg-pink-500/10 text-pink-400'
                              : 'border-border text-muted-foreground hover:border-muted-foreground',
                        )}
                      >
                        <Sparkles className="size-3.5" />
                        BSB กิจกรรม
                      </button>
                    </div>
                    <div className="min-h-[1rem] text-xs leading-relaxed">
                      {isEtherType && currentLevel < 10 && !noLevelLoss && (
                        <span className="text-sky-400/80">
                          {equipType === 'weapon_lv5' ? 'อาวุธ Lv.5' : 'เกราะ Lv.2'} (&lt;+10): ไม่เสียหายโดยอัตโนมัติ
                          {' '}— ธรรมดา −3 ขั้น · Enriched/HD −1 ขั้น
                        </span>
                      )}
                      {isEtherType && currentLevel >= 10 && !noBreak && !noLevelLoss && (
                        <span className="text-red-400/70">+10 ขึ้นไป = อาจติดได้ — เลือกป้องกันหากต้องการ</span>
                      )}
                      {!isEtherType && !noBreak && !noLevelLoss && (
                        <span className="text-red-400/70">ไม่เลือกป้องกัน = ไอเทมเสียหาย (หาย)</span>
                      )}
                      {!isEtherType && noBreak && !noLevelLoss && (
                        <span className="text-blue-400/70">ล้มเหลว = ลดลง 1 ขั้น (ไม่เสียหาย)</span>
                      )}
                      {isEtherType && noBreak && currentLevel >= 10 && !noLevelLoss && (
                        <span className="text-blue-400/70">ล้มเหลว = ลดลง 1 ขั้น (ไม่เสียหาย)</span>
                      )}
                      {noLevelLoss && (
                        <span className={useEventBsb ? 'text-pink-400/70' : 'text-amber-400/70'}>
                          BSB{useEventBsb ? ' กิจกรรม' : ''} จะถูกนับเฉพาะเมื่อ ≥+{safetyLevel} · มีข้อมูลถึง +13
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Current level */}
            <div className="flex flex-col items-center py-4 gap-2">
              {isBroken ? (
                <>
                  <div className="text-6xl">💥</div>
                  <div className="text-red-400 font-semibold text-lg">ไอเทมเสียหาย!</div>
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
                  {isEventType && eventItem?.pityPerFail && !reachedTarget && (pityByLevel[currentLevel] ?? 0) > 0 && (
                    <div className="text-xs text-purple-400">
                      (base {eventItem.rates[currentLevel]}% + {pityByLevel[currentLevel]} pity)
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
                      : lastResult === 'ether_pause'
                        ? 'border-sky-500/40 bg-sky-500/10 text-sky-400'
                        : lastResult === 'limit'
                          ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                          : 'border-orange-500/40 bg-orange-500/10 text-orange-400',
                )}
              >
                {lastResult === 'success'
                  ? '✓ Refine สำเร็จ!'
                  : lastResult === 'break'
                    ? '✕ ไอเทมเสียหาย!'
                    : lastResult === 'ether_pause'
                      ? '⏸ ถึง +10 แล้ว — กลไกเปลี่ยน เปิด BSB หากต้องการก่อนตีต่อ'
                      : lastResult === 'limit'
                        ? `⏸ ครบ ${(lastRunLimit ?? 0).toLocaleString()} ครั้ง — กดต่อเพื่อดำเนินการต่อ`
                        : '✕ Refine ล้มเหลว'}
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              <Button onClick={handleSingleAttempt} disabled={!canAttempt} size="sm" className="gap-1.5">
                <StepForward className="size-3.5" />
                ×1
              </Button>
              <Button onClick={() => handleBatchRun(10)} disabled={!canAttempt} size="sm" variant="outline" className="gap-1.5">
                ×10
              </Button>
              <Button onClick={() => handleBatchRun(50)} disabled={!canAttempt} size="sm" variant="outline" className="gap-1.5">
                ×50
              </Button>
            </div>
            <Button
              onClick={handleAutoRun}
              disabled={!canAttempt}
              variant="secondary"
              className="w-full gap-2"
            >
              <Play className="size-4" />
              ตีจนถึง +{targetLevel}
            </Button>

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
                label="เสียหาย (หาย)"
                value={stats.breakCount.toLocaleString()}
                color={stats.breakCount > 0 ? 'red' : undefined}
              />
              <StatTile
                label="BSB ที่ใช้"
                value={stats.totalBsb.toLocaleString()}
                color={stats.totalBsb > 0 ? 'amber' : undefined}
              />
              <div className="col-span-2">
                <StatTile
                  label="Zeny ที่ใช้"
                  value={`${stats.totalZeny.toLocaleString()} Z`}
                  color={stats.totalZeny > 0 ? 'amber' : undefined}
                />
              </div>
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
                    {isEventType ? 'อัตราสำเร็จ' : 'แร่ธรรมดา'}
                  </th>
                  {isEventType && !!eventItem?.pityPerFail && (
                    <th className="px-3 py-2 text-center text-xs font-medium text-purple-400">
                      สูงสุด (Pity)
                    </th>
                  )}
                  {!isEventType && (
                    <th className="px-3 py-2 text-center text-xs font-medium text-muted-foreground">
                      Enriched / HD
                    </th>
                  )}
                  {!isEventType && (
                    <th className="px-3 py-2 text-center text-xs font-medium text-muted-foreground">
                      BSB ต่อครั้ง{useEventBsb && <span className="ml-1 text-pink-400">♦กิจกรรม</span>}
                    </th>
                  )}
                  {isEventType && (
                    <th className="px-3 py-2 text-center text-xs font-medium text-muted-foreground">
                      Zeny/ครั้ง
                    </th>
                  )}
                  <th className="px-3 py-2 text-center text-xs font-medium text-muted-foreground">
                    {isEventType ? 'เหล็กไหล / ครั้ง' : 'แร่ที่ใช้'}
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
                    {isEventType && !!eventItem?.pityPerFail && (
                      <td className="px-3 py-1.5 text-center tabular-nums">
                        {row.pityCap !== null ? (
                          <span className="text-purple-400 font-medium">{row.pityCap}%</span>
                        ) : (
                          <span className="text-muted-foreground/40">—</span>
                        )}
                      </td>
                    )}
                    {!isEventType && (
                      <td
                        className={cn(
                          'px-3 py-1.5 text-center tabular-nums',
                          (row.enrichedRate ?? 0) === 100
                            ? 'text-green-400'
                            : (row.enrichedRate ?? 0) < 20
                              ? 'text-red-400'
                              : 'text-yellow-400',
                        )}
                      >
                        {row.enrichedRate}%
                      </td>
                    )}
                    {!isEventType && (
                      <td className="px-3 py-1.5 text-center text-xs tabular-nums">
                        {row.bsbCost !== null ? (
                          useEventBsb ? (
                            <span className="flex flex-col items-center leading-tight gap-0.5">
                              <span className="text-muted-foreground/40 line-through">{row.bsbCost}</span>
                              <span className="text-pink-400 font-medium">{BSB_EVENT_COSTS[row.fromLevel] ?? row.bsbCost}</span>
                            </span>
                          ) : (
                            <span className="text-amber-400 font-medium">{row.bsbCost}</span>
                          )
                        ) : row.fromLevel >= safetyLevel ? (
                          <span className="text-muted-foreground/40">?</span>
                        ) : (
                          <span className="text-muted-foreground/40">—</span>
                        )}
                      </td>
                    )}
                    {isEventType && (
                      <td className="px-3 py-1.5 text-center text-xs tabular-nums whitespace-nowrap">
                        <span className="text-amber-300 font-medium">{row.zenyCost?.toLocaleString()}</span>
                      </td>
                    )}
                    <td className="px-3 py-1.5 text-center text-xs text-muted-foreground whitespace-nowrap">
                      {isEventType
                        ? <span className="tabular-nums text-yellow-300 font-medium">{row.oreCount}</span>
                        : getOreName(equipType, row.fromLevel, 'normal')
                      }
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
