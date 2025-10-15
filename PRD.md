# Planning Guide

A professional, powerful developer tool for visualizing, exploring, analyzing structured data with advanced graph analytics, interactive exploration, comprehensive search capabilities, and beautiful data visualization. Now enhanced with refined visual polish, sophisticated animations, improved spacing, and delightful micro-interactions.

**Experience Qualities**:
1. **Powerful** - Graph visualization, advanced analytics, regex search, multi-modal data exploration with comprehensive metrics and insights
2. **Intuitive** - Seamless switching between tree and graph views, smart search modes, clear visual feedback, and guided exploration
3. **Professional** - Elegant design, sophisticated analytics, production-ready formatting tools, and refined interactions that delight

**Complexity Level**: Complex Application (advanced functionality with rich state management)
  - Multiple sophisticated features (graph visualization with D3 force simulation, advanced search with regex/path modes, comprehensive analytics, dual visualization modes) with extensive state persistence and real-time coordination

## Essential Features

### JSON/YAML Input & Parsing
- **Functionality**: Accept JSON or YAML input via textarea, auto-detect format, parse and validate with comprehensive error reporting
- **Purpose**: Allow users to quickly paste data from APIs, configs, or files with instant feedback
- **Trigger**: User pastes or types into input area
- **Progression**: Paste data → Auto-detect format → Parse → Validate → Build tree structure → Generate graph → Calculate analytics → Display results
- **Success criteria**: Valid JSON/YAML renders in tree/graph views with full analytics; invalid input shows clear error messages with line numbers and helpful suggestions

### Interactive Tree Visualization
- **Functionality**: Collapsible tree structure with syntax highlighting, type badges, value previews, path navigation, and expand/collapse all
- **Purpose**: Make nested data structures easy to explore with full control over visibility
- **Trigger**: Successful parsing of input data
- **Progression**: Parse complete → Render root node → Click to expand/collapse → Navigate nested structures → Copy paths → View full values → Expand/collapse all
- **Success criteria**: All nesting levels accessible, smooth expand/collapse animations, clear visual hierarchy, instant path copying

### Graph Visualization with D3
- **Functionality**: Interactive force-directed graph showing data structure relationships with zoom, pan, drag, and node selection
- **Purpose**: Visualize data structure relationships and hierarchy in a spatial, intuitive way
- **Trigger**: Switch to graph view tab after parsing
- **Progression**: Switch to graph → Render force-directed layout → Drag nodes → Zoom/pan → Click nodes to select → Highlight connections → View node details
- **Success criteria**: Smooth physics simulation, responsive interactions, clear node/edge differentiation, synchronized selection with tree view

### Advanced Search & Filtering
- **Functionality**: Multi-mode search (text, regex, path) with case sensitivity, whole word matching, and type filtering across all data
- **Purpose**: Enable powerful data discovery with flexible query options for any use case
- **Trigger**: User enters search term or changes search options
- **Progression**: Enter term → Select mode (text/regex/path) → Toggle options (case/word) → Apply type filters → View filtered results → See result count
- **Success criteria**: Instant filtering, accurate regex matching, path-based search, persistent filter state, clear result highlighting

### Graph Analytics & Metrics
- **Functionality**: Comprehensive graph analysis including centrality, clustering, density, diameter, branching factor, and depth distribution
- **Purpose**: Provide deep insights into data structure complexity and relationships
- **Trigger**: Automatic calculation after successful parsing
- **Progression**: Parse data → Build graph → Calculate metrics → Display analytics → Show depth/type distribution → Rank by centrality
- **Success criteria**: Accurate mathematical calculations, meaningful visualizations, organized presentation across multiple tabs

### Statistics & Analysis
- **Functionality**: Real-time stats - total keys, max depth, type distribution with progress bars and percentages
- **Purpose**: Provide instant overview of data structure composition
- **Trigger**: Successful parsing displays stats panel with live updates
- **Progression**: Parse data → Calculate metrics → Display stats → Update on filter changes → Show type distributions
- **Success criteria**: Accurate counts, instant updates, color-coded type badges, helpful visual representations

### JSON/YAML Formatting & Linting
- **Functionality**: Format/prettify with customizable indent (2/4 spaces, tabs), minify JSON, comprehensive linting with error locations
- **Purpose**: Clean up messy data, standardize formatting, identify and fix errors
- **Trigger**: Click format/minify buttons or open format dialog
- **Progression**: Click format → Select indent preference → Apply formatting → Update display → Show lint errors if any → Provide fix suggestions
- **Success criteria**: Proper indentation, maintains data integrity, helpful lint messages, smooth visual updates

### Light/Dark Mode Toggle
- **Functionality**: Switch between light and dark themes with persistent preference and smooth transitions
- **Purpose**: Reduce eye strain and match user's environment preference
- **Trigger**: Click theme toggle button in header
- **Progression**: Click toggle → Theme switches with smooth transition → Save preference → Persist across sessions → Update all visualizations
- **Success criteria**: Smooth 300ms color transitions, all elements adapt properly, preference persisted, graph colors update

