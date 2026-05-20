import { createBrowserRouter } from 'react-router-dom'

import MainLayout from '@/layouts/MainLayout'
import HomePage from '@/pages/home/HomePage'
import ContentPage from '@/pages/content/ContentPage'
import GalleryPage from '@/pages/gallery/GalleryPage'
import StatCalculatorPage from '@/pages/tools/stat/StatCalculatorPage'
import DamageCalculatorPage from '@/pages/tools/damage/DamageCalculatorPage'
import CentralLabHelperPage from '@/pages/tools/central-lab-helper/CentralLabHelperPage'
import ItemCostCalculatorPage from '@/pages/tools/item-cost-calculator/ItemCostCalculatorPage'
import MpJigsawCalculatorPage from '@/pages/tools/mp-jigsaw-calculator/MpJigsawCalculatorPage'
import RefineSimulatorPage from '@/pages/tools/refine-simulator/RefineSimulatorPage'
import ComingSoonPage from '@/pages/coming-soon/ComingSoonPage'
import NotFoundPage from '@/pages/not-found/NotFoundPage'
import ErrorPage from '@/pages/error/ErrorPage'
import { PATHS } from './paths'

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: PATHS.HOME,           element: <HomePage /> },
      { path: PATHS.CONTENT,        element: <ContentPage /> },
      { path: PATHS.GALLERY,        element: <GalleryPage /> },
      { path: PATHS.TOOLS_STAT,     element: <StatCalculatorPage /> },
      { path: PATHS.TOOLS_DAMAGE,   element: <DamageCalculatorPage /> },
      { path: PATHS.TOOLS_CENTRAL_LAB,  element: <CentralLabHelperPage /> },
      { path: PATHS.TOOLS_ITEM_COST,       element: <ItemCostCalculatorPage /> },
      { path: PATHS.TOOLS_MP_JIGSAW,        element: <MpJigsawCalculatorPage /> },
      { path: PATHS.TOOLS_REFINE_SIMULATOR,    element: <RefineSimulatorPage /> },
      { path: PATHS.COMING_SOON,            element: <ComingSoonPage /> },
      { path: '*',                          element: <NotFoundPage /> },
    ],
  },
])

