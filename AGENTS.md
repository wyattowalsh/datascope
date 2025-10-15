# 🤖 AI Agent Context - DataScope Project

**Quick Reference for AI/LLM Agents working on the DataScope codebase**

---

## 📋 Project Overview

**DataScope** is a professional data exploration, visualization, and analytics platform for structured data formats. Built with React 19, TypeScript, and Vite, it provides multi-format parsing (JSON, YAML, JSONL, CSV), interactive visualizations (Tree, 2D/3D graphs), comprehensive analytics, and intelligent user assistance.

| Property | Value |
|----------|-------|
| **Live URL** | https://datascope.w4w.dev |
| **Version** | 2.6.0 (Enhanced UX Update) |
| **Tech Stack** | React 19, TypeScript 5.7, Vite 6.3, Tailwind CSS v4 |
| **UI Components** | shadcn/ui v4, Radix UI, Phosphor Icons |
| **Visualizations** | D3.js v7 (2D), Three.js v0.175 (3D) |
| **State Management** | React Hooks + useKV (persistent storage) |

---

## 🎯 Core Capabilities (15 Major Features)

### 1. Multi-Format Data Parsing
**Supported Formats**: JSON, YAML, JSONL, CSV, JSON5  
**Auto-Detection**: Intelligent format detection from content  
**Error Handling**: Detailed errors with line/column numbers  
**Files**: `src/lib/parser.ts`, `src/App.tsx` (lines 431-527)

### 2. Three Visualization Modes
- **Tree View**: Collapsible hierarchy with syntax highlighting
- **2D Graph**: D3.js force-directed with 4 layouts (Force, Tree, Radial, Grid)
- **3D Graph**: Three.js 3D visualization with orbit controls  
**Files**: `src/components/TreeView.tsx`, `src/components/GraphVisualization.tsx`, `src/components/Graph3DVisualization.tsx`

### 3. Quick Actions Panel (NEW in v2.6)
One-click operations: Prettify, Minify, Validate, Copy All, Export  
**Features**: Action history, visual feedback, smart disabling  
**Files**: `src/components/QuickActionsPanel.tsx`

### 4. Data Validation & Quality Scoring (NEW in v2.6)
Real-time analysis with 0-100 quality score  
**Detects**: Deep nesting, empty objects, duplicates, type issues, whitespace problems  
**Categorizes**: Errors, Warnings, Info with actionable suggestions  
**Files**: `src/components/DataValidator.tsx`

### 5. Quick View Panel (NEW in v2.6)
Live preview of selected nodes with type-specific rendering  
**Shows**: Type badge, value preview, metadata (length/count), copy button  
**Files**: `src/components/QuickViewPanel.tsx`

### 6. Favorites/Bookmarks (NEW in v2.6)
Save and navigate important data paths  
**Features**: Persistent storage, one-click navigation, path copying, depth indicators  
**Files**: `src/components/FavoritesPanel.tsx`

### 7. Smart Suggestions (NEW in v2.6)
Context-aware recommendations based on data structure  
**Suggests**: Graph view, Search, Transform, Analytics, Export  
**Logic**: Adapts to complexity, arrays, nesting, object size  
**Files**: `src/components/SmartSuggestionsPanel.tsx`

### 8. Advanced Search & Filtering
**Modes**: Text, Regex, Path-based queries  
**Options**: Case-sensitive, whole word, type filters  
**Files**: `src/components/AdvancedSearch.tsx`, `src/lib/parser.ts` (advancedSearchNodes)

### 9. Comprehensive Analytics
- **Statistics**: Node count, depth, type distribution
- **Graph Analytics**: Centrality, clustering, density, diameter
- **Performance Metrics**: Parse time, data size, complexity  
**Files**: `src/components/analytics/*` (7 analytics components)

### 10. Enhanced Export (IMPROVED in v2.6)
**Formats**: JSON, YAML, CSV, JSONL, TypeScript, Plain Text  
**Options**: Custom filenames, indent size, sort keys, metadata, flatten nested  
**Files**: `src/components/ExportDialog.tsx`

### 11. Data Transformation Tools
- **Schema Extraction**: Auto-generate JSON Schema
- **Data Transformer**: JavaScript transformation engine
- **Data Comparator**: JSON diff with path-based comparison  
**Files**: `src/components/SchemaExtractor.tsx`, `src/components/DataTransformer.tsx`, `src/components/DataComparator.tsx`

### 12. File I/O
**Input**: Paste, file upload (drag & drop), URL loading  
**Output**: Multi-format export with advanced options  
**Files**: `src/components/FileInput.tsx`, `src/components/ExportDialog.tsx`

### 13. Formatting & Linting
JSON/YAML prettify, minify, alphabetical sorting, lint errors  
**Files**: `src/lib/formatter.ts`, `src/components/FormatOptionsDialog.tsx`, `src/components/LintErrorsDisplay.tsx`

### 14. Persistence & History
**useKV Hook**: Persistent storage survives page refresh  
**History**: Last 10 datasets with timestamps, quick restore  
**Files**: `src/components/DataHistory.tsx`, imports from `@github/spark/hooks`

