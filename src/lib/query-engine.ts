import { JSONPath } from 'jsonpath-plus'

export interface QueryResult {
  success: boolean
  results: any[]
  count: number
  paths: string[]
  error?: string
  executionTime: number
}

export interface SavedQuery {
  id: string
  name: string
  query: string
  language: 'jsonpath' | 'jq'
  timestamp: number
  resultCount?: number
}

export function executeJSONPath(data: any, query: string): QueryResult {
  const startTime = performance.now()
  
  try {
    const results = JSONPath({
      path: query,
      json: data,
      resultType: 'all'
    })

    const executionTime = performance.now() - startTime
    
    return {
      success: true,
      results: results.map((r: any) => r.value),
      count: results.length,
      paths: results.map((r: any) => r.path),
      executionTime
    }
  } catch (error: any) {
    return {
      success: false,
      results: [],
      count: 0,
      paths: [],
      error: error.message || 'Query execution failed',
      executionTime: performance.now() - startTime
    }
  }
}

export function validateJSONPath(query: string): { valid: boolean; error?: string } {
  try {
    JSONPath({ path: query, json: {}, resultType: 'value' })
    return { valid: true }
  } catch (error: any) {
    return { valid: false, error: error.message }
  }
}

export const JSONPATH_EXAMPLES = [
  {
    name: 'Root element',
    query: '$',
    description: 'Select the entire document'
  },
  {
    name: 'All properties',
    query: '$.*',
    description: 'Select all top-level properties'
  },
  {
    name: 'Deep scan',
    query: '$..name',
    description: 'Find all "name" properties at any depth'
  },
  {
    name: 'Array filter',
    query: '$.items[?(@.price < 100)]',
    description: 'Select items with price less than 100'
  },
  {
    name: 'Array slice',
    query: '$.items[0:5]',
    description: 'Select first 5 items'
  },
  {
    name: 'Multiple conditions',
    query: '$.users[?(@.age > 18 && @.active == true)]',
    description: 'Select active users over 18'
  },
  {
    name: 'Has property',
    query: '$..[?(@.email)]',
    description: 'Find all objects with an email property'
  },
  {
    name: 'Wildcard in path',
    query: '$.departments.*.employees',
    description: 'Get employees from all departments'
  }
]

export function buildQueryFromSelection(path: string[]): string {
  if (path.length === 0) return '$'
  
  return '$.' + path.map(segment => {
    if (/^\d+$/.test(segment)) {
      return `[${segment}]`
    }
    if (/^[a-zA-Z_]\w*$/.test(segment)) {
      return segment
    }
    return `['${segment}']`
  }).join('.')
}

export function parseQueryResultPath(path: string): string[] {
  const matches = path.match(/\[['"]?([^'"\]]+)['"]?\]|\.([^.[]+)/g)
  if (!matches) return []
  
  return matches.map(match => {
    const bracketMatch = match.match(/\[['"]?([^'"\]]+)['"]?\]/)
    if (bracketMatch) return bracketMatch[1]
    return match.substring(1)
  })
}

export function suggestQueries(data: any): SavedQuery[] {
  const suggestions: SavedQuery[] = []
  let id = 0

  function analyzeStructure(obj: any, path: string[] = []) {
    if (path.length > 5) return

    if (Array.isArray(obj)) {
      if (obj.length > 0) {
        const sample = obj[0]
        if (typeof sample === 'object' && sample !== null) {
          const keys = Object.keys(sample)
          
          if (keys.length > 0) {
            const pathStr = path.length > 0 ? `$.${path.join('.')}` : '$'
            
            suggestions.push({
              id: `suggest-${id++}`,
              name: `Filter ${path[path.length - 1] || 'items'}`,
              query: `${pathStr}[?(@.${keys[0]})]`,
              language: 'jsonpath',
              timestamp: Date.now()
            })

            if (keys.some(k => ['id', 'name', 'title'].includes(k))) {
              const nameKey = keys.find(k => ['name', 'title'].includes(k)) || keys[0]
              suggestions.push({
                id: `suggest-${id++}`,
                name: `All ${nameKey} values`,
                query: `${pathStr}[*].${nameKey}`,
                language: 'jsonpath',
                timestamp: Date.now()
              })
            }
          }
        }
      }
    } else if (typeof obj === 'object' && obj !== null) {
      const entries = Object.entries(obj)
      
      for (const [key, value] of entries.slice(0, 10)) {
        if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
          analyzeStructure(value, [...path, key])
        }
      }
    }
  }

  analyzeStructure(data)
  return suggestions.slice(0, 5)
}
