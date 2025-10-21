# AGENTS.md - Application Components

This file provides context for working on DataScope's React application in `src/`.

## Component architecture

### Core application files

- `App.tsx` - Main application component, orchestrates all features
- `AppRouter.tsx` - React Router configuration
- `ErrorFallback.tsx` - Global error boundary fallback
- `main.tsx` - Entry point (DO NOT EDIT unless structural change)
- `index.css` - Global styles (safe to edit)
- `main.css` - Tailwind directives (DO NOT EDIT)

### Component organization

```
src/components/
├── analytics/          # Analytics components (7 files)
│   ├── StatsPanel.tsx
│   ├── ComplexityAnalysis.tsx
│   ├── QualityAnalysis.tsx
│   ├── DensityAnalysis.tsx
│   ├── InsightsPanel.tsx
│   ├── PerformanceAnalysis.tsx
│   └── GraphAnalyticsPanel.tsx
├── ui/                 # shadcn/ui components (40+ files)
└── *.tsx              # Feature components (20+ files)
```

## Component patterns

### State management with useKV

```typescript
import { useKV } from '@/hooks/use-kv'

// Persistent state that survives refresh
const [data, setData] = useKV('data-input', '')
const [history, setHistory] = useKV<HistoryItem[]>('data-history', [])

// CRITICAL: Always use functional updates to avoid stale closures
setHistory(current => [...current, newItem])

// NOT: setHistory([...history, newItem]) // ❌ Stale closure bug
```

### Component structure

```typescript
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from '@phosphor-icons/react'

interface MyComponentProps {
  data: ParsedData
  onAction: (result: string) => void
}

export function MyComponent({ data, onAction }: MyComponentProps) {
  const [loading, setLoading] = useState(false)
  
  const handleClick = () => {
    setLoading(true)
    // ... logic
    onAction('result')
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <Button onClick={handleClick} disabled={loading}>
        <ArrowRight className="mr-2" />
        Action
      </Button>
    </div>
  )
}
```

### Analytics components

All analytics components follow this pattern:

1. Accept `data` or `tree` prop (ParsedData or TreeNode[])
2. Calculate metrics in useMemo
3. Render with Cards and Tailwind
4. Use consistent iconography (Phosphor Icons)

Example:

```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useMemo } from 'react'

export function StatsPanel({ tree }: { tree: TreeNode[] }) {
  const stats = useMemo(() => calculateStats(tree), [tree])
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>Nodes: {stats.nodeCount}</p>
          <p>Depth: {stats.maxDepth}</p>
        </div>
      </CardContent>
    </Card>
  )
}
```

## Library files

### `src/lib/` utilities

- `parser.ts` - Data parsing and tree building (850+ lines)
- `formatter.ts` - Data formatting (JSON, YAML, CSV)
- `analytics.ts` - Statistical calculations
- `graph-analyzer.ts` - Graph topology analysis
- `query-engine.ts` - JSONPath query execution
- `worker-manager.ts` - Web Worker orchestration
- `state-recovery.ts` - Auto-save and crash recovery
- `utils.ts` - shadcn/ui utilities

### Parser.ts key functions

```typescript
// Detect format from content
detectFormat(input: string): DataFormat

// Parse any supported format
parseData(input: string, format: DataFormat): ParsedData

// Build tree structure for visualization
buildTree(data: any, maxDepth?: number): TreeNode[]

// Build graph edges for 2D/3D visualization
buildGraph(tree: TreeNode[]): GraphData

// Search tree nodes
advancedSearchNodes(tree, query, options): TreeNode[]
```

## Hooks

### Custom hooks

- `use-kv.ts` - Persistent state with IndexedDB
- `use-theme.ts` - Theme management (light/dark/system)
- `use-mobile.ts` - Mobile detection

### useKV API

```typescript
const [value, setValue] = useKV<T>(key: string, defaultValue: T)

// Storage: IndexedDB via kvStore
// Auto-serializes/deserializes
// Survives page refresh
```

## Visualization components

### TreeView.tsx

- Collapsible tree with syntax highlighting
- Virtual scrolling for large datasets
- Copy path/value buttons
- Type badges
- Search highlighting

### GraphVisualization.tsx

- D3.js force-directed layout
- 4 layout modes: Force, Tree, Radial, Grid
- Canvas fallback for >5k nodes
- Node selection and tooltips
- Zoom and pan controls

### Graph3DVisualization.tsx

- Three.js 3D rendering
- Level-of-detail optimization
- Orbit controls
- Node selection with raycasting
- Performance optimized for >10k nodes

## Common tasks

### Adding a feature component

1. Create `NewFeature.tsx` in `src/components/`
2. Define TypeScript interface for props
3. Use shadcn/ui components for UI
4. Import Phosphor Icons for icons
5. Add to `App.tsx` in appropriate panel
6. Test in both themes and mobile

### Adding analytics metric

1. Create `NewAnalysis.tsx` in `src/components/analytics/`
2. Calculate metric in useMemo
3. Export from `src/components/analytics/index.ts`
4. Import in `App.tsx`
5. Add to analytics tabs/panels

### Adding parser format

1. Add format to `DataFormat` type in `parser.ts`
2. Implement `parseX()` function following existing patterns
3. Add to `parseData()` switch statement
4. Add to `detectFormat()` logic
5. Test with sample files

## Performance optimization

### Memoization

```typescript
// Expensive calculations
const result = useMemo(() => expensiveFunction(data), [data])

// Callbacks passed to children
const handleAction = useCallback(() => {
  // ...
}, [dependencies])
```

### Web Workers

For heavy parsing (>1MB files):

```typescript
import { parseDataInWorker } from '@/lib/worker-manager'

const result = await parseDataInWorker(input, format)
```

### Virtualization

For large trees (>1000 nodes), use `VirtualizedTreeView`:

```typescript
import { VirtualizedTreeView } from '@/components/VirtualizedTreeView'

<VirtualizedTreeView tree={tree} height={600} />
```

## Testing checklist

Before committing component changes:

- [ ] TypeScript compiles without errors
- [ ] Works in light and dark themes
- [ ] Responsive on mobile (<768px)
- [ ] Handles empty/null/undefined data
- [ ] No console errors or warnings
- [ ] State persists if using useKV
- [ ] Keyboard navigation works
- [ ] Loading states shown appropriately
- [ ] Error states handled gracefully

## Common pitfalls

### Stale closures with useKV

```typescript
// ❌ WRONG - creates stale closure
const addToHistory = () => {
  setHistory([...history, newItem]) // history is stale!
}

// ✅ CORRECT - functional update
const addToHistory = () => {
  setHistory(current => [...current, newItem])
}
```

### Missing null checks

```typescript
// ❌ WRONG - crashes if tree is undefined
const nodeCount = tree.length

// ✅ CORRECT - safe access
const nodeCount = tree?.length ?? 0
```

### Direct DOM manipulation

```typescript
// ❌ WRONG - breaks React reconciliation
document.getElementById('node').innerHTML = '<div>...'

// ✅ CORRECT - use React state
const [content, setContent] = useState('<div>...')
```

---

**Last Updated**: 2025-01-16
