# 🤖 AI Agent Context - DataScope Project

## 📋 Project Overview

**DataScope** is a professional, user-friendly data exploration, visualization, and analytics platform for structured data formats. It's a React/TypeScript web application built with Vite, featuring advanced graph visualizations, multi-format parsing, AI-powered insights, comprehensive data analytics, and intelligent user assistance features.

**Live URL**: https://datascope.w4w.dev  
**Tech Stack**: React 19, TypeScript, Vite, Tailwind CSS v4, D3.js, Three.js, shadcn/ui v4  
**Purpose**: Parse, visualize, analyze, and transform structured data (JSON, YAML, JSONL, CSV) with professional-grade tools and smart suggestions

**Latest Update**: Enhanced with Quick Actions, Smart Suggestions, Data Validation, Quick View, Favorites, and improved user experience

---

## 🏗️ Architecture Overview

### Core Technology Stack
```
Frontend Framework: React 19 (with TypeScript 5.7)
Build Tool: Vite 6.3
Styling: Tailwind CSS v4 (with @tailwindcss/vite plugin)
UI Components: shadcn/ui v4 (Radix UI primitives)
State Management: React hooks + useKV (persistent KV store)
Visualization: D3.js v7, Three.js v0.175
Icons: Phosphor Icons (duotone weight)
Animations: Framer Motion, custom CSS keyframes
Forms: react-hook-form + zod validation
Charts: Recharts for analytics
```

### Project Structure
```
/workspaces/spark-template/
├── src/
│   ├── App.tsx                    # Main application component (1180 lines)
│   ├── ErrorFallback.tsx          # Error boundary fallback
│   ├── main.tsx                   # Entry point (DO NOT EDIT)
│   ├── main.css                   # Structural CSS (DO NOT EDIT)
│   ├── index.css                  # Theme & custom styles
│   ├── components/
│   │   ├── ui/                    # shadcn components (45+ components)
│   │   ├── TreeView.tsx           # Recursive tree visualization
│   │   ├── GraphVisualization.tsx # 2D D3 graph with 4 layouts
│   │   ├── Graph3DVisualization.tsx # Three.js 3D graph
│   │   ├── StatsPanel.tsx         # Data statistics display
│   │   ├── GraphAnalyticsPanel.tsx # Graph metrics & analytics
│   │   ├── AdvancedSearch.tsx     # Multi-mode search (text/regex/path)
│   │   ├── FileInput.tsx          # File/URL data loader
│   │   ├── ExportDialog.tsx       # Multi-format export
│   │   ├── FormatOptionsDialog.tsx # Format settings
│   │   ├── LintErrorsDisplay.tsx   # JSON linting errors
│   │   ├── SchemaExtractor.tsx    # JSON Schema generator
│   │   ├── DataTransformer.tsx    # JS transformation engine
│   │   ├── DataComparator.tsx     # Data diff tool
│   │   ├── DataHistory.tsx        # History management
│   │   ├── InsightsPanel.tsx      # AI-powered insights
│   │   ├── ShortcutsDialog.tsx    # Keyboard shortcuts
│   │   ├── QuickActionsPanel.tsx  # NEW: One-click operations
│   │   ├── DataValidator.tsx      # NEW: Real-time validation
│   │   ├── QuickViewPanel.tsx     # NEW: Selected node preview
│   │   ├── FavoritesPanel.tsx     # NEW: Bookmark paths
│   │   └── SmartSuggestionsPanel.tsx # NEW: Context-aware tips
│   ├── hooks/
│   │   ├── use-mobile.ts          # Mobile breakpoint detection
│   │   └── use-theme.ts           # Theme management (light/dark)
│   ├── lib/
│   │   ├── utils.ts               # cn() utility for class merging
│   │   ├── parser.ts              # Multi-format parser (JSON/YAML/JSONL/CSV)
│   │   ├── formatter.ts           # Data formatting & linting
│   │   ├── graph-analyzer.ts      # Graph construction & analytics
│   │   └── analytics.ts           # Google Tag Manager events
│   └── assets/
│       ├── images/logo.svg        # DataScope logo
│       └── ...
├── index.html                     # HTML entry with GTM
├── package.json                   # Dependencies (managed via npm tool)
├── tailwind.config.js             # Tailwind configuration
├── vite.config.ts                 # Vite config (DO NOT EDIT)
├── tsconfig.json                  # TypeScript config
├── PRD.md                         # Product Requirements Doc
└── AGENTS.md                      # This file
```

