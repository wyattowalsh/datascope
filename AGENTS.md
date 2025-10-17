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

**DataScope** is a professional-grade data exploration, visualization, and analytics platform for structured data formats. Built with React 19, TypeScript, and Vite, it provides multi-format parsing (JSON, YAML, JSONL, CSV), interactive visualizations (Tree, 2D/3D graphs), comprehensive analytics, intelligent user assistance, and advanced querying with JSONPath/jq-compatible syntax.

**NEW in v3.0**: Enterprise-grade stability with crash guards, auto-save/recovery, support for very large datasets (100k+ nodes), and first-class querying with JSONPath/jq.
**Output**: Multi-format export with advanced options  
### 1. Multi-Format Data ParsingtDialog.tsx`
**Supported Formats**: JSON, YAML, JSONL, CSV, JSON5  
**Auto-Detection**: Intelligent format detection from content  
**Error Handling**: Detailed errors with line/column numbers  
**Files**: `src/lib/parser.ts`, `src/App.tsx` (lines 431-527)

### 2. Three Visualization Modes
- **Tree View**: Collapsible hierarchy with syntax highlighting
- **2D Graph**: D3.js force-directed with 4 layouts (Force, Tree, Radial, Grid)
- **3D Graph**: Three.js 3D visualization with orbit controls  hub/spark/hooks`
**Files**: `src/components/TreeView.tsx`, `src/components/GraphVisualization.tsx`, `src/components/Graph3DVisualization.tsx`

### 3. Quick Actions Panel (NEW in v2.6)
One-click operations: Prettify, Minify, Validate, Copy All, Export  
**Features**: Action history, visual feedback, smart disabling  
**Files**: `src/components/QuickActionsPanel.tsx`
---
### 4. Data Validation & Quality Scoring (NEW in v2.6)
Real-time analysis with 0-100 quality score  
**Detects**: Deep nesting, empty objects, duplicates, type issues, whitespace problems  
**Categorizes**: Errors, Warnings, Info with actionable suggestions  
**Files**: `src/components/DataValidator.tsx`

### 5. Quick View Panel (NEW in v2.6)
Live preview of selected nodes with type-specific rendering  
**Shows**: Type badge, value preview, metadata (length/count), copy button  
**Files**: `src/components/QuickViewPanel.tsx`
│   ├── components/
### 6. Favorites/Bookmarks (NEW in v2.6)onents
Save and navigate important data paths  
**Features**: Persistent storage, one-click navigation, path copying, depth indicators  
**Files**: `src/components/FavoritesPanel.tsx`

### 7. Smart Suggestions (NEW in v2.6)
Context-aware recommendations based on data structure  
**Suggests**: Graph view, Search, Transform, Analytics, Export  
**Logic**: Adapts to complexity, arrays, nesting, object size  
**Files**: `src/components/SmartSuggestionsPanel.tsx`dations
portDialog.tsx         # ENHANCED: Export options

**Modes**: Text, Regex, Path-based queries  
**Options**: Case-sensitive, whole word, type filters  
**Files**: `src/components/AdvancedSearch.tsx`, `src/lib/parser.ts` (advancedSearchNodes)

### 9. Comprehensive Analytics
- **Statistics**: Node count, depth, type distribution
- **Graph Analytics**: Centrality, clustering, density, diameter
- **Performance Metrics**: Parse time, data size, complexity  
**Files**: `src/components/analytics/*` (7 analytics components)
--accent: oklch(0.66 0.15 210.42)         /* Bright cyan */
### 10. Enhanced Export (IMPROVED in v2.6)
**Formats**: JSON, YAML, CSV, JSONL, TypeScript, Plain Text  
**Options**: Custom filenames, indent size, sort keys, metadata, flatten nested  
**Files**: `src/components/ExportDialog.tsx`

### 11. Data Transformation Tools
- **Schema Extraction**: Auto-generate JSON Schema text */
- **Data Transformer**: JavaScript transformation engine
- **Data Comparator**: JSON diff with path-based comparison  
**Files**: `src/components/SchemaExtractor.tsx`, `src/components/DataTransformer.tsx`, `src/components/DataComparator.tsx`

### 12. File I/O
**Input**: Paste, file upload (drag & drop), URL loading  
## 🎯 Core Capabilities (18 Major Features)

### 1. Multi-Format Data Parsing
**Supported Formats**: JSON, YAML, JSONL, CSV, JSON5  
**Auto-Detection**: Intelligent format detection from content  
**Error Handling**: Detailed errors with line/column numbers  
**Files**: `src/lib/parser.ts`, `src/App.tsx` (lines 470-560)