### 15. Keyboard Shortcuts & Theme
**Shortcuts**: Ctrl+P (parse), Ctrl+E (export), Ctrl+K (search), etc.  
**Theme**: Light/dark mode with 350ms smooth transitions, OKLCH colors  
**Files**: `src/components/ShortcutsDialog.tsx`, `src/hooks/use-theme.ts`, `src/index.css`

---

## 🏗️ Architecture

### Project Structure
```
/workspaces/spark-template/
├── src/
│   ├── App.tsx                      # Main app (1200+ lines)
│   ├── main.tsx, main.css           # DO NOT EDIT (structural)
│   ├── index.css                    # Theme & custom styles
│   ├── components/
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
```typescript
// For UI state that doesn't need persistence
const [selectedPath, setSelectedPath] = useState<string[]>([])
const [showDialog, setShowDialog] = useState(false)
const [error, setError] = useState<string>('')
```

### Data Flow
```
User Input → detectFormat() → parseData() 
           → buildTree() + buildGraph() 
           → calculateStats() + analyzeGraph()
           → Render: TreeView / GraphVisualization / Analytics
```

---

## 🎨 Design System

### Color Palette (OKLCH)

#### Light Mode
```css
--background: oklch(0.985 0.001 247.86)   /* Near-white */
--foreground: oklch(0.12 0.01 250)        /* Dark text */
--primary: oklch(0.56 0.21 264.05)        /* Vibrant blue */
--accent: oklch(0.66 0.15 210.42)         /* Bright cyan */
--muted: oklch(0.965 0.003 247.86)        /* Soft slate */
```

#### Dark Mode
```css
--background: oklch(0.10 0.012 250)       /* Deep dark */
--foreground: oklch(0.96 0.008 250)       /* Light text */
--primary: oklch(0.67 0.26 265.75)        /* Bright blue */
--accent: oklch(0.76 0.16 210)            /* Electric cyan */
--muted: oklch(0.17 0.012 250)            /* Deep slate */
```

### Typography
- **UI Font**: Inter (400, 500, 600) - Loaded via Google Fonts
- **Code Font**: JetBrains Mono (400, 500) - Letter-spacing: 0.02em
- **Loaded in**: `index.html` (lines 31-33)

### Component Patterns
```tsx
// Glassmorphic Card
className="bg-card/70 backdrop-blur-md border-border/50 shadow-2xl"

// Gradient Text
className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent"

// Hover Scale
className="hover:scale-105 transition-all duration-200"
```

### Animation Standards
- **Theme Transition**: 350ms cubic-bezier(0.4, 0, 0.2, 1)
- **Hover States**: 200ms
- **Modals**: 300ms slide-in
- **Defined in**: `src/index.css` (lines 21-135)

---

## 🔧 Development Guidelines

### Critical Rules

#### 1. Package Management
```bash
# ❌ NEVER manually edit package.json
# ✅ ALWAYS use npm tool
npm install <package>

# ✅ CHECK installed packages first
npm list --depth=0

# ✅ VERIFY browser compatibility (no Node-only packages)
```

#### 2. File Restrictions
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

#### 3. Import Conventions
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

#### 4. Code Style
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

#### 5. Comments Policy
**DO NOT ADD COMMENTS** unless explicitly requested. Code should be self-documenting with descriptive names.

---

## 🚀 Spark Runtime

### Global `spark` Object
```typescript
// Available globally, no imports needed
window.spark.llm()      // LLM API
window.spark.kv         // Key-value store
window.spark.user()     // User info
```

### LLM Integration
```typescript
// ✅ REQUIRED: Use spark.llmPrompt
const prompt = spark.llmPrompt`Analyze this: ${JSON.stringify(data)}`

// Execute (models: gpt-4o, gpt-4o-mini)
const result = await spark.llm(prompt, "gpt-4o")

// JSON mode (returns string-encoded object with properties)
const prompt = spark.llmPrompt`Generate 5 users as JSON with a "users" array property`
const jsonResult = await spark.llm(prompt, "gpt-4o", true)
const parsed = JSON.parse(jsonResult)
console.log(parsed.users) // Array of users
```

### KV Persistence
```typescript
// React Hook (PREFERRED)
import { useKV } from '@github/spark/hooks'
const [value, setValue, deleteValue] = useKV("key", defaultValue)

// Direct API (non-React)
await spark.kv.set("key", value)
const value = await spark.kv.get<Type>("key")
const keys = await spark.kv.keys()
await spark.kv.delete("key")
```

### User Context
```typescript
const user = await spark.user()
// Returns: { avatarUrl, email, id, isOwner, login }