---

## 🎯 Core Features & Capabilities

### 1. Quick Actions Panel (NEW)
- **Functionality**: One-click access to common operations - Prettify, Minify, Validate, Copy All, Export
- **Purpose**: Streamline workflow with instant access to frequently used actions
- **Trigger**: Automatically displayed in sidebar when data is parsed
- **Progression**: Parse data → See quick actions → Click action → Operation executes → See recent action history
- **Success criteria**: All actions work instantly; visual feedback on each action; maintains history of recent operations; disabled when no data present

**Key Files**:
- `src/components/QuickActionsPanel.tsx` - Quick actions component with action tracking

### 2. Data Validation (NEW)
- **Functionality**: Real-time data quality analysis with scoring, issue detection, and actionable suggestions
- **Purpose**: Help users identify and fix data quality issues before processing
- **Trigger**: Automatically runs when data is parsed
- **Progression**: Parse data → Validate structure → Calculate quality score → Identify issues → Show suggestions
- **Success criteria**: Accurate quality scoring (0-100); detects common issues (empty objects, deep nesting, invalid keys); provides helpful fix suggestions; categorizes issues by severity (error/warning/info)

**Key Files**:
- `src/components/DataValidator.tsx` - Validation logic and UI
- Issues detected: empty objects/arrays, deep nesting, duplicate keys, numeric keys, mixed array types, whitespace issues, invalid numbers

### 3. Quick View Panel (NEW)
- **Functionality**: Live preview of selected node with type info, value display, and copy functionality
- **Purpose**: Instantly see details of any selected node without expanding the tree
- **Trigger**: Automatically updates when user selects any node in tree view
- **Progression**: Select node → View type badge → See value preview → Copy if needed
- **Success criteria**: Real-time updates on selection; shows appropriate preview for each type; handles strings, numbers, booleans, arrays, objects; displays metadata (length, key count)

**Key Files**:
- `src/components/QuickViewPanel.tsx` - Selected node preview with type-specific rendering

### 4. Favorites/Bookmarks (NEW)
- **Functionality**: Save and quickly navigate to frequently accessed data paths
- **Purpose**: Enable quick access to important paths in complex data structures
- **Trigger**: Click "Add" button to bookmark current path, or navigate from favorites list
- **Progression**: Navigate to path → Click Add → Path saved → Access from favorites list → One-click navigation/copy
- **Success criteria**: Persists favorites between sessions; shows path details; one-click navigation; bulk clear option; visual feedback on duplicate attempts

**Key Files**:
- `src/components/FavoritesPanel.tsx` - Bookmark management with persistence via useKV

### 5. Smart Suggestions (NEW)
- **Functionality**: Context-aware recommendations based on data structure and content
- **Purpose**: Guide users to relevant features and optimal workflows for their specific data
- **Trigger**: Automatically analyzes data structure and shows relevant suggestions
- **Progression**: Parse data → Analyze structure → Generate suggestions → Show actionable recommendations
- **Success criteria**: Suggests graph view for complex structures; recommends search for arrays; suggests transformations for nested data; adapts to data characteristics; maximum 4 suggestions shown

**Key Files**:
- `src/components/SmartSuggestionsPanel.tsx` - Intelligent recommendation engine

### 6. Multi-Format Data Input & Parsing
- **Formats Supported**: JSON, YAML, JSONL (line-delimited), CSV, JSON5
- **Auto-Detection**: Intelligent format detection from content structure
- **Error Handling**: Detailed parse errors with line/column numbers
- **Performance**: Handles large datasets with progress indicators

**Key Files**:
- `src/lib/parser.ts` - Parsing logic for all formats
- `src/App.tsx` (lines 422-454) - Format detection logic
- `src/App.tsx` (lines 468-508) - Parse handler

### 7. Dual Visualization Modes

#### Tree View
- Recursive collapsible tree structure
- Syntax highlighting (theme-aware colors)
- Type badges (object/array/primitive)
- Path copying with breadcrumb display
- Expand/collapse all functionality
- Search highlighting

