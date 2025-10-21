# 🤖 AI Agent Context - DataScope Project

**Quick Reference for AI/LLM Agents working on the DataScope codebase**

| Property | Value |
|----------|-------|
| **Live URL** | https://datascope.w4w.dev |
| **Version** | 3.0.0 (Stability & Performance Update) |
| **Tech Stack** | React 19, TypeScript 5.7, Vite 6.3, Tailwind CSS v4 |
| **UI Components** | shadcn/ui v4, Radix UI, Phosphor Icons |
| **Visualizations** | D3.js v7 (2D), Three.js v0.175 (3D), Canvas (large datasets) |
| **State Management** | React Hooks + useKV (persistent storage) + Auto-save |
| **Workers** | Web Workers for parsing/querying |
| **Error Handling** | Error Boundaries with telemetry |

## 📋 Project Overview

**DataScope** is a professional-grade data exploration, visualization, and analytics platform for structured data formats. Built with React 19, TypeScript, and Vite, it provides multi-format parsing (JSON, YAML, XML, TOML, INI, JSONL, CSV), interactive visualizations (Tree, 2D/3D graphs), comprehensive analytics, intelligent user assistance, and advanced querying with JSONPath/jq-compatible syntax.

**NEW in v3.0**:
- ✅ **XML, TOML, INI Support** - Three additional data formats
- ✅ **Enterprise-grade Stability** - Crash guards with auto-save/recovery
- ✅ **Large Dataset Support** - Handle 100k+ nodes with web workers & virtualization
- ✅ **First-class Querying** - JSONPath/jq-compatible query engine

---

## 🎯 Core Capabilities (20+ Major Features)

### 1. Multi-Format Data Parsing ⭐ ENHANCED
**Supported Formats**: JSON, YAML, XML, TOML, INI, JSONL, CSV, JSON5  
**Auto-Detection**: Intelligent format detection from content patterns  
**Error Handling**: Detailed errors with line/column numbers  
**Files**: `src/lib/parser.ts`, `src/App.tsx` (lines 470-560)

### 2. Three Visualization Modes
- **Tree View**: Collapsible hierarchy with syntax highlighting (virtualized for >10k nodes)
- **2D Graph**: D3.js force-directed with 4 layouts (Force, Tree, Radial, Grid) - Canvas-based for >5k nodes
- **3D Graph**: Three.js 3D visualization with orbit controls and LOD  
**Files**: `src/components/TreeView.tsx`, `src/components/VirtualizedTree.tsx`, `src/components/GraphVisualization.tsx`, `src/components/CanvasGraphVisualization.tsx`, `src/components/Graph3DVisualization.tsx`

### 3. Crash Guards & State Recovery ⭐ NEW
**Error Boundaries**: Scoped fallbacks for tree/graph/3D views  
**Auto-Save**: Persist input + view state every 10 keystrokes  
**Recovery**: Auto-rehydrate on fault with non-blocking toast  
**Telemetry**: Client-side error logging (stack + view + layout, no user data)  
**Files**: `src/components/ErrorBoundary.tsx`, `src/hooks/use-auto-save.ts`, `src/lib/error-telemetry.ts`

### 4. Large Dataset Support ⭐ NEW
**Web Workers**: Parsing/graph extraction in background threads  
**Virtualized Tree**: Efficient rendering of 50k+ rows  
**Canvas Rendering**: Hardware-accelerated 2D graphs for >5k nodes  
**Level of Detail**: LOD system for 3D graphs  
**Progress Indicators**: Smooth 60 FPS interactions  
**Files**: `src/workers/parser.worker.ts`, `src/workers/query.worker.ts`, `src/hooks/use-worker.ts`, `src/components/VirtualizedTree.tsx`, `src/components/CanvasGraphVisualization.tsx`

### 5. JSONPath & jq Query Engine ⭐ NEW
**Query Languages**: JSONPath and jq-compatible syntax  
**Live Preview**: Real-time result preview with count  
**Saved Queries**: Persist queries with dataset, shareable via URL hash  
**Worker-Based**: Queries run on dedicated worker thread  
**Export Results**: Export query results as virtual nodes  
**Files**: `src/components/QueryPanel.tsx`, `src/workers/query.worker.ts`

