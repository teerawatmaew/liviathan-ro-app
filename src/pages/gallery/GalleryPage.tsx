import { useState } from 'react'
import { GalleryGrid } from '@/features/gallery/GalleryGrid'
import type { GalleryItem } from '@/types'

const initialGallery: GalleryItem[] = [
  {
    id: '1',
    url: 'https://placehold.co/400x400/7c3aed/ffffff?text=Screenshot+1',
    name: 'screenshot-1.png',
    caption: 'Screenshot ตัวอย่าง',
    category: 'screenshot',
  },
  {
    id: '2',
    url: 'https://placehold.co/400x400/059669/ffffff?text=Screenshot+2',
    name: 'screenshot-2.png',
    caption: 'Screenshot ตัวอย่าง 2',
    category: 'screenshot',
  },
  {
    id: '3',
    url: 'https://placehold.co/400x400/dc2626/ffffff?text=Fan+Art',
    name: 'fanart-1.png',
    caption: 'Fan Art',
    category: 'fanart',
  },
]

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>(initialGallery)

  function handleAdd(newItems: GalleryItem[]) {
    setItems((prev) => [...prev, ...newItems])
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">แกลเลอรี่</h1>
        <p className="text-sm text-muted-foreground mt-1">
          รูปภาพ Screenshot, Fan Art และอื่น ๆ — อัปโหลดรูปของคุณได้เลย
        </p>
      </div>

      <GalleryGrid items={items} onAdd={handleAdd} allowUpload />
    </div>
  )
}