**Key Files**:
- `src/components/TreeView.tsx` - Tree rendering component
- `src/lib/parser.ts` - `buildTree()` function

#### Graph Visualizations

**2D Graph (D3.js)** - 4 Layout Options:
1. **Force-Directed**: Physics-based organic layout
2. **Tree**: Hierarchical top-down layout
3. **Radial**: Circular hierarchical layout
4. **Grid**: Organized row-based layout

**3D Graph (Three.js)**:
- Interactive 3D force-directed visualization
- Camera controls (orbit, zoom, pan)
- Node selection with raycasting

**Key Files**:
- `src/components/GraphVisualization.tsx` - 2D graph with layouts
- `src/components/Graph3DVisualization.tsx` - 3D visualization
- `src/lib/graph-analyzer.ts` - Graph construction & metrics

### 8. Advanced Search & Filtering
- **Search Modes**: Text, Regex, Path-based
- **Options**: Case sensitive, whole word matching
- **Type Filters**: Filter by object/array/string/number/boolean/null
- **Real-time**: Instant filtering with result counts

**Key Files**:
- `src/components/AdvancedSearch.tsx` - Search UI
- `src/lib/parser.ts` - `advancedSearchNodes()` function
- `src/App.tsx` (lines 664-685) - Search logic

### 9. Data Analytics & Insights

#### Statistics Panel
- Total keys, max depth, type distribution
- Percentage breakdowns with visual bars
- Color-coded type badges

#### Graph Analytics
- Total nodes & edges
- Average degree, density, diameter
- Clustering coefficient
- Centrality rankings (betweenness)
- Branching factor
- Depth distribution charts

#### AI-Powered Insights
- Deep nesting warnings
- Null value prevalence detection
- Schema consistency analysis
- Array structure recommendations
- Performance tips

**Key Files**:
- `src/components/StatsPanel.tsx` - Statistics display
- `src/components/GraphAnalyticsPanel.tsx` - Graph metrics
- `src/components/InsightsPanel.tsx` - AI insights
- `src/lib/graph-analyzer.ts` - `analyzeGraph()` function
- `src/lib/parser.ts` - `calculateStats()` function

### 10. Data Transformation Tools

#### Schema Extractor
- Auto-generate JSON Schema (Draft-07)
- Type inference with format detection
- Email, URI, date-time pattern recognition

#### Data Transformer
- JavaScript transformation engine
- Built-in examples (extract, filter, map, flatten)
- Safe execution with error handling
- Preview before apply

#### Data Comparator
- JSON diff with path-based comparison
- Color-coded changes (added/removed/modified)
- Metrics summary
- Nested object comparison

**Key Files**:
- `src/components/SchemaExtractor.tsx`
- `src/components/DataTransformer.tsx`
- `src/components/DataComparator.tsx`

### 11. File I/O & Export

#### Input Methods
- **Paste**: Direct text input with auto-format detection
- **File Upload**: Drag & drop or file browser (.json, .yaml, .jsonl, .csv)
- **URL Loading**: Fetch from remote URLs with CORS handling

#### Export Options
- Multi-format export (JSON, YAML, CSV, JSONL)
- Prettify & sort keys options
- Automatic file naming with timestamps

**Key Files**:
- `src/components/FileInput.tsx` - File/URL loader
- `src/components/ExportDialog.tsx` - Export functionality

### 12. Formatting & Linting
- JSON prettify with indent options (2/4 spaces, tabs)
- Alphabetical key sorting
- Minify JSON/JSONL
- Comprehensive linting with error locations
- Auto-fix suggestions

**Key Files**:
- `src/lib/formatter.ts` - Format/lint logic
- `src/components/FormatOptionsDialog.tsx` - Format settings
- `src/components/LintErrorsDisplay.tsx` - Error display

### 13. Persistence & History
- **useKV Hook**: Persistent key-value store (survives page refresh)
- Input data persisted automatically
- History of last 10 datasets with timestamps
- Quick restore from history
- Theme preference persistence

**Key Files**:
- `src/App.tsx` (line 393) - `useKV('visualizer-input', '')`
- `src/components/DataHistory.tsx` - History management
- Import: `import { useKV } from '@github/spark/hooks'`

