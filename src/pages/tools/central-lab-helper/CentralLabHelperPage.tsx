import { Separator } from '@/components/ui/separator'
import BossLookup from '@/features/centrallab/BossLookup'
import { usePageTitle } from '@/hooks/use-page-title'
import SwitchDecoder from './SwitchDecoder'
import PhaseTimers from './PhaseTimers'

export default function CentralLabHelperPage() {
  usePageTitle('Central Lab Helper')
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Central Lab Helper</h1>
        <p className="text-muted-foreground text-sm mt-1">เครื่องมือช่วยเล่น Central Lab</p>
      </div>

      <SwitchDecoder />

      <Separator />

      <PhaseTimers />

      <Separator />

      <BossLookup />
    </div>
  )
}