### 2. Three Visualization Modes
- **Tree View**: Collapsible hierarchy with syntax highlighting (virtualized for >10k nodes)
- **2D Graph**: D3.js force-directed with 4 layouts (Force, Tree, Radial, Grid) - Canvas-based for >5k nodes
- **3D Graph**: Three.js 3D visualization with orbit controls and LOD
**Files**: `src/components/TreeView.tsx`, `src/components/VirtualizedTree.tsx`, `src/components/GraphVisualization.tsx`, `src/components/CanvasGraphVisualization.tsx`, `src/components/Graph3DVisualization.tsx`

### 3. Crash Guards & State Recovery (NEW in v3.0)
**Error Boundaries**: Scoped fallbacks for tree/graph/3D views  
**Auto-Save**: Persist input + view state every 10 keystrokes  
**Recovery**: Auto-rehydrate on fault with non-blocking toast  
**Telemetry**: Client-side error logging (stack + view + layout, no user data)  
**Files**: `src/components/ErrorBoundary.tsx`, `src/hooks/use-auto-save.ts`, `src/lib/error-telemetry.ts`

### 4. Large Dataset Support (NEW in v3.0)
**Web Workers**: Parsing/graph extraction in background threads  
**Virtualized Tree**: Efficient rendering of 50k+ rows  
**Canvas Rendering**: Hardware-accelerated 2D graphs for >5k nodes  
**Level of Detail**: LOD system for 3D graphs  
**Progress Indicators**: Smooth 60 FPS interactions  
**Files**: `src/workers/parser.worker.ts`, `src/workers/query.worker.ts`, `src/hooks/use-worker.ts`, `src/components/VirtualizedTree.tsx`, `src/components/CanvasGraphVisualization.tsx`

### 5. JSONPath & jq Query Engine (NEW in v3.0)
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
./workspaces/spark-template/
├── src/
│   ├── App.tsx                      # Main app (1300+ lines) with error boundaries
│   ├── main.tsx, main.css           # DO NOT EDIT (structural)
│   ├── index.css                    # Theme & custom styles
│   ├── components/
│   │   ├── ui/                      # 45+ shadcn components
│   │   ├── analytics/               # 7 analytics components
│   │   ├── TreeView.tsx             # Recursive tree
│   │   ├── VirtualizedTree.tsx      # NEW: Virtualized tree for large datasets
│   │   ├── GraphVisualization.tsx   # 2D D3 graph (SVG)
│   │   ├── CanvasGraphVisualization.tsx # NEW: Canvas 2D for >5k nodes
│   │   ├── Graph3DVisualization.tsx # 3D Three.js with LOD
│   │   ├── QueryPanel.tsx           # NEW: JSONPath/jq query engine
│   │   ├── ErrorBoundary.tsx        # NEW: Scoped error boundaries
│   │   ├── QuickActionsPanel.tsx    # Quick operations
│   │   ├── DataValidator.tsx        # Quality scoring
│   │   ├── QuickViewPanel.tsx       # Node preview
│   │   ├── FavoritesPanel.tsx       # Bookmarks
│   │   ├── SmartSuggestionsPanel.tsx # Recommendations
│   │   ├── ExportDialog.tsx         # ENHANCED: Export options
│   │   └── ... (25+ more components)
│   ├── hooks/
│   │   ├── use-mobile.ts
│   │   ├── use-theme.ts
│   │   ├── use-worker.ts            # NEW: Web Worker hook
│   │   └── use-auto-save.ts         # NEW: Auto-save hook
│   ├── lib/
│   │   ├── parser.ts                # Multi-format parsing
│   │   ├── formatter.ts             # Format/lint utilities
│   │   ├── graph-analyzer.ts        # Graph algorithms
│   │   ├── analytics.ts             # GTM tracking
│   │   ├── error-telemetry.ts       # NEW: Error logging
│   │   └── utils.ts                 # cn() helper
│   ├── workers/                     # NEW: Web Workers
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
**Shortcuts**: Ctrl+P (parse), Ctrl+E (export), Ctrl+K (search), etc.  
**Theme**: Light/dark mode with 350ms smooth transitions, OKLCH colors  
**Files**: `src/components/ShortcutsDialog.tsx`, `src/hooks/use-theme.ts`, `src/index.css`

