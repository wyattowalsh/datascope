# 🔍 DataScope

A professional, powerful tool for exploring, visualizing, and analyzing structured data across multiple formats with advanced graph analytics and beautiful visualizations.

**🌐 Live Demo**: [https://datascope.w4w.dev](https://datascope.w4w.dev)

## ✨ Features

### 📁 Flexible Data Input
- **Multiple Input Methods**: Load data from local files, URLs, or paste directly
- **Drag & Drop**: Simply drop your data files anywhere
- **Auto-Detection**: Automatically detects format from file extension and content
- **Supported Formats**: JSON, YAML, JSONL, CSV, JSON5

### 📊 Multiple Graph Layouts
- **Force-Directed**: Physics-based organic layout with interactive dragging
- **Tree Layout**: Clean hierarchical visualization
- **Radial Layout**: Circular hierarchy showing depth relationships
- **Grid Layout**: Organized rows for structured viewing

### 🔎 Advanced Exploration
- **Interactive Tree View**: Collapsible hierarchy with syntax highlighting
- **Path Navigation**: Click to select and copy paths to any node
- **Advanced Search**: Text, regex, and path-based search with type filtering
- **Graph Analytics**: Comprehensive metrics including centrality, clustering, and depth analysis

### 🎨 Beautiful Design
- **Light/Dark Mode**: Smooth theme transitions with persistent preference
- **Glassmorphic UI**: Premium design with backdrop blur and gradient accents
- **Responsive**: Optimized for all screen sizes from mobile to desktop
- **Micro-animations**: Delightful interactions throughout

### 🛠️ Data Tools
- **Format & Prettify**: Customizable indentation and key sorting
- **Minify**: Compress JSON/JSONL data
- **Lint & Validate**: Comprehensive error detection with helpful suggestions
- **Statistics**: Real-time type distribution and structure metrics

## 🚀 Quick Start

1. **Load Your Data**
   - Drop a file, paste a URL, or type/paste data directly
   - Format is auto-detected or select manually

2. **Parse & Explore**
   - Click "Parse Data" to visualize your structure
   - Switch between Tree and Graph views

3. **Analyze**
   - Use advanced search to find specific nodes
   - View comprehensive analytics and metrics
   - Explore different graph layouts

4. **Format & Export**
   - Use formatting tools to clean up your data
   - Copy paths to specific data points

## 💡 Use Cases

- **API Response Analysis**: Explore complex JSON responses
- **Log File Parsing**: Analyze JSONL log streams
- **Config File Editing**: Visualize and edit YAML configurations
- **Data Export Review**: Parse and validate CSV exports
- **Structure Visualization**: Understand complex data hierarchies

## 🎯 Graph Layouts Guide

- **Force**: Best for exploring relationships and connections
- **Tree**: Best for understanding hierarchical structure
- **Radial**: Best for visualizing depth and nested relationships
- **Grid**: Best for systematic data review

## 🚢 Deployment

DataScope is deployed on Vercel at [datascope.w4w.dev](https://datascope.w4w.dev).

### Vercel Setup

The project includes:
- `vercel.json` - Deployment configuration
- `.github/workflows/deploy.yml` - CI/CD pipeline
- `DEPLOYMENT.md` - Detailed deployment guide

### Environment Variables

Optional environment variables (see `.env.example`):
- `VITE_APP_NAME` - Application name
- `VITE_APP_URL` - Production URL
- `VITE_GTM_ID` - Google Tag Manager ID

### Analytics

Integrated with Google Tag Manager (GTM-KDKW33HQ) for:
- Page view tracking
- Data parse events
- File load tracking
- View mode changes
- Search analytics
- Format actions

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 📦 Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI + shadcn
- **Visualization**: D3.js
- **Icons**: Phosphor Icons
- **State**: React Hooks + useKV (persistent state)
- **Analytics**: Google Tag Manager
- **Deployment**: Vercel

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
