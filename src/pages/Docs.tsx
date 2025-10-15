import { useState, useEffect } from 'react'
import { DocsLayout } from '@/components/DocsLayout'
import { marked } from 'marked'
import { useKV } from '@github/spark/hooks'

const docContent: Record<string, string> = {
  'index': `# Welcome to DataScope

## Introduction

DataScope is a comprehensive data exploration and visualization platform built with React and TypeScript. It provides powerful tools for parsing, analyzing, and visualizing structured data formats including JSON, YAML, JSONL, and CSV.

## Key Features

### Multi-Format Support
- **JSON** - Parse and visualize JSON with syntax highlighting
- **YAML** - Full YAML support with Kubernetes manifests
- **JSONL** - Line-delimited JSON for log analysis
- **CSV** - Tabular data visualization and analysis

### Visualization Modes
- **Tree View** - Hierarchical data exploration with expand/collapse
- **2D Graph** - Force-directed graph layouts with multiple algorithms
- **3D Graph** - Three.js-powered 3D visualization

### Advanced Analytics
- Real-time performance metrics
- Graph topology analysis
- Data quality validation
- Smart suggestions based on data structure

### Developer Tools
- Schema extraction
- Data transformation
- Data comparison
- Export to multiple formats

## Quick Start

1. Paste or load your data into the input area
2. Click **Parse** to analyze the data
3. Explore using Tree, 2D Graph, or 3D Graph views
4. Use advanced search, filters, and analytics panels

## Architecture

DataScope is built using:
- **React 19** with TypeScript
- **Tailwind CSS v4** for styling
- **shadcn/ui** component library
- **D3.js** for 2D visualizations
- **Three.js** for 3D rendering
- **Spark KV** for persistent storage`,

  'getting-started': `# Getting Started

## Installation & Setup

DataScope is a Spark application built with React and Vite. To run it locally:

\`\`\`bash
npm install
npm run dev
\`\`\`

The app will be available at the URL provided by Vite.

## Loading Data

### Paste Data Directly
Simply paste your JSON, YAML, JSONL, or CSV data into the text area. The format will be automatically detected.

### Load from File
Use the **File Input** panel on the right sidebar to:
- Upload files from your computer
- Load data from URLs
- Access recent history

### Try Examples
Click the **Examples** dropdown to load sample data:
- JSON - Organization structure
- YAML - Kubernetes deployment
- JSONL - Application logs
- CSV - User analytics

## Understanding the Interface

### Main Input Area
- Large textarea for pasting or editing data
- Format detection badge showing the detected format
- Tools dropdown for formatting and minifying
- Parse button to process the data

### Visualization Panel
After parsing, you'll see three view modes:
- **Tree** - Hierarchical structure with expand/collapse
- **2D Graph** - Interactive force-directed graph
- **3D Graph** - 3D spatial visualization

### Right Sidebar
Multiple analysis panels:
- Quick Actions - Common operations
- Advanced Search - Regex and type filters  
- Smart Suggestions - Context-aware recommendations
- Quick View - Selected node details
- Favorites - Save important paths
- Data Validator - Quality checks
- Performance Metrics
- Statistics Panel
- Graph Analytics

## Basic Workflow

1. **Load Data** - Paste, upload, or use examples
2. **Parse** - Click the Parse button (or press \`Cmd/Ctrl + S\`)
3. **Explore** - Navigate the tree or graph visualization
4. **Search** - Use advanced search to find specific values
5. **Analyze** - Review statistics and analytics
6. **Transform** - Apply transformations if needed
7. **Export** - Download in various formats

## Keyboard Shortcuts

Press \`?\` to view all keyboard shortcuts. Common ones:

- \`Cmd/Ctrl + S\` - Parse data
- \`Cmd/Ctrl + /\` - Focus search
- \`Cmd/Ctrl + E\` - Export data
- \`Cmd/Ctrl + T\` - Toggle theme
- \`Cmd/Ctrl + 1\` - Switch to Tree view
- \`Cmd/Ctrl + 2\` - Switch to Graph view

## Next Steps

- Learn about Features
- Explore the Architecture
- View API Reference`,

  'features': `# Features

## Data Parsing & Validation

### Multi-Format Support

DataScope automatically detects and parses multiple data formats:

**JSON**
- Full JSON5 support
- Syntax highlighting
- Lint errors with line numbers
- Pretty printing and minification

**YAML**
- Complete YAML 1.2 support
- Kubernetes manifests
- Multi-document support

**JSONL**
- Line-delimited JSON
- Log file analysis
- Streaming data support

**CSV**
- Header detection
- Type inference
- Large file support

### Data Validation

The Data Validator panel provides:
- Type consistency checks
- Missing value detection
- Duplicate key identification
- Schema validation suggestions

## Visualization

### Tree View

Hierarchical exploration with:
- Expandable/collapsible nodes
- Path selection and copying
- Type-based color coding
- Syntax-highlighted values
- Expand all / Collapse all

### 2D Graph Visualization

Force-directed graph with multiple layouts:
- **Force** - Physics-based simulation
- **Tree** - Hierarchical tree layout
- **Radial** - Circular radial layout
- **Grid** - Organized grid layout

Features:
- Node click to select
- Zoom and pan
- Dynamic physics
- Edge highlighting

### 3D Graph Visualization

Three.js-powered 3D rendering:
- Interactive 3D navigation
- Mouse orbit controls
- Spatial relationships
- Depth perception

## Search & Filtering

### Advanced Search

Multiple search modes:
- **Text** - Simple text matching
- **Regex** - Regular expression patterns
- **Path** - JSONPath-style queries
- **Value** - Type-specific filtering

Options:
- Case sensitive matching
- Whole word only
- Type filters (string, number, boolean, null, object, array)

## Analytics

### Performance Metrics
- Parse time
- Data size (bytes)
- Node count
- Edge count

### Statistics Panel
- Total nodes
- Total keys
- Maximum depth
- Data types distribution

### Graph Analytics
- Node degree centrality
- Clustering coefficient
- Average path length
- Graph density

## Data Tools

### Schema Extraction
Generate schemas from data:
- TypeScript interfaces
- JSON Schema
- Zod schemas

### Data Transformation
Transform your data:
- Key renaming
- Value mapping
- Filtering
- Sorting

### Export Options
Export to multiple formats:
- JSON (formatted/minified)
- YAML
- CSV
- TypeScript types`,

  'architecture': `# Architecture

## Technology Stack

### Core Framework
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tooling and HMR

### UI Framework
- **Tailwind CSS v4** - Utility-first CSS with new engine
- **shadcn/ui v4** - Composable component library
- **Radix UI** - Accessible primitives
- **Phosphor Icons** - Duotone icon system

### Data Processing
- **YAML** - YAML parsing library
- **D3.js** - Data visualization and graph layouts
- **Three.js** - 3D rendering and WebGL

### State Management
- **React Hooks** - Built-in state management
- **Spark KV Store** - Persistent key-value storage
- **useKV Hook** - Reactive persistent state

## Project Structure

\`\`\`
spark-template/
├── src/
│   ├── App.tsx                 # Main application component
│   ├── components/
│   │   ├── ui/                 # shadcn components (40+)
│   │   ├── TreeView.tsx        # Hierarchical tree visualization
│   │   ├── GraphVisualization.tsx    # 2D graph with D3
│   │   ├── Graph3DVisualization.tsx  # 3D graph with Three.js
│   │   └── analytics/          # Analytics components
│   ├── lib/
│   │   ├── parser.ts           # Data parsing logic
│   │   ├── formatter.ts        # Formatting utilities
│   │   ├── graph-analyzer.ts   # Graph algorithms
│   │   └── utils.ts            # Shared utilities
│   └── pages/
│       └── Docs.tsx            # Documentation page
├── content/docs/               # Documentation (MDX)
└── package.json
\`\`\`

## Core Components

### App.tsx
Main application orchestrator:
- State management for parsed data
- View mode switching (tree/2D/3D)
- Search and filter coordination
- History tracking
- Analytics integration

### Parser (lib/parser.ts)
Multi-format parsing engine:
- Format detection heuristics
- JSON/JSON5/JSONL parsing
- YAML parsing
- CSV parsing with type inference
- Tree structure building

### Graph Analyzer (lib/graph-analyzer.ts)
Graph computation engine:
- Node and edge extraction
- Topology metrics
- Path analysis
- Connected components

## State Management

### Local State (useState)
Used for transient UI state:
- Current input value
- View mode selection
- Dialog visibility

### Persistent State (useKV)
Used for cross-session data:
- Input data
- User preferences
- Search history
- Favorites

## Performance Optimizations

### Parsing
- Early format detection
- Streaming for large files
- Worker thread consideration

### Rendering
- Virtual scrolling for large trees
- Canvas for 2D graphs at scale
- LOD for 3D
- Memoization

## Design System

### Color System (OKLCH)
- Perceptually uniform color space
- Consistent contrast ratios
- Dark/light theme support

### Typography
- Inter for UI text
- JetBrains Mono for code
- Clear hierarchy`,

  'api': `# API Reference

## Parser API

### parseData()

Parse data from a string into a structured format.

\`\`\`typescript
function parseData(
  data: string,
  format: DataFormat
): ParseResult

interface ParseResult {
  success: boolean
  data?: any
  error?: string
  format?: DataFormat
}
\`\`\`

### buildTree()

Convert parsed data into a hierarchical tree structure.

\`\`\`typescript
function buildTree(data: any): TreeNode[]

interface TreeNode {
  key: string
  value: any
  type: ValueType
  path: string[]
  isExpanded: boolean
  children?: TreeNode[]
}
\`\`\`

### calculateStats()

Calculate statistics about the data structure.

\`\`\`typescript
function calculateStats(data: any): DataStats

interface DataStats {
  totalNodes: number
  totalKeys: number
  maxDepth: number
  types: Record<ValueType, number>
}
\`\`\`

## Formatter API

### formatJSON()

Format JSON with customizable options.

\`\`\`typescript
function formatJSON(
  data: string,
  options: FormatOptions
): FormatResult

interface FormatOptions {
  indent: number
  trailingComma: boolean
  quoteStyle: 'single' | 'double'
}
\`\`\`

### minifyJSON()

Remove all whitespace from JSON.

\`\`\`typescript
function minifyJSON(data: string): FormatResult
\`\`\`

## Graph API

### buildGraph()

Extract graph structure from data.

\`\`\`typescript
function buildGraph(data: any): GraphData

interface GraphData {
  nodes: GraphNode[]
  links: GraphLink[]
}
\`\`\`

### analyzeGraph()

Perform topology analysis on a graph.

\`\`\`typescript
function analyzeGraph(graph: GraphData): GraphAnalytics

interface GraphAnalytics {
  nodeCount: number
  edgeCount: number
  avgDegree: number
  density: number
}
\`\`\`

## Spark KV API

### useKV Hook

React hook for persistent reactive state.

\`\`\`typescript
function useKV<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void]
\`\`\`

**Example:**
\`\`\`typescript
const [todos, setTodos, deleteTodos] = useKV('todos', [])

// Set with function
setTodos(current => [...current, newTodo])
\`\`\`

## Component Props

### TreeView

\`\`\`typescript
interface TreeViewProps {
  nodes: TreeNode[]
  onNodeUpdate: (path: string[], isExpanded: boolean) => void
  selectedPath: string[]
  onSelectNode: (path: string[]) => void
}
\`\`\`

### GraphVisualization

\`\`\`typescript
interface GraphVisualizationProps {
  data: GraphData
  onNodeClick: (nodeId: string) => void
  selectedNodeId?: string
}
\`\`\``,

  'development': `# Development Guide

## Development Setup

### Prerequisites

- Node.js 18+ 
- npm 8+
- Modern browser with ES2022 support

### Installation

\`\`\`bash
git clone <repository-url>
cd spark-template
npm install
\`\`\`

### Development Server

\`\`\`bash
npm run dev
\`\`\`

Vite will start the dev server with hot module replacement (HMR).

## Code Style

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Define interfaces for component props
- Use type inference when obvious

### React

- Use functional components
- Prefer hooks over classes
- Extract custom hooks for reusable logic
- Memoize expensive computations

### Naming Conventions

- **Components**: PascalCase (\`TreeView\`, \`DataValidator\`)
- **Functions**: camelCase (\`parseData\`, \`buildGraph\`)
- **Constants**: UPPER_SNAKE_CASE (\`MAX_DEPTH\`)
- **Types/Interfaces**: PascalCase (\`TreeNode\`, \`GraphData\`)

## Adding New Features

### 1. New Data Format Support

To add support for a new format:

1. Add format to \`DataFormat\` type in \`lib/parser.ts\`
2. Implement parser function
3. Add format detection logic
4. Update format options in UI

### 2. New Visualization Mode

To add a new visualization:

1. Create component in \`src/components/\`
2. Add view mode to state
3. Add tab in visualization panel
4. Implement render logic

### 3. New Analysis Panel

To add an analysis panel:

1. Create component in \`src/components/\`
2. Add to sidebar in \`App.tsx\`
3. Implement analysis logic

## State Management Patterns

### Local UI State

\`\`\`typescript
const [isOpen, setIsOpen] = useState(false)
\`\`\`

### Persistent State

\`\`\`typescript
const [userPrefs, setUserPrefs] = useKV('preferences', {
  theme: 'light'
})
\`\`\`

### Derived State

\`\`\`typescript
const filteredNodes = useMemo(
  () => searchNodes(nodes, searchTerm),
  [nodes, searchTerm]
)
\`\`\`

## Performance Optimization

### Memoization

\`\`\`typescript
const expensiveValue = useMemo(
  () => computeExpensiveValue(data),
  [data]
)
\`\`\`

### Callback Stability

\`\`\`typescript
const handleClick = useCallback((id: string) => {
  performAction(id)
}, [])
\`\`\`

## Building for Production

\`\`\`bash
npm run build
\`\`\`

Output will be in \`dist/\` directory.

## Git Workflow

### Branching

- \`main\` - production-ready code
- \`develop\` - integration branch
- \`feature/*\` - new features
- \`fix/*\` - bug fixes

### Commit Messages

Follow conventional commits:

\`\`\`
feat: add CSV export functionality
fix: resolve graph rendering issue
docs: update API reference
\`\`\`

## Troubleshooting

### Build Errors

**Issue**: TypeScript errors during build
**Solution**: Run \`npm run type-check\`

**Issue**: Vite dependency pre-bundling fails
**Solution**: Clear cache with \`rm -rf node_modules/.vite\`

### Performance Issues

**Issue**: Slow rendering on large datasets
**Solution**: Implement virtualization or pagination

**Issue**: Memory leaks
**Solution**: Clean up effects and event listeners`
}

export function Docs({ onBackToApp }: { onBackToApp?: () => void } = {}) {
  const [currentPage, setCurrentPage] = useKV<string>('docs-current-page', 'index')
  const [html, setHtml] = useState('')

  useEffect(() => {
    async function render() {
      const content = docContent[currentPage as keyof typeof docContent] || docContent['index']
      marked.setOptions({
        breaks: true,
        gfm: true,
      })
      const htmlContent: string = (await marked.parse(content)) || ''
      setHtml(htmlContent)
    }
    render()
  }, [currentPage])

  return (
    <DocsLayout currentPage={currentPage} onPageChange={setCurrentPage} onBackToApp={onBackToApp}>
      <div 
        className="prose prose-sm md:prose-base max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </DocsLayout>
  )
}
