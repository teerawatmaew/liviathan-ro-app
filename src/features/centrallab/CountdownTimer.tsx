import { useState, useEffect, useRef, useCallback } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function playBeep() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
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

export default function CountdownTimer({ label, initialSeconds }: Props) {
  const [remaining, setRemaining] = useState(initialSeconds)
  const [running, setRunning] = useState(false)
  const [expired, setExpired] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!running) {
      stop()
      return
    }
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          stop()
          setRunning(false)
          setExpired(true)
          playBeep()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return stop
  }, [running, stop])

  function handleToggle() {
    if (expired) return
    setRunning((r) => !r)
  }

  function handleReset() {
    stop()
    setRunning(false)
    setExpired(false)
    setRemaining(initialSeconds)
  }

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0')
  const ss = String(remaining % 60).padStart(2, '0')

  return (
    <Card className={expired ? 'border-destructive animate-pulse' : ''}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Countdown display */}
        <div
          className={`text-5xl font-mono font-bold text-center tabular-nums ${
            expired ? 'text-destructive' : ''
          }`}
        >
          {mm}:{ss}
        </div>

        {expired && (
          <p className="text-center text-xs font-semibold text-destructive">
            หมดเวลา!
          </p>
        )}

        {/* Controls */}
        <div className="flex justify-center gap-2">
          <Button
            size="sm"
            variant={running ? 'outline' : 'default'}
            onClick={handleToggle}
            disabled={expired}
          >
            {running ? (
              <><Pause className="size-3.5" /> หยุด</>
            ) : (
              <><Play className="size-3.5" /> เริ่ม</>
            )}
          </Button>
          <Button size="sm" variant="ghost" onClick={handleReset}>
            <RotateCcw className="size-3.5" />
            รีเซ็ต
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
