# Planning Guide

A professional, powerful developer tool for exploring, visualizing, and analyzing structured data across multiple formats (JSON, YAML, JSONL, CSV) with advanced graph analytics, multiple layout options, flexible file input methods, interactive exploration, comprehensive search capabilities, beautiful data visualization, AI-powered insights, data transformation engine, schema generation, comparison tools, keyboard shortcuts, persistent history, enhanced complexity analysis, performance metrics, and data quality scoring. Enhanced with premium UI/UX featuring glassmorphic design, sophisticated animations, and delightful micro-interactions. Deployed at https://datascope.w4w.dev

**Experience Qualities**:
1. **Versatile** - Supports JSON, YAML, JSONL, CSV formats with auto-detection, flexible file/URL loading, and intelligent format conversion
2. **Powerful** - Multiple graph layouts, advanced analytics, regex search, multi-modal data exploration with comprehensive metrics and insights
3. **Beautiful** - Refined glassmorphic design, smooth animations, gradient accents, and professional polish that delights users

**Complexity Level**: Complex Application (advanced functionality with rich state management)
  - Highly sophisticated features (multi-format parsing, graph visualization with D3 force/tree/radial/grid layouts, file/URL input, advanced search with regex/path modes, comprehensive analytics, dual visualization modes) with extensive state persistence and real-time coordination

## Essential Features

### Flexible File Input & Loading
- **Functionality**: Load data from local files (drag & drop or browse), URLs with CORS support, or direct paste with automatic format detection
- **Purpose**: Provide maximum flexibility for data input from any source - files, APIs, remote endpoints, or clipboard
- **Trigger**: User selects file input mode (file or URL) in the Load Data panel
- **Progression**: Select input mode → Choose file/enter URL → Auto-detect format from extension/content → Load data → Set format tab → Display in textarea → Ready to parse
- **Success criteria**: Files load instantly; URLs fetch with loading state; format auto-detected accurately; drag & drop works smoothly; errors shown clearly; supports .json, .yaml, .jsonl, .csv, .json5 files

### Automatic Format Detection
- **Functionality**: Intelligently detect data format from file extension, URL path, and content structure analysis
- **Purpose**: Eliminate manual format selection and reduce user friction when loading data
- **Trigger**: File or URL loaded into the application
- **Progression**: Data loaded → Check file extension → Analyze content structure → Detect format → Set appropriate format tab → Notify user
- **Success criteria**: 95%+ accuracy on format detection; handles edge cases (no extension, ambiguous content); provides format in toast notification

### Multiple Graph Layout Options
- **Functionality**: Four distinct graph visualization layouts - Force-directed (physics), Tree (hierarchical), Radial (circular hierarchy), Grid (organized rows)
- **Purpose**: Enable users to view data structure in the most meaningful way for their use case and data shape
- **Trigger**: User selects layout from tabs in graph view
- **Progression**: Parse data → Switch to graph view → Select layout (force/tree/radial/grid) → Re-render graph with new layout → Maintain zoom/pan state → Update legend
- **Success criteria**: Smooth transitions between layouts; each layout clearly shows structure; force has physics simulation; tree shows hierarchy; radial shows depth; grid shows organization

### Multi-Format Data Input & Parsing
- **Functionality**: Accept JSON, YAML, JSONL (line-delimited JSON), CSV, and JSON5 with auto-detection, format conversion, and comprehensive error reporting
- **Purpose**: Handle diverse data sources from APIs, logs, configs, databases, and exports with intelligent parsing
- **Trigger**: User selects format tab and pastes/types/loads data
- **Progression**: Select format → Load/paste data → Auto-detect/validate → Parse with timing metrics → Build tree structure → Generate graph → Calculate analytics → Display results
- **Success criteria**: All formats parse correctly; JSONL handles streaming logs; CSV converts to structured objects; parse time shown; invalid input shows format-specific errors with suggestions

### JSONL (Line-Delimited JSON) Support
- **Functionality**: Parse JSONL files where each line is a valid JSON object, commonly used for logs and streaming data
- **Purpose**: Enable analysis of log files, event streams, and line-delimited datasets
- **Trigger**: User selects JSONL format and pastes data
- **Progression**: Select JSONL → Parse each line separately → Build array of records → Display as tree/graph → Show record count
- **Success criteria**: Each JSON line parsed independently; shows line count; handles thousands of records; displays parse errors by line number

