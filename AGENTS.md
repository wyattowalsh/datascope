# AGENTS.md

DataScope is a professional data exploration, visualization, and analytics platform for structured data. This file provides context and instructions for AI coding agents.

## Project overview

- **Live URL**: <https://datascope.w4w.dev\>
- **Version**: 2.7.0
- **Tech**: React 19, TypeScript 5.7, Vite 6.3, Tailwind CSS v4
- **UI**: shadcn/ui v4, Radix UI, Phosphor Icons
- **Viz**: D3.js v7 (2D), Three.js v0.175 (3D)
- **State**: useKV (IndexedDB)
- **Workers**: Off-thread parsing
- **Query**: JSONPath

## Setup commands

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Package management

- ❌ **NEVER** manually edit `package.json`
- ✅ **ALWAYS** use `npm install <package>`
- ✅ **CHECK** installed packages: `npm list --depth=0`
- ✅ **VERIFY** browser compatibility (no Node-only packages)

## File restrictions

**DO NOT EDIT** these files (structural):

- `src/main.tsx`
- `src/main.css`
- `vite.config.ts`

**SAFE TO EDIT** (application code):

- `src/App.tsx`
- `src/index.css`
- All files in `src/components/`
- All files in `src/lib/`
- All files in `src/pages/`

## Code style

### TypeScript

- Strict mode enabled
- Explicit types for parameters
- No `any` types
- ESLint: Zero warnings/errors

### React patterns

- Functional components only
- React hooks for state
- Memoization for expensive computations
- Callbacks for event handlers

### Naming conventions

- Components: `PascalCase` (TreeView.tsx)
- Functions: `camelCase` (parseData)
- Constants: `UPPER_SNAKE_CASE` (EXAMPLE_JSON)
- CSS: `kebab-case` or Tailwind classes

### Imports

```typescript
// ✅ Correct asset imports
import logoSvg from '@/assets/images/logo.svg'

// ✅ Use @ alias for src imports
import { parseData } from '@/lib/parser'
import { Button } from '@/components/ui/button'

// ❌ Wrong (string paths)
<img src="/src/assets/images/logo.svg" alt="Logo" />
```

### State management

```typescript
// ✅ Persistent state (survives refresh)
const [input, setInput] = useKV('key', defaultValue)

// ✅ CRITICAL: Always use functional updates
setHistory(current => [...current, newItem])

// ❌ Wrong (stale closure)
setHistory([...history, newItem])

// ✅ Temporary UI state
const [showDialog, setShowDialog] = useState(false)
```

## Testing instructions

Before committing:

- [ ] Works in light mode
- [ ] Works in dark mode
- [ ] Responsive on mobile (< 768px)
- [ ] Handles empty/invalid input
- [ ] No console errors
- [ ] TypeScript passes
- [ ] State persists if using useKV
- [ ] Keyboard shortcuts work (if applicable)

## Task completion workflow

When you complete a task, **ALWAYS** document it in the changelog:

```bash
# 1. Make your code changes
# 2. Test thoroughly
# 3. Add changelog entry (REQUIRED)
cat >> content/docs/changelog.mdx << 'EOF'

## YYYY-MM-DD - [Brief Title]

### Added
- New feature or component added

### Changed
- What was modified and why

### Fixed
- Bugs that were resolved
EOF

# 4. Commit changes (including changelog update)
```

**Never** create separate summary files like:
- `TASK_SUMMARY.md`
- `WORK_COMPLETED.md`
- `CHANGES_MADE.md`

All task summaries belong in `content/docs/changelog.mdx`.

## Key architecture

### Data flow

```
User Input → detectFormat() → parseData()
           → buildTree() + buildGraph()
           → calculateStats() + analyzeGraph()
           → Render: TreeView / GraphVisualization / Analytics
```

### State patterns

- **useKV**: Data that survives page refresh (input, history, favorites)
- **useState**: Temporary UI state (dialogs, selections, errors)

### Performance

- **Web Workers**: Off-thread parsing for large files
- **Virtualization**: Tree rendering for 10k+ nodes
- **Canvas Mode**: 2D graphs switch to canvas for >5k nodes
- **LOD**: Level-of-detail in 3D for smooth 60 FPS

## Common tasks

### Adding a new component

