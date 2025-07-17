import { useCallback, useEffect, useState } from 'react'

import { clientSide } from 'core-kit/utils'

export function useBrowserStorage<T>(
  storageType: 'sessionStorage' | 'localStorage',
  key: string,
  initialValue: T,
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState(initialValue)
  const storage = !clientSide
    ? null
    : storageType === 'sessionStorage'
      ? sessionStorage
      : localStorage

  const setValue = useCallback(
    (value: T) => {
      try {
        setStoredValue(value)
        storage?.setItem(key, JSON.stringify(value))
      } catch (error) {
        console.error(error)
      }
    },
    [key, storage],
  )

  useEffect(() => {
    try {
      const item = storage?.getItem(key)
      item && setStoredValue(JSON.parse(item))
    } catch (error) {
      console.error(error)
    }
  }, [key, storage])

  return [storedValue, setValue]
}
