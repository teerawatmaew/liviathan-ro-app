import { useEffect } from 'react'

/**
 * Updates document.title for the current page.
 * Appends "— LiviathaN RO" suffix automatically.
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} — LiviathaN RO`
    return () => {
      document.title = 'LiviathaN RO'
    }
  }, [title])
}
