import { useState, useEffect, useCallback } from 'react'

/**
 * useLocalStorage - Persists state to localStorage
 *
 * @param {string} key - localStorage key
 * @param {any} initialValue - Initial value if nothing is stored
 * @returns {[any, Function, Function]} - [storedValue, setValue, removeValue]
 *
 * @example
 * const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light')
 */
const useLocalStorage = (key, initialValue) => {
  // Get stored value or use initial
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Update localStorage when value changes
  const setValue = useCallback(
    (value) => {
      try {
        // Support functional updates
        const valueToStore =
          value instanceof Function ? value(storedValue) : value

        setStoredValue(valueToStore)
        window.localStorage.setItem(key, JSON.stringify(valueToStore))

        // Dispatch custom event for cross-tab sync
        window.dispatchEvent(
          new StorageEvent('storage', {
            key,
            newValue: JSON.stringify(valueToStore)
          })
        )
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  // Remove from localStorage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  // Listen for changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue))
        } catch (error) {
          console.warn('Error parsing storage event:', error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return [storedValue, setValue, removeValue]
}

export default useLocalStorage