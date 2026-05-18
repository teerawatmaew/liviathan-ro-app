import { Link } from 'react-router-dom'
import { Calendar, Tag } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { categoryLabel } from './data'
import { PATHS } from '@/routes/paths'
import type { Article } from '@/types'

interface ArticleCardProps {
  article: Article
}

export function ArticleCard({ article }: ArticleCardProps) {
  const detailPath = PATHS.CONTENT_DETAIL.replace(':slug', article.slug)

  return (
    <Card className="flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      {article.thumbnail && (
        <div className="aspect-video overflow-hidden bg-muted">
          <img
            src={article.thumbnail}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      {!article.thumbnail && (
        <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
          <span className="text-3xl opacity-20">⚔️</span>
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="secondary" className="text-xs">
            {categoryLabel[article.category]}
          </Badge>
        </div>
        <CardTitle className="text-base leading-snug line-clamp-2">
          <Link to={detailPath} className="hover:text-primary transition-colors">
            {article.title}
          </Link>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 text-sm text-muted-foreground line-clamp-3">
        {article.excerpt}
      </CardContent>

      <CardFooter className="pt-0 flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="size-3" />
          {article.publishedAt}
        </span>
        {article.tags.length > 0 && (
          <span className="flex items-center gap-1">
            <Tag className="size-3" />
            {article.tags.slice(0, 2).join(', ')}
          </span>
        )}
      </CardFooter>
    </Card>
  )
}