### CSV to JSON Conversion
- **Functionality**: Parse CSV with headers, auto-detect types (numbers, booleans, null), convert to structured JSON array
- **Purpose**: Analyze tabular data exports from spreadsheets and databases
- **Trigger**: User selects CSV format and pastes data
- **Progression**: Select CSV → Parse headers → Detect types → Convert rows to objects → Display as tree → Show record count
- **Success criteria**: Headers become keys; types inferred correctly; handles quoted values; displays as explorable tree structure

### Interactive Tree Visualization
- **Functionality**: Collapsible tree structure with syntax highlighting, type badges, value previews, path navigation, and expand/collapse all
- **Purpose**: Make nested data structures easy to explore with full control over visibility
- **Trigger**: Successful parsing of input data
- **Progression**: Parse complete → Render root node → Click to expand/collapse → Navigate nested structures → Copy paths → View full values → Expand/collapse all
- **Success criteria**: All nesting levels accessible, smooth expand/collapse animations, clear visual hierarchy, instant path copying

### Graph Visualization with D3
- **Functionality**: Interactive graph with multiple layouts (force-directed, tree, radial, grid) showing data structure relationships with zoom, pan, drag, and node selection
- **Purpose**: Visualize data structure relationships and hierarchy in a spatial, intuitive way with layout options for different analysis needs
- **Trigger**: Switch to graph view tab after parsing, select layout option
- **Progression**: Switch to graph → Select layout (force/tree/radial/grid) → Render with selected layout → Drag nodes (force mode) → Zoom/pan → Click nodes to select → Highlight connections → View node details
- **Success criteria**: Smooth physics simulation in force mode; clear hierarchical tree layout; radial shows depth beautifully; grid organizes uniformly; responsive interactions; clear node/edge differentiation; synchronized selection with tree view; layout switcher intuitive

### Advanced Search & Filtering
- **Functionality**: Multi-mode search (text, regex, path) with case sensitivity, whole word matching, and type filtering across all data
- **Purpose**: Enable powerful data discovery with flexible query options for any use case
- **Trigger**: User enters search term or changes search options
- **Progression**: Enter term → Select mode (text/regex/path) → Toggle options (case/word) → Apply type filters → View filtered results → See result count
- **Success criteria**: Instant filtering, accurate regex matching, path-based search, persistent filter state, clear result highlighting

### Graph Analytics & Metrics
- **Functionality**: Comprehensive graph analysis including centrality, clustering, density, diameter, branching factor, depth distribution, plus enhanced complexity scoring, data quality analysis, and real-time performance metrics
- **Purpose**: Provide deep insights into data structure complexity, relationships, quality, and processing performance
- **Trigger**: Automatic calculation after successful parsing
- **Progression**: Parse data → Build graph → Calculate metrics → Display analytics → Show depth/type distribution → Rank by centrality → Analyze complexity → Score quality → Track performance
- **Success criteria**: Accurate mathematical calculations, meaningful visualizations, organized presentation across multiple tabs, complexity scoring (Simple/Moderate/Complex/Very Complex), quality rating (0-100), performance benchmarking

### Statistics & Analysis
- **Functionality**: Real-time stats - total keys, max depth, type distribution with progress bars and percentages
- **Purpose**: Provide instant overview of data structure composition
- **Trigger**: Successful parsing displays stats panel with live updates
- **Progression**: Parse data → Calculate metrics → Display stats → Update on filter changes → Show type distributions
- **Success criteria**: Accurate counts, instant updates, color-coded type badges, helpful visual representations

### Advanced Formatting & Linting
- **Functionality**: Format/prettify with customizable indent (2/4 spaces, tabs), alphabetical key sorting, minify JSON/JSONL, comprehensive linting with error locations
- **Purpose**: Clean up messy data, standardize formatting, alphabetize keys for consistency, identify and fix errors
- **Trigger**: Click format/minify buttons or open format dialog
- **Progression**: Click format → Select indent preference + sort option → Apply formatting → Update display → Show lint errors if any → Provide fix suggestions
- **Success criteria**: Proper indentation, optional key sorting, maintains data integrity, helpful lint messages, format-specific optimizations

