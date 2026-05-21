import { useState, useCallback } from 'react'

/**
 * Drop-in replacement for useState that persists state to localStorage.
 * API is identical: const [value, setValue] = useLocalStorage('key', initialValue)
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item !== null ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue: React.Dispatch<React.SetStateAction<T>> = useCallback(
    (value) => {
      setStoredValue((prev) => {
        const next =
          typeof value === 'function' ? (value as (prev: T) => T)(prev) : value
        try {
          window.localStorage.setItem(key, JSON.stringify(next))
        } catch {
          // quota exceeded — silently ignore
        }
        return next
      })
    },
    [key],
  )

  return [storedValue, setValue]
}
