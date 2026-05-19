import CountdownTimer from '@/features/centrallab/CountdownTimer'

export default function PhaseTimers() {
  return (
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
  )
}
