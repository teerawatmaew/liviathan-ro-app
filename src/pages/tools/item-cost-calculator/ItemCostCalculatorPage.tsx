import { useLocalStorage } from '@/hooks/use-local-storage'
import { FlaskConical, Layers } from 'lucide-react'
import { usePageTitle } from '@/hooks/use-page-title'
import { Separator } from '@/components/ui/separator'
import ReformSection from './ReformSection'
import GradeSection from './GradeSection'

export default function ItemCostCalculatorPage() {
  usePageTitle('Enhancement Cost')
  const [section, setSection] = useLocalStorage<'reform' | 'grade'>('lro-item-section', 'reform')

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Enhancement Cost</h1>
        <p className="text-sm text-muted-foreground mt-1">
          คำนวณค่าใช้จ่ายในการทำ Enhancement
        </p>
      </div>

      <div className="flex gap-1 p-1 rounded-lg bg-muted w-fit">
        <button
          type="button"
          onClick={() => setSection('reform')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            section === 'reform'
              ? 'bg-background shadow text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <FlaskConical className="size-4" />
          Reform &amp; Craft
        </button>
        <button
          type="button"
          onClick={() => setSection('grade')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            section === 'grade'
              ? 'bg-background shadow text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Layers className="size-4" />
          Grade Item
        </button>
      </div>

      <Separator />

      {section === 'reform' && <ReformSection />}
      {section === 'grade' && <GradeSection />}
    </div>
  )
}