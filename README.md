# DataScope - Professional Data Visualization & Analytics

**Version 2.7.0** - Enterprise Features & Documentation Overhaul  
Live at: https://datascope.w4w.dev

## 🎯 What is DataScope?

DataScope is a powerful, enterprise-grade web application for exploring, visualizing, and analyzing structured data. It supports JSON, YAML, JSONL, and CSV formats with intelligent parsing, Web Worker-based async processing, interactive visualizations, JSONPath queries, and comprehensive analytics—all with complete, integrated documentation.

## ✨ Key Features

### 🆕 NEW in v2.7.0 - Enterprise Features

#### 🔒 Crash Recovery & Error Boundaries
- **Automatic state persistence**: Auto-save every 3 seconds
- **Crash recovery**: Restore last session after browser crash
- **Error boundaries**: Graceful error handling with recovery UI
- **User-friendly fallbacks**: Continue working even when errors occur

#### ⚡ Web Worker Parsing
- **Off-thread processing**: Parse large datasets without freezing UI
- **Async/await**: Non-blocking data processing
- **Progress feedback**: Real-time parsing status
- **Better performance**: Handles massive JSON/YAML files smoothly

#### 🔍 JSONPath Query Engine
- **Query panel**: Interactive JSONPath query interface
- **Live results**: Real-time filtering as you type
- **Syntax highlighting**: Clear query visualization
- **Multiple queries**: Save and reuse common queries

#### 📊 Virtualized Tree View
- **Smart virtualization**: Renders only visible nodes
- **1000+ node optimization**: Automatic virtualization trigger
- **Smooth scrolling**: Handles massive datasets effortlessly
- **Memory efficient**: Reduces browser memory footprint

### Core Functionality
- **Multi-Format Support**: JSON, YAML, JSONL (line-delimited), CSV with automatic format detection
- **Dual Visualization Modes**: Interactive tree view and dynamic graph visualizations (2D & 3D)
- **Four Graph Layouts**: Force-directed, Tree, Radial, and Grid layouts for different analysis needs
- **Advanced Search**: Text, regex, and path-based search with type filtering
- **Data Transformation**: Built-in JavaScript transformation engine with examples
- **Schema Generation**: Automatic JSON Schema extraction with type inference
- **Export Options**: Save data in JSON, YAML, CSV, or JSONL formats

### NEW in v2.6.0 - Enhanced User Experience

#### 🚀 Quick Actions Panel
One-click access to common operations:
- Prettify/Format data
- Minify JSON
- Validate structure
- Copy all data
- Export options
- Recent action history

#### ✅ Data Validation
Real-time quality analysis with:
- 0-100 quality scoring
- Issue detection (errors, warnings, info)
- Actionable suggestions
- Deep nesting detection
- Empty object/array identification
- Type consistency checking

#### 👁️ Quick View Panel
Instant preview of selected nodes:
- Type-specific rendering
- Metadata display (length, count, etc.)
- One-click copy functionality
- Live updates on selection

#### ⭐ Favorites/Bookmarks
Save and navigate important paths:
- Persistent favorites between sessions
- One-click navigation
- Path copying
- Bulk management

#### 💡 Smart Suggestions
Context-aware recommendations:
- Suggests relevant features
- Adapts to data structure
- Guides workflow optimization
- Helps discover functionality

### Analytics & Insights
- Comprehensive statistics (node count, depth, type distribution)
- Graph analytics (centrality, clustering, density, diameter)
- Performance metrics (parse time, data size, complexity)
- AI-powered insights and recommendations
- Real-time data quality scoring

### Developer-Friendly Features
- Keyboard shortcuts for power users
- Dark/light theme with smooth transitions
- History management (last 10 datasets)
- File upload and URL loading
- Drag & drop support
- Persistent state across sessions

## 🛠️ Technology Stack

- **Frontend**: React 19 + TypeScript 5.7
- **Build Tool**: Vite 6.3 with Web Worker support
- **Styling**: Tailwind CSS v4 with custom theme
- **UI Components**: shadcn/ui v4 (Radix UI)
- **Visualizations**: D3.js v7 (2D graphs), Three.js (3D graphs)
- **Icons**: Phosphor Icons (duotone)
- **Animations**: Framer Motion + custom CSS
- **Data Parsing**: Web Workers, Native JSON, yaml library, custom JSONL/CSV parsers
- **Query Engine**: JSONPath for advanced data filtering
- **Documentation**: Integrated MDX documentation with marked renderer
- **State Management**: React hooks + KV persistence + auto-save
- **Error Recovery**: Error boundaries + state recovery hooks

## 🚀 Getting Started

### Development
```bash
npm install
npm run dev
```

### Building
```bash
npm run build
```

### Preview
```bash
npm run preview
```

## 📖 Documentation

### Integrated Documentation (NEW in v2.7!)
- **Access**: Click the Book icon in the app header or navigate to `/docs` route
- **Content**: Comprehensive guides for all features, API reference, architecture details
- **Format**: MDX documentation rendered inline with the main app
- **Features**:
  - Welcome page with v2.7 highlights
  - Quick start guide (5-minute setup)
  - Complete feature documentation
  - Technical architecture overview
  - API reference with examples
  - Contributing guidelines
  
### Developer Documentation
- **AGENTS.md**: Comprehensive developer guide for AI agents and developers
- **DOCUMENTATION_COMPLETE.md**: v2.7 implementation and docs overhaul summary
- **PRD.md**: Product requirements and design specifications  
- **DEPLOYMENT.md**: Deployment configuration and instructions
- **SECURITY.md**: Security policies and guidelines

## 🎨 Design Philosophy

DataScope follows a modern, professional design approach:
- **Glassmorphic UI**: Subtle transparency with backdrop blur
- **Smooth Animations**: 200-350ms transitions for premium feel
- **Color-Coded Types**: Visual distinction for different data types
- **Responsive Design**: Mobile-first with progressive enhancement
- **Accessibility**: WCAG AA compliant with keyboard navigation

## 🔒 Privacy & Security

- **Local-First**: All data processing happens in your browser
- **No Server Storage**: Your data never leaves your device
- **Persistent Storage**: Optional local storage via browser KV store
- **No Tracking**: Analytics are anonymized and aggregated

## 📊 Use Cases

- **API Development**: Visualize and validate API responses
- **Data Analysis**: Explore complex data structures
- **Configuration Management**: Parse and validate config files
- **Log Analysis**: Process JSONL log files
- **Data Quality**: Validate and improve data structure
- **Learning**: Understand data relationships visually

## 🤝 Contributing

This project is part of the Spark platform. For contributions and issues, please refer to the project guidelines.

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.

---

**Built with ❤️ using Spark** • Professional Data Analytics & Visualization