### 6. Quick Actions Panel
One-click operations: Prettify, Minify, Validate, Copy All, Export  
**Features**: Action history, visual feedback, smart disabling  
**Files**: `src/components/QuickActionsPanel.tsx`

### 7. Data Validation & Quality Scoring
Real-time analysis with 0-100 quality score  
**Detects**: Deep nesting, empty objects, duplicates, type issues, whitespace problems  
**Categorizes**: Errors, Warnings, Info with actionable suggestions  
**Files**: `src/components/DataValidator.tsx`

### 8. Quick View Panel
Live preview of selected nodes with type-specific rendering  
**Shows**: Type badge, value preview, metadata (length/count), copy button  
**Files**: `src/components/QuickViewPanel.tsx`

### 9. Favorites/Bookmarks
Save and navigate important data paths  
**Features**: Persistent storage, one-click navigation, path copying, depth indicators  
**Files**: `src/components/FavoritesPanel.tsx`

### 10. Smart Suggestions
Context-aware recommendations based on data structure  
**Suggests**: Graph view, Search, Transform, Analytics, Export  
**Logic**: Adapts to complexity, arrays, nesting, object size  
**Files**: `src/components/SmartSuggestionsPanel.tsx`

### 11. Advanced Search
**Modes**: Text, Regex, Path-based queries  
**Options**: Case-sensitive, whole word, type filters  
**Files**: `src/components/AdvancedSearch.tsx`, `src/lib/parser.ts` (advancedSearchNodes)

### 12. Comprehensive Analytics
- **Statistics**: Node count, depth, type distribution
- **Graph Analytics**: Centrality, clustering, density, diameter
- **Performance Metrics**: Parse time, data size, complexity  
**Files**: `src/components/analytics/*` (7 analytics components)

### 13. Enhanced Export
**Formats**: JSON, YAML, CSV, JSONL, TypeScript, Plain Text  
**Options**: Custom filenames, indent size, sort keys, metadata, flatten nested  
**Files**: `src/components/ExportDialog.tsx`

### 14. Data Transformation Tools
- **Schema Extraction**: Auto-generate JSON Schema
- **Data Transformer**: JavaScript transformation engine
- **Data Comparator**: JSON diff with path-based comparison  
**Files**: `src/components/SchemaExtractor.tsx`, `src/components/DataTransformer.tsx`, `src/components/DataComparator.tsx`

### 15. File I/O
**Input**: Paste, file upload (drag & drop), URL loading  
**Output**: Multi-format export with advanced options  
**Files**: `src/components/FileInput.tsx`, `src/components/ExportDialog.tsx`

### 16. Formatting & Linting
JSON/YAML prettify, minify, alphabetical sorting, lint errors  
**Files**: `src/lib/formatter.ts`, `src/components/FormatOptionsDialog.tsx`, `src/components/LintErrorsDisplay.tsx`

### 17. Persistence & History
**useKV Hook**: Persistent storage survives page refresh  
**Auto-Save**: Every 10 keystrokes with recovery on crash  
**History**: Last 10 datasets with timestamps, quick restore  
**Files**: `src/components/DataHistory.tsx`, `src/hooks/use-auto-save.ts`, imports from `@github/spark/hooks`

### 18. Keyboard Shortcuts & Theme
**Shortcuts**: Ctrl+P (parse), Ctrl+E (export), Ctrl+K (search), etc.  
**Theme**: Light/dark mode with 350ms smooth transitions, OKLCH colors  
**Files**: `src/components/ShortcutsDialog.tsx`, `src/hooks/use-theme.ts`, `src/index.css`

---

## 🏗️ Architecture

