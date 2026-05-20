import { RouterProvider } from 'react-router-dom'
import { router } from '@/routes'
import { Analytics } from '@vercel/analytics/react'

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Analytics />
    </>
  )
}
