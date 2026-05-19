import { Link } from 'react-router-dom'
import { BookOpen, Calculator, Image, ArrowRight, Swords, ToggleLeft, Gem, Puzzle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { PATHS } from '@/routes/paths'
import { articles } from '@/features/content/data'
import { ArticleCard } from '@/features/content/ArticleCard'

const toolLinks = [
  {
    title: 'คำนวณ Stat',
    description: 'HP, SP, ATK, MATK, HIT, FLEE, DEF, MDEF จาก Stat + Job + Level',
    icon: Calculator,
    url: PATHS.TOOLS_STAT,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    title: 'คำนวณ Damage',
    description: 'คำนวณ Damage สำหรับการโจมตีแบบต่าง ๆ',
    icon: Swords,
    url: PATHS.TOOLS_DAMAGE,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
  },
  {
    title: 'Central Lab Helper',
    description: 'แปลงเลข Switch + Boss Lookup + Countdown Timer',
    icon: ToggleLeft,
    url: PATHS.TOOLS_CENTRAL_LAB,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    title: 'Item Cost Calculator',
    description: 'คำนวณ Zeny และวัตถุดิบสำหรับการ Enhancement',
    icon: Gem,
    url: PATHS.TOOLS_ITEM_COST,
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
  },
  {
    title: 'MP Jigsaw Calculator',
    description: 'คำนวณจำนวน Jigsaw ที่ได้จาก Mystical Pass',
    icon: Puzzle,
    url: PATHS.TOOLS_MP_JIGSAW,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
]

const contentLinks = [
  {
    title: 'บทความ / คู่มือ',
    description: 'คู่มือ Job, Skill Build, การแจก Stat และอื่น ๆ',
    icon: BookOpen,
    url: PATHS.CONTENT,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
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
        <h1 className="text-4xl font-bold tracking-tight">LiviathaN RO</h1>
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

      {/* Tools */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">เครื่องมือ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {toolLinks.map((item) => (
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

      <Separator />

      {/* Content & Gallery */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">คอนเทนต์</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {contentLinks.map((item) => (
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

      <Separator />

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

