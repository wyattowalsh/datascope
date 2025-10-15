import { useState, useEffect } from 'react'
import { DocsLayout } from '@/components/DocsLayout'
import { marked } from 'marked'
import { useKV } from '@github/spark/hooks'

const docContent: Record<string, string> = {
  'index': `# DataScope Documentation

Welcome to the comprehensive documentation for DataScope - your professional data visualization and analytics platform.

## What is DataScope?

DataScope is a powerful, user-friendly web application for exploring, visualizing, and analyzing structured data. It supports JSON, YAML, JSONL, and CSV formats with intelligent parsing, interactive visualizations, and comprehensive analytics.

## Quick Navigation

- **[Getting Started](#getting-started)** - Installation and basic usage
- **[Features](#features)** - Comprehensive feature guide
- **[Architecture](#architecture)** - Technical architecture and design
- **[API Reference](#api)** - Developer API documentation
- **[Development](#development)** - Contributing and development guide
- **[Changelog](#changelog)** - Version history and updates
- **[Deployment](#deployment)** - Deployment instructions
- **[Security](#security)** - Security policies and reporting

## Welcome to DataScope

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
│   │   ���── graph-analyzer.ts   # Graph algorithms
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
**Solution**: Clean up effects and event listeners`,

  'changelog': `# Changelog

## Version 2.6.0 - Enhanced UX Update (2024-03-21)

### 🚀 New Features

#### Quick Actions Panel
- One-click access to Prettify, Minify, Validate, Copy All, and Export operations
- Action history tracking shows recent operations
- Tooltips and visual feedback for each action
- Disabled states when no data is present
- Glassmorphic design consistent with app theme

#### Data Validation
- Real-time quality scoring (0-100 scale)
- Comprehensive issue detection:
  - Deep nesting warnings (>20 levels)
  - Empty objects and arrays
  - Duplicate keys detection
  - Invalid numeric keys
  - Mixed array types
  - Whitespace issues in strings
  - Invalid numbers (Infinity, NaN)
- Categorized issues: Errors, Warnings, Info
- Actionable suggestions for each issue
- Scrollable issue list with path references

#### Quick View Panel
- Live preview of selected tree nodes
- Type-specific rendering:
  - Strings: Show length and formatted text
  - Numbers: Integer/Float detection with formatting
  - Booleans: Clear visual representation
  - Arrays: Item count and JSON preview
  - Objects: Key count and structured preview
- One-click copy functionality
- Current path display
- Type badges with color coding

#### Favorites/Bookmarks System
- Save important data paths for quick access
- Persistent storage using useKV
- Features:
  - One-click navigation to bookmarked paths
  - Path copying
  - Individual or bulk removal
  - Prevents duplicate bookmarks
  - Shows depth level for each favorite
- Hover interactions reveal action buttons
- Empty state with helpful instructions

#### Smart Suggestions Panel
- Context-aware recommendations based on data structure
- Analyzes data to suggest:
  - Graph visualization for complex structures (>20 nodes)
  - Search functionality for arrays
  - Data transformation for nested arrays
  - Analytics for objects with many keys
  - Export options
- Maximum 4 suggestions shown at once
- Actionable buttons for each suggestion
- Adapts to current data characteristics

#### Enhanced Export Options
- **New Formats**: TypeScript interface generation, Plain text export
- **Custom Filenames**: Name your exports with custom or auto-generated names
- **Advanced Options**:
  - Configurable indent size (2 or 4 spaces)
  - Include metadata (timestamp, format, size)
  - Flatten nested objects for CSV export
  - Improved CSV handling for objects and arrays
- **Better UX**: Larger dialog, organized layout, format descriptions

### 💎 Improvements

#### User Experience
- More intuitive sidebar organization
- New features prioritized at top of sidebar
- Better visual hierarchy with consistent spacing
- Enhanced empty states with helpful guidance
- Improved tooltips throughout

#### Performance
- Optimized memoization in new components
- Efficient re-rendering strategies
- Lazy calculation of suggestions and validations

#### Design Consistency
- All new panels follow glassmorphic design language
- Consistent use of Phosphor icons (duotone weight)
- Harmonized color coding for types
- Smooth hover transitions (200ms)
- Proper spacing and alignment

#### Code Quality
- TypeScript strict mode compliance
- Proper type safety across all new components
- Consistent use of useKV for persistence
- Modular, maintainable component structure
- Following established patterns from existing codebase

### 📝 Documentation

#### Updated Documentation
- Comprehensive export guide in docs
- Security policies integrated
- Deployment instructions included
- Changelog accessible from docs
- AGENTS.md updated with all new features

## Version 2.5.0 - Graph Analytics (2024-03-15)

### Features
- Added 2D and 3D graph visualizations
- Four graph layout options (Force, Tree, Radial, Grid)
- Graph analytics panel with centrality metrics
- Interactive node selection and highlighting

## Version 2.0.0 - Multi-Format Support (2024-03-01)

### Features
- YAML format support
- JSONL (line-delimited JSON) support
- CSV parsing and visualization
- Automatic format detection
- Advanced search with regex

## Version 1.0.0 - Initial Release (2024-02-01)

### Features
- JSON parsing and visualization
- Tree view with expand/collapse
- Basic statistics panel
- Export to JSON
- Dark/light theme support`,

  'deployment': `# Deployment Guide

This document provides instructions for deploying DataScope to Vercel.

## Prerequisites

- Vercel account with deployment access
- Git repository connected to Vercel
- Node.js 18+ for local testing

## Deployment Configuration

### Build Settings

- **Framework**: Vite
- **Build Command**: \`npm run build\`
- **Output Directory**: \`dist\`
- **Install Command**: \`npm install\`
- **Node Version**: 18.x (recommended)

### Environment Variables

No environment variables are required for basic deployment.

### Custom Domain Setup

1. In Vercel dashboard, go to your project settings
2. Navigate to "Domains"
3. Add custom domain: \`datascope.w4w.dev\`
4. Configure DNS records as instructed by Vercel:
   - Type: CNAME
   - Name: datascope
   - Value: cname.vercel-dns.com

### Google Tag Manager Integration

The application includes Google Tag Manager (GTM) integration with ID: \`GTM-KDKW33HQ\`

GTM is loaded in two places for complete coverage:
1. **Head script**: Async loading in \`<head>\` tag
2. **Noscript fallback**: Iframe fallback in \`<body>\` for users with JavaScript disabled

No additional configuration needed - GTM will automatically track:
- Page views
- Navigation events
- User interactions (as configured in GTM dashboard)

## Deployment Steps

### Automatic Deployment (Recommended)

1. Push changes to your main branch
2. Vercel will automatically build and deploy
3. Monitor deployment at vercel.com/dashboard

### Manual Deployment

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
\`\`\`

## Performance Optimizations

The deployment includes:

- **Asset Caching**: Static assets cached for 1 year with immutable headers
- **Security Headers**: 
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - X-XSS-Protection: enabled
  - Referrer-Policy: strict-origin-when-cross-origin
- **SPA Routing**: All routes rewrite to index.html for client-side routing
- **Clean URLs**: Trailing slashes removed for consistency

## Testing Deployment

After deployment, verify:

1. ✅ Site loads at https://datascope.w4w.dev
2. ✅ All data formats parse correctly (JSON, YAML, JSONL, CSV)
3. ✅ Theme toggle works (light/dark mode)
4. ✅ File upload and URL loading function
5. ✅ Graph visualizations render properly
6. ✅ GTM tracking fires (check browser Network tab for gtm.js)

## Troubleshooting

### Build Fails
- Check Node.js version (must be 18+)
- Verify all dependencies are in package.json
- Run \`npm run build\` locally to identify issues

### 404 Errors on Routes
- Verify rewrites configuration in vercel.json
- Ensure all routes redirect to /index.html

### GTM Not Tracking
- Verify GTM container ID is GTM-KDKW33HQ
- Check browser console for GTM errors
- Test with Google Tag Assistant extension

### Domain Not Resolving
- Verify DNS CNAME record points to cname.vercel-dns.com
- Allow up to 48 hours for DNS propagation
- Use DNS checker tool to verify propagation

## Monitoring

Monitor your deployment:
- **Vercel Analytics**: Built-in analytics in Vercel dashboard
- **GTM Dashboard**: Track user behavior and conversions
- **Error Tracking**: Check Vercel function logs for runtime errors

## Support

For deployment issues:
1. Check Vercel documentation: https://vercel.com/docs
2. Review build logs in Vercel dashboard
3. Test locally with \`npm run build && npm run preview\``,

  'security': `# Security Policy

## Reporting Security Issues

If you believe you have found a security vulnerability in DataScope, please report it to us through coordinated disclosure.

**Please do not report security vulnerabilities through public GitHub issues, discussions, or pull requests.**

Instead, please send an email to opensource-security[@]github.com.

Please include as much of the information listed below as you can to help us better understand and resolve the issue:

- The type of issue (e.g., buffer overflow, SQL injection, or cross-site scripting)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue

This information will help us triage your report more quickly.

## Security Best Practices

DataScope follows security best practices:

### Data Handling
- **Local-First**: All data processing happens in your browser
- **No Server Storage**: Your data never leaves your device
- **No External Requests**: Data is not sent to external servers (except optional LLM features)
- **Persistent Storage**: Uses browser's local storage only

### Input Validation
- Sanitizes user input before parsing
- Validates URLs before fetching
- Handles CORS errors gracefully
- Limits file sizes to prevent DoS
- Catches and safely displays parse errors

### Code Execution
- JavaScript transformations run in isolated context
- Prevents infinite loops in user code
- Validates transformation results
- Doesn't expose sensitive data in errors

### Dependencies
- Regular security audits (\`npm audit\`)
- Dependencies kept updated
- Only browser-compatible packages
- No deprecated packages

### Privacy
- No sensitive data logging
- Analytics anonymized (GTM)
- No user tracking beyond aggregated analytics
- No cookies for authentication

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.6.x   | :white_check_mark: |
| 2.5.x   | :white_check_mark: |
| < 2.0   | :x:                |

## Known Security Considerations

### Client-Side Processing
DataScope processes all data client-side. While this enhances privacy, users should:
- Not paste sensitive credentials or keys into the application
- Be cautious when loading data from untrusted URLs
- Verify data sources before import

### Browser Storage
Data persisted via useKV is stored in browser's IndexedDB. This data:
- Remains on your device only
- Can be cleared via browser settings
- Is not encrypted at rest (relies on OS/browser security)

## Safe Harbor Policy

See [GitHub's Safe Harbor Policy](https://docs.github.com/en/site-policy/security-policies/github-bug-bounty-program-legal-safe-harbor#1-safe-harbor-terms)

## Contact

For security concerns, contact: opensource-security[@]github.com`
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