if (user.isOwner) {
  // Show admin features
}
```

---

## 📝 Common Tasks & Solutions

### Adding a New Feature Component

1. **Create component** in `src/components/` (or `src/components/analytics/` if analytics-related)
2. **Import dependencies**: shadcn components, hooks, types
3. **Define interface** for props with TypeScript
4. **Implement component** following existing patterns
5. **Use useKV** for persistent state if needed
6. **Add to App.tsx** in appropriate section
7. **Update AGENTS.md** feature list (this file)

### Adding Export Format

1. **Update type**: Add to `ExportFormat` in `ExportDialog.tsx`
2. **Add UI**: New RadioGroupItem with icon
3. **Implement logic**: Add case to `handleExport()` switch
4. **Add options**: Format-specific settings if needed
5. **Test**: With various data structures
6. **Update docs**: Add to changelog and features

### Adding Graph Layout

1. **Update GraphVisualization.tsx**: Add layout to `applyLayout()` function
2. **Add tab**: New TabsTrigger in visualization panel
3. **Test**: Ensure smooth transitions between layouts
4. **Verify**: Works with various data structures

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
- ✅ Use functional updates: `setValue(current => ...)`
- ❌ Don't use closure values with setters

### Graph Not Rendering
- Check console for D3/Three.js errors
- Verify `parsedData` is not null
- Ensure `graphData` has nodes and links
- Check SVG dimensions and viewBox

### Parse Errors
- Validate format matches selected format
- Check for encoding issues
- Verify JSONL has one object per line
- Ensure CSV has consistent columns
- Check YAML indentation (spaces, not tabs)

### Theme Not Applying
- Verify `.dark` class on `<html>` element
- Check CSS variable definitions in both modes
- Ensure using theme vars, not hardcoded colors
- Test with `useTheme` hook

### Performance Issues
- Check data size (node count, depth)
- Monitor graph simulation (CPU-heavy)
- Consider virtual scrolling for large trees
- Use React DevTools Profiler

---

## 📚 Key Documentation Files

| File | Purpose | Location |
|------|---------|----------|
| **AGENTS.md** | This file - AI agent reference | Root directory |
| **PRD.md** | Product requirements & design | Root directory |
| **README.md** | Project overview & setup | Root directory |
| **Docs.tsx** | Full documentation (NEW) | `src/pages/Docs.tsx` |
| **package.json** | Dependencies (use npm tool) | Root directory |

### Documentation Access
All documentation is now integrated into the app:
- In-app: Click Documentation button in header
- Includes: Getting Started, Features, Architecture, API, Development, Changelog, Deployment, Security

---

## ✅ Quality Standards

### Code Quality
- TypeScript strict mode: No `any` types
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
- Support large datasets (10k+ nodes)
- Accurate analytics
- Meaningful insights

---

## 🎯 Recent Changes (v2.6.0)

### NEW Features
1. ✅ **Quick Actions Panel** - One-click operations with history
2. ✅ **Data Validation** - Quality scoring with issue detection
3. ✅ **Quick View Panel** - Type-specific node previews
4. ✅ **Favorites System** - Bookmark important paths
5. ✅ **Smart Suggestions** - Context-aware recommendations
6. ✅ **Enhanced Export** - TypeScript, Text formats + advanced options
7. ✅ **Integrated Docs** - All documentation in app (Changelog, Deployment, Security)

### Updated Files
- `src/components/ExportDialog.tsx` - Major enhancement
- `src/pages/Docs.tsx` - Complete documentation integration
- `src/components/DocsLayout.tsx` - Added new nav items
- `AGENTS.md` - This file - restructured and improved

### Removed/Deprecated
- Standalone `.md` files now integrated into `Docs.tsx`
- Old export logic replaced with enhanced version

---

## 🤝 Working with AI Agents

### Effective Prompts
```
✅ Good: "Add a bar chart showing node degree distribution to GraphAnalyticsPanel"
❌ Bad: "Make analytics better"

✅ Good: "Fix 3D graph camera gimbal lock and add zoom limits (min: 5, max: 50)"
❌ Bad: "3D thing broken"

✅ Good: "Add XML parsing following parseJSONL pattern in lib/parser.ts"
❌ Bad: "Add XML support"
```

### Workflow Checklist
- [ ] Review this file + PRD.md + relevant code
- [ ] Understand existing patterns
- [ ] Plan implementation approach
- [ ] Implement incrementally
- [ ] Test in both themes
- [ ] Verify responsive behavior
- [ ] Check TypeScript (no errors)
- [ ] Update documentation if needed
- [ ] Provide clear summary

### Testing Checklist
- [ ] Works in light mode
- [ ] Works in dark mode
- [ ] Responsive on mobile (< 768px)
- [ ] Handles empty/invalid input
- [ ] No console errors
- [ ] TypeScript passes
- [ ] Analytics fire correctly
- [ ] Keyboard shortcuts work
- [ ] State persists (if useKV)
- [ ] Accessible (keyboard, screen readers)

---

## 📞 Support

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
- Error tracking (console)
- Performance (Core Web Vitals)

---

**Last Updated**: 2024-03-21  
**Agent Version**: 3.0  
**Project Version**: 2.6.0 (Enhanced UX + Export + Docs Update)

---

*This document is the primary reference for AI/LLM agents. Keep it current as the project evolves.*
