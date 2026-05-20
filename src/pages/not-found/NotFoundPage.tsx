import { Link } from 'react-router-dom'
import { House, MapPinOff } from 'lucide-react'
import { usePageTitle } from '@/hooks/use-page-title'
import { Button } from '@/components/ui/button'
import { PATHS } from '@/routes/paths'

export default function NotFoundPage() {
  usePageTitle('404 — ไม่พบหน้านี้')
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
        <MapPinOff className="size-8 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground tracking-widest uppercase">404</p>
        <h1 className="text-3xl font-bold tracking-tight">ไม่พบหน้านี้</h1>
        <p className="text-muted-foreground max-w-sm mx-auto">
          URL ที่คุณเข้าถึงไม่มีอยู่ในระบบ หรืออาจถูกย้ายไปแล้ว
        </p>
      </div>
      <Button asChild>
        <Link to={PATHS.HOME}>
          <House className="size-4" />
          กลับหน้าหลัก
        </Link>
      </Button>
    </div>
  )
}
