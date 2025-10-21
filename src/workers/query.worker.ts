import JSONPath from 'jsonpath-plus'

interface WorkerMessage {
  id: string
  type: 'jsonpath' | 'jq'
  payload: {
    data: any
    query: string
  }
}

interface WorkerResponse {
  id: string
  success: boolean
  results?: any[]
  error?: string
  count?: number
}

function executeJQCompatible(data: any, query: string): any[] {
  try {
    query = query.trim()
    
    if (query === '.') {
      return [data]
    }
    
    if (query.startsWith('.')) {
      const path = query.substring(1)
      const parts = path.split('.')
      let current = data
      
      for (const part of parts) {
        if (part.includes('[')) {
          const [key, rest] = part.split('[')
          if (key) current = current[key]
          const index = parseInt(rest.replace(']', ''))
          if (!isNaN(index)) current = current[index]
        } else {
          current = current[part]
        }
        
        if (current === undefined) return []
      }
      
      return [current]
    }
    
    if (query === 'keys') {
      return [Object.keys(data)]
    }
    
    if (query === 'values') {
      return Object.values(data)
    }
    
    if (query === 'length') {
      if (Array.isArray(data)) return [data.length]
      if (typeof data === 'object') return [Object.keys(data).length]
      return [0]
    }
    
    if (query.startsWith('select(')) {
      const condition = query.match(/select\((.*?)\)/)?.[1]
      if (condition && Array.isArray(data)) {
        return data.filter((item: any) => {
          try {
            return new Function('item', `with(item) { return ${condition} }`)(item)
          } catch {
            return false
          }
        })
      }
    }
    
    if (query.startsWith('map(')) {
      const mapper = query.match(/map\((.*?)\)/)?.[1]
      if (mapper && Array.isArray(data)) {
        return [data.map((item: any) => {
          try {
            return new Function('item', `with(item) { return ${mapper} }`)(item)
          } catch {
            return item
          }
        })]
      }
    }
    
    return [data]
  } catch (error) {
    throw new Error(`JQ query error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const { id, type, payload } = e.data
  
  try {
    let results: any[]

    if (type === 'jsonpath') {
      results = JSONPath.JSONPath({ path: payload.query, json: payload.data })
    } else if (type === 'jq') {
      results = executeJQCompatible(payload.data, payload.query)
    } else {
      throw new Error(`Unknown query type: ${type}`)
    }

    const response: WorkerResponse = {
      id,
      success: true,
      results,
      count: results.length
    }
    
    self.postMessage(response)
  } catch (error: any) {
    const response: WorkerResponse = {
      id,
      success: false,
      error: error.message || 'Query execution error',
      count: 0
    }
    self.postMessage(response)
  }
}