### Project Structure
```
/workspaces/spark-template/
├── src/
│   ├── App.tsx                      # Main app (1600+ lines) with error boundaries
│   ├── main.tsx, main.css           # DO NOT EDIT (structural)
│   ├── index.css                    # Theme & custom styles
│   ├── components/
│   │   ├── ui/                      # 45+ shadcn components
│   │   ├── analytics/               # 7 analytics components
│   │   ├── TreeView.tsx             # Recursive tree
│   │   ├── VirtualizedTree.tsx      # Virtualized tree for large datasets
│   │   ├── GraphVisualization.tsx   # 2D D3 graph (SVG)
│   │   ├── CanvasGraphVisualization.tsx # Canvas 2D for >5k nodes
│   │   ├── Graph3DVisualization.tsx # 3D Three.js with LOD
│   │   ├── QueryPanel.tsx           # JSONPath/jq query engine
│   │   ├── ErrorBoundary.tsx        # Scoped error boundaries
│   │   ├── QuickActionsPanel.tsx    # Quick operations
│   │   ├── DataValidator.tsx        # Quality scoring
│   │   ├── QuickViewPanel.tsx       # Node preview
│   │   ├── FavoritesPanel.tsx       # Bookmarks
│   │   ├── SmartSuggestionsPanel.tsx # Recommendations
│   │   ├── ExportDialog.tsx         # Export options
│   │   └── ... (25+ more components)
│   ├── hooks/
│   │   ├── use-mobile.ts
│   │   ├── use-theme.ts
│   │   ├── use-worker.ts            # Web Worker hook
│   │   └── use-auto-save.ts         # Auto-save hook
│   ├── lib/
│   │   ├── parser.ts                # Multi-format parsing (XML, TOML, INI added)
│   │   ├── formatter.ts             # Format/lint utilities
│   │   ├── graph-analyzer.ts        # Graph algorithms
│   │   ├── analytics.ts             # GTM tracking
│   │   ├── error-telemetry.ts       # Error logging
│   │   └── utils.ts                 # cn() helper
│   ├── workers/                     # Web Workers
│   │   ├── parser.worker.ts         # Background parsing
│   │   └── query.worker.ts          # JSONPath/jq execution
│   ├── pages/
│   │   └── Docs.tsx                 # Full documentation
│   └── assets/
│       └── images/logo.svg
├── index.html                       # Entry with GTM
├── package.json                     # USE npm TOOL ONLY
├── tailwind.config.js
├── vite.config.ts                   # DO NOT EDIT
├── PRD.md                           # Product requirements
├── AGENTS.md                        # This file
├── README.md                        # Project overview
└── CHANGELOG.md, FEATURES.md, etc.
```

### State Management Patterns

#### ✅ Persistent State (useKV)
```typescript
// For data that survives page refresh
const [input, setInput] = useKV('visualizer-input', '')
const [history, setHistory] = useKV<any[]>('data-history', [])
const [favorites, setFavorites] = useKV<Favorite[]>('favorites', [])

// CRITICAL: ALWAYS use functional updates
setHistory(current => [...(current || []), newItem])  // ✅ Correct
setHistory([...history, newItem])                      // ❌ Wrong (stale closure)
```

#### ✅ Temporary State (useState)
```typescript
// For UI state that doesn't need persistence
const [selectedPath, setSelectedPath] = useState<string[]>([])
const [showDialog, setShowDialog] = useState(false)
const [error, setError] = useState<string>('')
```

#### ✅ Auto-Save State (useAutoSave)
```typescript
// Automatically saves every 10 keystrokes
const { savedState, clearAutoSave } = useAutoSave(inputValue, viewMode, selectedPath)

// On mount, check for recovery
useEffect(() => {
  if (savedState && timeSince < 1hour) {
    // Restore state with toast notification
  }
}, [])
```

#### ✅ Worker Communication (useWorker)
```typescript
const { postMessage } = useWorker('/workers/parser.worker.ts')

// Execute work in background thread
const result = await postMessage<ParseResult>('parse', {
  input: data,
  format: 'json'
})
```

