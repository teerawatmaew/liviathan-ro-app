import { Sparkles } from 'lucide-react'
import { usePageTitle } from '@/hooks/use-page-title'

export default function ComingSoonPage() {
  usePageTitle('Coming Soon')
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
        <Sparkles className="size-8 text-primary" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Coming Soon</h1>
        <p className="text-muted-foreground max-w-sm mx-auto">
          ฟีเจอร์นี้กำลังอยู่ในระหว่างการพัฒนา โปรดติดตามการอัพเดทในเร็ว ๆ นี้
        </p>
      </div>
    </div>
  )
}
