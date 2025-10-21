/**
 * Centralized storage keys for IndexedDB via useKV hook
 * Helps prevent typos and makes refactoring easier
 */
export const STORAGE_KEYS = {
  /** Main input textarea value */
  INPUT: 'visualizer-input',
  
  /** Data parsing history */
  HISTORY: 'data-history',
  
  /** Favorited paths */
  FAVORITES: 'data-favorites',
  
  /** JSONPath query history */
  QUERY_HISTORY: 'query-history',
  
  /** Format options (indent type, size, etc.) */
  FORMAT_OPTIONS: 'format-options',
  
  /** User preferences for formatting */
  USER_PREFERENCES: 'user-preferences',
  
  /** Session recovery state */
  SESSION_STATE: 'session-state',
} as const

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS]
