import { parse as parseYAML } from 'yaml'

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
  stats?: any
}

function parseJSON(input: string) {
  const startTime = performance.now()
  try {
    const data = JSON.parse(input)
    const parseTime = performance.now() - startTime
    return {
      success: true,
      data,
      format: 'json' as const,
      stats: { parseTime }
    }
  } catch (error: any) {
    return {
      success: false,
      error: `JSON Error: ${error.message}`,
      format: 'json' as const
    }
  }
}

function parseJSONL(input: string) {
  const startTime = performance.now()
  try {
    const lines = input.split('\n').filter(line => line.trim())
    const records = lines.map((line, index) => {
      try {
        return JSON.parse(line)
      } catch (error: any) {
        throw new Error(`Line ${index + 1}: ${error.message}`)
      }
    })
    
    const parseTime = performance.now() - startTime
    return {
      success: true,
      data: records,
      format: 'jsonl' as const,
      stats: {
        lineCount: lines.length,
        recordCount: records.length,
        parseTime
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: `JSONL Error: ${error.message}`,
      format: 'jsonl' as const
    }
  }
}

function parseYAMLData(input: string) {
  const startTime = performance.now()
  try {
    const data = parseYAML(input)
    const parseTime = performance.now() - startTime
    return {
      success: true,
      data,
      format: 'yaml' as const,
      stats: { parseTime }
    }
  } catch (error: any) {
    return {
      success: false,
      error: `YAML Error: ${error.message}`,
      format: 'yaml' as const
    }
  }
}

function parseCSV(input: string) {
  const startTime = performance.now()
  try {
    const lines = input.split('\n').filter(line => line.trim())
    if (lines.length === 0) {
      throw new Error('CSV is empty')
    }
    
    const headers = lines[0].split(',').map(h => h.trim())
    const records = lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim())
      if (values.length !== headers.length) {
        throw new Error(`Line ${index + 2}: Expected ${headers.length} columns, got ${values.length}`)
      }
      
      const record: any = {}
      headers.forEach((header, i) => {
        const value = values[i]
        if (value === 'true' || value === 'false') {
          record[header] = value === 'true'
        } else if (!isNaN(Number(value)) && value !== '') {
          record[header] = Number(value)
        } else {
          record[header] = value
        }
      })
      return record
    })
    
    const parseTime = performance.now() - startTime
    return {
      success: true,
      data: records,
      format: 'csv' as const,
      stats: {
        lineCount: lines.length,
        recordCount: records.length,
        parseTime
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: `CSV Error: ${error.message}`,
      format: 'csv' as const
    }
  }
}

function buildTreeNode(data: any, path: string[] = [], depth = 0): any {
  const maxDepth = 100
  if (depth > maxDepth) {
    return {
      path,
      key: path[path.length - 1] || 'root',
      value: '[Maximum depth exceeded]',
      type: 'string' as const,
      children: [],
      isExpanded: false,
      depth
    }
  }

  if (data === null) {
    return {
      path,
      key: path[path.length - 1] || 'root',
      value: null,
      type: 'null' as const,
      children: [],
      isExpanded: false,
      depth
    }
  }

  const type = Array.isArray(data) ? 'array' : typeof data

  if (type === 'object' && !Array.isArray(data)) {
    const children = Object.entries(data).map(([key, value]) => 
      buildTreeNode(value, [...path, key], depth + 1)
    )
    return {
      path,
      key: path[path.length - 1] || 'root',
      type: 'object' as const,
      children,
      isExpanded: depth < 3,
      depth
    }
  }

  if (type === 'array') {
    const children = data.map((item: any, index: number) => 
      buildTreeNode(item, [...path, String(index)], depth + 1)
    )
    return {
      path,
      key: path[path.length - 1] || 'root',
      type: 'array' as const,
      children,
      isExpanded: depth < 3,
      depth
    }
  }

  return {
    path,
    key: path[path.length - 1] || 'root',
    value: data,
    type: type as 'string' | 'number' | 'boolean',
    children: [],
    isExpanded: false,
    depth
  }
}

function buildGraphData(data: any) {
  const nodes: any[] = []
  const links: any[] = []
  let nodeId = 0

  function traverse(obj: any, parentId: number | null = null, key: string = 'root', depth = 0) {
    if (depth > 50) return

    const currentId = nodeId++
    const type = Array.isArray(obj) ? 'array' : obj === null ? 'null' : typeof obj
    
    nodes.push({
      id: currentId,
      label: key,
      type,
      value: type === 'object' || type === 'array' ? undefined : obj,
      depth
    })

    if (parentId !== null) {
      links.push({
        source: parentId,
        target: currentId
      })
    }

    if (type === 'object' && obj !== null) {
      Object.entries(obj).forEach(([k, v]) => {
        traverse(v, currentId, k, depth + 1)
      })
    } else if (type === 'array') {
      obj.forEach((item: any, index: number) => {
        traverse(item, currentId, `[${index}]`, depth + 1)
      })
    }
  }

  traverse(data)
  return { nodes, links }
}

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { id, type, payload } = event.data
  
  try {
    let result: any
    
    switch (type) {
      case 'parse':
        const { input, format } = payload
        switch (format) {
          case 'json':
            result = parseJSON(input)
            break
          case 'jsonl':
            result = parseJSONL(input)
            break
          case 'yaml':
            result = parseYAMLData(input)
            break
          case 'csv':
            result = parseCSV(input)
            break
          default:
            result = { success: false, error: 'Unknown format' }
        }
        break
        
      case 'buildTree':
        const startTree = performance.now()
        const tree = buildTreeNode(payload.data)
        const treeTime = performance.now() - startTree
        result = { success: true, data: tree, stats: { buildTime: treeTime } }
        break
        
      case 'buildGraph':
        const startGraph = performance.now()
        const graph = buildGraphData(payload.data)
        const graphTime = performance.now() - startGraph
        result = { success: true, data: graph, stats: { buildTime: graphTime } }
        break
        
      default:
        result = { success: false, error: 'Unknown operation type' }
    }
    
    self.postMessage({ id, ...result } as WorkerResponse)
  } catch (error: any) {
    console.error('Worker error:', error)
    self.postMessage({
      id,
      success: false,
      error: error?.message || error?.toString() || 'Unknown worker error'
    } as WorkerResponse)
  }
}


export {}