### Data Export & Download
- **Functionality**: Export parsed data in multiple formats (JSON, YAML, CSV, JSONL) with prettify and sort options
- **Purpose**: Enable users to download processed data in their preferred format for use in other tools
- **Trigger**: Click Export button after parsing data
- **Progression**: Open export dialog → Select format → Configure options (prettify, sort keys) → Download file → Receive confirmation
- **Success criteria**: Supports all major formats; maintains data integrity; generates proper filenames; handles edge cases (CSV requires arrays)

### JSON Schema Generation
- **Functionality**: Automatically generate JSON Schema (Draft-07) from parsed data with type inference and format detection
- **Purpose**: Document data structure, enable validation, provide schema for API contracts
- **Trigger**: Expand Advanced Tools panel when data is parsed
- **Progression**: Parse data → Infer types → Detect formats (email, URI, date) → Generate schema → Display with copy option → User copies schema
- **Success criteria**: Accurate type detection; identifies string formats; handles nested objects and arrays; proper Draft-07 compliance; one-click copy

### Data Transformation Engine
- **Functionality**: Apply JavaScript transformations to data with built-in examples (extract keys, filter, map, flatten)
- **Purpose**: Enable users to reshape, filter, and transform data without leaving the app
- **Trigger**: Expand Advanced Tools panel, write/select transformation code
- **Progression**: Select example or write code → Preview transformation → Apply to main view → Data updates → Re-analyze
- **Success criteria**: Safe execution; helpful examples; error handling; preview before apply; updates entire visualization pipeline

### Data Comparison & Diff
- **Functionality**: Compare current data with another dataset, showing added, removed, modified, and unchanged properties
- **Purpose**: Identify differences between versions, API responses, or configurations
- **Trigger**: Expand Advanced Tools panel, paste comparison data
- **Progression**: Paste JSON → Compare → Show metrics (added/removed/modified/unchanged) → Display detailed diff with color coding → Explore changes
- **Success criteria**: Accurate path-based comparison; clear visual distinction; handles nested objects; shows change summary; scrollable diff view

### AI-Powered Data Insights
- **Functionality**: Automatically analyze data structure and provide intelligent insights, warnings, and recommendations
- **Purpose**: Help users understand their data quality, structure, and potential issues at a glance
- **Trigger**: Automatic analysis when data is parsed successfully
- **Progression**: Parse data → Analyze structure → Detect patterns/issues → Generate insights → Display categorized recommendations (tips/warnings/info/trends)
- **Success criteria**: Detects deep nesting, null prevalence, schema consistency, data types, array structures; provides actionable recommendations; color-coded by insight type

### Enhanced Analytics & Intelligence
- **Functionality**: Advanced complexity analysis with scoring (Simple to Very Complex), data quality assessment (0-100 score), density metrics (branching factor, width distribution), and real-time performance profiling
- **Purpose**: Provide professional-grade insights into data structure quality, complexity, and processing efficiency
- **Trigger**: Automatic analysis on successful parse
- **Progression**: Parse complete → Calculate complexity score → Analyze quality metrics → Measure density patterns → Profile performance → Display insights across tabs
- **Success criteria**: Accurate complexity classification, meaningful quality scoring with issues/strengths, density visualization, parse time tracking, throughput calculation, actionable recommendations

### Keyboard Shortcuts
- **Functionality**: Comprehensive keyboard shortcuts for all major actions with discoverable shortcut panel
- **Purpose**: Enable power users to work efficiently without mouse interaction
- **Trigger**: Press '?' to open shortcuts dialog, use shortcuts anywhere in app
- **Progression**: Learn shortcuts → Use hotkeys → Increase productivity → Access shortcuts reference anytime
- **Success criteria**: Ctrl+P parse, Ctrl+E export, Ctrl+K search, Ctrl+1/2 view switch, E/C expand/collapse, ? show help; all shortcuts work reliably; dialog shows complete reference

