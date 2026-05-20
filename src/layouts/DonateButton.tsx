import { useState } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default function DonateButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="gap-1.5 text-xs border-pink-500/40 text-pink-400 hover:bg-pink-500/10 hover:text-pink-300 hover:border-pink-400"
        onClick={() => setOpen(true)}
      >
        <Heart className="size-3.5 fill-pink-500 text-pink-500" />
        สนับสนุนผู้พัฒนา
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle className="text-center">สนับสนุนผู้พัฒนา</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-2">
            <p className="text-sm text-muted-foreground text-center">
              สนับสนุนค่าชาไทยได้ทางนี้นะครับ ☕
            </p>
            <div className="rounded-xl overflow-hidden border">
              <img
                src="/images/slip/Slip-make.jpg"
                alt="QR Code สนับสนุนผู้พัฒนา"
                className="w-full max-w-[240px] block"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
