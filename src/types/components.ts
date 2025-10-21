/**
 * Shared component types across the application
 */

/** Graph visualization layout algorithms */
export type GraphLayout = 'force' | 'radial' | 'tree' | 'circular'

/** Data export format options */
export type ExportFormat = 
  | 'json'
  | 'yaml'
  | 'csv'
  | 'xml'
  | 'typescript'
  | 'markdown'
  | 'sql'

/** Search modes for advanced search */
export type SearchMode = 'text' | 'regex' | 'jsonpath'

/** Search options for filtering tree nodes */
export interface SearchOptions {
  searchTerm: string
  searchMode: SearchMode
  caseSensitive: boolean
  wholeWord: boolean
  typeFilters: string[]
}

/** Favorite item for bookmarking paths */
export interface FavoriteItem {
  id: string
  path: string[]
  label: string
  timestamp: number
  note?: string
}

/** History entry for data parsing */
export interface HistoryEntry {
  id: string
  data: string
  format: string
  timestamp: number
  preview?: string
}

/** Query history entry */
export interface QueryHistoryEntry {
  id: string
  query: string
  timestamp: number
  resultCount?: number
}

/** View mode for data visualization */
export type ViewMode = 'tree' | 'graph' | 'graph3d'

/** Parse metrics for performance analysis */
export interface ParseMetrics {
  parseTime: number
  dataSize: number
  nodeCount: number
  edgeCount: number
}