### Data Flow
```
User Input → detectFormat() → Web Worker (parse)
           → buildTree() + buildGraph() (Worker or Main)
           → calculateStats() + analyzeGraph()
           → Auto-save (every 10 keystrokes)
           → Render: VirtualizedTree / CanvasGraph / 3DGraph (with Error Boundaries)
```

### Performance Optimization Strategy

| Data Size | Tree Strategy | Graph Strategy | Notes |
|-----------|---------------|----------------|-------|
| < 1k nodes | Standard TreeView | SVG D3 Graph | Full interactivity |
| 1k-10k nodes | Standard TreeView | SVG D3 Graph | Debounced updates |
| 10k-50k nodes | VirtualizedTree | Canvas Graph | Virtualization + HW acceleration |
| 50k+ nodes | VirtualizedTree | Canvas Graph + LOD | Level of detail, budgeted frames |

### Error Handling Policy

**Crash Guards**: All visualization components wrapped in ErrorBoundary  
**State Preservation**: Auto-save ensures no data loss on crash  
**User Feedback**: Non-blocking toasts with recovery CTA  
**Telemetry**: Stack, view mode, layout, node count (NO user data)  
**Recovery**: One-click recovery to last known good state

---

## 🔧 Supported Data Formats

### Format Details

| Format | Extension | Parse Function | Example Trigger |
|--------|-----------|----------------|----------------|
| **JSON** | `.json` | `JSON.parse()` | `{ "key": "value" }` |
| **YAML** | `.yaml`, `.yml` | `yaml.parse()` | `key: value` |
| **XML** ⭐ NEW | `.xml` | `fast-xml-parser` | `<?xml version="1.0"?>` |
| **TOML** ⭐ NEW | `.toml` | `@iarna/toml` | `[section]\nkey = "value"` |
| **INI** ⭐ NEW | `.ini`, `.cfg` | `ini.parse()` | `[section]\nkey=value` |
| **JSONL** | `.jsonl` | Line-by-line JSON | `{...}\n{...}` |
| **CSV** | `.csv` | Custom CSV parser | `name,age\nAlice,30` |
| **JSON5** | `.json5` | `JSON.parse()` | Same as JSON |

### Format Detection Logic

```typescript
// Order of detection (in detectFormat function):
1. XML: Starts with <?xml or < with </
2. INI: Starts with [ and contains =
3. TOML: Has [ ] sections with = assignments
4. JSONL: Multiple lines, each starting with { or [
5. JSON: Starts with { or [
6. CSV: Contains commas in first line
7. YAML: Contains : without starting with {
8. Unknown: Falls back to JSON parsing attempt
```

---

## 📝 Common Tasks & Solutions

### Adding a New Data Format

1. **Install parser library** (if needed):
   ```bash
   npm install <parser-library>
   ```

2. **Update type definition** in `src/lib/parser.ts`:
   ```typescript
   export type DataFormat = 'json' | 'yaml' | ... | 'newformat'
   ```

3. **Add parse function**:
   ```typescript
   export function parseNewFormat(input: string): ParseResult {
     // Implementation
   }
   ```

4. **Update detectFormat()**: Add detection logic

5. **Update parseData()**: Add case for new format

6. **Add example data** in `src/App.tsx`:
   ```typescript
   const EXAMPLE_NEWFORMAT = `...`
   ```

7. **Update UI**:
   - Add to `loadExample` function
   - Add menu item with icon
   - Update placeholder text

8. **Test**: With various datasets

9. **Update docs**: AGENTS.md, README.md, CHANGELOG.md

### Adding a New Feature Component

1. **Create component** in `src/components/`
2. **Import dependencies**: shadcn components, hooks, types
3. **Define interface** for props with TypeScript
4. **Implement component** following existing patterns
5. **Use useKV** for persistent state if needed
6. **Add to App.tsx** in appropriate section
7. **Update AGENTS.md** feature list

### Adding Export Format

1. **Update type**: Add to `ExportFormat` in `ExportDialog.tsx`
2. **Add UI**: New RadioGroupItem with icon
3. **Implement logic**: Add case to `handleExport()` switch
4. **Add options**: Format-specific settings if needed
5. **Test**: With various data structures
6. **Update docs**: Add to changelog and features

