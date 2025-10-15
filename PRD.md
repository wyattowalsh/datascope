# Planning Guide

A professional, beautiful developer tool for visualizing, exploring, and analyzing JSON and YAML data with powerful search, filtering, formatting, and navigation capabilities.

**Experience Qualities**:
1. **Efficient** - Instant parsing, responsive interactions, and formatting tools that help developers work faster
2. **Clear** - Visual hierarchy, syntax highlighting, and adaptive theming make complex data structures immediately understandable
3. **Powerful** - Advanced features like path copying, type filtering, deep search, formatting/linting, and customization without overwhelming the interface

**Complexity Level**: Light Application (multiple features with basic state)
  - Multiple coordinated features (parsing, search, filtering, tree navigation, formatting, theme switching) with persistent state for user preferences and current data

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

### JSON/YAML Formatting & Linting
- **Functionality**: Format/prettify JSON with customizable indent (2/4 spaces, tabs), minify, validate and show lint errors
- **Purpose**: Clean up messy data, reduce size, or standardize formatting
- **Trigger**: Click format/minify buttons in toolbar
- **Progression**: Click format → Select indent preference → Apply formatting → Update display → Show success toast
- **Success criteria**: Proper indentation, maintains data integrity, smooth visual update

### Light/Dark Mode Toggle
- **Functionality**: Switch between light and dark themes with persistent preference
- **Purpose**: Reduce eye strain and match user's environment/preference
- **Trigger**: Click theme toggle button in header
- **Progression**: Click toggle → Theme switches instantly → Save preference → Persist across sessions
- **Success criteria**: Smooth transition, all colors adapt properly, preference remembered

## Edge Case Handling
- **Empty Input**: Show helpful placeholder with example JSON/YAML to get started
- **Invalid Syntax**: Display detailed error message with line/column numbers and helpful fix suggestions
- **Very Large Files**: Handle large documents gracefully with virtual scrolling and performance warnings (10k+ nodes)
- **Deep Nesting**: Limit initial expansion depth, provide expand-all option with warning for deep structures (20+ levels)
- **Special Characters**: Properly escape and display unicode, emojis, and special chars in values
- **Circular References**: Detect and display warning (JSON only, as YAML can have anchors/aliases)
- **Mixed Format**: Auto-detect format and guide user to correct tab
- **Malformed Formatting**: Provide lint errors with helpful suggestions when formatting fails
- **Theme Transitions**: Ensure smooth color transitions without flashing on theme change
- **Mobile Interactions**: Handle touch gestures, prevent zoom on double-tap, optimize for small screens

## Design Direction
The design should feel professional, elegant, and adaptive - like a premium developer tool that works beautifully in any lighting condition. Clean, monospace typography for code with sophisticated color-coded syntax highlighting. Smooth theme transitions between light and dark modes. Minimal but powerful interface where function is immediately visible. Modern glassmorphic touches and subtle shadows that adapt to the current theme.

## Color Selection
Dual-palette system with carefully balanced light and dark modes, both featuring syntax-highlighting inspired colors that feel technical yet refined.

**Light Mode Palette:**
- **Primary Color**: Vibrant Blue (oklch(0.53 0.197 264.05)) - Professional, energetic, represents clarity and structure
- **Secondary Colors**: Soft slate backgrounds (oklch(0.96 0.002 247.86)) for subtle contrast and visual breathing room
- **Accent Color**: Bright Cyan (oklch(0.69 0.134 210.42)) for interactive highlights and active states - modern and eye-catching
- **Background**: Near-white (oklch(0.99 0 0)) with very light warmth for reduced eye strain
- **Foreground/Background Pairings**:
  - Background (oklch(0.99 0 0)): Dark text (oklch(0.09 0 0)) - Ratio 16.8:1 ✓
  - Card (oklch(1 0 0)): Dark text (oklch(0.09 0 0)) - Ratio 18.2:1 ✓
  - Primary (oklch(0.53 0.197 264.05)): White text (oklch(0.99 0 0)) - Ratio 6.8:1 ✓
  - Accent (oklch(0.69 0.134 210.42)): White text (oklch(0.99 0 0)) - Ratio 4.9:1 ✓
  - Muted (oklch(0.96 0.002 247.86)): Medium text (oklch(0.48 0.014 252.73)) - Ratio 8.1:1 ✓