## Edge Case Handling
- **Empty Input**: Show helpful quick start guide with example links and feature overview
- **Invalid Syntax**: Display detailed error message with line/column numbers and helpful fix suggestions with inline highlighting
- **Very Large Files**: Handle large documents gracefully with virtual scrolling, performance monitoring, and warnings (10k+ nodes)
- **Deep Nesting**: Smart initial expansion, expand-all with progress, performance warnings for deep structures (20+ levels)
- **Special Characters**: Properly escape and display unicode, emojis, and special chars in values across all views
- **Circular References**: Detect and display warning (JSON only, as YAML can have anchors/aliases)
- **Mixed Format**: Auto-detect format and guide user to correct tab with helpful suggestions
- **Malformed Formatting**: Provide comprehensive lint errors with helpful fix suggestions and error locations
- **Theme Transitions**: Ensure smooth color transitions across all components including graph visualization
- **Mobile Interactions**: Handle touch gestures for graph manipulation, prevent zoom conflicts, optimize for small screens
- **Complex Regex**: Catch and display regex syntax errors with helpful messages
- **Empty Search Results**: Show "No results found" state with suggestion to adjust filters
- **Graph Rendering**: Handle disconnected nodes, self-loops, and performance for large graphs (500+ nodes)
- **Path Edge Cases**: Handle special characters in keys, numeric indices, and deeply nested paths correctly

## Design Direction
The design should feel sophisticated, powerful, and elegant - like a premium data analytics platform that combines technical precision with visual beauty. Modern glassmorphic UI with subtle depth, professional monospace typography for code with sophisticated multi-color syntax highlighting. Smooth theme transitions between light and dark modes that extend to graph visualizations. Layered information architecture where complexity is progressively revealed. Interactive visualizations that respond fluidly to user input with physics-based animations in graph view.

## Color Selection
Sophisticated dual-palette system with carefully balanced light and dark modes, featuring syntax-highlighting inspired colors and analytics-grade visualizations.

**Light Mode Palette:**
- **Primary Color**: Vibrant Blue (oklch(0.53 0.197 264.05)) - Professional, energetic, represents clarity and structure, used for graph arrays and primary actions
- **Secondary Colors**: Soft slate backgrounds (oklch(0.96 0.002 247.86)) for subtle contrast and visual breathing room
- **Accent Color**: Bright Cyan (oklch(0.69 0.134 210.42)) for interactive highlights, graph objects, and active states - modern and eye-catching
- **Background**: Near-white (oklch(0.99 0 0)) with very light warmth for reduced eye strain
- **Foreground/Background Pairings**:
  - Background (oklch(0.99 0 0)): Dark text (oklch(0.09 0 0)) - Ratio 16.8:1 ✓
  - Card (oklch(1 0 0)): Dark text (oklch(0.09 0 0)) - Ratio 18.2:1 ✓
  - Primary (oklch(0.53 0.197 264.05)): White text (oklch(0.99 0 0)) - Ratio 6.8:1 ✓
  - Accent (oklch(0.69 0.134 210.42)): White text (oklch(0.99 0 0)) - Ratio 4.9:1 ✓
  - Muted (oklch(0.96 0.002 247.86)): Medium text (oklch(0.48 0.014 252.73)) - Ratio 8.1:1 ✓

**Dark Mode Palette:**
- **Primary Color**: Bright Blue (oklch(0.64 0.25 265.75)) - Luminous against dark, maintains brand identity, graph arrays
- **Secondary Colors**: Deep slate backgrounds (oklch(0.18 0.01 250)) for rich depth
- **Accent Color**: Electric Cyan (oklch(0.75 0.15 210)) for vibrant highlights, graph objects, that pop in darkness
- **Background**: True dark (oklch(0.12 0.01 250)) with slight cool tone for OLED-friendly display
- **Foreground/Background Pairings**:
  - Background (oklch(0.12 0.01 250)): Light text (oklch(0.95 0.01 250)) - Ratio 15.2:1 ✓
  - Card (oklch(0.15 0.01 250)): Light text (oklch(0.95 0.01 250)) - Ratio 13.8:1 ✓
  - Primary (oklch(0.64 0.25 265.75)): Dark text (oklch(0.12 0.01 250)) - Ratio 7.2:1 ✓
  - Accent (oklch(0.75 0.15 210)): Dark text (oklch(0.12 0.01 250)) - Ratio 8.6:1 ✓
  - Muted (oklch(0.18 0.01 250)): Light muted text (oklch(0.62 0.02 250)) - Ratio 7.4:1 ✓

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
Monospace fonts for code display and technical precision, clean sans-serif for UI elements and analytics readability.