### Modifying Theme

1. **Edit colors**: `src/index.css` (lines 137-223)
2. **Update both**: `:root` (light) and `.dark` (dark) sections
3. **Check contrast**: WCAG AA ratios (4.5:1 minimum)
4. **Test graphs**: Verify visualization colors work
5. **Update PRD.md**: Document color changes

---

## 🐛 Troubleshooting

### State Not Persisting
- ✅ Use `useKV` instead of `useState`
- ✅ Use functional updates to avoid stale closures

### Graph Not Rendering
- Verify `parsedData` is not null
- Ensure `graphData` has nodes and links
- Check browser console for Three.js errors

### Parse Errors
- Validate format matches detected format
- Check for encoding issues (UTF-8 expected)
- Verify format-specific requirements
- Check browser console for detailed error

### Theme Not Applying
- Verify `.dark` class on `<html>` element
- Check CSS variable definitions in both modes
- Ensure using theme vars, not hardcoded colors
- Test with `useTheme` hook

### Performance Issues
- Check data size (node count, depth)
- Monitor graph simulation (CPU-heavy)
- Enable virtualization for large datasets
- Use Canvas rendering for >5k nodes
- Consider using Web Workers

### Worker Not Responding
- Check worker file path is correct
- Verify worker is properly initialized
- Check browser console for worker errors
- Ensure data is serializable (no functions)

---

## 📚 Key Documentation Files

| File | Purpose | Location |
|------|---------|----------|
| **AGENTS.md** | This file - AI agent reference | Root directory |
| **PRD.md** | Product requirements & design | Root directory |
| **README.md** | Project overview & setup | Root directory |
| **Docs.tsx** | Full documentation | `src/pages/Docs.tsx` |
| **package.json** | Dependencies (use npm tool) | Root directory |

### Documentation Access

All documentation is now integrated into the app:
- In-app: Click Documentation button in header
- Includes: Getting Started, Features, Architecture, API, Development, Changelog, Deployment, Security

---

## ✅ Quality Standards

### Code Quality
- TypeScript strict mode: Minimal `any` types
- ESLint: Zero warnings/errors
- Console: Clean in production
- Performance: < 100ms interactions
- Accessibility: WCAG AA
- Bundle size: Monitor with Vite

### UX Quality
- 60 fps animations
- Loading states for async
- Helpful error messages
- Success feedback via toasts
- Consistent spacing/alignment
- Professional polish

### Data Quality
- Parse accuracy > 99%
- Format detection > 95%
- Handle edge cases gracefully
- Support large datasets (100k+ nodes)
- Accurate analytics
- Meaningful insights

---

## 🎯 Recent Changes (v3.0.0)

### ⭐ NEW Features

1. ✅ **XML Support** - Full XML parsing with attributes and text nodes
2. ✅ **TOML Support** - Complete TOML v1.0 parser
3. ✅ **INI Support** - INI/CFG configuration file parser
4. ✅ **Crash Guards** - Error boundaries on all visualization components
5. ✅ **Auto-Save & Recovery** - Save every 10 keystrokes, recover on crash
6. ✅ **Web Workers** - Background parsing and querying
7. ✅ **Virtualized Tree** - Handle 50k+ rows efficiently
8. ✅ **Canvas 2D Graphs** - Hardware-accelerated for >5k nodes
9. ✅ **JSONPath Engine** - First-class query support
10. ✅ **jq-compatible Queries** - Familiar query syntax

### 📦 Dependencies Added
- `fast-xml-parser` - XML parsing
- `@iarna/toml` - TOML parsing
- `ini` - INI parsing
- `jsonpath-plus` - JSONPath queries