### 14. Keyboard Shortcuts
- `Ctrl+P` - Parse data
- `Ctrl+E` - Export
- `Ctrl+K` - Focus search
- `Ctrl+1` - Tree view
- `Ctrl+2` - 2D Graph view
- `Ctrl+3` - 3D Graph view
- `E` - Expand all
- `C` - Collapse all
- `Ctrl+D` - Toggle theme
- `?` - Show shortcuts

**Key Files**:
- `src/components/ShortcutsDialog.tsx` - Shortcuts UI & logic
- `src/App.tsx` (lines 693-705) - Shortcut handlers

### 15. Theme System
- **Light Mode**: Bright, clean, professional
- **Dark Mode**: Rich, deep, luminous accents
- **Smooth Transitions**: 350ms color morphing
- **Graph Integration**: Theme-aware visualization colors
- **Persistence**: Theme saved via useKV

**Key Files**:
- `src/hooks/use-theme.ts` - Theme management
- `src/index.css` - Color variables (lines 137-223)
- `src/main.css` - Dark mode overrides (lines 73-105)

---

## 🆕 Recent Improvements & New Features

### User Experience Enhancements (Latest Update)

#### Quick Actions Panel
One-click access to the most common operations saves users time and reduces cognitive load. Features action history tracking to show recent operations.

#### Data Validation
Real-time quality analysis helps users identify and fix issues before they cause problems. Provides a 0-100 quality score with categorized issues (errors, warnings, info) and actionable suggestions for improvement.

#### Quick View Panel
Eliminates the need to expand nodes to see their values. Shows type-specific previews with relevant metadata (string length, array size, object keys) and provides instant copy functionality.

#### Favorites/Bookmarks
Users can save important paths for quick access later. Especially useful for large, complex data structures where finding specific paths repeatedly is time-consuming.

#### Smart Suggestions
Context-aware recommendations guide users to relevant features based on their specific data structure. Helps new users discover functionality and experienced users optimize their workflow.

### Architecture Improvements
- Enhanced TypeScript type safety across new components
- Consistent use of useKV for persistent state management
- Modular component design for easy maintenance
- Responsive design with mobile-first approach
- Optimized performance with useMemo for expensive calculations

### Design System Refinements
- Consistent glassmorphic styling across all new panels
- Smooth hover animations and transitions
- Color-coded type indicators for better visual scanning
- Icon consistency using Phosphor duotone weight
- Proper spacing and alignment throughout

---

## 🎨 Design System

### Color Palette (OKLCH)

#### Light Mode
```css
--background: oklch(0.985 0.001 247.86)    /* Near-white */
--foreground: oklch(0.12 0.01 250)         /* Dark text */
--primary: oklch(0.56 0.21 264.05)         /* Vibrant blue */
--accent: oklch(0.66 0.15 210.42)          /* Bright cyan */
--muted: oklch(0.965 0.003 247.86)         /* Soft slate */
```

#### Dark Mode
```css
--background: oklch(0.10 0.012 250)        /* Deep dark */
--foreground: oklch(0.96 0.008 250)        /* Light text */
--primary: oklch(0.67 0.26 265.75)         /* Bright blue */
--accent: oklch(0.76 0.16 210)             /* Electric cyan */
--muted: oklch(0.17 0.012 250)             /* Deep slate */
```

#### Syntax Highlighting (Theme-Adaptive)
```css
/* Light Mode */
--syntax-string: oklch(0.58 0.16 163.23)   /* Emerald */
--syntax-number: oklch(0.68 0.18 65.28)    /* Amber */
--syntax-boolean: oklch(0.62 0.20 305.48)  /* Purple */
--syntax-key: oklch(0.44 0.14 264.05)      /* Deep blue */

/* Dark Mode */
--syntax-string: oklch(0.74 0.19 163)      /* Bright emerald */
--syntax-number: oklch(0.80 0.20 65)       /* Bright amber */
--syntax-boolean: oklch(0.74 0.24 305)     /* Bright purple */
--syntax-key: oklch(0.70 0.17 265)         /* Bright blue */
```

### Typography
- **UI Font**: Inter (400, 500, 600 weights)
- **Code Font**: JetBrains Mono (400, 500 weights)
- **Letter Spacing**: 0.02em for monospace
- **Loaded via**: Google Fonts in `index.html`

