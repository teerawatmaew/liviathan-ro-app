import { lazy, Suspense } from 'react'
import { PageLoader } from '@/components/ui/page-loader'

export const HomePage               = lazy(() => import('@/pages/home/HomePage'))
export const ContentPage            = lazy(() => import('@/pages/content/ContentPage'))
export const GalleryPage            = lazy(() => import('@/pages/gallery/GalleryPage'))
export const StatCalculatorPage     = lazy(() => import('@/pages/tools/stat/StatCalculatorPage'))
export const DamageCalculatorPage   = lazy(() => import('@/pages/tools/damage/DamageCalculatorPage'))
export const CentralLabHelperPage   = lazy(() => import('@/pages/tools/central-lab-helper/CentralLabHelperPage'))
export const ItemCostCalculatorPage = lazy(() => import('@/pages/tools/item-cost-calculator/ItemCostCalculatorPage'))
export const MpJigsawCalculatorPage = lazy(() => import('@/pages/tools/mp-jigsaw-calculator/MpJigsawCalculatorPage'))
export const RefineSimulatorPage    = lazy(() => import('@/pages/tools/refine-simulator/RefineSimulatorPage'))
export const ZenyCalculatorPage     = lazy(() => import('@/pages/tools/zeny-calculator/ZenyCalculatorPage'))
export const ChangelogPage          = lazy(() => import('@/pages/changelog/ChangelogPage'))
export const ComingSoonPage         = lazy(() => import('@/pages/coming-soon/ComingSoonPage'))
export const NotFoundPage           = lazy(() => import('@/pages/not-found/NotFoundPage'))

export function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}
