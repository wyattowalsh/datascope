# Planning Guide

A professional tool for developers to visualize, explore, and analyze JSON and YAML data with powerful search, filtering, and navigation capabilities.

**Experience Qualities**:
1. **Efficient** - Instant parsing and responsive interactions that help developers work faster
2. **Clear** - Visual hierarchy and syntax highlighting make complex data structures immediately understandable
3. **Powerful** - Advanced features like path copying, type filtering, and deep search without overwhelming the interface

**Complexity Level**: Light Application (multiple features with basic state)
  - Multiple coordinated features (parsing, search, filtering, tree navigation) with persistent state for user preferences and current data

## Essential Features

### JSON/YAML Input & Parsing
- **Functionality**: Accept JSON or YAML input via textarea, auto-detect format, parse and validate
- **Purpose**: Allow users to quickly paste data from APIs, configs, or files
- **Trigger**: User pastes or types into input area
- **Progression**: Paste data → Auto-detect format → Parse → Display result or validation errors → Render tree view
- **Success criteria**: Valid JSON/YAML renders in tree view; invalid input shows clear error messages with line numbers

### Interactive Tree Visualization
- **Functionality**: Collapsible tree structure with syntax highlighting, type badges, and value previews
- **Purpose**: Make nested data structures easy to explore and understand at a glance
- **Trigger**: Successful parsing of input data
- **Progression**: Parse complete → Render root node → Click to expand/collapse → Navigate nested structures → View full values
- **Success criteria**: All nesting levels accessible, smooth expand/collapse, clear visual hierarchy

### Search & Filter
- **Functionality**: Real-time search across keys and values, filter by data type (string, number, boolean, null, array, object)
- **Purpose**: Quickly locate specific data in large documents
- **Trigger**: User types in search box or selects type filters
- **Progression**: Enter search term → Highlight matching nodes → Filter by type → Show only matching branches → Clear to reset
- **Success criteria**: Instant results, highlight all matches, maintain tree context for filtered results

### Path Navigation
- **Functionality**: Display and copy JSON path or YAML path for any selected node
- **Purpose**: Enable developers to quickly reference data locations in code
- **Trigger**: Click on any node in tree
- **Progression**: Click node → Show path in toolbar → Click copy button → Path copied to clipboard → Toast confirmation
- **Success criteria**: Accurate path notation (dot notation for JSON, bracket notation option), one-click copy

### Statistics & Analysis
- **Functionality**: Show document stats - total keys, nesting depth, type distribution
- **Purpose**: Provide overview of data structure complexity
- **Trigger**: Successful parsing displays stats panel
- **Progression**: Parse data → Calculate metrics → Display in stats panel → Update on filter changes
- **Success criteria**: Accurate counts, instant updates, helpful metrics

## Edge Case Handling
- **Empty Input**: Show helpful placeholder with example JSON/YAML to get started
- **Invalid Syntax**: Display detailed error message with line/column numbers and helpful fix suggestions
- **Very Large Files**: Handle large documents gracefully with virtual scrolling and performance warnings
- **Deep Nesting**: Limit initial expansion depth, provide expand-all option with warning for deep structures
- **Special Characters**: Properly escape and display unicode, emojis, and special chars in values
- **Circular References**: Detect and display warning (JSON only, as YAML can have anchors/aliases)

## Design Direction
The design should feel professional, technical, and elegant - like a premium developer tool. Clean, monospace typography for code, with a sophisticated color-coded syntax highlighting system. Minimal but powerful interface where function is immediately visible.

## Color Selection
Custom palette with syntax-highlighting inspired colors that feel technical yet refined.