### Data History & Restore
- **Functionality**: Automatically save recent datasets with timestamps, quick restore, and history management
- **Purpose**: Allow users to quickly switch between recent datasets without re-loading
- **Trigger**: Automatic save on parse/load, manual restore from history panel
- **Progression**: Parse/load data → Auto-save to history → View history panel → Restore previous dataset → Clear individual items or all
- **Success criteria**: Saves last 10 datasets; shows timestamp and format; one-click restore; clear all option; persists across sessions

### Light/Dark Mode Toggle
- **Functionality**: Switch between light and dark themes with persistent preference and smooth transitions
- **Purpose**: Reduce eye strain and match user's environment preference
- **Trigger**: Click theme toggle button in header
- **Progression**: Click toggle → Theme switches with smooth transition → Save preference → Persist across sessions → Update all visualizations
- **Success criteria**: Smooth 300ms color transitions, all elements adapt properly, preference persisted, graph colors update

## Edge Case Handling
- **Empty Input**: Show helpful quick start guide with examples for all supported formats (JSON, YAML, JSONL, CSV) and file/URL loading options
- **Invalid Syntax**: Display detailed error message with line/column numbers and format-specific fix suggestions with inline highlighting
- **JSONL Line Errors**: Show which line failed to parse, allow partial success for valid lines
- **CSV Header Issues**: Detect missing/duplicate headers, provide suggestions for malformed CSV
- **Mixed Format Detection**: Auto-detect format and guide user to correct tab with intelligent suggestions
- **Very Large Files**: Handle large documents gracefully with virtual scrolling, performance monitoring, warnings (10k+ nodes, 1000+ JSONL records); warn before loading massive files from URL
- **Deep Nesting**: Smart initial expansion, expand-all with progress, performance warnings for deep structures (20+ levels); tree layout handles deep hierarchies
- **Special Characters**: Properly escape and display unicode, emojis, and special chars in values across all views and formats
- **Circular References**: Detect and display warning (JSON only, as YAML can have anchors/aliases)
- **Malformed Formatting**: Provide comprehensive lint errors with helpful fix suggestions and error locations
- **Theme Transitions**: Ensure smooth color transitions across all components including graph visualization with 350ms easing
- **Mobile Interactions**: Handle touch gestures for graph manipulation, prevent zoom conflicts, optimize for small screens with responsive tabs
- **Complex Regex**: Catch and display regex syntax errors with helpful messages in search
- **Empty Search Results**: Show "No results found" state with suggestion to adjust filters
- **Graph Rendering**: Handle disconnected nodes, self-loops, and performance for large graphs (500+ nodes); optimize layouts for various graph shapes
- **Path Edge Cases**: Handle special characters in keys, numeric indices, and deeply nested paths correctly
- **Format Conversion**: Handle edge cases when converting between formats (YAML anchors, CSV special chars)
- **URL Loading**: Handle CORS errors gracefully with helpful message; show loading state; timeout after 30s; validate URL format
- **File Size Limits**: Warn for files >10MB; show progress for large file reading
- **Layout Switching**: Preserve selection when switching between graph layouts; smooth transitions
- **Drag & Drop**: Highlight drop zone on drag over; prevent page navigation on drop; accept only valid file types
- **Export Edge Cases**: Validate data structure before export (CSV/JSONL require arrays); handle export errors gracefully; warn about data loss in format conversion
- **Schema Generation**: Handle recursive/circular structures in schema; support all JSON types; detect common string formats
- **Transformation Errors**: Catch and display JavaScript errors; prevent infinite loops; sandbox execution; validate result
- **Comparison Parsing**: Handle invalid comparison JSON; validate structures are comparable; show helpful error messages

## Design Direction
The design should feel premium, sophisticated, and powerful - like a professional data analytics platform with studio-quality polish. Modern glassmorphic UI with subtle backdrop blur, layered depth through shadows and gradients, and refined spacing that breathes. Professional monospace typography for code with multi-color syntax highlighting. Smooth theme transitions (350ms) between light and dark modes that extend seamlessly to all visualizations. Gradient accents on buttons and headers that catch the eye. Rounded corners (12px) throughout for modern feel. Layered information architecture where complexity is progressively revealed. Interactive visualizations that respond fluidly with micro-animations and hover states. Premium feel through attention to detail - from animated gradients to smooth scale transforms.

