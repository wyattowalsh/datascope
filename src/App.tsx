import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { useTheme } from '@/hooks/use-theme'
import { 
  Copy, 
  Check, 
  File, 
  FileCode, 
  ChartBar,
  Sun,
  Moon,
  TextAlignLeft,
  Minus,
  ArrowsOut,
  ArrowsIn,
  Gear,
  Graph,
  TreeStructure,
  Table,
  ListBullets,
  FileCsv,
  Download,
  Toolbox,
  Keyboard
} from '@phosphor-icons/react'
import logoSvg from '@/assets/images/logo.svg'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { TreeView } from '@/components/TreeView'
import { StatsPanel } from '@/components/StatsPanel'
import { FormatOptionsDialog } from '@/components/FormatOptionsDialog'
import { LintErrorsDisplay } from '@/components/LintErrorsDisplay'
import { GraphVisualization } from '@/components/GraphVisualization'
import { GraphAnalyticsPanel } from '@/components/GraphAnalyticsPanel'
import { AdvancedSearch, SearchOptions } from '@/components/AdvancedSearch'
import { FileInput } from '@/components/FileInput'
import { ExportDialog } from '@/components/ExportDialog'
import { SchemaExtractor } from '@/components/SchemaExtractor'
import { DataTransformer } from '@/components/DataTransformer'
import { DataComparator } from '@/components/DataComparator'
import { ShortcutsDialog, useKeyboardShortcuts } from '@/components/ShortcutsDialog'
import { InsightsPanel } from '@/components/InsightsPanel'
import { DataHistory, saveToHistory } from '@/components/DataHistory'
import { parseData, buildTree, calculateStats, getPathString, advancedSearchNodes, TreeNode, ValueType, DataFormat } from '@/lib/parser'
import { formatJSON, minifyJSON, formatYAML, formatJSONL, lintJSON, FormatOptions, LintError } from '@/lib/formatter'
import { buildGraph, analyzeGraph, GraphData, GraphAnalytics } from '@/lib/graph-analyzer'
import { gtmDataParsed, gtmFileLoaded, gtmViewChanged, gtmSearchPerformed, gtmFormatAction } from '@/lib/analytics'
import { toast } from 'sonner'

const EXAMPLE_JSON = `{
  "user": {
    "id": 12345,
    "name": "Alex Rivera",
    "email": "alex@example.com",
    "active": true,
    "roles": ["admin", "developer"],
    "metadata": {
      "created": "2024-01-15",
      "lastLogin": "2024-03-20",
      "preferences": {
        "theme": "dark",
        "language": "en"
      }
    }
  },
  "projects": [
    {
      "id": 1,
      "title": "Data Visualizer",
      "status": "active",
      "tags": ["react", "d3", "typescript"]
    },
    {
      "id": 2,
      "title": "Graph Analytics",
      "status": "planning",
      "tags": ["algorithms", "optimization"]
    }
  ],
  "settings": {
    "theme": "dark",
    "notifications": true,
    "privacy": null
  }
}`

const EXAMPLE_YAML = `user:
  id: 12345
  name: Alex Rivera
  email: alex@example.com
  active: true
  roles:
    - admin
    - developer
  metadata:
    created: 2024-01-15
    lastLogin: 2024-03-20
    preferences:
      theme: dark
      language: en
projects:
  - id: 1
    title: Data Visualizer
    status: active
    tags:
      - react
      - d3
      - typescript
  - id: 2
    title: Graph Analytics
    status: planning
    tags:
      - algorithms
      - optimization
settings:
  theme: dark
  notifications: true
  privacy: null`

const EXAMPLE_JSONL = `{"id": 1, "name": "Alice Johnson", "role": "Engineer", "active": true, "score": 95.5}
{"id": 2, "name": "Bob Smith", "role": "Designer", "active": true, "score": 87.3}
{"id": 3, "name": "Carol White", "role": "Manager", "active": false, "score": 92.1}
{"id": 4, "name": "David Brown", "role": "Engineer", "active": true, "score": 88.7}
{"id": 5, "name": "Eve Davis", "role": "Analyst", "active": true, "score": 94.2}`

