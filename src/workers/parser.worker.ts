import { parse as parseYAML } from 'yaml'
import { parseData, buildTree } from '@/lib/parser'
import { buildGraph } from '@/lib/graph-analyzer'

interface WorkerMessage {
  id: string
  type: 'parse' | 'buildTree' | 'buildGraph'
  payload: any
}

interface WorkerResponse {
  id: string
  success: boolean
  data?: any
  error?: string
}

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const { id, type, payload } = e.data
  
  try {
    let result: any

    switch (type) {
      case 'parse': {
        const { input, format } = payload
        result = parseData(input, format)
        break
      }
      case 'buildTree': {
        result = buildTree(payload)
        break
      }
      case 'buildGraph': {
        result = buildGraph(payload)
        break
      }
      default:
        throw new Error(`Unknown worker message type: ${type}`)
    }

    const response: WorkerResponse = {
      id,
      success: true,
      data: result
    }
    
    self.postMessage(response)
  } catch (error: any) {
    const response: WorkerResponse = {
      id,
      success: false,
      error: error.message || 'Worker error'
    }
    self.postMessage(response)
  }
}
