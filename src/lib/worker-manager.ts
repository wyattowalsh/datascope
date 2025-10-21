import ParserWorker from '@/workers/parser.worker.ts?worker'

interface PendingRequest {
  resolve: (value: any) => void
  reject: (error: Error) => void
}

class WorkerManager {
  private worker: Worker | null = null
  private pendingRequests = new Map<string, PendingRequest>()
  private requestId = 0

  private ensureWorker() {
    if (!this.worker) {
      this.worker = new ParserWorker()
      this.worker.onmessage = this.handleMessage.bind(this)
      this.worker.onerror = this.handleError.bind(this)
    }
    return this.worker
  }

  private handleMessage(event: MessageEvent) {
    const { id, ...result } = event.data
    const pending = this.pendingRequests.get(id)
    
    if (pending) {
      if (result.success) {
        pending.resolve(result)
      } else {
        pending.reject(new Error(result.error || 'Worker operation failed'))
      }
      this.pendingRequests.delete(id)
    }
  }

  private handleError(error: ErrorEvent) {
    console.error('Worker error:', error)
    this.pendingRequests.forEach(({ reject }) => {
      reject(new Error('Worker encountered an error'))
    })
    this.pendingRequests.clear()
    this.terminate()
  }

  async parse(input: string, format: string): Promise<any> {
    const worker = this.ensureWorker()
    const id = `parse-${this.requestId++}`
    
    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject })
      worker.postMessage({
        id,
        type: 'parse',
        payload: { input, format }
      })
    })
  }

  async buildTree(data: any): Promise<any> {
    const worker = this.ensureWorker()
    const id = `tree-${this.requestId++}`
    
    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, {
        resolve: (result: any) => resolve(result.data),
        reject
      })
      worker.postMessage({
        id,
        type: 'buildTree',
        payload: { data }
      })
    })
  }

  async buildGraph(data: any): Promise<any> {
    const worker = this.ensureWorker()
    const id = `graph-${this.requestId++}`
    
    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, {
        resolve: (result: any) => resolve(result.data),
        reject
      })
      worker.postMessage({
        id,
        type: 'buildGraph',
        payload: { data }
      })
    })
  }

  terminate() {
    if (this.worker) {
      this.worker.terminate()
      this.worker = null
    }
    this.pendingRequests.clear()
  }
}

export const workerManager = new WorkerManager()