## Color Selection
Premium dual-palette system with sophisticated gradients, glassmorphic effects, and carefully balanced light and dark modes featuring syntax-highlighting inspired colors and analytics-grade visualizations.

**Light Mode Palette:**
- **Primary Color**: Vibrant Blue (oklch(0.56 0.21 264.05)) - Professional, energetic, represents clarity and structure, used for graph arrays and primary actions with gradient overlays
- **Secondary Colors**: Soft slate backgrounds (oklch(0.965 0.003 247.86)) with subtle gradients for depth
- **Accent Color**: Bright Cyan (oklch(0.66 0.15 210.42)) for interactive highlights, graph objects, and active states with glow effects
- **Background**: Near-white base (oklch(0.985 0.001 247.86)) with subtle gradient to muted for depth
- **Glassmorphic Effects**: backdrop-blur-xl with bg opacity 50-90% for floating panels
- **Foreground/Background Pairings**:
  - Background (oklch(0.985 0.001 247.86)): Dark text (oklch(0.12 0.01 250)) - Ratio 15.8:1 ✓
  - Card (oklch(1 0 0)): Dark text (oklch(0.12 0.01 250)) - Ratio 17.2:1 ✓
  - Primary (oklch(0.56 0.21 264.05)): White text (oklch(0.99 0 0)) - Ratio 6.4:1 ✓
  - Accent (oklch(0.66 0.15 210.42)): White text (oklch(0.99 0 0)) - Ratio 4.7:1 ✓
  - Muted (oklch(0.965 0.003 247.86)): Medium text (oklch(0.52 0.018 252.73)) - Ratio 7.8:1 ✓

**Dark Mode Palette:**
- **Primary Color**: Bright Blue (oklch(0.67 0.26 265.75)) - Luminous against dark with gradient shine
- **Secondary Colors**: Deep slate backgrounds (oklch(0.17 0.012 250)) for rich depth with subtle gradients
- **Accent Color**: Electric Cyan (oklch(0.76 0.16 210)) for vibrant highlights with glow that pops in darkness
- **Background**: Deep dark (oklch(0.10 0.012 250)) with gradient to card for layered depth
- **Glassmorphic Effects**: backdrop-blur-xl with bg opacity 50-90% for floating panels with subtle glow
- **Foreground/Background Pairings**:
  - Background (oklch(0.10 0.012 250)): Light text (oklch(0.96 0.008 250)) - Ratio 16.4:1 ✓
  - Card (oklch(0.14 0.012 250)): Light text (oklch(0.96 0.008 250)) - Ratio 14.2:1 ✓
  - Primary (oklch(0.67 0.26 265.75)): Dark text (oklch(0.10 0.012 250)) - Ratio 7.8:1 ✓
  - Accent (oklch(0.76 0.16 210)): Dark text (oklch(0.10 0.012 250)) - Ratio 9.2:1 ✓
  - Muted (oklch(0.17 0.012 250)): Light muted text (oklch(0.64 0.022 250)) - Ratio 7.6:1 ✓

**Syntax Highlighting Colors (Adaptive):**
- Light Mode:
  - String values: Emerald (oklch(0.64 0.15 163.23)) - Graph primitives
  - Number values: Amber (oklch(0.72 0.16 65.28))
  - Boolean values: Purple (oklch(0.64 0.19 305.48))
  - Null values: Slate (oklch(0.54 0.02 247.86))
  - Keys: Deep blue (oklch(0.42 0.12 264.05))
  - Brackets: Medium slate (oklch(0.52 0.02 252.73))

- Dark Mode:
  - String values: Bright emerald (oklch(0.72 0.18 163)) - Graph primitives
  - Number values: Bright amber (oklch(0.78 0.18 65))
  - Boolean values: Bright purple (oklch(0.72 0.22 305))
  - Null values: Light slate (oklch(0.62 0.03 250))
  - Keys: Bright blue (oklch(0.68 0.15 265))
  - Brackets: Light slate (oklch(0.58 0.03 250))