1. Create file in `src/components/` (or `src/components/analytics/` if analytics)
2. Import shadcn components, hooks, types
3. Define TypeScript interface for props
4. Use useKV for persistent state if needed
5. Add to `App.tsx` in appropriate section
6. Test in both themes and mobile

### Adding export format

1. Update `ExportFormat` type in `ExportDialog.tsx`
2. Add RadioGroupItem with icon
3. Implement logic in `handleExport()` switch
4. Add format-specific options if needed
5. Test with various data structures

### Adding graph layout

1. Update `GraphVisualization.tsx` - add to `applyLayout()` function
2. Add TabsTrigger in visualization panel
3. Test smooth transitions between layouts
4. Verify works with various data structures

## Security

- **Local-First**: All processing in browser
- **No Server Storage**: Data never leaves your device
- **No External Requests**: Data not sent to servers (except optional LLM)
- **Browser Storage**: IndexedDB via useKV only

## Deployment

- **Production**: Vercel (auto-deploy on main)
- **Domain**: datascope.w4w.dev
- **GTM**: GTM-KDKW33HQ

## Documentation rules

### ❌ DO NOT create ad-hoc documentation files

**NEVER** create standalone documentation files like:
- `NOTES.md` / `TODO.md` / `SUMMARY.md`
- `CHANGES.md` / `UPDATES.md` / `RELEASE_NOTES.md`
- `MIGRATION.md` / `UPGRADE_GUIDE.md`
- `*_NOTES.md` / `*_GUIDE.md` / `*_DOCS.md`
- `IMPLEMENTATION.md` / `DESIGN.md` / `ARCHITECTURE_NOTES.md`
- Any other root-level or random `.md` files

**This includes**:
- Task summaries → Add to `content/docs/changelog.mdx`
- Implementation notes → Add to relevant doc page or inline code comments
- Architecture decisions → Update `content/docs/architecture.mdx`
- API changes → Update `content/docs/api.mdx`
- Migration guides → Update `content/docs/changelog.mdx` or create versioned guide
- Feature documentation → Update `content/docs/features.mdx`

### ✅ ALWAYS add documentation to the docs site

**ALL** documentation, notes, guides, summaries, and explanations must go in `content/docs/`:

1. **For changes/updates**: Add entry to `content/docs/changelog.mdx`
2. **For new topics**: Create a new `.mdx` file in `content/docs/`
3. **For existing topics**: Edit the relevant `.mdx` file
4. **For code notes**: Add inline comments or docstrings in the code itself

**Example workflows**:

```bash
# ❌ WRONG - creates ad-hoc summary file
echo "Completed feature X, updated components Y and Z" > SUMMARY.md

# ✅ CORRECT - adds to changelog
cat >> content/docs/changelog.mdx << 'EOF'

## 2025-01-16 - Feature X

### Added
- Feature X implementation in components Y and Z
- New functionality for handling edge case A

### Changed
- Refactored component Y for better performance
EOF
```

```bash
# ❌ WRONG - creates migration notes file
echo "Migration steps..." > MIGRATION_NOTES.md

# ✅ CORRECT - adds to docs site
cat > content/docs/migrations.mdx << 'EOF'
---
title: "Migrations"
description: "Migration guides and version upgrade notes"
---

## Version 2.7 Migration

Step-by-step migration instructions...
EOF

# Then update meta.json and Docs.tsx
```

```bash
# ❌ WRONG - creates implementation notes
echo "Design decisions..." > IMPLEMENTATION.md

# ✅ CORRECT - adds to architecture docs
# Edit content/docs/architecture.mdx directly
# OR add inline code comments for implementation details
```

### Documentation structure

- `content/docs/` - All user-facing documentation (MDX format)
- `AGENTS.md` - Instructions for AI coding agents (this file)
- `content/docs/AGENTS.md` - Context for working with docs
- `src/AGENTS.md` - Context for working with app code
- Inline comments - Code-level documentation

## Nested AGENTS.md files

For subsystem-specific context:

- `content/docs/AGENTS.md` - Documentation system (MDX, meta.json, rendering)
- `src/AGENTS.md` - Application components (React, hooks, visualizations)

---

**Last Updated**: 2025-01-16  
**Version**: 5.0 (Community Best Practices)