### Spacing & Layout
- **Border Radius**: `--radius: 0.75rem` (12px)
- **Card Padding**: `p-6` (24px) for main content
- **Section Gaps**: `gap-6` to `gap-8` for major sections
- **Max Width**: 1800px container with responsive padding
- **Grid Layout**: XL breakpoint uses 3-column grid (2:1 ratio)

### Component Styling Patterns
```tsx
// Glassmorphic Card
className="bg-card/70 backdrop-blur-md border-border/50 shadow-2xl"

// Gradient Text
className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent"

// Hover Scale Button
className="hover:scale-105 transition-all duration-200"

// Premium Shadow
className="shadow-2xl hover:shadow-[0_20px_70px_-15px_rgba(0,0,0,0.3)]"
```

### Animation Standards
- **Theme Transition**: 350ms cubic-bezier(0.4, 0, 0.2, 1)
- **Hover States**: 200ms transitions
- **Button Press**: 150ms with scale(0.98)
- **Tree Expand**: 250ms ease-out
- **Graph Physics**: Continuous D3 simulation
- **Modal Entry**: 300ms slide-in

---

## 🔧 Development Guidelines

### State Management Rules

#### Persistent State (useKV)
```tsx
// ✅ Use for data that survives page refresh
const [input, setInput] = useKV('visualizer-input', '')
const [history, setHistory] = useKV<any[]>('data-history', [])

// ⚠️ ALWAYS use functional updates with useKV
setHistory(current => [...current, newItem])  // ✅ Correct
setHistory([...history, newItem])             // ❌ Wrong (stale closure)
```

#### Temporary State (useState)
```tsx
// ✅ Use for UI state that doesn't need persistence
const [selectedPath, setSelectedPath] = useState<string[]>([])
const [showDialog, setShowDialog] = useState(false)
const [error, setError] = useState<string>('')
```

### Component Patterns

#### Tree View Recursion
```tsx
// TreeView.tsx uses recursive rendering
<TreeView nodes={nodes} onNodeUpdate={handleUpdate} />
// Nodes contain children array for recursion
```

#### Graph Data Flow
```
Raw Data → parseData() → buildTree() + buildGraph()
         → calculateStats() → analyzeGraph()
         → Render TreeView / GraphVisualization
```

#### Search Filtering
```tsx
// Filter nodes with useMemo for performance
const filteredNodes = useMemo(() => {
  return advancedSearchNodes(treeNodes, searchOptions)
}, [treeNodes, searchOptions])
```

### Performance Considerations
- **Virtual Scrolling**: Use `<ScrollArea>` for large lists
- **Memoization**: `useMemo` for expensive calculations
- **Debouncing**: Search input debounced (if needed)
- **Lazy Loading**: Components loaded on demand
- **Graph Limits**: Warn at 500+ nodes, 1000+ edges

### Error Handling
```tsx
try {
  const result = parseData(input, format)
  if (result.success) {
    // Handle success
    toast.success('Parsed successfully')
  } else {
    // Handle parse error
    setError(result.error)
    toast.error('Parse failed')
  }
} catch (error) {
  // Handle unexpected errors
  console.error(error)
  toast.error('Unexpected error')
}
```

### Analytics Integration
```tsx
import { gtmDataParsed, gtmFileLoaded, gtmViewChanged } from '@/lib/analytics'

// Track user actions
gtmDataParsed(format, success)
gtmFileLoaded('file', format)
gtmViewChanged('graph', 'force')
```

---

## 📦 Key Dependencies

### Core Libraries
```json
{
  "react": "19.0.0",
  "react-dom": "19.0.0",
  "typescript": "5.7.3",
  "vite": "6.3.5",
  "tailwindcss": "4.1.11"
}
```

### UI Components
```json
{
  "@radix-ui/react-*": "Latest",  // 20+ Radix primitives
  "@phosphor-icons/react": "2.1.7",
  "framer-motion": "12.6.3",
  "sonner": "2.0.1",              // Toast notifications
  "class-variance-authority": "0.7.1",
  "clsx": "2.1.1",
  "tailwind-merge": "3.0.2"
}
```

### Data & Visualization
```json
{
  "d3": "7.9.0",                  // 2D graphs
  "three": "0.175.0",             // 3D graphs
  "recharts": "2.15.1",           // Analytics charts
  "yaml": "2.8.1",                // YAML parsing
  "marked": "15.0.7"              // Markdown rendering
}
```

