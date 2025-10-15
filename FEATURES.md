# DataScope Features Guide

## 🚀 Quick Actions Panel

**Location**: Top of sidebar when data is loaded

### What it does
Provides one-click access to the most commonly used operations, eliminating the need to navigate through menus.

### Features
- **Prettify**: Format and indent your data beautifully
- **Minify**: Compress data to minimal format
- **Validate**: Check data structure and quality
- **Copy All**: Copy entire dataset to clipboard
- **Export**: Quick access to export dialog

### Additional Features
- **Recent Actions**: See history of last 5 operations
- **Visual Feedback**: Hover effects and state indicators
- **Smart Disable**: Actions disabled when not applicable

### Use Cases
- Quick data formatting before sharing
- Fast validation of data structure
- One-click export for downloads
- Rapid data cleanup workflow

---

## ✅ Data Validator

**Location**: Below Favorites in sidebar

### What it does
Analyzes your data in real-time and provides a quality score (0-100) with specific issues and suggestions for improvement.

### Quality Score Breakdown
- **90-100**: Excellent - Clean, well-structured data
- **70-89**: Good - Minor issues, mostly warnings
- **50-69**: Fair - Several warnings, some errors
- **0-49**: Needs Improvement - Multiple errors

### Issues Detected

#### Errors (Critical)
- Duplicate keys
- Invalid numbers (Infinity, NaN)
- Type inconsistencies

#### Warnings (Important)
- Very deep nesting (>20 levels)
- Large objects (>50 keys)
- Large arrays (>1000 items)
- Keys starting with numbers
- Very long strings (>10,000 chars)
- Leading/trailing whitespace

#### Info (Suggestions)
- Empty objects or arrays
- Null or undefined values
- Mixed types in arrays
- Empty strings

### Suggestions Provided
Each issue includes:
- Clear problem description
- Exact path to the issue
- Actionable suggestion to fix it
- Severity indicator (color-coded)

### Use Cases
- Pre-validation before API submission
- Data cleanup and optimization
- Structure improvement
- Best practice compliance

---

## 👁️ Quick View Panel

**Location**: Middle of sidebar when data is loaded

### What it does
Shows an instant preview of whatever node you select in the tree view, without needing to expand it.

### Type-Specific Previews

#### Strings
- Character count
- Formatted text display
- Handles long strings gracefully

#### Numbers
- Integer vs Float identification
- Formatted with thousands separators
- Clear numeric display

#### Booleans
- Large, clear true/false display
- Color-coded for quick recognition

#### Arrays
- Item count display
- JSON preview (scrollable)
- First few items visible

#### Objects
- Key count display
- Key names listed (first 5)
- JSON preview (scrollable)
- Complete structure available

### Features
- **Live Updates**: Changes instantly when you select different nodes
- **One-Click Copy**: Copy button for selected value
- **Path Display**: Shows current path in tree
- **Type Badge**: Clear visual indicator of data type

### Use Cases
- Quick data inspection without expanding
- Value verification
- Type checking
- Path confirmation before bookmarking

---

## ⭐ Favorites / Bookmarks

**Location**: Middle of sidebar

### What it does
Lets you save important data paths for quick access later. Perfect for large, complex data structures where you frequently need to access specific paths.

### How to Use

#### Adding Favorites
1. Navigate to any node in the tree
2. Click "Add" button in Favorites panel
3. Path is saved with label and depth info

#### Using Favorites
- **Navigate**: Click magnifying glass icon to jump to path
- **Copy Path**: Click copy icon to copy path string
- **Remove**: Click trash icon to delete bookmark
- **Clear All**: Remove all favorites at once

### Features
- **Persistent Storage**: Favorites saved between sessions
- **Duplicate Prevention**: Can't accidentally add same path twice
- **Visual Feedback**: Hover reveals action buttons
- **Depth Indicator**: Shows how many levels deep the path is
- **Label Display**: Last key in path shown as friendly name

### Use Cases
- Navigating large configuration files
- Repeated access to specific API response paths
- Bookmarking important metrics in analytics data
- Quick reference to frequently checked values
- Team collaboration (bookmark important paths)

