import { useState, useMemo, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { centralLabBosses } from './data/bosses'
import { getBestAttackerElements } from './data/elements'
import type { Boss, ElementType, StageType } from './types'

// ─── Element badge colours ──────────────────────────────────────────────────

const elementCls: Record<ElementType, string> = {
  Neutral: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600',
  Water:   'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/60 dark:text-blue-300 dark:border-blue-700',
  Earth:   'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/60 dark:text-amber-300 dark:border-amber-700',
  Fire:    'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/60 dark:text-red-300 dark:border-red-700',
  Wind:    'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/60 dark:text-green-300 dark:border-green-700',
  Poison:  'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/60 dark:text-purple-300 dark:border-purple-700',
  Holy:    'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/60 dark:text-yellow-200 dark:border-yellow-700',
  Shadow:  'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-900/60 dark:text-indigo-300 dark:border-indigo-700',
  Ghost:   'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
  Undead:  'bg-zinc-200 text-zinc-800 border-zinc-400 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-700',
}

function pctCls(pct: number) {
  if (pct === 0)   return 'text-red-500 font-bold'
  if (pct >= 200)  return 'text-green-600 font-bold'
  if (pct >= 150)  return 'text-green-500 font-semibold'
  if (pct < 100)   return 'text-orange-500'
  return 'text-muted-foreground'
}

function ElementTag({ element, pct }: { element: ElementType; pct?: number }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5
        text-[11px] font-medium ${elementCls[element]}`}
    >
      {element}
      {pct !== undefined && (
        <span className={`text-[10px] ${pctCls(pct)}`}>{pct}%</span>
      )}
    </span>
  )
}

function MutedTag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded border px-1.5 py-0.5 text-[11px] text-muted-foreground bg-muted/40">
      {label}
    </span>
  )
}

// ─── Stage filter ───────────────────────────────────────────────────────────

type Filter = 'all' | StageType
const FILTERS: Filter[] = ['all', 'mini', 1, 2, 3]
const filterLabel: Record<string, string> = {
  all: 'ทั้งหมด',
  mini: 'Mini',
  '1': 'Stage 1',
  '2': 'Stage 2',
  '3': 'Stage 3',
}

// ─── Boss card ───────────────────────────────────────────────────────────────

function BossCard({ boss }: { boss: Boss }) {
  const allSorted = getBestAttackerElements(boss.element, boss.elementLevel)
  const effective = allSorted.filter(([, p]) => p > 100)
  const immune    = allSorted.filter(([, p]) => p === 0)
  const reduced   = allSorted.filter(([, p]) => p > 0 && p < 100)

  return (
    <Card>
      <CardHeader className="px-4 pt-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-semibold leading-snug">{boss.name}</CardTitle>
          <MutedTag label={boss.stage === 'mini' ? 'Mini' : `Stage ${boss.stage}`} />
        </div>
        <div className="flex flex-wrap gap-1 mt-1.5">
          <ElementTag element={boss.element} />
          <MutedTag label={`Lv.${boss.elementLevel}`} />
          <MutedTag label={boss.race} />
          <MutedTag label={boss.size} />
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-2.5">
        {effective.length > 0 ? (
          <div>
            <p className="text-[11px] text-muted-foreground font-medium mb-1">✅ ธาตุได้เปรียบ</p>
            <div className="flex flex-wrap gap-1">
              {effective.map(([elem, p]) => <ElementTag key={elem} element={elem} pct={p} />)}
            </div>
          </div>
        ) : (
          <p className="text-[11px] text-muted-foreground italic">ไม่มีธาตุได้เปรียบพิเศษ</p>
        )}

        {reduced.length > 0 && (
          <div>
            <p className="text-[11px] text-muted-foreground font-medium mb-1">⚡ ลดความเสียหาย</p>
            <div className="flex flex-wrap gap-1">
              {reduced.map(([elem, p]) => <ElementTag key={elem} element={elem} pct={p} />)}
            </div>
          </div>
        )}

        {immune.length > 0 && (
          <div>
            <p className="text-[11px] text-muted-foreground font-medium mb-1">🛡️ ภูมิคุ้มกัน (0%)</p>
            <div className="flex flex-wrap gap-1">
              {immune.map(([elem]) => <ElementTag key={elem} element={elem} pct={0} />)}
            </div>
          </div>
        )}

        {boss.notes && (
          <p className="text-[11px] text-muted-foreground border-t pt-2 mt-1">⚠️ {boss.notes}</p>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function BossLookup() {
  const [query, setQuery]       = useState('')
  const [open, setOpen]         = useState(false)
  const [selected, setSelected] = useState<Boss | null>(null)
  const [stageFilter, setStageFilter] = useState<Filter>('all')
  const [activeIndex, setActiveIndex] = useState(0)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const stageBosses = useMemo(
    () => centralLabBosses.filter((boss) => stageFilter === 'all' || boss.stage === stageFilter),
    [stageFilter],
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  const suggestions = useMemo(() => {
    if (!query.trim()) return []
    const q = query.trim().toLowerCase()
    return stageBosses.filter((boss) => boss.name.toLowerCase().includes(q)).slice(0, 10)
  }, [query, stageBosses])

  function handleSelect(boss: Boss) {
    setSelected(boss)
    setQuery(boss.name)
    setOpen(false)
  }

  function handleClear() {
    setQuery('')
    setSelected(null)
    setOpen(false)
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value)
    setSelected(null)
    setOpen(true)
    setActiveIndex(0)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      handleSelect(suggestions[Math.min(activeIndex, suggestions.length - 1)])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const stageCls = (f: Filter) => stageFilter === f
    ? 'bg-primary text-primary-foreground border-primary'
    : 'bg-background border-border text-foreground hover:bg-accent'

  return (
    <div>
      <h2 className="text-lg font-semibold mb-1">ค้นหาบอส</h2>
      <p className="text-muted-foreground text-sm mb-4">
        พิมพ์ชื่อบอส หรือเลือก Stage แล้วกดชื่อบอส เพื่อดูธาตุ, race และธาตุที่ได้เปรียบ
      </p>

      {/* ─── Stage filter ───────────────────────────────────────────── */}
      <div className="flex gap-1 flex-wrap mb-3">
        {FILTERS.map((f) => (
          <button
            key={String(f)}
            type="button"
            className={`rounded-md border px-3 py-1 text-xs font-medium transition-colors ${stageCls(f)}`}
            onClick={() => { setStageFilter(f); setSelected(null); setQuery('') }}
          >
            {filterLabel[String(f)]}
          </button>
        ))}
      </div>

      {/* ─── Combobox ───────────────────────────────────────────────── */}
      <div ref={wrapperRef} className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground pointer-events-none z-10" />
        <Input
          placeholder="พิมพ์ชื่อบอส..."
          className="pl-8 pr-8"
          value={query}
          onChange={handleInputChange}
          onFocus={() => { if (query.trim()) setOpen(true) }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          role="combobox"
          aria-expanded={open && suggestions.length > 0}
          aria-label="ค้นหาบอส"
        />
        {query && (
          <button
            type="button"
            className="absolute right-2 top-2 p-0.5 text-muted-foreground hover:text-foreground"
            onClick={handleClear}
            aria-label="ล้างการค้นหา"
          >
            <X className="size-4" />
          </button>
        )}

        {/* Dropdown */}
        {open && suggestions.length > 0 && (
          <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md overflow-hidden">
            {suggestions.map((boss, i) => (
              <button
                key={boss.id}
                type="button"
                className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-sm
                  hover:bg-accent hover:text-accent-foreground text-left
                  ${i === activeIndex ? 'bg-accent text-accent-foreground' : ''}`}
                onPointerEnter={() => setActiveIndex(i)}
                onPointerDown={(e) => { e.preventDefault(); handleSelect(boss) }}
              >
                <span>{boss.name}</span>
                <span className="text-[11px] text-muted-foreground shrink-0">
                  {boss.stage === 'mini' ? 'Mini' : `Stage ${boss.stage}`}
                </span>
              </button>
            ))}
          </div>
        )}

        {open && query.trim() && suggestions.length === 0 && (
          <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover px-3 py-3 text-sm text-muted-foreground shadow-md">
            ไม่พบบอสที่ค้นหา
          </div>
        )}
      </div>

      {/* ─── Browse by stage (ยังไม่ได้พิมพ์) ───────────────────────── */}
      {!query.trim() && (
        <div className="mt-4">
          <p className="text-xs text-muted-foreground mb-2">
            {filterLabel[String(stageFilter)]} · {stageBosses.length} ตัว — กดเพื่อดูข้อมูล
          </p>
          <div className="flex flex-wrap gap-1.5">
            {stageBosses.map((boss) => (
              <button
                key={boss.id}
                type="button"
                onClick={() => handleSelect(boss)}
                className="inline-flex items-center gap-1.5 rounded-md border bg-background px-2 py-1 text-xs hover:bg-accent transition-colors"
              >
                <span className={`size-2 rounded-full border ${elementCls[boss.element]}`} />
                {boss.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── Selected boss card ─────────────────────────────────────── */}
      {selected && (
        <div className="mt-5 max-w-sm">
          <BossCard boss={selected} />
        </div>
      )}
    </div>
  )
}
