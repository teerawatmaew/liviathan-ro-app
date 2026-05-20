import { createBrowserRouter } from 'react-router-dom'

import MainLayout from '@/layouts/MainLayout'
import ErrorPage from '@/pages/error/ErrorPage'
import { PATHS } from './paths'
import {
  HomePage, ContentPage, GalleryPage,
  StatCalculatorPage, DamageCalculatorPage,
  CentralLabHelperPage, ItemCostCalculatorPage,
  MpJigsawCalculatorPage, RefineSimulatorPage,
  ComingSoonPage, NotFoundPage,
  Lazy,
} from './lazy-pages'

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: PATHS.HOME,                    element: <Lazy><HomePage /></Lazy> },
      { path: PATHS.CONTENT,                 element: <Lazy><ContentPage /></Lazy> },
      { path: PATHS.GALLERY,                 element: <Lazy><GalleryPage /></Lazy> },
      { path: PATHS.TOOLS_STAT,              element: <Lazy><StatCalculatorPage /></Lazy> },
      { path: PATHS.TOOLS_DAMAGE,            element: <Lazy><DamageCalculatorPage /></Lazy> },
      { path: PATHS.TOOLS_CENTRAL_LAB,       element: <Lazy><CentralLabHelperPage /></Lazy> },
      { path: PATHS.TOOLS_ITEM_COST,         element: <Lazy><ItemCostCalculatorPage /></Lazy> },
      { path: PATHS.TOOLS_MP_JIGSAW,         element: <Lazy><MpJigsawCalculatorPage /></Lazy> },
      { path: PATHS.TOOLS_REFINE_SIMULATOR,  element: <Lazy><RefineSimulatorPage /></Lazy> },
      { path: PATHS.COMING_SOON,             element: <Lazy><ComingSoonPage /></Lazy> },
      { path: '*',                           element: <Lazy><NotFoundPage /></Lazy> },
    ],
  },
])


