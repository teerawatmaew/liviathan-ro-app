import { useState, useCallback } from 'react'
import { Upload, X, ZoomIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { GalleryItem } from '@/types'

interface GalleryGridProps {
  items: GalleryItem[]
  onAdd?: (items: GalleryItem[]) => void
  allowUpload?: boolean
}

export function GalleryGrid({ items, onAdd, allowUpload = false }: GalleryGridProps) {
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null)

  const handleFiles = useCallback(
    (files: FileList) => {
      if (!onAdd) return
      const newItems: GalleryItem[] = []
      Array.from(files).forEach((file) => {
        if (!file.type.startsWith('image/')) return
        const url = URL.createObjectURL(file)
        newItems.push({ id: crypto.randomUUID(), url, name: file.name })
      })
      if (newItems.length > 0) onAdd(newItems)
    },
    [onAdd],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles],
  )

  return (
    <div className="space-y-4">
      {allowUpload && (
        <label
          className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl p-8 cursor-pointer hover:bg-muted/50 transition-colors"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          <Upload className="size-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground text-center">
            ลากวางรูปภาพที่นี่ หรือ{' '}
            <span className="text-primary font-medium">คลิกเพื่อเลือก</span>
          </p>
        </label>
      )}

      {items.length === 0 && !allowUpload && (
        <p className="text-center text-sm text-muted-foreground py-12">
          ยังไม่มีรูปภาพ
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer"
            onClick={() => setLightbox(item)}
          >
            <img
              src={item.url}
              alt={item.caption ?? item.name}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <ZoomIn className="size-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {item.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1 text-xs text-white truncate">
                {item.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={() => setLightbox(null)}
          >
            <X className="size-5" />
          </Button>
          <img
            src={lightbox.url}
            alt={lightbox.caption ?? lightbox.name}
            className="max-w-full max-h-[90vh] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {lightbox.caption && (
            <p className="absolute bottom-6 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
              {lightbox.caption}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