**Dark Mode Palette:**
- **Primary Color**: Bright Blue (oklch(0.64 0.25 265.75)) - Luminous against dark, maintains brand identity
- **Secondary Colors**: Deep slate backgrounds (oklch(0.18 0.01 250)) for rich depth
- **Accent Color**: Electric Cyan (oklch(0.75 0.15 210)) for vibrant highlights that pop in darkness
- **Background**: True dark (oklch(0.12 0.01 250)) with slight cool tone for OLED-friendly display
- **Foreground/Background Pairings**:
  - Background (oklch(0.12 0.01 250)): Light text (oklch(0.95 0.01 250)) - Ratio 15.2:1 ✓
  - Card (oklch(0.15 0.01 250)): Light text (oklch(0.95 0.01 250)) - Ratio 13.8:1 ✓
  - Primary (oklch(0.64 0.25 265.75)): Dark text (oklch(0.12 0.01 250)) - Ratio 7.2:1 ✓
  - Accent (oklch(0.75 0.15 210)): Dark text (oklch(0.12 0.01 250)) - Ratio 8.6:1 ✓
  - Muted (oklch(0.18 0.01 250)): Light muted text (oklch(0.62 0.02 250)) - Ratio 7.4:1 ✓

**Syntax Highlighting Colors (Adaptive):**
- Light Mode:
  - String values: Emerald (oklch(0.64 0.15 163.23))
  - Number values: Amber (oklch(0.72 0.16 65.28))
  - Boolean values: Purple (oklch(0.64 0.19 305.48))
  - Null values: Slate (oklch(0.54 0.02 247.86))
  - Keys: Deep blue (oklch(0.42 0.12 264.05))
  - Brackets: Medium slate (oklch(0.52 0.02 252.73))

- Dark Mode:
  - String values: Bright emerald (oklch(0.72 0.18 163))
  - Number values: Bright amber (oklch(0.78 0.18 65))
  - Boolean values: Bright purple (oklch(0.72 0.22 305))
  - Null values: Light slate (oklch(0.62 0.03 250))
  - Keys: Bright blue (oklch(0.68 0.15 265))
  - Brackets: Light slate (oklch(0.58 0.03 250))

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
Purposeful, smooth animations that provide visual feedback and guide attention without interrupting workflow - theme transitions, tree expansions, and interactive states.

- **Purposeful Meaning**: Theme transitions smoothly morph colors (300ms), expand/collapse animations communicate hierarchy changes (250ms), search highlights pulse briefly to catch attention (200ms), copy confirmations fade smoothly (150ms), format changes animate gracefully (200ms)
- **Hierarchy of Movement**: Theme switch is primary (300ms with easing), tree expand/collapse is secondary (250ms smooth), button interactions and hovers are tertiary (150ms), tooltips appear quickly (100ms)

## Component Selection
- **Components**: 
  - Card for main content areas (input panel, tree view, stats)
  - Tabs for JSON/YAML format switching
  - Input/Textarea for data entry with monospace styling
  - Badge for type indicators (string, number, object, array, etc.)
  - Button for actions (parse, copy, expand all, collapse all, format, minify)
  - ScrollArea for tree view to handle large documents
  - Alert for error messages with helpful context
  - Separator for visual section division
  - Tooltip for path previews, keyboard shortcuts, and feature hints
  - Sheet/Drawer for stats panel and filters on mobile
  - Dialog for format options (indent size, style preferences)
  - Switch for theme toggle (light/dark)
  - DropdownMenu for formatting options
  
- **Customizations**: 
  - Custom Tree component with recursive rendering
  - Custom syntax highlighting for values (theme-aware)
  - Custom path breadcrumb component
  - Copy button with success state animation
  - Format toolbar with indent options
  - Theme toggle with smooth transition
  
- **States**: 
  - Buttons: Default (with icon), Hover (slight lift + bg change), Active (pressed effect), Disabled (grayed when no data), Loading (spinner for format operations)
  - Tree Nodes: Collapsed (chevron right), Expanded (chevron down), Matched (highlighted bg), Selected (accent border), Hover (subtle bg)
  - Input: Empty (placeholder), Valid (success border), Invalid (error border + message), Formatting (brief overlay)
  - Theme: Light (bright, high contrast), Dark (rich, deep colors), Transition (smooth 300ms morph)
  
- **Icon Selection**: 
  - MagnifyingGlass for search
  - Funnel for filters
  - Copy/Check for path copying with success state
  - CaretRight/CaretDown for tree expansion
  - File/FileCode for JSON/YAML tabs
  - ChartBar for statistics
  - Sun/Moon for theme toggle
  - TextAlignLeft/TextAlignJustify for format/minify
  - Gear for settings
  - ArrowsOut/ArrowsIn for expand/collapse all
  
- **Spacing**: Consistent use of Tailwind spacing - gap-6 for major sections, gap-4 for related groups, gap-2 for tight elements, p-6 for cards, p-4 for compact areas, p-2 for minimal padding

- **Mobile**: 
  - Stack input and tree view vertically on mobile (<768px)
  - Stats panel becomes a bottom sheet/drawer with swipe gesture
  - Reduce tree indentation from 24px to 16px on mobile
  - Larger touch targets (44px min) for all interactive elements
  - Sticky header with theme toggle and essential controls
  - Format options in dropdown menu instead of inline buttons
  - Collapsible filter chips instead of full filter sheet
  - Responsive font sizes (14px → 13px for code on mobile)
  - Bottom toolbar for primary actions (parse, format) on mobile
