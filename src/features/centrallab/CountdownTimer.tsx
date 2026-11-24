import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

let audioCtx: AudioContext | null = null

function playBeep() {
  try {
    audioCtx ??= new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const ctx = audioCtx
    void ctx.resume()
    const beep = (startTime: number) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.value = 880
      gain.gain.setValueAtTime(0.4, startTime)
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35)
      osc.start(startTime)
      osc.stop(startTime + 0.35)
    }
    beep(ctx.currentTime)
    beep(ctx.currentTime + 0.45)
    beep(ctx.currentTime + 0.9)
  } catch {
    // AudioContext not available
  }
}

interface Props {
  label: string
  initialSeconds: number
}

/**
 * นับถอยหลังจากเวลาสิ้นสุดจริง (Date.now) แทนการลบทีละ 1 วินาที
 * เพื่อไม่ให้เวลาเพี้ยนเมื่อแท็บอยู่เบื้องหลัง (browser throttle setInterval)
 */
export default function CountdownTimer({ label, initialSeconds }: Props) {
  const [remaining, setRemaining] = useState(initialSeconds)
  const [running, setRunning] = useState(false)
  const endAtRef = useRef(0)

  const expired = remaining === 0

  useEffect(() => {
    if (!running) return
    const tick = () => {
      const left = Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000))
      setRemaining(left)
      if (left === 0) {
        setRunning(false)
        playBeep()
      }
    }
    const id = setInterval(tick, 250)
    return () => clearInterval(id)
  }, [running])

  function handleToggle() {
    if (expired) return
    if (!running) endAtRef.current = Date.now() + remaining * 1000
    setRunning((r) => !r)
  }

  function handleReset() {
    setRunning(false)
    setRemaining(initialSeconds)
  }

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0')
  const ss = String(remaining % 60).padStart(2, '0')
  const pct = (remaining / initialSeconds) * 100

  return (
    <Card className={cn('gap-2 py-3 sm:gap-4 sm:py-4', expired && 'ring-2 ring-destructive animate-pulse')}>
      <CardHeader className="px-2 sm:px-4">
        <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground text-center sm:text-left">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 sm:px-4 space-y-2 sm:space-y-4">
        <div
          className={cn(
            'text-2xl sm:text-5xl font-mono font-bold text-center tabular-nums',
            expired && 'text-destructive',
          )}
          role="timer"
          aria-live="off"
        >
          {mm}:{ss}
        </div>

        <div className="h-1 rounded-full bg-muted overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-[width] duration-300', expired ? 'bg-destructive' : 'bg-primary')}
            style={{ width: `${pct}%` }}
          />
        </div>

        {expired && (
          <p className="text-center text-xs font-semibold text-destructive" role="alert">
            หมดเวลา!
          </p>
        )}

        <div className="flex justify-center gap-1 sm:gap-2">
          <Button
            size="sm"
            variant={running ? 'outline' : 'default'}
            onClick={handleToggle}
            disabled={expired}
            aria-label={running ? `หยุด ${label}` : `เริ่ม ${label}`}
          >
            {running ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
            <span className="hidden sm:inline">{running ? 'หยุด' : 'เริ่ม'}</span>
          </Button>
          <Button size="sm" variant="ghost" onClick={handleReset} aria-label={`รีเซ็ต ${label}`}>
            <RotateCcw className="size-3.5" />
            <span className="hidden sm:inline">รีเซ็ต</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
