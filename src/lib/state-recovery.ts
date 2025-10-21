import { useKV } from '@github/spark/hooks'
import { useEffect, useCallback, useRef } from 'react'

export interface AppState {
  input: string
  selectedFormat: string
  viewMode: string
  graphLayout: string
  selectedPath: string[]
  timestamp: number
  parsedData?: any
  treeData?: any
}

export interface CrashReport {
  timestamp: number
  error: string
  stack?: string
  viewMode: string
  graphLayout?: string
  componentStack?: string
  userAgent: string
  appVersion: string
}

const APP_VERSION = '2.7.0'
const STATE_SAVE_INTERVAL = 2000 // Save state every 2 seconds
const MAX_CRASH_REPORTS = 10

export function useStateRecovery() {
  const [savedState, setSavedState, deleteSavedState] = useKV<AppState | null>('app-recovery-state', null)
  const [crashReports, setCrashReports] = useKV<CrashReport[]>('crash-reports', [])
  const lastSaveTimeRef = useRef<number>(0)
  const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const saveState = useCallback((state: Partial<AppState>) => {
    const now = Date.now()
    
    // Debounce saves
    if (now - lastSaveTimeRef.current < 500) {
      clearTimeout(saveTimeoutRef.current)
      saveTimeoutRef.current = setTimeout(() => saveState(state), 500)
      return
    }
    
    lastSaveTimeRef.current = now
    
    setSavedState(current => ({
      input: '',
      selectedFormat: 'json',
      viewMode: 'tree',
      graphLayout: 'force',
      selectedPath: [],
      timestamp: now,
      ...current,
      ...state
    }))
  }, [setSavedState])

  const clearSavedState = useCallback(() => {
    deleteSavedState()
  }, [deleteSavedState])

  const saveCrashReport = useCallback((
    error: Error,
    errorInfo?: { componentStack?: string },
    additionalContext?: Partial<CrashReport>
  ) => {
    const report: CrashReport = {
      timestamp: Date.now(),
      error: error.message,
      stack: error.stack,
      viewMode: additionalContext?.viewMode || 'unknown',
      graphLayout: additionalContext?.graphLayout,
      componentStack: errorInfo?.componentStack,
      userAgent: navigator.userAgent,
      appVersion: APP_VERSION
    }

    setCrashReports(current => {
      const updated = [report, ...(current || [])].slice(0, MAX_CRASH_REPORTS)
      return updated
    })
  }, [setCrashReports])

  const getCrashReports = useCallback(() => {
    return crashReports || []
  }, [crashReports])

  const clearCrashReports = useCallback(() => {
    setCrashReports([])
  }, [setCrashReports])

  return {
    savedState,
    saveState,
    clearSavedState,
    saveCrashReport,
    getCrashReports,
    clearCrashReports
  }
}

export function useAutoSave(
  getData: () => Partial<AppState>,
  interval: number = STATE_SAVE_INTERVAL
) {
  const { saveState } = useStateRecovery()
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const state = getData()
      if (state.input && state.input.trim()) {
        saveState(state)
      }
    }, interval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [getData, saveState, interval])
}