- **Primary Color**: Deep Blue (#2563eb) - Professional, trustworthy, represents structure and logic
- **Secondary Colors**: Muted slate backgrounds for code areas, soft borders for subtle separation
- **Accent Color**: Electric Cyan (#06b6d4) for interactive elements and highlights - draws attention without being harsh
- **Foreground/Background Pairings**:
  - Background (Light Gray #fafafa): Dark text (#0a0a0a) - Ratio 19.5:1 ✓
  - Card (White #ffffff): Dark text (#0a0a0a) - Ratio 21:1 ✓
  - Primary (Deep Blue #2563eb): White text (#ffffff) - Ratio 7.1:1 ✓
  - Accent (Cyan #06b6d4): White text (#ffffff) - Ratio 4.8:1 ✓
  - Muted (Light Slate #f1f5f9): Medium text (#475569) - Ratio 7.2:1 ✓

**Syntax Highlighting Colors**:
- String values: Emerald green (#10b981)
- Number values: Orange (#f59e0b)
- Boolean values: Purple (#a855f7)
- Null values: Gray (#6b7280)
- Keys: Dark blue (#1e40af)
- Brackets/Braces: Slate (#64748b)

## Font Selection
Monospace fonts for code display convey precision and technical accuracy, while clean sans-serif for UI elements maintains readability and modern aesthetics.

- **Typographic Hierarchy**:
  - H1 (App Title): Inter SemiBold/24px/tight letter spacing
  - H2 (Section Headers): Inter Medium/16px/normal spacing
  - Code/Data Display: JetBrains Mono Regular/14px/wide letter spacing for clarity
  - UI Labels: Inter Regular/13px/normal spacing
  - Tree Keys: JetBrains Mono Medium/13px
  - Tree Values: JetBrains Mono Regular/13px
  - Stats/Meta: Inter Regular/12px/subtle gray

## Animations
Subtle, functional animations that provide feedback without slowing down the workflow - drawer slides, smooth tree expansion, and highlight pulses.

- **Purposeful Meaning**: Expand/collapse animations communicate hierarchy changes, search highlights pulse briefly to catch attention, copy confirmations fade smoothly
- **Hierarchy of Movement**: Tree expand/collapse is primary (300ms smooth), search highlights are secondary (200ms), tooltips and hovers are tertiary (100ms)

## Component Selection
- **Components**: 
  - Card for main content areas (input panel, tree view, stats)
  - Tabs for JSON/YAML format switching
  - Input/Textarea for data entry with monospace styling
  - Badge for type indicators (string, number, object, array, etc.)
  - Button for actions (parse, copy, expand all, collapse all)
  - ScrollArea for tree view to handle large documents
  - Alert for error messages with helpful context
  - Separator for visual section division
  - Tooltip for path previews and keyboard shortcuts
  - Sheet/Drawer for stats panel on mobile
  
- **Customizations**: 
  - Custom Tree component with recursive rendering
  - Custom syntax highlighting for values
  - Custom path breadcrumb component
  - Copy button with success state animation
  
- **States**: 
  - Buttons: Default (with icon), Hover (slight scale + bg change), Active (pressed effect), Disabled (grayed when no data)
  - Tree Nodes: Collapsed (chevron right), Expanded (chevron down), Matched (highlighted bg), Selected (accent border)
  - Input: Empty (placeholder), Valid (green border), Invalid (red border + error text)
  
- **Icon Selection**: 
  - MagnifyingGlass for search
  - Funnel for filters
  - Copy for path copying
  - CaretRight/CaretDown for tree expansion
  - FileJson for JSON
  - FileCode for YAML
  - ChartBar for statistics
  - Check for copy success
  
- **Spacing**: Consistent use of Tailwind spacing - gap-4 for major sections, gap-2 for related elements, p-6 for cards, p-4 for compact areas, p-1 for tight groups

- **Mobile**: 
  - Stack input and tree view vertically on mobile
  - Stats panel becomes a bottom sheet/drawer
  - Reduce tree indentation from 24px to 16px
  - Larger touch targets (44px min) for expand/collapse
  - Sticky search bar at top
  - Collapsible filter chips instead of full filter panel
