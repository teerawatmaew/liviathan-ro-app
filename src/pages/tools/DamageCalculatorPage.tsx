import { Swords } from 'lucide-react'

export default function DamageCalculatorPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold">คำนวณ Damage</h1>
        <p className="text-sm text-muted-foreground mt-1">
          คำนวณ Physical / Magical Damage ต่อ Monster
        </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-muted-foreground border-2 border-dashed rounded-xl">
        <Swords className="size-10 opacity-30" />
        <p className="text-sm">Coming soon — กำลังพัฒนา</p>
      </div>
    </div>
  )
}