## Font Selection
Monospace fonts for code display and technical precision, clean sans-serif for UI elements and analytics readability with refined hierarchy.

- **Typographic Hierarchy**:
  - H1 (App Title): Inter SemiBold/32px (desktop) 24px (mobile)/tight letter spacing with gradient text
  - H2 (Section Headers): Inter SemiBold/18px/normal spacing
  - H3 (Panel Titles): Inter SemiBold/14px/normal spacing with icon accompaniment
  - Code/Data Display: JetBrains Mono Regular/14px/wider letter spacing (0.02em) for clarity
  - Graph Labels: Inter Medium/11px/normal spacing
  - UI Labels: Inter Regular/14px/normal spacing
  - Tree Keys: JetBrains Mono Medium/14px
  - Tree Values: JetBrains Mono Regular/14px
  - Stats/Metrics: Inter Bold/36px (numbers) with gradient, Inter Regular/12px (labels) uppercase
  - Analytics Text: Inter Regular/14px
  - Badge Text: Inter SemiBold/12px
  - Button Text: Inter Medium/14px
  - Tooltip Text: Inter Medium/12px

## Animations
Premium, purposeful animations that provide visual feedback, guide attention, and create delightful micro-interactions - from theme transitions to graph physics to gradient shimmers.

- **Purposeful Meaning**: 
  - Theme transitions smoothly morph all colors including graphs (350ms cubic-bezier)
  - Graph force simulation provides organic, physics-based movement (continuous)
  - Tree expand/collapse with smooth height transitions (250ms ease-out)
  - Search filter animations highlight results (200ms)
  - Node drag in graph view with momentum and spring physics
  - Zoom/pan in graph with smooth easing (300ms)
  - Copy confirmations with check animation and scale (150ms)
  - Tab switches with fade and subtle slide (200ms)
  - Hover states with gentle scale transform (100ms) and color shift
  - Gradient animations on accent elements (pulse, shimmer)
  - Card hover elevations with shadow transitions (200ms)
  - Button scale on press (1.05x with 200ms)
  - Slide-in animations for panels (300ms ease-out)
  - Progress bar fills with smooth transitions
  
- **Hierarchy of Movement**: 
  - Graph physics simulation is primary (continuous, organic, physics-based)
  - Theme switch is secondary (350ms with smooth easing across all elements)
  - View mode transitions are secondary (250ms with fade)
  - Tree expand/collapse is tertiary (250ms smooth with momentum)
  - Card hovers and elevations are quaternary (200ms)
  - Button interactions are quaternary (150-200ms)
  - Tooltips appear quickly (100ms)
  - Micro-interactions subtle but noticeable (100-150ms)

## Component Selection
- **Component Selection**: 
  - Card with glassmorphic effects (backdrop-blur, semi-transparent) for all major content areas
  - Tabs with rounded pills for format switching (JSON/YAML/JSONL/CSV/JSON5), view modes (Tree/Graph), and graph layouts (Force/Tree/Radial/Grid)
  - Textarea with monospace styling and rounded corners for data entry
  - Input for URL entry with validation
  - Badge with color coding and semi-transparent backgrounds for type indicators
  - Button with gradient backgrounds, rounded corners (12px), scale transforms, and icon support
  - ScrollArea with custom styled scrollbars for tree view and analytics panels
  - Alert with rounded corners and semi-transparent destructive backgrounds for error messages
  - Separator with gradient effects (transparent → border → transparent)
  - Tooltip with rounded corners, backdrop blur, and quick appearance
  - Dialog with glassmorphic styling and smooth entrance for format options
  - Switch with smooth toggle animation for boolean options
  - DropdownMenu with rounded corners, shadow-xl, and hover states for tools
  - Progress bars with rounded ends and gradient fills for distributions
  - Custom D3 SVG for graph visualization with smooth transitions and multiple layouts
  