const EXAMPLE_CSV = `name,age,department,salary,active
John Doe,32,Engineering,85000,true
Jane Smith,28,Design,78000,true
Bob Johnson,45,Management,95000,true
Alice Williams,35,Sales,72000,false
Charlie Brown,29,Engineering,82000,true`

function App() {
  const [inputValue, setInputValue] = useKV('visualizer-input', '')
  const [detectedFormat, setDetectedFormat] = useState<DataFormat>('json')
  const [parsedData, setParsedData] = useState<any>(null)
  const [error, setError] = useState<string>('')
  const [treeNodes, setTreeNodes] = useState<TreeNode[]>([])
  const [selectedPath, setSelectedPath] = useState<string[]>([])
  const [copiedPath, setCopiedPath] = useState(false)
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set())
  const [showFormatDialog, setShowFormatDialog] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [showShortcutsDialog, setShowShortcutsDialog] = useState(false)
  const [lintErrors, setLintErrors] = useState<LintError[]>([])
  const [showLintErrors, setShowLintErrors] = useState(false)
  const [graphData, setGraphData] = useState<GraphData | null>(null)
  const [graphAnalytics, setGraphAnalytics] = useState<GraphAnalytics | null>(null)
  const [viewMode, setViewMode] = useState<'tree' | 'graph'>('tree')
  const [toolsExpanded, setToolsExpanded] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [history, setHistory] = useKV<any[]>('data-history', [])
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    searchTerm: '',
    searchMode: 'text',
    caseSensitive: false,
    wholeWord: false,
    typeFilters: []
  })
  
  const { theme, toggleTheme } = useTheme()

  const detectFormat = useCallback((data: string): DataFormat => {
    const trimmed = data.trim()
    
    if (!trimmed) return 'json'
    
    if (trimmed.split('\n').length > 1 && trimmed.split('\n').every(line => {
      const l = line.trim()
      return !l || (l.startsWith('{') && l.endsWith('}'))
    })) {
      return 'jsonl'
    }
    
    const lines = trimmed.split('\n')
    if (lines.length > 1 && lines[0].includes(',')) {
      const hasConsistentCommas = lines.slice(0, Math.min(5, lines.length)).every(line => 
        line.includes(',')
      )
      if (hasConsistentCommas) return 'csv'
    }
    
    if (trimmed.match(/^[\w-]+:\s*.+/m) && !trimmed.startsWith('{') && !trimmed.startsWith('[')) {
      return 'yaml'
    }
    
    try {
      JSON.parse(trimmed)
      return 'json'
    } catch {
      return 'yaml'
    }
  }, [])

  useEffect(() => {
    if (inputValue) {
      const detected = detectFormat(inputValue)
      setDetectedFormat(detected)
    }
  }, [inputValue, detectFormat])

  const handleViewModeChange = useCallback((newMode: 'tree' | 'graph') => {
    setViewMode(newMode)
    gtmViewChanged(newMode)
  }, [])

  const handleParse = useCallback(() => {
    const result = parseData(inputValue || '', detectedFormat)
    
    if (result.success && result.data) {
      setParsedData(result.data)
      setError('')
      const nodes = buildTree(result.data)
      setTreeNodes(nodes)
      setExpandedPaths(new Set())
      
      const graph = buildGraph(result.data)
      setGraphData(graph)
      
      const analytics = analyzeGraph(graph)
      setGraphAnalytics(analytics)
      
      if (detectedFormat === 'json') {
        const errors = lintJSON(inputValue || '')
        setLintErrors(errors)
        setShowLintErrors(errors.length > 0)
      } else {
        setLintErrors([])
        setShowLintErrors(false)
      }
      
      saveToHistory(inputValue || '', detectedFormat, setHistory)
      
      gtmDataParsed(detectedFormat, true)
      toast.success(`${result.format?.toUpperCase()} parsed successfully`)
    } else {
      setParsedData(null)
      setTreeNodes([])
      setGraphData(null)
      setGraphAnalytics(null)
      setError(result.error || 'Failed to parse')
      setLintErrors([])
      setShowLintErrors(false)
      gtmDataParsed(detectedFormat, false)
      toast.error('Parse failed')
    }
  }, [inputValue, detectedFormat, setHistory])

  const stats = parsedData ? calculateStats(parsedData) : null

  const handleNodeUpdate = useCallback((path: string[], isExpanded: boolean) => {
    const pathKey = path.join('.')
    setExpandedPaths(prev => {
      const next = new Set(prev)
      if (isExpanded) {
        next.add(pathKey)
      } else {
        next.delete(pathKey)
      }
      return next
    })

    setTreeNodes(prevNodes => {
      const updateNode = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map(node => {
          if (JSON.stringify(node.path) === JSON.stringify(path)) {
            return { ...node, isExpanded }
          }
          if (node.children) {
            return { ...node, children: updateNode(node.children) }
          }
          return node
        })
      }
      return updateNode(prevNodes)
    })
  }, [])

  const handleExpandAll = useCallback(() => {
    const expandAllNodes = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map(node => {
        const updated = { ...node, isExpanded: true }
        if (node.children) {
          updated.children = expandAllNodes(node.children)
          node.children.forEach(child => {
            expandedPaths.add(child.path.join('.'))
          })
        }
        return updated
      })
    }
    setTreeNodes(expandAllNodes(treeNodes))
  }, [treeNodes, expandedPaths])

  const handleCollapseAll = useCallback(() => {
    const collapseAllNodes = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map(node => {
        const updated = { ...node, isExpanded: false }
        if (node.children) {
          updated.children = collapseAllNodes(node.children)
        }
        return updated
      })
    }
    setTreeNodes(collapseAllNodes(treeNodes))
    setExpandedPaths(new Set())
  }, [treeNodes])

  const handleCopyPath = useCallback(() => {
    const pathStr = getPathString(selectedPath, 'dot')
    navigator.clipboard.writeText(pathStr)
    setCopiedPath(true)
    toast.success('Path copied to clipboard')
    setTimeout(() => setCopiedPath(false), 2000)
  }, [selectedPath])

  const loadExample = useCallback((type: DataFormat) => {
    const examples: Record<DataFormat, string> = {
      json: EXAMPLE_JSON,
      yaml: EXAMPLE_YAML,
      jsonl: EXAMPLE_JSONL,
      csv: EXAMPLE_CSV,
      json5: EXAMPLE_JSON,
      unknown: EXAMPLE_JSON
    }
    setInputValue(examples[type] || EXAMPLE_JSON)
    setDetectedFormat(type)
  }, [setInputValue])

  const handleFileLoaded = useCallback((data: string, detectedFormatFromFile?: DataFormat) => {
    setInputValue(data)
    if (detectedFormatFromFile) {
      setDetectedFormat(detectedFormatFromFile)
    }
    saveToHistory(data, detectedFormatFromFile || detectedFormat, setHistory)
    gtmFileLoaded('file', detectedFormatFromFile)
  }, [setInputValue, detectedFormat, setHistory])

  const handleFormat = useCallback((options: FormatOptions) => {
    let result
    if (detectedFormat === 'json' || detectedFormat === 'json5') {
      result = formatJSON(inputValue || '', options)
    } else if (detectedFormat === 'jsonl') {
      result = formatJSONL(inputValue || '', options)
    } else if (detectedFormat === 'yaml') {
      result = formatYAML(inputValue || '', options)
    } else {
      toast.error('Format not supported for this data type')
      return
    }
    
    if (result.success && result.formatted) {
      setInputValue(result.formatted)
      gtmFormatAction('format', detectedFormat)
      toast.success(`${detectedFormat.toUpperCase()} formatted successfully`)
      handleParse()
    } else {
      toast.error(`Format failed: ${result.error}`)
    }
  }, [inputValue, detectedFormat, setInputValue, handleParse])

  const handleMinify = useCallback(() => {
    if (detectedFormat === 'json') {
      const result = minifyJSON(inputValue || '')
      if (result.success && result.formatted) {
        setInputValue(result.formatted)
        gtmFormatAction('minify', detectedFormat)
        toast.success('JSON minified successfully')
        handleParse()
      } else {
        toast.error(`Minify failed: ${result.error}`)
      }
    } else {
      toast.error('Minify is only available for JSON')
    }
  }, [inputValue, detectedFormat, setInputValue, handleParse])

  const handleGraphNodeClick = useCallback((nodeId: string) => {
    const pathArray = nodeId.replace(/^root\.?/, '').split('.')
    setSelectedPath(pathArray.length === 1 && pathArray[0] === '' ? [] : pathArray)
  }, [])

  const handleTransformedData = useCallback((transformedData: any) => {
    setParsedData(transformedData)
    const nodes = buildTree(transformedData)
    setTreeNodes(nodes)
    setExpandedPaths(new Set())
    
    const graph = buildGraph(transformedData)
    setGraphData(graph)
    
    const analytics = analyzeGraph(graph)
    setGraphAnalytics(analytics)
    
    toast.success('Data updated with transformation')
  }, [])

  const handleHistoryRestore = useCallback((data: string, historyFormat: string) => {
    setInputValue(data)
    setDetectedFormat(historyFormat as DataFormat)
  }, [setInputValue])

  const filteredNodes = useMemo(() => {
    return advancedSearchNodes(treeNodes, searchOptions)
  }, [treeNodes, searchOptions])

  const searchResultCount = useMemo(() => {
    const countNodes = (nodes: TreeNode[]): number => {
      return nodes.reduce((count, node) => {
        let nodeCount = 1
        if (node.children) {
          nodeCount += countNodes(node.children)
        }
        return count + nodeCount
      }, 0)
    }
    const count = countNodes(filteredNodes)
    
    if (searchOptions.searchTerm && count > 0) {
      gtmSearchPerformed(searchOptions.searchMode, count)
    }
    
    return count
  }, [filteredNodes, searchOptions])

  useEffect(() => {
    if (inputValue) {
      handleParse()
    }
  }, [])

  useKeyboardShortcuts({
    focusSearch: () => searchInputRef.current?.focus(),
    parseData: handleParse,
    exportData: () => parsedData && setShowExportDialog(true),
    toggleTheme: toggleTheme,
    showShortcuts: () => setShowShortcutsDialog(true),
    switchToTree: () => parsedData && setViewMode('tree'),
    switchToGraph: () => parsedData && setViewMode('graph'),
    expandAll: () => parsedData && handleExpandAll(),
    collapseAll: () => parsedData && handleCollapseAll(),
    formatData: () => setShowFormatDialog(true),
    minifyData: handleMinify,
  })

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 transition-all duration-[350ms] ease-out relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent pointer-events-none" />
        
        <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg transition-all duration-300 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 opacity-50" />
          <div className="max-w-[1800px] mx-auto px-4 md:px-6 lg:px-8 py-6 relative">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-gradient-to-br from-primary/20 via-accent/15 to-primary/10 backdrop-blur-sm shadow-2xl shadow-primary/20 ring-1 ring-primary/10 hover:scale-105 transition-transform duration-300">
                    <img src={logoSvg} alt="DataScope Logo" className="w-10 h-10" />
                  </div>
                  <div>
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                      DataScope
                    </h1>
                    <p className="text-xs md:text-sm text-muted-foreground/90 font-medium">
                      Parse, explore, analyze structured data • Automatic format detection
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 items-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowShortcutsDialog(true)}
                      className="flex-shrink-0 h-10 w-10 rounded-xl hover:scale-105 transition-all duration-200 hover:border-primary/50 hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/20 group"
                    >
                      <Keyboard size={20} weight="duotone" className="transition-transform duration-300 group-hover:scale-110" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="font-medium">
                    <p>Keyboard shortcuts (?)</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleTheme}
                      className="flex-shrink-0 h-10 w-10 rounded-xl hover:scale-105 transition-all duration-200 hover:border-primary/50 hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/20 group"
                    >
                      {theme === 'light' ? (
                        <Moon size={20} weight="duotone" className="transition-transform duration-300 group-hover:rotate-12" />
                      ) : (
                        <Sun size={20} weight="duotone" className="transition-transform duration-300 group-hover:rotate-90" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="font-medium">
                    <p>Toggle {theme === 'light' ? 'dark' : 'light'} mode</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-[1800px] mx-auto p-4 md:p-6 lg:p-8 relative z-10">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            <div className="xl:col-span-2 space-y-6">
              <Card className="p-6 space-y-5 shadow-2xl border-border/50 bg-card/70 backdrop-blur-md transition-all duration-300 hover:shadow-[0_20px_70px_-15px_rgba(0,0,0,0.3)] hover:border-primary/30 hover:bg-card/80 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="flex items-center justify-between gap-3 flex-wrap relative z-10">
                  <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary/15 via-accent/15 to-primary/10 border border-primary/30 shadow-lg shadow-primary/10 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/20 transition-all duration-300">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                        <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-primary animate-ping opacity-75" />
                      </div>
                      <span className="text-sm font-semibold text-foreground/90 tracking-wide">Auto-detected:</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/20 border border-primary/40 shadow-inner">
                      {detectedFormat === 'json' && <File size={16} weight="duotone" className="text-primary" />}
                      {detectedFormat === 'yaml' && <FileCode size={16} weight="duotone" className="text-primary" />}
                      {detectedFormat === 'jsonl' && <ListBullets size={16} weight="duotone" className="text-primary" />}
                      {detectedFormat === 'csv' && <FileCsv size={16} weight="duotone" className="text-primary" />}
                      {detectedFormat === 'json5' && <Table size={16} weight="duotone" className="text-primary" />}
                      <span className="text-sm font-bold text-primary uppercase tracking-wider">{detectedFormat}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap w-full sm:w-auto justify-end">
                    <DropdownMenu>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline" className="gap-2 hover:border-primary/50 transition-all duration-200 rounded-lg hover:bg-primary/10 hover:shadow-md hover:shadow-primary/20">
                              <File size={16} weight="duotone" />
                              <span className="hidden sm:inline">Examples</span>
                            </Button>
                          </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">Load example data</TooltipContent>
                      </Tooltip>
                      <DropdownMenuContent align="end" className="w-48 shadow-xl rounded-xl">
                        <DropdownMenuItem onClick={() => loadExample('json')} className="gap-2 cursor-pointer rounded-lg">
                          <File size={16} weight="duotone" />
                          JSON Example
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => loadExample('yaml')} className="gap-2 cursor-pointer rounded-lg">
                          <FileCode size={16} weight="duotone" />
                          YAML Example
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => loadExample('jsonl')} className="gap-2 cursor-pointer rounded-lg">
                          <ListBullets size={16} weight="duotone" />
                          JSONL Example
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => loadExample('csv')} className="gap-2 cursor-pointer rounded-lg">
                          <FileCsv size={16} weight="duotone" />
                          CSV Example
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <DropdownMenu>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline" className="gap-2 hover:border-primary/50 transition-all duration-200 rounded-lg hover:bg-primary/10 hover:shadow-md hover:shadow-primary/20">
                              <Gear size={16} weight="duotone" />
                              <span className="hidden sm:inline">Tools</span>
                            </Button>
                          </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">Formatting tools</TooltipContent>
                      </Tooltip>
                      <DropdownMenuContent align="end" className="w-52 shadow-xl rounded-xl">
                        <DropdownMenuItem onClick={() => setShowFormatDialog(true)} className="gap-2 cursor-pointer rounded-lg">
                          <TextAlignLeft size={16} weight="duotone" />
                          Format & Prettify
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={handleMinify}
                          disabled={detectedFormat !== 'json' && detectedFormat !== 'jsonl'}
                          className="gap-2 cursor-pointer rounded-lg"
                        >
                          <Minus size={16} weight="duotone" />
                          Minify
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {parsedData && (
                      <Button 
                        onClick={() => setShowExportDialog(true)} 
                        size="sm"
                        variant="outline"
                        className="gap-2 hover:border-accent/50 transition-all duration-200 rounded-lg hover:bg-accent/10 hover:shadow-md hover:shadow-accent/20"
                      >
                        <Download size={16} weight="duotone" />
                        <span className="hidden sm:inline">Export</span>
                      </Button>
                    )}

                    <Button 
                      onClick={handleParse} 
                      size="sm" 
                      className="shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 bg-gradient-to-r from-primary via-primary to-primary/80 rounded-lg font-semibold hover:from-primary/90 hover:via-primary hover:to-primary/70"
                    >
                      Parse Data
                    </Button>
                  </div>
                </div>

                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={`Paste your data here... (${detectedFormat.toUpperCase()} will be auto-detected)`}
                  className="font-mono text-sm min-h-[240px] md:min-h-[280px] resize-y transition-all duration-200 focus:ring-2 focus:ring-primary/30 border-border/50 hover:border-border/70 rounded-xl bg-muted/40 focus:bg-background shadow-inner hover:shadow-lg"
                />

                {showLintErrors && lintErrors.length > 0 && (
                  <LintErrorsDisplay 
                    errors={lintErrors}
                    onClose={() => setShowLintErrors(false)}
                  />
                )}

                {error && !showLintErrors && (
                  <Alert variant="destructive" className="rounded-xl border-destructive/50 bg-destructive/10">
                    <AlertDescription className="text-sm font-mono">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}
              </Card>

              {parsedData && (
                <>
                  <Card className="p-6 space-y-5 shadow-2xl border-border/50 bg-card/70 backdrop-blur-md transition-all duration-300 hover:shadow-[0_20px_70px_-15px_rgba(0,0,0,0.3)] hover:border-primary/30 hover:bg-card/80 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <div className="relative z-10">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <Tabs value={viewMode} onValueChange={(v) => handleViewModeChange(v as 'tree' | 'graph')}>
                        <TabsList className="bg-muted/80 p-1 rounded-xl shadow-inner">
                          <TabsTrigger value="tree" className="gap-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/15 data-[state=active]:to-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-md transition-all duration-200 rounded-lg">
                            <TreeStructure size={16} weight="duotone" />
                            <span className="hidden sm:inline font-medium">Tree View</span>
                          </TabsTrigger>
                          <TabsTrigger value="graph" className="gap-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/15 data-[state=active]:to-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-md transition-all duration-200 rounded-lg">
                            <Graph size={16} weight="duotone" />
                            <span className="hidden sm:inline font-medium">Graph View</span>
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                      
                      {viewMode === 'tree' && (
                        <div className="flex gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleExpandAll}
                                className="hover:border-primary/50 transition-all duration-200 hover:scale-105 rounded-lg hover:bg-primary/10 hover:shadow-md hover:shadow-primary/20 group"
                              >
                                <ArrowsOut size={16} weight="duotone" className="group-hover:scale-110 transition-transform" />
                                <span className="hidden sm:inline ml-2">Expand All</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="font-medium">Expand all nodes</TooltipContent>
                          </Tooltip>
                          
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCollapseAll}
                                className="hover:border-primary/50 transition-all duration-200 hover:scale-105 rounded-lg hover:bg-primary/10 hover:shadow-md hover:shadow-primary/20 group"
                              >
                                <ArrowsIn size={16} weight="duotone" className="group-hover:scale-90 transition-transform" />
                                <span className="hidden sm:inline ml-2">Collapse All</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="font-medium">Collapse all nodes</TooltipContent>
                          </Tooltip>
                        </div>
                      )}
                    </div>

                    {viewMode === 'tree' && (
                      <>
                        {selectedPath.length > 0 && (
                          <div className="flex items-center gap-2 p-3.5 bg-gradient-to-r from-muted/70 via-muted/60 to-muted/50 rounded-xl border border-border/50 backdrop-blur-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:shadow-primary/10 group">
                            <code className="flex-1 text-xs font-mono truncate text-foreground/90 group-hover:text-foreground transition-colors">
                              {getPathString(selectedPath, 'dot')}
                            </code>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 flex-shrink-0 hover:bg-primary/10 hover:text-primary transition-all duration-200 rounded-lg"
                              onClick={handleCopyPath}
                            >
                              {copiedPath ? (
                                <Check size={16} className="text-syntax-string" weight="bold" />
                              ) : (
                                <Copy size={16} />
                              )}
                            </Button>
                          </div>
                        )}

                        <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                        <ScrollArea className="h-[500px] md:h-[560px] rounded-xl border border-border/30 shadow-inner">
                          <div className="p-2">
                            <TreeView
                              nodes={filteredNodes}
                              onNodeUpdate={handleNodeUpdate}
                              selectedPath={selectedPath}
                              onSelectNode={setSelectedPath}
                            />
                          </div>
                        </ScrollArea>
                      </>
                    )}

                    {viewMode === 'graph' && graphData && (
                      <div className="rounded-xl border border-border/30 overflow-hidden shadow-inner">
                        <GraphVisualization 
                          data={graphData}
                          onNodeClick={handleGraphNodeClick}
                          selectedNodeId={selectedPath.length > 0 ? `root.${selectedPath.join('.')}` : 'root'}
                        />
                      </div>
                    )}
                    </div>
                  </Card>
                </>
              )}
            </div>

            <div className="space-y-6">
              {parsedData && (
                <>
                  <AdvancedSearch 
                    options={searchOptions}
                    onChange={setSearchOptions}
                    resultCount={searchResultCount}
                  />

                  {stats && <InsightsPanel stats={stats} data={parsedData} />}

                  {stats && <StatsPanel stats={stats} />}

                  {graphAnalytics && (
                    <GraphAnalyticsPanel analytics={graphAnalytics} />
                  )}

                  <Card className="p-6 space-y-4 shadow-xl border-border/50 bg-card/60 backdrop-blur-sm">
                    <Button
                      onClick={() => setToolsExpanded(!toolsExpanded)}
                      variant="outline"
                      className="w-full gap-2 hover:border-accent/50 transition-all duration-200 rounded-lg hover:bg-accent/10"
                    >
                      <Toolbox size={20} weight="duotone" />
                      Advanced Tools
                      <span className="ml-auto text-xs text-muted-foreground">
                        {toolsExpanded ? 'Hide' : 'Show'}
                      </span>
                    </Button>
                    
                    {toolsExpanded && (
                      <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                        <SchemaExtractor data={parsedData} />
                        <DataTransformer data={parsedData} onTransformed={handleTransformedData} />
                        <DataComparator data={parsedData} />
                      </div>
                    )}
                  </Card>
                </>
              )}
              
              <FileInput onDataLoaded={handleFileLoaded} />

              <DataHistory onRestore={handleHistoryRestore} />
              
              {!parsedData && (
                <Card className="p-8 space-y-6 shadow-2xl border-border/50 bg-gradient-to-br from-card/70 to-muted/50 backdrop-blur-md hover:shadow-[0_20px_70px_-15px_rgba(0,0,0,0.3)] transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="relative z-10">
                  <div className="flex items-center gap-3 text-foreground/80">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 via-accent/20 to-primary/15 shadow-lg shadow-primary/20 ring-1 ring-primary/20">
                      <ChartBar size={28} weight="duotone" className="text-primary" />
                    </div>
                    <h3 className="text-lg font-bold bg-gradient-to-r from-foreground to-primary/80 bg-clip-text text-transparent">Quick Start Guide</h3>
                  </div>
                  <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-background/60 border border-border/50 transition-all duration-200 hover:border-primary/40 hover:bg-background/80 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] group/item">
                      <span className="text-primary font-bold flex-shrink-0 text-base w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover/item:bg-primary/20 transition-colors">1</span>
                      <p className="group-hover/item:text-foreground/80 transition-colors">Load data from file, URL, or paste directly</p>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-background/60 border border-border/50 transition-all duration-200 hover:border-primary/40 hover:bg-background/80 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] group/item">
                      <span className="text-primary font-bold flex-shrink-0 text-base w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover/item:bg-primary/20 transition-colors">2</span>
                      <p className="group-hover/item:text-foreground/80 transition-colors">Format automatically detected (JSON, YAML, JSONL, CSV)</p>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-background/60 border border-border/50 transition-all duration-200 hover:border-primary/40 hover:bg-background/80 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] group/item">
                      <span className="text-primary font-bold flex-shrink-0 text-base w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover/item:bg-primary/20 transition-colors">3</span>
                      <p className="group-hover/item:text-foreground/80 transition-colors">Click "Parse Data" to visualize structure & analytics</p>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-background/60 border border-border/50 transition-all duration-200 hover:border-primary/40 hover:bg-background/80 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] group/item">
                      <span className="text-primary font-bold flex-shrink-0 text-base w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover/item:bg-primary/20 transition-colors">4</span>
                      <p className="group-hover/item:text-foreground/80 transition-colors">Use Tools menu for formatting, minifying, & prettifying</p>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-background/60 border border-border/50 transition-all duration-200 hover:border-primary/40 hover:bg-background/80 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] group/item">
                      <span className="text-primary font-bold flex-shrink-0 text-base w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover/item:bg-primary/20 transition-colors">5</span>
                      <p className="group-hover/item:text-foreground/80 transition-colors">Advanced search with regex, path queries, & type filters</p>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-background/60 border border-border/50 transition-all duration-200 hover:border-primary/40 hover:bg-background/80 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] group/item">
                      <span className="text-primary font-bold flex-shrink-0 text-base w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover/item:bg-primary/20 transition-colors">6</span>
                      <p className="group-hover/item:text-foreground/80 transition-colors">Explore multiple graph layouts: force, tree, radial, grid</p>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-background/60 border border-border/50 transition-all duration-200 hover:border-primary/40 hover:bg-background/80 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] group/item">
                      <span className="text-primary font-bold flex-shrink-0 text-base w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover/item:bg-primary/20 transition-colors">7</span>
                      <p className="group-hover/item:text-foreground/80 transition-colors">Comprehensive analytics, metrics, & insights</p>
                    </div>
                  </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>

        <FormatOptionsDialog
          open={showFormatDialog}
          onOpenChange={setShowFormatDialog}
          onApply={handleFormat}
        />

        <ExportDialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          data={parsedData}
          currentFormat={detectedFormat}
        />

        <ShortcutsDialog
          open={showShortcutsDialog}
          onOpenChange={setShowShortcutsDialog}
        />
      </div>

      <footer className="max-w-[1800px] mx-auto px-4 md:px-6 lg:px-8 py-8 mt-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-br from-muted/60 to-muted/40 border border-border/30 shadow-xl backdrop-blur-md hover:shadow-2xl hover:border-primary/20 transition-all duration-300 group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="p-1.5 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 group-hover:scale-110 transition-transform duration-300">
              <img src={logoSvg} alt="DataScope" className="w-8 h-8 opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-sm text-muted-foreground">
              <strong className="text-foreground font-bold">DataScope</strong> • Professional data analytics & visualization
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground relative z-10">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-all duration-200 hover:scale-105 font-medium"
            >
              GitHub
            </a>
            <span>•</span>
            <a 
              href="https://datascope.w4w.dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-all duration-200 hover:scale-105 font-medium"
            >
              Docs
            </a>
            <span>•</span>
            <span className="font-medium">© 2024 DataScope</span>
          </div>
        </div>
      </footer>
    </TooltipProvider>
  )
}

export default App