---*Theme Transition**: 350ms cubic-bezier(0.4, 0, 0.2, 1)
00ms
## 🏗️ Architecture
es 21-135)
### Project Structure
```
/workspaces/spark-template/
├── src/
│   ├── App.tsx                      # Main app (1200+ lines)
│   ├── main.tsx, main.css           # DO NOT EDIT (structural)
│   ├── index.css                    # Theme & custom styles
│   ├── components/agement
│   │   ├── ui/                      # 45+ shadcn components
│   │   ├── analytics/               # 7 analytics components
│   │   ├── TreeView.tsx             # Recursive tree
│   │   ├── GraphVisualization.tsx   # 2D D3 graph
│   │   ├── Graph3DVisualization.tsx # 3D Three.js
│   │   ├── QuickActionsPanel.tsx   # NEW: Quick operations
│   │   ├── DataValidator.tsx        # NEW: Quality scoring
│   │   ├── QuickViewPanel.tsx       # NEW: Node preview
│   │   ├── FavoritesPanel.tsx       # NEW: Bookmarks
│   │   ├── SmartSuggestionsPanel.tsx # NEW: Recommendations
│   │   ├── ExportDialog.tsx         # ENHANCED: Export options
│   │   └── ... (20+ more components)
│   ├── hooks/
│   │   ├── use-mobile.ts
│   │   └── use-theme.ts
│   ├── lib/
│   │   ├── parser.ts                # Multi-format parsing
│   │   ├── formatter.ts             # Format/lint utilities
│   │   ├── graph-analyzer.ts        # Graph algorithms
│   │   ├── analytics.ts             # GTM tracking
│   │   └── utils.ts                 # cn() helper
│   ├── pages/
│   │   └── Docs.tsx                 # ENHANCED: Full documentation
│   └── assets/
│       └── images/logo.svg
├── index.html                       # Entry with GTM
├── package.json                     # USE npm TOOL ONLY
├── tailwind.config.js
├── vite.config.ts                   # DO NOT EDIT
├── PRD.md                           # Product requirements
├── AGENTS.md                        # This file
├── README.md                        # Project overview
└── ... (docs now in Docs.tsx)
```
as for src imports
### State Management Patterns

#### ✅ Persistent State (useKV)
```typescript
// For data that survives page refresh
const [input, setInput] = useKV('visualizer-input', '')
const [history, setHistory] = useKV<any[]>('data-history', [])
const [favorites, setFavorites] = useKV<Favorite[]>('favorites', [])

// CRITICAL: ALWAYS use functional updates
setHistory(current => [...current, newItem])  // ✅ Correct
setHistory([...history, newItem])             // ❌ Wrong (stale closure)
```

#### ✅ Temporary State (useState)
```typescriptted = useMemo(() => expensive(data), [data])
// For UI state that doesn't need persistence
const [selectedPath, setSelectedPath] = useState<string[]>([])
const [showDialog, setShowDialog] = useState(false)
const [error, setError] = useState<string>('')
```

### Data Flowsx)
```Case (parseData)
User Input → detectFormat() → parseData() 
           → buildTree() + buildGraph() 
           → calculateStats() + analyzeGraph()
           → Render: TreeView / GraphVisualization / Analytics
```Policy
uld be self-documenting with descriptive names.
```typescript
// ✅ REQUIRED: Use spark.llmPrompt
---

## 📝 Common Tasks & Solutions

### Adding a New Feature Component

--background: oklch(0.985 0.001 247.86)   /* Near-white */
--foreground: oklch(0.12 0.01 250)        /* Dark text */
--primary: oklch(0.56 0.21 264.05)        /* Vibrant blue */
--accent: oklch(0.66 0.15 210.42)         /* Bright cyan */
--muted: oklch(0.965 0.003 247.86)        /* Soft slate */
6. **Add to App.tsx** in appropriate section
7. **Update AGENTS.md** feature list (this file)

### Adding Export Format
--background: oklch(0.10 0.012 250)       /* Deep dark */
--foreground: oklch(0.96 0.008 250)       /* Light text */
--primary: oklch(0.67 0.26 265.75)        /* Bright blue */
--accent: oklch(0.76 0.16 210)            /* Electric cyan */
--muted: oklch(0.17 0.012 250)            /* Deep slate */
5. **Test**: With various data structures
6. **Update docs**: Add to changelog and features

- **UI Font**: Inter (400, 500, 600) - Loaded via Google Fonts
- **Code Font**: JetBrains Mono (400, 500) - Letter-spacing: 0.02em
- **Loaded in**: `index.html` (lines 31-33)

### Component Patternsng
- Check SVG dimensions and viewBox

### Parse Errors
- Validate format matches selected format
- Check for encoding issues
- Verify JSONL has one object per line
- Ensure CSV has consistent columns
// Hover Scaleot tabs)

- Ensure using theme vars, not hardcoded colors
- Test with `useTheme` hook

### Performance Issues
- **Hover States**: 200ms
- **Modals**: 300ms slide-in
- **Defined in**: `src/index.css` (lines 21-135)


## 📚 Key Documentation Files

| File | Purpose | Location |
### Critical Rules
| **AGENTS.md** | This file - AI agent reference | Root directory |
#### 1. Package Managementectory |
```bash** | Project overview & setup | Root directory |
# ❌ NEVER manually edit package.json
# ✅ ALWAYS use npm tool
npm install <package>
### Documentation Access
# ✅ CHECK installed packages first
npm list --depth=0
hangelog, Deployment, Security
# ✅ VERIFY browser compatibility (no Node-only packages)
- Console: Clean in production
- Performance: < 100ms interactions
#### 2. File Restrictions
```typescript: Monitor with Vite
// ❌ DO NOT EDIT
- src/main.tsx
- src/main.css  
- vite.config.ts

// ✅ SAFE TO EDITia toasts
- src/App.tsxspacing/alignment
- src/index.css
- All components
- All lib files
- Handle edge cases gracefully
- Support large datasets (10k+ nodes)
#### 3. Import Conventions
```typescriptts
// ✅ Correct asset imports
import logoSvg from '@/assets/images/logo.svg'
<img src={logoSvg} alt="Logo" />