### Forms & Validation
```json
{
  "react-hook-form": "7.54.2",
  "zod": "3.25.76",
  "@hookform/resolvers": "4.1.3"
}
```

### Package Management
- **NEVER** manually edit `package.json`
- **ALWAYS** use the `npm` tool for installs
- **CHECK** installed packages before adding new ones
- **VERIFY** browser compatibility (no Node-only packages)

---

## 🚀 Spark Runtime Features

### Global `spark` Object
```tsx
// Available globally, no imports needed
window.spark.llm()      // LLM API
window.spark.kv         // Key-value store
window.spark.user()     // User info
```

### LLM Integration
```tsx
// Create prompts (REQUIRED pattern)
const prompt = spark.llmPrompt`Analyze this data: ${JSON.stringify(data)}`

// Execute LLM call
const result = await spark.llm(prompt, "gpt-4o")

// JSON mode (returns string-encoded JSON object)
const prompt = spark.llmPrompt`Generate 5 users as JSON with a "users" array property`
const jsonResult = await spark.llm(prompt, "gpt-4o", true)
const parsed = JSON.parse(jsonResult)
console.log(parsed.users) // Array of users
```

### KV Persistence
```tsx
// React Hook (PREFERRED)
import { useKV } from '@github/spark/hooks'
const [value, setValue, deleteValue] = useKV("key", defaultValue)

// Direct API (non-React)
await spark.kv.set("key", value)
const value = await spark.kv.get<Type>("key")
await spark.kv.delete("key")
const keys = await spark.kv.keys()
```

### User Context
```tsx
const user = await spark.user()
// Returns: { avatarUrl, email, id, isOwner, login }

if (user.isOwner) {
  // Show admin features
}
```

---

## 🎯 Common Tasks & Solutions

### Adding a New Data Format
1. Add type to `DataFormat` in `src/lib/parser.ts`
2. Implement parser function (follow `parseJSONL` pattern)
3. Add to `parseData()` switch statement
4. Update format detection in `detectFormat()`
5. Add icon to format selector in `App.tsx`
6. Update PRD.md with new format details

### Adding Analytics Metrics
1. Add metric calculation to `analyzeGraph()` in `graph-analyzer.ts`
2. Add to `GraphAnalytics` interface
3. Display in `GraphAnalyticsPanel.tsx` (use Tabs for organization)
4. Add tooltip explanations for complex metrics
5. Consider adding visualization (chart/progress bar)

### Adding Search Modes
1. Add mode to `SearchMode` type in `AdvancedSearch.tsx`
2. Implement filtering logic in `advancedSearchNodes()` (parser.ts)
3. Add mode selector button in `AdvancedSearch.tsx`
4. Add icon and tooltip
5. Track with `gtmSearchPerformed()`

### Modifying Graph Layouts
1. Edit layout logic in `GraphVisualization.tsx`
2. Update `applyLayout()` function for new layout type
3. Add layout selector tab
4. Ensure smooth transitions between layouts
5. Test with various data structures

### Adding Transformation Examples
1. Add to `TRANSFORM_EXAMPLES` in `DataTransformer.tsx`
2. Include clear description and safe code
3. Test with various data structures
4. Show expected output in description

### Theme Customization
1. Modify CSS variables in `src/index.css` (lines 137-223)
2. Update both `:root` (light) and `.dark` (dark) sections
3. Ensure WCAG AA contrast ratios (4.5:1 minimum)
4. Test graph visualizations in both modes
5. Update PRD.md color specifications

---

## 🐛 Troubleshooting Guide

### Common Issues

#### State Not Persisting
- ✅ Use `useKV` instead of `useState` for persistent data
- ✅ Use functional updates: `setValue(current => ...)`
- ❌ Don't use closure values with setters

#### Graph Not Rendering
- Check console for D3/Three.js errors
- Ensure data is parsed successfully (`parsedData` not null)
- Verify `graphData` has nodes and links
- Check SVG dimensions and viewBox
- Ensure theme colors are defined

#### Parse Errors
- Validate input format matches selected format
- Check for special characters or encoding issues
- Verify JSONL has one JSON object per line
- Ensure CSV has consistent column counts
- Check YAML indentation (spaces, not tabs)

