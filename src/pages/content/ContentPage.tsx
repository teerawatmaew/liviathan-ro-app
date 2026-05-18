import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ArticleCard } from '@/features/content/ArticleCard'
import { articles, categoryLabel } from '@/features/content/data'
import type { ArticleCategory } from '@/types'

const categories: ArticleCategory[] = ['guide', 'news', 'update', 'showcase']

export default function ContentPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<ArticleCategory | 'all'>('all')

  const filtered = articles.filter((a) => {
    const matchSearch =
      search === '' ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase())
    const matchCategory = activeCategory === 'all' || a.category === activeCategory
    return matchSearch && matchCategory
  })

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">บทความ / คู่มือ</h1>
        <p className="text-sm text-muted-foreground mt-1">
          รวมคู่มือ, Skill Build และข้อมูลเกมทั้งหมด
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="ค้นหาบทความ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge
            variant={activeCategory === 'all' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setActiveCategory('all')}
          >
            ทั้งหมด
          </Badge>
          {categories.map((cat) => (
            <Badge
              key={cat}
              variant={activeCategory === cat ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setActiveCategory(cat)}
            >
              {categoryLabel[cat]}
            </Badge>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          ไม่พบบทความที่ตรงกับการค้นหา
        </div>
      )}
    </div>
  )
}
