import { useRef, useCallback, useEffect } from 'react'

interface UseWorkerOptions {
  onMessage?: (data: any) => void
  onError?: (error: Error) => void
}

export function useWorker(workerUrl: string, options: UseWorkerOptions = {}) {
  const workerRef = useRef<Worker | null>(null)
  const pendingCallbacks = useRef<Map<string, { resolve: (value: any) => void; reject: (error: Error) => void }>>(new Map())

  useEffect(() => {
    try {
      workerRef.current = new Worker(workerUrl, { type: 'module' })

      workerRef.current.onmessage = (e: MessageEvent) => {
        const { id, success, data, error, results } = e.data
        
        if (id && pendingCallbacks.current.has(id)) {
          const callbacks = pendingCallbacks.current.get(id)!
          pendingCallbacks.current.delete(id)
          
          if (success) {
            callbacks.resolve(data || results)
          } else {
            callbacks.reject(new Error(error || 'Worker error'))
          }
        }
        
        if (options.onMessage) {
          options.onMessage(e.data)
        }
      }

      workerRef.current.onerror = (error: ErrorEvent) => {
        const err = new Error(error.message || 'Worker error')
        if (options.onError) {
          options.onError(err)
        }
        pendingCallbacks.current.forEach(({ reject }) => reject(err))
        pendingCallbacks.current.clear()
      }
    } catch (error) {
      console.error('Failed to create worker:', error)
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate()
        workerRef.current = null
      }
      pendingCallbacks.current.clear()
    }
  }, [workerUrl])

  const postMessage = useCallback(<T = any,>(type: string, payload: any): Promise<T> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        reject(new Error('Worker not initialized'))
        return
      }

      const id = `${Date.now()}-${Math.random()}`
      pendingCallbacks.current.set(id, { resolve, reject })

      workerRef.current.postMessage({ id, type, payload })

      setTimeout(() => {
        if (pendingCallbacks.current.has(id)) {
          pendingCallbacks.current.delete(id)
          reject(new Error('Worker timeout'))
        }
      }, 30000)
    })
  }, [])

  return { postMessage, worker: workerRef.current }
}