### 📝 Updated Files
- `src/lib/parser.ts` - Added XML, TOML, INI parsers
- `src/App.tsx` - Added examples and UI for new formats
- `src/workers/parser.worker.ts` - Background parsing
- `src/workers/query.worker.ts` - Query execution
- `src/hooks/use-auto-save.ts` - Auto-save hook
- `src/components/ErrorBoundary.tsx` - Crash guards
- `index.html` - Updated metadata
- `AGENTS.md` - This file - comprehensive update

---

## 💡 Best Practices for AI Agents

### When Adding Features

✅ **Good**: "Add XML export with attribute preservation to ExportDialog.tsx"  
❌ **Bad**: "Make exports better"

✅ **Good**: "Fix 3D graph camera gimbal lock and add zoom limits (min: 5, max: 50)"  
❌ **Bad**: "3D thing broken"

✅ **Good**: "Add PROTOBUF parsing following parseXML pattern in lib/parser.ts"  
❌ **Bad**: "Add protobuf support"

### Workflow Checklist

- [ ] Review AGENTS.md + PRD.md + relevant code
- [ ] Understand existing patterns
- [ ] Plan implementation approach
- [ ] Implement incrementally
- [ ] Test in both themes
- [ ] Verify responsive behavior
- [ ] Check TypeScript (no errors)
- [ ] Update documentation if needed
- [ ] Provide clear summary

### Testing Checklist

- [ ] No console errors
- [ ] TypeScript passes
- [ ] Analytics fire correctly
- [ ] State persists (if useKV)
- [ ] Accessible (keyboard, screen readers)
- [ ] Responsive on mobile (< 768px)
- [ ] Handles empty/invalid input
- [ ] Error boundaries catch crashes
- [ ] Web workers respond correctly

---

## 📞 Support & Maintenance

### Regular Maintenance
- Dependency updates: Weekly
- Security patches: Immediate
- Performance monitoring: Ongoing
- Bug triage: Daily

### Deployment
- **Production**: Vercel (auto-deploy on main)
- **Build**: `npm run build`
- **Dev**: `npm run dev`
- **Preview**: `npm run preview`

### Monitoring
- Google Analytics (GTM-KDKW33HQ)
- Error tracking (console + telemetry)
- Performance (Core Web Vitals)

---

## 🔐 Critical Rules

### 1. Package Management
```bash
# ❌ NEVER manually edit package.json
# ✅ ALWAYS use npm tool
npm install <package>

# ✅ CHECK installed packages first
npm list --depth=0

# ✅ VERIFY browser compatibility (no Node-only packages)
```

### 2. File Restrictions
```typescript
// ❌ DO NOT EDIT
- src/main.tsx
- src/main.css  
- vite.config.ts

// ✅ SAFE TO EDIT
- src/App.tsx
- src/index.css
- All components
- All lib files
```

### 3. Import Conventions
```typescript
// ✅ Correct asset imports
import logoSvg from '@/assets/images/logo.svg'
<img src={logoSvg} alt="Logo" />

// ❌ Wrong (string paths)
<img src="/src/assets/images/logo.svg" alt="Logo" />

// ✅ Use @ alias for src imports
import { parseData } from '@/lib/parser'
import { Button } from '@/components/ui/button'
```

### 4. Code Style
```typescript
// TypeScript: Strict mode, explicit types for params
interface Props {
  data: any
  onUpdate: (value: any) => void
}

// React: Functional components, hooks, memoization
const Component = ({ data, onUpdate }: Props) => {
  const [state, setState] = useState()
  const computed = useMemo(() => expensive(data), [data])
  const handler = useCallback(() => {...}, [])
  
  return (...)
}

// Naming:
// - Components: PascalCase (TreeView.tsx)
// - Functions: camelCase (parseData)
// - Constants: UPPER_SNAKE_CASE (EXAMPLE_JSON)
// - CSS: kebab-case or Tailwind
```

### 5. Comments Policy
**DO NOT ADD COMMENTS** unless explicitly requested. Code should be self-documenting with descriptive names.

---

**Agent Version**: 3.0  
**Project Version**: 3.0.0 (Enhanced Formats + Stability + Performance)

*This document is the primary reference for AI/LLM agents. Keep it current as the project evolves.*
