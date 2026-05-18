// Shared application-wide TypeScript types

export interface NavItem {
  title: string
  url: string
  icon?: React.ComponentType<{ className?: string }>
  children?: NavItem[]
}

// ─── Content ────────────────────────────────────────────────────────────────

export type ArticleCategory = 'guide' | 'news' | 'update' | 'showcase'

export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: ArticleCategory
  tags: string[]
  thumbnail?: string
  images?: string[]
  publishedAt: string
  author?: string
}

// ─── Gallery ────────────────────────────────────────────────────────────────

export interface GalleryItem {
  id: string
  url: string
  name: string
  caption?: string
  category?: string
}

// ─── Calculator ─────────────────────────────────────────────────────────────

export interface StatSet {
  str: number
  agi: number
  vit: number
  int: number
  dex: number
  luk: number
}

export interface JobClass {
  id: string
  name: string
  hpModifier: number
  spModifier: number
}
