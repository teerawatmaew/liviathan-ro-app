import { createBrowserRouter } from 'react-router-dom'

import MainLayout from '@/layouts/MainLayout'
import HomePage from '@/pages/home/HomePage'
import ContentPage from '@/pages/content/ContentPage'
import GalleryPage from '@/pages/gallery/GalleryPage'
import StatCalculatorPage from '@/pages/tools/StatCalculatorPage'
import DamageCalculatorPage from '@/pages/tools/DamageCalculatorPage'
import CentralLabSwitchPage from '@/pages/tools/CentralLabSwitchPage'
import { PATHS } from './paths'

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: PATHS.HOME,           element: <HomePage /> },
      { path: PATHS.CONTENT,        element: <ContentPage /> },
      { path: PATHS.GALLERY,        element: <GalleryPage /> },
      { path: PATHS.TOOLS_STAT,     element: <StatCalculatorPage /> },
      { path: PATHS.TOOLS_DAMAGE,   element: <DamageCalculatorPage /> },
      { path: PATHS.TOOLS_SWITCH,     element: <CentralLabSwitchPage /> },
    ],
  },
])