- **Customizations**: 
  - Custom Tree component with recursive rendering, path tracking, and smooth animations
  - Custom Graph component with D3 force/tree/radial/grid layouts and theme-aware colors
  - File Input component with drag & drop, file browse, and URL loading
  - Advanced Search component with multi-mode support and glassmorphic styling
  - Graph Analytics Panel with tabbed metrics and premium design
  - Stats Panel with gradient metric cards and animated progress bars
  - Custom syntax highlighting theme-aware across all views and formats
  - Path display with glassmorphic background and copy functionality
  - Interactive node selection synchronized across views with smooth highlights
  - Format selector with 5 format options in responsive grid
  - Premium header with app logo icon and gradient text
  - Layout switcher with 4 graph layout options and tooltips
  - Automatic format detection from file extension and content
  
- **States**: 
  - Buttons: Default, Hover (scale 1.05 + glow), Active (scale 0.98), Disabled (opacity 50%), Loading (spinner)
  - Tree Nodes: Collapsed, Expanded (smooth height), Matched (highlighted background), Selected (accent border + glow), Hover (background shift)
  - Graph Nodes: Normal, Hover (scale + glow), Selected (thick border + glow), Dragging (elevated shadow - force mode only)
  - Graph Layouts: Force (physics simulation), Tree (hierarchical), Radial (circular), Grid (organized) with smooth transitions
  - Search Modes: Text (default icon), Regex (code icon), Path (path icon) with active state styling
  - Views: Tree (hierarchical list), Graph (spatial visualization) with smooth transition
  - Input: Empty (placeholder), Valid (success subtle glow), Invalid (error border + shake), Formatting (loading overlay)
  - Theme: Light (bright gradients), Dark (rich with glow), Transitioning (smooth 350ms morph)
  - Cards: Default (subtle shadow), Hover (shadow-2xl + border glow + scale 1.01)
  - File Input: Default, Drag Over (border highlight), Loading (spinner), Error (red border)
  - URL Input: Empty, Valid URL, Loading (disabled + spinner), Error (validation message)
  
- **Icon Selection** (Phosphor Icons, duotone weight): 
  - Custom DataScope logo (magnifying glass with bar chart) for app branding
  - Graph/TreeStructure for view mode switching
  - Circle/Tree/Rows for graph layout options
  - Upload/Link for file input modes
  - MagnifyingGlass for search
  - Code for regex mode
  - Path for path search mode
  - TextAa for text mode
  - Funnel/X for filters
  - Copy/Check for path copying with animation
  - CaretRight/CaretDown for tree expansion
  - File/FileCode/ListBullets/FileCsv/Table for format tabs
  - ChartBar for statistics
  - Target for centrality
  - GitBranch for graph structure
  - Rows for node count
  - Sun/Moon for theme toggle with rotation
  - TextAlignLeft/Minus for format/minify
  - Gear for settings
  - ArrowsOut/ArrowsIn/ArrowsClockwise for zoom controls
  - Download for export functionality
  - Toolbox for advanced tools panel
  - BracketsAngle for schema generation
  - ClipboardText for data transformation
  - GitDiff for data comparison
  - Play for running transformations
  - Check/X for diff indicators
  
- **Spacing**: 
  - Consistent Tailwind spacing with breathing room: gap-8 for major sections, gap-6 for panels, gap-4 for related groups, gap-3 for options, gap-2 for tight elements
  - Card padding: p-6 for main content, p-5 for secondary, p-4 for compact with rounded-xl borders
  - Graph margins calculated by force simulation with comfortable padding
  - Header padding: py-6 with max-width container
  - Button padding: px-5 py-2.5 for comfortable touch targets
  
- **Mobile**: 
  - Stack all panels vertically on single column (<1280px breakpoint)
  - Format tabs switch to 2x3 grid or scrollable on narrow screens
  - Graph view optimized for touch (larger nodes, better hit targets 44px+)
  - Advanced search filters collapsible by default with expand button
  - Analytics tabs remain accessible with swipe gestures
  - Tree indentation reduced to 12px on mobile for more content
  - Larger touch targets (44px minimum) for all interactive elements
  - Sticky header with essential controls and theme toggle
  - Responsive font scaling (base 14px → 16px on mobile)
  - Bottom safe area padding for iOS devices
  - Touch-optimized dropdowns and dialogs
  - Pinch to zoom on graph visualization
  - Swipe gestures for tab navigation