#### Search Not Working
- Verify `filteredNodes` calculation in useMemo
- Check regex validity for regex mode
- Ensure search term is properly passed to filter
- Test with different search modes (text/regex/path)

#### Theme Not Applying
- Check if `.dark` class is on `<html>` element
- Verify CSS variable definitions in both modes
- Ensure `useTheme` hook is properly set up
- Check for hardcoded colors (should use theme vars)

#### Performance Issues
- Check data size (nodes count, depth)
- Monitor graph simulation (force layout can be CPU-heavy)
- Consider virtual scrolling for large trees
- Debounce search input if needed
- Use React DevTools Profiler

---

## 📝 Code Style & Conventions

### TypeScript
- Strict mode enabled
- Explicit types for function parameters
- Interface over type for objects
- Use `unknown` instead of `any` when possible
- Destructure props in function signatures

### React
- Functional components only (no classes)
- Custom hooks for reusable logic
- `useCallback` for functions passed as props
- `useMemo` for expensive computations
- Proper dependency arrays (no ESLint warnings)

### Naming Conventions
- Components: PascalCase (`TreeView.tsx`)
- Hooks: camelCase with `use` prefix (`useTheme.ts`)
- Utils: camelCase (`parser.ts`)
- Constants: UPPER_SNAKE_CASE (`EXAMPLE_JSON`)
- CSS classes: kebab-case or Tailwind utilities

### File Organization
```tsx
// 1. Imports (React, external, internal, components, utils, types)
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { parseData } from '@/lib/parser'

// 2. Types & Interfaces
interface Props { ... }
type DataFormat = 'json' | 'yaml'

// 3. Constants
const EXAMPLE_DATA = `...`

// 4. Component
export function Component({ ...props }: Props) {
  // 4a. State hooks
  const [state, setState] = useState()
  
  // 4b. Custom hooks
  const { theme } = useTheme()
  
  // 4c. Memoized values
  const computed = useMemo(() => ...)
  
  // 4d. Callbacks
  const handleClick = useCallback(() => ...)
  
  // 4e. Effects
  useEffect(() => ...)
  
  // 4f. Render
  return (...)
}
```

### Comments
- **DO NOT ADD** unless explicitly requested
- Code should be self-documenting
- Use descriptive variable/function names
- Complex algorithms get brief explanation only

### Imports
- Use `@/` alias for src imports
- Group imports logically
- Remove unused imports
- Import assets explicitly (never string paths)

```tsx
// ✅ Correct
import logoSvg from '@/assets/images/logo.svg'
<img src={logoSvg} alt="Logo" />

// ❌ Wrong
<img src="/src/assets/images/logo.svg" alt="Logo" />
```

---

## 🔒 Security & Best Practices

### Data Handling
- Sanitize user input before parsing
- Validate URLs before fetching
- Handle CORS errors gracefully
- Limit file sizes (warn at 10MB+)
- Catch and display parse errors safely

### Code Execution
- Sandbox JavaScript transformations
- Prevent infinite loops in transforms
- Validate transformation results
- Don't expose sensitive data in errors

### Dependencies
- Regular security audits (`npm audit`)
- Keep dependencies updated
- Only browser-compatible packages
- Avoid deprecated packages

### User Privacy
- No sensitive data logging
- Analytics anonymized (GTM)
- Local-first approach (useKV)
- No data sent to servers (except LLM opt-in)

---

## 📚 Additional Resources

### Key Documentation
- **PRD.md**: Full product requirements and design specs
- **README.md**: Project overview and setup
- **DEPLOYMENT.md**: Deployment configuration
- **SECURITY.md**: Security policies

