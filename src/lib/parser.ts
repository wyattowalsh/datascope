import { parse as parseYAML } from 'yaml'

export type DataFormat = 'json' | 'yaml' | 'unknown'

export interface ParseResult {
  success: boolean
  data?: any
  error?: string
  format?: DataFormat
}

export function detectFormat(input: string): DataFormat {
  const trimmed = input.trim()
  if (!trimmed) return 'unknown'
  
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    return 'json'
  }
  
  if (trimmed.includes(':') && !trimmed.startsWith('{')) {
    return 'yaml'
  }
  
  return 'unknown'
}

export function parseData(input: string, format?: DataFormat): ParseResult {
  if (!input.trim()) {
    return { success: false, error: 'Input is empty' }
  }

  const detectedFormat = format || detectFormat(input)

  if (detectedFormat === 'json' || detectedFormat === 'unknown') {
    try {
      const data = JSON.parse(input)
      return { success: true, data, format: 'json' }
    } catch (jsonError: any) {
      if (detectedFormat === 'json') {
        const match = jsonError.message.match(/position (\d+)/)
        const position = match ? parseInt(match[1]) : 0
        const lines = input.substring(0, position).split('\n')
        const line = lines.length
        const column = lines[lines.length - 1].length + 1
        return {
          success: false,
          error: `JSON Error at line ${line}, column ${column}: ${jsonError.message}`,
          format: 'json'
        }
      }
    }
  }

  if (detectedFormat === 'yaml' || detectedFormat === 'unknown') {
    try {
      const data = parseYAML(input)
      return { success: true, data, format: 'yaml' }
    } catch (yamlError: any) {
      return {
        success: false,
        error: `YAML Error: ${yamlError.message}`,
        format: 'yaml'
      }
    }
  }

  return { success: false, error: 'Unable to parse input' }
}

export type ValueType = 'string' | 'number' | 'boolean' | 'null' | 'array' | 'object'

export function getValueType(value: any): ValueType {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  if (typeof value === 'object') return 'object'
  return typeof value as ValueType
}

export interface TreeNode {
  key: string
  value: any
  type: ValueType
  path: string[]
  children?: TreeNode[]
  isExpanded?: boolean
}

export function buildTree(data: any, parentPath: string[] = []): TreeNode[] {
  const nodes: TreeNode[] = []

  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      const path = [...parentPath, index.toString()]
      const type = getValueType(item)
      const node: TreeNode = {
        key: index.toString(),
        value: item,
        type,
        path,
        isExpanded: false
      }

      if (type === 'object' || type === 'array') {
        node.children = buildTree(item, path)
      }

      nodes.push(node)
    })
  } else if (typeof data === 'object' && data !== null) {
    Object.entries(data).forEach(([key, value]) => {
      const path = [...parentPath, key]
      const type = getValueType(value)
      const node: TreeNode = {
        key,
        value,
        type,
        path,
        isExpanded: false
      }

      if (type === 'object' || type === 'array') {
        node.children = buildTree(value, path)
      }

      nodes.push(node)
    })
  }

  return nodes
}

export interface DataStats {
  totalKeys: number
  maxDepth: number
  typeCount: Record<ValueType, number>
}

export function calculateStats(data: any, depth = 0): DataStats {
  const stats: DataStats = {
    totalKeys: 0,
    maxDepth: depth,
    typeCount: {
      string: 0,
      number: 0,
      boolean: 0,
      null: 0,
      array: 0,
      object: 0
    }
  }

  const type = getValueType(data)
  stats.typeCount[type]++

  if (Array.isArray(data)) {
    stats.totalKeys += data.length
    data.forEach(item => {
      const childStats = calculateStats(item, depth + 1)
      stats.totalKeys += childStats.totalKeys
      stats.maxDepth = Math.max(stats.maxDepth, childStats.maxDepth)
      Object.entries(childStats.typeCount).forEach(([key, count]) => {
        stats.typeCount[key as ValueType] += count
      })
    })
  } else if (typeof data === 'object' && data !== null) {
    const keys = Object.keys(data)
    stats.totalKeys += keys.length
    keys.forEach(key => {
      const childStats = calculateStats(data[key], depth + 1)
      stats.totalKeys += childStats.totalKeys
      stats.maxDepth = Math.max(stats.maxDepth, childStats.maxDepth)
      Object.entries(childStats.typeCount).forEach(([key, count]) => {
        stats.typeCount[key as ValueType] += count
      })
    })
  }

  return stats
}

export function getPathString(path: string[], format: 'dot' | 'bracket' = 'dot'): string {
  if (path.length === 0) return ''
  
  if (format === 'dot') {
    return path.map(p => {
      if (/^\d+$/.test(p)) return `[${p}]`
      if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(p)) return p
      return `["${p}"]`
    }).join('.').replace(/^\./g, '')
  } else {
    return path.map(p => `["${p}"]`).join('')
  }
}

export function searchNodes(nodes: TreeNode[], searchTerm: string, typeFilter?: ValueType[]): TreeNode[] {
  if (!searchTerm && (!typeFilter || typeFilter.length === 0)) {
    return nodes
  }

  const lowerSearch = searchTerm.toLowerCase()
  const filtered: TreeNode[] = []

  nodes.forEach(node => {
    const matchesSearch = !searchTerm || 
      node.key.toLowerCase().includes(lowerSearch) ||
      (typeof node.value === 'string' && node.value.toLowerCase().includes(lowerSearch)) ||
      (typeof node.value === 'number' && node.value.toString().includes(lowerSearch))

    const matchesType = !typeFilter || typeFilter.length === 0 || typeFilter.includes(node.type)

    let childMatches: TreeNode[] = []
    if (node.children) {
      childMatches = searchNodes(node.children, searchTerm, typeFilter)
    }

    if ((matchesSearch && matchesType) || childMatches.length > 0) {
      filtered.push({
        ...node,
        children: childMatches.length > 0 ? childMatches : node.children,
        isExpanded: childMatches.length > 0 ? true : node.isExpanded
      })
    }
  })

  return filtered
}