// ❌ Wrong (string paths)
<img src="/src/assets/images/logo.svg" alt="Logo" />
 One-click operations with history
// ✅ Use @ alias for src imports
import { parseData } from '@/lib/parser'
import { Button } from '@/components/ui/button'
✅ Good: "Add a bar chart showing node degree distribution to GraphAnalyticsPanel"
❌ Bad: "Make analytics better"
#### 4. Code Style
```typescriptph camera gimbal lock and add zoom limits (min: 5, max: 50)"
// TypeScript: Strict mode, explicit types for params
interface Props {
  data: anyng parseJSONL pattern in lib/parser.ts"
  onUpdate: (value: any) => void
- [ ] Responsive on mobile (< 768px)
 ] Handles empty/invalid input
// React: Functional components, hooks, memoization
const Component = ({ data, onUpdate }: Props) => {
  const [state, setState] = useState()
  const computed = useMemo(() => expensive(data), [data])
  const handler = useCallback(() => {...}, [])
  aders)
  return (...)
### Regular Maintenance
ependency updates: Weekly
// Naming: patches: Immediate
// - Components: PascalCase (TreeView.tsx)
// - Functions: camelCase (parseData)
// - Constants: UPPER_SNAKE_CASE (EXAMPLE_JSON)
// - CSS: kebab-case or Tailwind
### Monitoring
- Google Analytics (GTM-KDKW33HQ)
#### 5. Comments Policy
**DO NOT ADD COMMENTS** unless explicitly requested. Code should be self-documenting with descriptive names.

## 🚀 Spark Runtime```typescript```typescript// ✅ REQUIRED: Use spark.llmPromptconst prompt = spark.llmPrompt`Analyze this: ${JSON.stringify(data)}`// Execute (models: gpt-4o, gpt-4o-mini)// JSON mode (returns string-encoded object with properties)```typescriptawait spark.kv.delete("key")
```typescript## 📝 Common Tasks & Solutions### Adding a New Feature Component1. **Create component** in `src/components/` (or `src/components/analytics/` if analytics-related)2. **Import dependencies**: shadcn components, hooks, types3. **Define interface** for props with TypeScript4. **Implement component** following existing patterns5. **Use useKV** for persistent state if needed6. **Add to App.tsx** in appropriate section7. **Update AGENTS.md** feature list (this file)### Adding Export Format1. **Update type**: Add to `ExportFormat` in `ExportDialog.tsx`2. **Add UI**: New RadioGroupItem with icon3. **Implement logic**: Add case to `handleExport()` switch4. **Add options**: Format-specific settings if needed5. **Test**: With various data structures6. **Update docs**: Add to changelog and features### Adding Graph Layout1. **Update GraphVisualization.tsx**: Add layout to `applyLayout()` function2. **Add tab**: New TabsTrigger in visualization panel3. **Test**: Ensure smooth transitions between layouts4. **Verify**: Works with various data structures### Modifying Theme1. **Edit colors**: `src/index.css` (lines 137-223)2. **Update both**: `:root` (light) and `.dark` (dark) sections3. **Check contrast**: WCAG AA ratios (4.5:1 minimum)4. **Test graphs**: Verify visualization colors work5. **Update PRD.md**: Document color changes## 🐛 Troubleshooting### State Not Persisting- ✅ Use `useKV` instead of `useState`### Graph Not Rendering- Verify `parsedData` is not null- Ensure `graphData` has nodes and links### Parse Errors- Validate format matches selected format- Check for encoding issues- Verify JSONL has one object per line- Ensure CSV has consistent columns### Theme Not Applying- Verify `.dark` class on `<html>` element- Check CSS variable definitions in both modes- Ensure using theme vars, not hardcoded colors- Test with `useTheme` hook### Performance Issues- Check data size (node count, depth)- Monitor graph simulation (CPU-heavy)## 📚 Key Documentation Files| File | Purpose | Location ||------|---------|----------|| **AGENTS.md** | This file - AI agent reference | Root directory || **PRD.md** | Product requirements & design | Root directory || **README.md** | Project overview & setup | Root directory || **Docs.tsx** | Full documentation (NEW) | `src/pages/Docs.tsx` || **package.json** | Dependencies (use npm tool) | Root directory |### Documentation AccessAll documentation is now integrated into the app:- In-app: Click Documentation button in header- Includes: Getting Started, Features, Architecture, API, Development, Changelog, Deployment, Security## ✅ Quality Standards### Code Quality- TypeScript strict mode: No `any` types- ESLint: Zero warnings/errors- Console: Clean in production- Performance: < 100ms interactions- Accessibility: WCAG AA- Bundle size: Monitor with Vite### UX Quality- 60 fps animations- Loading states for async- Helpful error messages- Success feedback via toasts- Consistent spacing/alignment- Professional polish### Data Quality- Parse accuracy > 99%- Format detection > 95%- Handle edge cases gracefully- Support large datasets (10k+ nodes)- Accurate analytics- Meaningful insights## 🎯 Recent Changes (v2.6.0)### NEW Features1. ✅ **Quick Actions Panel** - One-click operations with history2. ✅ **Data Validation** - Quality scoring with issue detection3. ✅ **Quick View Panel** - Type-specific node previews4. ✅ **Favorites System** - Bookmark important paths5. ✅ **Smart Suggestions** - Context-aware recommendations6. ✅ **Enhanced Export** - TypeScript, Text formats + advanced options7. ✅ **Integrated Docs** - All documentation in app (Changelog, Deployment, Security)### Updated Files- `src/components/ExportDialog.tsx` - Major enhancement- `src/pages/Docs.tsx` - Complete documentation integration- `src/components/DocsLayout.tsx` - Added new nav items- `AGENTS.md` - This file - restructured and improved### Removed/Deprecated- Standalone `.md` files now integrated into `Docs.tsx`- Old export logic replaced with enhanced version✅ Good: "Add a bar chart showing node degree distribution to GraphAnalyticsPanel"❌ Bad: "Make analytics better"✅ Good: "Fix 3D graph camera gimbal lock and add zoom limits (min: 5, max: 50)"❌ Bad: "3D thing broken"✅ Good: "Add XML parsing following parseJSONL pattern in lib/parser.ts"❌ Bad: "Add XML support"### Workflow Checklist- [ ] Review this file + PRD.md + relevant code- [ ] Understand existing patterns- [ ] Plan implementation approach- [ ] Implement incrementally- [ ] Test in both themes- [ ] Verify responsive behavior- [ ] Check TypeScript (no errors)- [ ] Update documentation if needed- [ ] Provide clear summary- [ ] No console errors- [ ] TypeScript passes- [ ] Analytics fire correctly- [ ] State persists (if useKV)- [ ] Accessible (keyboard, screen readers)## 📞 Support### Regular Maintenance- Dependency updates: Weekly- Security patches: Immediate- Performance monitoring: Ongoing- Bug triage: Daily- **Production**: Vercel (auto-deploy on main)- **Build**: `npm run build`- **Dev**: `npm run dev`- **Preview**: `npm run preview`- Google Analytics (GTM-KDKW33HQ)- Error tracking (console)- Performance (Core Web Vitals)**Agent Version**: 3.0  **Project Version**: 2.6.0 (Enhanced UX + Export + Docs Update)*This document is the primary reference for AI/LLM agents. Keep it current as the project evolves.*