---

## 💡 Smart Suggestions

**Location**: Top-middle of sidebar

### What it does
Analyzes your data structure and content to provide context-aware recommendations for relevant features and optimal workflows.

### Suggestions Triggered

#### Complex Structure (>20 nodes)
**Suggests**: Switch to Graph View
**Reason**: Graph visualization better shows relationships and structure in complex data

#### Array Data
**Suggests**: Use Advanced Search
**Reason**: Arrays benefit from filtering and search capabilities

#### Nested Arrays
**Suggests**: Open Data Transformer
**Reason**: Nested structures often need flattening or field extraction

#### Large Objects (>10 keys)
**Suggests**: View Analytics
**Reason**: Analytics provide better overview of structure and composition

#### Always Available
**Suggests**: Export Options
**Reason**: Common need to save processed data

### Features
- **Context-Aware**: Adapts to your specific data
- **Actionable**: Each suggestion is clickable and takes you to the feature
- **Limited**: Maximum 4 suggestions to avoid overwhelm
- **Smart**: Only shows relevant suggestions for your data

### Use Cases
- **New Users**: Discover features you might not know about
- **Efficiency**: Quick access to optimal tools for your data
- **Learning**: Understand which features work best for different data types
- **Workflow**: Streamline your data analysis process

---

## 🎯 Best Practices

### Workflow Recommendations

#### 1. Load Data
- Use drag-and-drop for files
- Paste directly for quick tests
- Use URL loader for API responses

#### 2. Quick Actions
- Click Validate to check quality
- Use Prettify if data is messy
- Check Data Validator for issues

#### 3. Exploration
- Select nodes to see Quick View
- Bookmark important paths
- Follow Smart Suggestions

#### 4. Analysis
- Switch between Tree and Graph views
- Use Advanced Search to filter
- Check Analytics panels

#### 5. Transform
- Use Smart Suggestions to find Transform tool
- Apply transformations as needed
- Validate results

#### 6. Export
- Quick Actions → Export
- Choose appropriate format
- Save for later use

### Pro Tips

1. **Use Favorites Early**: As you explore, bookmark important paths immediately
2. **Check Quality First**: Run validator before detailed analysis
3. **Follow Suggestions**: Smart Suggestions often point to time-saving features
4. **Quick View Before Expand**: Use Quick View to check if you need to expand nodes
5. **Combine Features**: Use Search + Quick View + Favorites together for power workflow

---

## 🔧 Keyboard Shortcuts

All existing shortcuts still work:
- `Ctrl+P`: Parse data
- `Ctrl+E`: Export
- `Ctrl+K`: Focus search
- `Ctrl+1`: Tree view
- `Ctrl+2`: 2D Graph
- `Ctrl+3`: 3D Graph
- `E`: Expand all
- `C`: Collapse all
- `Ctrl+D`: Toggle theme
- `?`: Show shortcuts

---

## 📊 Use Case Examples

### API Development
1. Paste API response
2. Validate structure
3. Bookmark important response paths
4. Quick View to verify values
5. Export as schema

### Data Cleanup
1. Load messy data
2. Check Data Validator
3. Follow suggestions to fix issues
4. Use Transformer if needed
5. Validate again
6. Export clean version

### Configuration Management
1. Load config file
2. Bookmark critical paths
3. Use Quick View to verify values
4. Follow Smart Suggestions
5. Transform if structure needs change

### Log Analysis
1. Load JSONL logs
2. Use Search to filter events
3. Quick View specific entries
4. Bookmark interesting patterns
5. Export filtered results

---

## 🆘 Need Help?

- **Tooltips**: Hover over any button or feature for hints
- **Smart Suggestions**: Follow recommendations for optimal workflow
- **Data Validator**: Provides specific guidance for issues
- **Keyboard Shortcuts**: Press `?` to see all shortcuts
- **Quick View**: Shows detailed info about selected data

---

**DataScope v2.6.0** - Professional Data Analytics & Visualization
