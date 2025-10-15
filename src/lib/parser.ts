import { parse as parseYAML } from 'yaml'

export type DataFormat = 'json' | 'yaml' | 'jsonl' | 'json5' | 'csv' | 'unknown'

export interface ParseResult {
  success: boolean
  data?: any
  error?: string
  format?: DataFormat
  stats?: {
    lineCount?: number
    recordCount?: number
    parseTime?: number
  }
}

export function detectFormat(input: string): DataFormat {
  const trimmed = input.trim()
  if (!trimmed) return 'unknown'
  
  const lines = trimmed.split('\n').filter(l => l.trim())
  
  if (lines.length > 1) {
    const possibleJsonl = lines.every(line => {
      const trimmedLine = line.trim()
      return trimmedLine.startsWith('{') || trimmedLine.startsWith('[')
    })
    
    if (possibleJsonl) {
      return 'jsonl'
    }
  }
  
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    return 'json'
  }
  
  if (lines.length > 0) {
    const firstLine = lines[0]
    if (firstLine.includes(',') && !firstLine.startsWith('{')) {
      const commaCount = (firstLine.match(/,/g) || []).length
      if (commaCount > 0) {
        return 'csv'
      }
    }
  }
  
  if (trimmed.includes(':') && !trimmed.startsWith('{')) {
    return 'yaml'
  }
  
  return 'unknown'
}

export function parseJSONL(input: string): ParseResult {
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
      format: 'jsonl',
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
      format: 'jsonl'
    }
  }
}

export function parseCSV(input: string): ParseResult {
  const startTime = performance.now()
  try {
    const lines = input.split('\n').filter(line => line.trim())
    if (lines.length === 0) {
      return { success: false, error: 'CSV is empty' }
    }
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
    const records = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
      const record: any = {}
      headers.forEach((header, index) => {
        let value: any = values[index] || ''
        if (value === 'true') value = true
        else if (value === 'false') value = false
        else if (value === 'null') value = null
        else if (!isNaN(Number(value)) && value !== '') value = Number(value)
        record[header] = value
      })
      return record
    })
    
    const parseTime = performance.now() - startTime
    
    return {
      success: true,
      data: records,
      format: 'csv',
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
      format: 'csv'
    }
  }
}

export function parseData(input: string, format?: DataFormat): ParseResult {
  const startTime = performance.now()
  
  if (!input.trim()) {
    return { success: false, error: 'Input is empty' }
  }

  const detectedFormat = format || detectFormat(input)

  if (detectedFormat === 'jsonl') {
    return parseJSONL(input)
  }

  if (detectedFormat === 'csv') {
    return parseCSV(input)
  }

  if (detectedFormat === 'json' || detectedFormat === 'json5' || detectedFormat === 'unknown') {
    try {
      const data = JSON.parse(input)
      const parseTime = performance.now() - startTime
      return { 
        success: true, 
        data, 
        format: 'json',
        stats: { parseTime }
      }
    } catch (jsonError: any) {
      if (detectedFormat === 'json' || detectedFormat === 'json5') {
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
      const parseTime = performance.now() - startTime
      return { 
        success: true, 
        data, 
        format: 'yaml',
        stats: { parseTime }
      }
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

export interface AdvancedSearchOptions {
  searchTerm: string
  searchMode: 'text' | 'regex' | 'path'
  caseSensitive: boolean
  wholeWord: boolean
  typeFilter?: ValueType[]
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

export function advancedSearchNodes(
  nodes: TreeNode[], 
  options: AdvancedSearchOptions
): TreeNode[] {
  const { searchTerm, searchMode, caseSensitive, wholeWord, typeFilter } = options

  if (!searchTerm && (!typeFilter || typeFilter.length === 0)) {
    return nodes
  }

  const filtered: TreeNode[] = []

  nodes.forEach(node => {
    let matchesSearch = false

    if (!searchTerm) {
      matchesSearch = true
    } else if (searchMode === 'regex') {
      try {
        const flags = caseSensitive ? 'g' : 'gi'
        const regex = new RegExp(searchTerm, flags)
        
        matchesSearch = regex.test(node.key) ||
          (typeof node.value === 'string' && regex.test(node.value)) ||
          (typeof node.value === 'number' && regex.test(node.value.toString()))
      } catch {
        matchesSearch = false
      }
    } else if (searchMode === 'path') {
      const pathStr = getPathString(node.path, 'dot')
      matchesSearch = caseSensitive 
        ? pathStr.includes(searchTerm)
        : pathStr.toLowerCase().includes(searchTerm.toLowerCase())
    } else {
      const searchValue = caseSensitive ? searchTerm : searchTerm.toLowerCase()
      const keyValue = caseSensitive ? node.key : node.key.toLowerCase()
      
      let keyMatches = false
      let valueMatches = false

      if (wholeWord) {
        const wordRegex = new RegExp(`\\b${searchValue}\\b`, caseSensitive ? 'g' : 'gi')
        keyMatches = wordRegex.test(node.key)
        
        if (typeof node.value === 'string') {
          valueMatches = wordRegex.test(node.value)
        }
      } else {
        keyMatches = keyValue.includes(searchValue)
        
        if (typeof node.value === 'string') {
          const strValue = caseSensitive ? node.value : node.value.toLowerCase()
          valueMatches = strValue.includes(searchValue)
        } else if (typeof node.value === 'number') {
          valueMatches = node.value.toString().includes(searchValue)
        }
      }

      matchesSearch = keyMatches || valueMatches
    }

    const matchesType = !typeFilter || typeFilter.length === 0 || typeFilter.includes(node.type)

    let childMatches: TreeNode[] = []
    if (node.children) {
      childMatches = advancedSearchNodes(node.children, options)
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
