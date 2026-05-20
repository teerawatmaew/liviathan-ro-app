import { Link, useRouteError, isRouteErrorResponse } from 'react-router-dom'
import { House, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PATHS } from '@/routes/paths'

export default function ErrorPage() {
  const error = useRouteError()

  let message = 'เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง'

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      // Redirect to NotFoundPage via wildcard route handles this,
      // but keep as fallback
      message = 'ไม่พบหน้าที่คุณต้องการ'
    } else {
      message = `${error.status} — ${error.statusText}`
    }
  } else if (error instanceof Error) {
    message = error.message
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-6 text-center bg-background">
      <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
        <TriangleAlert className="size-8 text-destructive" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">เกิดข้อผิดพลาด</h1>
        <p className="text-muted-foreground max-w-sm mx-auto">{message}</p>
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