- **Typographic Hierarchy**:
  - H1 (App Title): Inter SemiBold/24px/tight letter spacing
  - H2 (Section Headers): Inter SemiBold/16px/normal spacing
  - H3 (Panel Titles): Inter SemiBold/14px/normal spacing
  - Code/Data Display: JetBrains Mono Regular/13px/wide letter spacing for clarity
  - Graph Labels: Inter Medium/11px/normal spacing
  - UI Labels: Inter Regular/13px/normal spacing
  - Tree Keys: JetBrains Mono Medium/13px
  - Tree Values: JetBrains Mono Regular/13px
  - Stats/Metrics: Inter Medium/20px for numbers, Inter Regular/12px for labels
  - Analytics Text: Inter Regular/13px
  - Badge Text: Inter Medium/11px

## Animations
Sophisticated, purposeful animations that provide visual feedback, guide attention, and create delightful micro-interactions - from theme transitions to graph physics simulations.

- **Purposeful Meaning**: 
  - Theme transitions smoothly morph all colors including graphs (300ms)
  - Graph force simulation provides organic, physics-based movement
  - Tree expand/collapse with smooth height transitions (250ms)
  - Search filter animations highlight results (200ms)
  - Node drag in graph view with momentum
  - Zoom/pan in graph with smooth easing
  - Copy confirmations with check animation (150ms)
  - Tab switches with subtle fade (200ms)
  - Hover states with gentle scale (100ms)
  
- **Hierarchy of Movement**: 
  - Graph physics simulation is primary (continuous, organic)
  - Theme switch is secondary (300ms with easing)
  - View mode transitions are secondary (250ms)
  - Tree expand/collapse is tertiary (250ms smooth)
  - Button interactions are quaternary (150ms)
  - Tooltips appear quickly (100ms)

## Component Selection
- **Components**: 
  - Card for all major content areas (input, tree, graph, stats, analytics)
  - Tabs for format switching (JSON/YAML) and view modes (Tree/Graph)
  - Textarea for data entry with monospace styling
  - Badge for type indicators with color coding
  - Button for all actions with icon support
  - ScrollArea for tree view and analytics panels
  - Alert for error messages with syntax highlighting
  - Separator for visual organization
  - Tooltip for contextual help throughout
  - Dialog for format options
  - Switch for boolean options
  - DropdownMenu for tools and actions
  - Progress bars for type/depth distribution
  - Custom D3 SVG for graph visualization
  
- **Customizations**: 
  - Custom Tree component with recursive rendering and path tracking
  - Custom Graph component with D3 force-directed layout
  - Advanced Search component with multi-mode support
  - Graph Analytics Panel with tabbed metrics
  - Custom syntax highlighting theme-aware across all views
  - Path display with copy functionality
  - Interactive node selection synchronized across views
  
- **States**: 
  - Buttons: Default, Hover (lift + color), Active (pressed), Disabled (grayed), Loading (spinner)
  - Tree Nodes: Collapsed, Expanded, Matched (highlighted), Selected (accent border), Hover (bg change)
  - Graph Nodes: Normal, Hover (highlight), Selected (thick border + color), Dragging (elevated)
  - Search Modes: Text (default), Regex (code icon), Path (path icon)
  - Views: Tree (hierarchical), Graph (spatial)
  - Input: Empty (placeholder), Valid (success), Invalid (error + details), Formatting (loading)
  - Theme: Light (bright), Dark (rich), Transitioning (smooth morph)
  
- **Icon Selection**: 
  - Graph/TreeStructure for view mode switching
  - MagnifyingGlass for search
  - Code for regex mode
  - Path for path search mode
  - TextAa for text mode
  - Funnel/X for filters
  - Copy/Check for path copying
  - CaretRight/CaretDown for tree expansion
  - File/FileCode for JSON/YAML
  - ChartBar for statistics
  - Target for centrality
  - GitBranch for graph structure
  - Rows for node count
  - Sun/Moon for theme toggle
  - TextAlignLeft/Minus for format/minify
  - Gear for settings
  - ArrowsOut/ArrowsIn for expand/collapse and zoom
  - ArrowsClockwise for graph reset
  
- **Spacing**: 
  - Consistent Tailwind spacing: gap-6 for major sections, gap-4 for related groups, gap-3 for search options, gap-2 for tight elements
  - Card padding: p-6 for analytics, p-4 for general cards, p-3 for compact
  - Graph margins and node spacing calculated by force simulation
  
- **Mobile**: 
  - Stack all panels vertically (<1280px)
  - Graph view optimized for touch (larger nodes, better hit targets)
  - Advanced search collapses filters by default
  - Analytics tabs remain accessible
  - Tree indentation reduced to 16px on mobile
  - Larger touch targets (44px min) for all interactive elements
  - Sticky header with essential controls
  - Bottom toolbar for primary actions
  - Swipe gestures for graph pan
  - Pinch to zoom on graph
  - Responsive font scaling