### External Docs
- [React 19 Docs](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn/ui v4](https://ui.shadcn.com)
- [D3.js](https://d3js.org)
- [Three.js](https://threejs.org)
- [Radix UI](https://www.radix-ui.com)
- [Phosphor Icons](https://phosphoricons.com)

### Internal Patterns
- Review existing components before creating new ones
- Follow established patterns for consistency
- Reuse utility functions from `lib/`
- Leverage shadcn components over custom UI

---

## 🎯 Current State & Next Steps

### Completed Features ✅
- Multi-format parsing (JSON, YAML, JSONL, CSV)
- Dual visualization (Tree + 2D/3D Graph)
- Four graph layouts (Force, Tree, Radial, Grid)
- Advanced search with regex/path modes
- Comprehensive analytics & insights
- Data transformation tools
- Schema generation & comparison
- File/URL loading with drag & drop
- Export to multiple formats
- Keyboard shortcuts
- Theme system with persistence
- History management
- Google Analytics integration
- **Quick Actions Panel** (NEW)
- **Data Validation with Quality Scoring** (NEW)
- **Quick View for Selected Nodes** (NEW)
- **Favorites/Bookmarks System** (NEW)
- **Smart Suggestions Engine** (NEW)

### Known Issues 🐛
- 3D graph performance with large datasets (optimize rendering)
- CSV export edge cases (handle nested structures)
- Mobile graph interactions (improve touch handling)
- Deep nesting performance (virtual scrolling needed)

### Potential Enhancements 💡
- SQL query support
- XML/HTML parsing
- GraphQL schema introspection
- API endpoint testing
- Collaborative sharing (URL state)
- Custom theme builder
- Plugin system for extensions
- Offline PWA support
- Performance profiling dashboard
- Advanced filtering UI (query builder)
- Data validation rules
- Template library for common schemas

---

## 🤝 Working with AI Agents

### Effective Prompts
```
✅ Good: "Add a new metric to graph analytics showing the average node degree distribution as a bar chart"
❌ Bad: "Make the app better"

✅ Good: "Fix the 3D graph camera controls to prevent gimbal lock and add smooth zoom limits"
❌ Bad: "The 3D thing doesn't work right"

✅ Good: "Implement XML parsing support following the existing parseJSONL pattern in lib/parser.ts"
❌ Bad: "Add XML"
```

### When Making Changes
1. **Read existing code** before modifying
2. **Follow established patterns** (don't reinvent)
3. **Test thoroughly** with various data types
4. **Update PRD.md** if features change
5. **Check mobile responsiveness**
6. **Verify theme compatibility** (light + dark)
7. **Add analytics tracking** for new features
8. **Consider performance** impact

### Agent Workflow
```
1. Understand task requirements
2. Review relevant files (this doc + PRD.md + code)
3. Plan implementation approach
4. Check existing patterns to follow
5. Implement changes incrementally
6. Test in both themes
7. Verify responsive behavior
8. Update documentation if needed
9. Provide clear summary of changes
```

### Testing Checklist
- [ ] Works in light mode
- [ ] Works in dark mode
- [ ] Responsive on mobile (< 768px)
- [ ] Handles empty/invalid input
- [ ] No console errors/warnings
- [ ] TypeScript passes (no errors)
- [ ] Analytics events fire correctly
- [ ] Keyboard shortcuts work
- [ ] State persists (if using useKV)
- [ ] Accessible (keyboard navigation, screen readers)

---

## 🏆 Quality Standards

### Code Quality
- TypeScript strict mode: No `any` types
- ESLint: Zero warnings/errors
- Console: Clean (no errors in production)
- Performance: < 100ms for interactions
- Accessibility: WCAG AA compliance
- Bundle size: Monitor with Vite build

### UX Quality
- Animations smooth (60 fps)
- Loading states for async operations
- Error messages helpful and actionable
- Success feedback with toasts
- Consistent spacing and alignment
- Professional polish throughout

### Data Quality
- Parse accuracy > 99%
- Format detection > 95%
- Handle edge cases gracefully
- Support large datasets (10k+ nodes)
- Accurate analytics calculations
- Meaningful insights generation

---

## 📞 Support & Maintenance

### Regular Tasks
- Dependency updates (weekly)
- Security patches (immediate)
- Performance monitoring (ongoing)
- User feedback integration (continuous)
- Analytics review (weekly)
- Bug triage (daily)

### Deployment
- Production: Vercel (auto-deploy on main)
- Preview: PR deployments
- Environment: Node.js 20+
- Build: `npm run build`
- Dev: `npm run dev`

### Monitoring
- Google Analytics (GTM)
- Error tracking (console errors)
- Performance metrics (Core Web Vitals)
- User sessions (GA4)

---

**Last Updated**: 2024-03-21  
**Agent Version**: 2.0  
**Project Version**: 2.6.0 (Enhanced UX Update)

---

*This document is maintained for AI/LLM agents working on the DataScope codebase. Keep it updated as the project evolves.*
