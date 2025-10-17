import { useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'

interface AutoSaveState {
  inputValue: string
  viewMode: string
  selectedPath: string[]
  timestamp: number
}

export function useAutoSave(
  inputValue: string,
  viewMode: string,
  selectedPath: string[],
  interval: number = 2000
) {
  const [savedState, setSavedState] = useKV<AutoSaveState | null>('app-auto-save', null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const keystrokeCountRef = useRef(0)
  const KEYSTROKES_THRESHOLD = 10

  useEffect(() => {
    keystrokeCountRef.current++

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      if (keystrokeCountRef.current >= KEYSTROKES_THRESHOLD) {
        setSavedState((prev) => ({
          inputValue,
          viewMode,
          selectedPath,
          timestamp: Date.now()
        }))
        keystrokeCountRef.current = 0
      }
    }, interval)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [inputValue, viewMode, JSON.stringify(selectedPath), interval, setSavedState])

  const clearAutoSave = () => {
    setSavedState(() => null)
  }

  return { savedState, clearAutoSave }
}
