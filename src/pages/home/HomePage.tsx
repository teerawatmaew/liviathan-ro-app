import { Link } from 'react-router-dom'
import { BookOpen, Calculator, Image, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PATHS } from '@/routes/paths'
import { articles } from '@/features/content/data'
import { ArticleCard } from '@/features/content/ArticleCard'

const quickLinks = [
  {
    title: 'บทความ / คู่มือ',
    description: 'คู่มือ Job, Skill Build, การแจก Stat และอื่น ๆ',
    icon: BookOpen,
    url: PATHS.CONTENT,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    title: 'เครื่องมือคำนวณ',
    description: 'คำนวณ Stat, HP/SP, ATK, MATK และ Damage',
    icon: Calculator,
    url: PATHS.TOOLS_STAT,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    title: 'แกลเลอรี่',
    description: 'รูปภาพ Screenshot, Fan Art และอื่น ๆ',
    icon: Image,
    url: PATHS.GALLERY,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
]

export default function HomePage() {
  const recentArticles = articles.slice(0, 3)

  return (
    <div className="space-y-10 p-6 max-w-5xl mx-auto">
      {/* Hero */}
      <section className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border px-8 py-12 text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Liviatha<span className="text-primary">N</span> RO
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          รวมคู่มือ เครื่องมือคำนวณ และแกลเลอรี่ สำหรับ Ragnarok Online
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Button asChild>
            <Link to={PATHS.CONTENT}>
              อ่านคู่มือ <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to={PATHS.TOOLS_STAT}>ลองคำนวณ Stat</Link>
          </Button>
        </div>
      </section>

      {/* Quick links */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">เมนูหลัก</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickLinks.map((item) => (
            <Link key={item.url} to={item.url} className="group">
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center mb-1`}>
                    <item.icon className={`size-5 ${item.color}`} />
                  </div>
                  <CardTitle className="text-base group-hover:text-primary transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {item.description}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent articles */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">บทความล่าสุด</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to={PATHS.CONTENT}>
              ดูทั้งหมด <ArrowRight className="ml-1 size-3" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {recentArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </div>
  )
}

