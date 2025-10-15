import { useState, useCallback, useEffect, useMemo } from 'react'
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
  Sparkle
} from '@phosphor-icons/react'
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
  const [format, setFormat] = useState<DataFormat>('json')
  const [parsedData, setParsedData] = useState<any>(null)
  const [error, setError] = useState<string>('')
  const [treeNodes, setTreeNodes] = useState<TreeNode[]>([])
  const [selectedPath, setSelectedPath] = useState<string[]>([])
  const [copiedPath, setCopiedPath] = useState(false)
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set())
  const [showFormatDialog, setShowFormatDialog] = useState(false)
  const [lintErrors, setLintErrors] = useState<LintError[]>([])
  const [showLintErrors, setShowLintErrors] = useState(false)
  const [graphData, setGraphData] = useState<GraphData | null>(null)
  const [graphAnalytics, setGraphAnalytics] = useState<GraphAnalytics | null>(null)
  const [viewMode, setViewMode] = useState<'tree' | 'graph'>('tree')
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    searchTerm: '',
    searchMode: 'text',
    caseSensitive: false,
    wholeWord: false,
    typeFilters: []
  })
  
  const { theme, toggleTheme } = useTheme()

  const handleViewModeChange = useCallback((newMode: 'tree' | 'graph') => {
    setViewMode(newMode)
    gtmViewChanged(newMode)
  }, [])

  const handleParse = useCallback(() => {
    const result = parseData(inputValue || '', format)
    
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
      
      if (format === 'json') {
        const errors = lintJSON(inputValue || '')
        setLintErrors(errors)
        setShowLintErrors(errors.length > 0)
      } else {
        setLintErrors([])
        setShowLintErrors(false)
      }
      
      gtmDataParsed(format, true)
      toast.success(`${result.format?.toUpperCase()} parsed successfully`)
    } else {
      setParsedData(null)
      setTreeNodes([])
      setGraphData(null)
      setGraphAnalytics(null)
      setError(result.error || 'Failed to parse')
      setLintErrors([])
      setShowLintErrors(false)
      gtmDataParsed(format, false)
      toast.error('Parse failed')
    }
  }, [inputValue, format])

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
    setFormat(type)
  }, [setInputValue])

  const handleFileLoaded = useCallback((data: string, detectedFormat?: DataFormat) => {
    setInputValue(data)
    if (detectedFormat) {
      setFormat(detectedFormat)
    }
    gtmFileLoaded('file', detectedFormat)
  }, [setInputValue])

  const handleFormat = useCallback((options: FormatOptions) => {
    let result
    if (format === 'json' || format === 'json5') {
      result = formatJSON(inputValue || '', options)
    } else if (format === 'jsonl') {
      result = formatJSONL(inputValue || '', options)
    } else if (format === 'yaml') {
      result = formatYAML(inputValue || '', options)
    } else {
      toast.error('Format not supported for this data type')
      return
    }
    
    if (result.success && result.formatted) {
      setInputValue(result.formatted)
      gtmFormatAction('format', format)
      toast.success(`${format.toUpperCase()} formatted successfully`)
      handleParse()
    } else {
      toast.error(`Format failed: ${result.error}`)
    }
  }, [inputValue, format, setInputValue, handleParse])

  const handleMinify = useCallback(() => {
    if (format === 'json') {
      const result = minifyJSON(inputValue || '')
      if (result.success && result.formatted) {
        setInputValue(result.formatted)
        gtmFormatAction('minify', format)
        toast.success('JSON minified successfully')
        handleParse()
      } else {
        toast.error(`Minify failed: ${result.error}`)
      }
    } else {
      toast.error('Minify is only available for JSON')
    }
  }, [inputValue, format, setInputValue, handleParse])

  const handleGraphNodeClick = useCallback((nodeId: string) => {
    const pathArray = nodeId.replace(/^root\.?/, '').split('.')
    setSelectedPath(pathArray.length === 1 && pathArray[0] === '' ? [] : pathArray)
  }, [])

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

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 transition-all duration-[350ms] ease-out">
        <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-sm transition-all duration-300">
          <div className="max-w-[1800px] mx-auto px-4 md:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 via-primary/15 to-accent/20 backdrop-blur-sm shadow-lg shadow-primary/10">
                    <Sparkle size={28} weight="duotone" className="text-primary" />
                  </div>
                  <div>
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight bg-gradient-to-r from-foreground via-primary/90 to-accent/80 bg-clip-text text-transparent">
                      DataScope
                    </h1>
                    <p className="text-xs md:text-sm text-muted-foreground/90">
                      Parse, explore, analyze structured data • JSON, YAML, JSONL, CSV
                    </p>
                  </div>
                </div>
              </div>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleTheme}
                    className="flex-shrink-0 h-10 w-10 rounded-xl hover:scale-105 transition-all duration-200 hover:border-primary/50 hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/20"
                  >
                    {theme === 'light' ? (
                      <Moon size={20} weight="duotone" className="transition-transform duration-300" />
                    ) : (
                      <Sun size={20} weight="duotone" className="transition-transform duration-300" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="font-medium">
                  <p>Toggle {theme === 'light' ? 'dark' : 'light'} mode</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </header>

        <div className="max-w-[1800px] mx-auto p-4 md:p-6 lg:p-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            <div className="xl:col-span-2 space-y-6">
              <Card className="p-6 space-y-5 shadow-xl border-border/50 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:border-border/70 hover:bg-card/70">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <Tabs value={format} onValueChange={(v) => setFormat(v as DataFormat)} className="w-full sm:w-auto">
                    <TabsList className="grid grid-cols-2 sm:grid-cols-5 bg-muted/80 p-1 rounded-xl shadow-inner">
                      <TabsTrigger value="json" className="gap-1.5 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/15 data-[state=active]:to-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-md transition-all duration-200 rounded-lg">
                        <File size={16} weight="duotone" />
                        <span className="text-xs sm:text-sm font-medium">JSON</span>
                      </TabsTrigger>
                      <TabsTrigger value="yaml" className="gap-1.5 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/15 data-[state=active]:to-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-md transition-all duration-200 rounded-lg">
                        <FileCode size={16} weight="duotone" />
                        <span className="text-xs sm:text-sm font-medium">YAML</span>
                      </TabsTrigger>
                      <TabsTrigger value="jsonl" className="gap-1.5 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/15 data-[state=active]:to-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-md transition-all duration-200 rounded-lg">
                        <ListBullets size={16} weight="duotone" />
                        <span className="text-xs sm:text-sm font-medium">JSONL</span>
                      </TabsTrigger>
                      <TabsTrigger value="csv" className="gap-1.5 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/15 data-[state=active]:to-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-md transition-all duration-200 rounded-lg">
                        <FileCsv size={16} weight="duotone" />
                        <span className="text-xs sm:text-sm font-medium">CSV</span>
                      </TabsTrigger>
                      <TabsTrigger value="json5" className="gap-1.5 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/15 data-[state=active]:to-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-md transition-all duration-200 rounded-lg">
                        <Table size={16} weight="duotone" />
                        <span className="text-xs sm:text-sm font-medium">JSON5</span>
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

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
                          disabled={format !== 'json' && format !== 'jsonl'}
                          className="gap-2 cursor-pointer rounded-lg"
                        >
                          <Minus size={16} weight="duotone" />
                          Minify
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Button 
                      onClick={handleParse} 
                      size="sm" 
                      className="shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 bg-gradient-to-r from-primary via-primary to-primary/80 rounded-lg font-medium hover:from-primary/90 hover:via-primary hover:to-primary/70"
                    >
                      Parse Data
                    </Button>
                  </div>
                </div>

                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={`Paste your ${format.toUpperCase()} data here...`}
                  className="font-mono text-sm min-h-[240px] md:min-h-[280px] resize-y transition-all duration-200 focus:ring-2 focus:ring-primary/30 border-border/50 hover:border-border/70 rounded-xl bg-muted/40 focus:bg-background shadow-inner"
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
                  <Card className="p-6 space-y-5 shadow-xl border-border/50 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:border-border/70 hover:bg-card/70">
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
                                className="hover:border-primary/50 transition-all duration-200 hover:scale-105 rounded-lg hover:bg-primary/10 hover:shadow-md hover:shadow-primary/20"
                              >
                                <ArrowsOut size={16} weight="duotone" />
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
                                className="hover:border-primary/50 transition-all duration-200 hover:scale-105 rounded-lg hover:bg-primary/10 hover:shadow-md hover:shadow-primary/20"
                              >
                                <ArrowsIn size={16} weight="duotone" />
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

                  {stats && <StatsPanel stats={stats} />}

                  {graphAnalytics && (
                    <GraphAnalyticsPanel analytics={graphAnalytics} />
                  )}
                </>
              )}
              
              <FileInput onDataLoaded={handleFileLoaded} />
              
              {!parsedData && (
                <Card className="p-8 space-y-6 shadow-xl border-border/50 bg-gradient-to-br from-card/60 to-muted/40 backdrop-blur-sm">
                  <div className="flex items-center gap-3 text-foreground/80">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                      <ChartBar size={24} weight="duotone" className="text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">Quick Start Guide</h3>
                  </div>
                  <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-background/60 border border-border/50 transition-all duration-200 hover:border-primary/40 hover:bg-background/80 hover:shadow-md hover:shadow-primary/10 group">
                      <span className="text-primary font-bold flex-shrink-0 text-base">1.</span>
                      <p className="group-hover:text-foreground/80 transition-colors">Load data from file, URL, or paste directly</p>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-background/60 border border-border/50 transition-all duration-200 hover:border-primary/40 hover:bg-background/80 hover:shadow-md hover:shadow-primary/10 group">
                      <span className="text-primary font-bold flex-shrink-0 text-base">2.</span>
                      <p className="group-hover:text-foreground/80 transition-colors">Auto-detection or select format (JSON, YAML, JSONL, CSV)</p>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-background/60 border border-border/50 transition-all duration-200 hover:border-primary/40 hover:bg-background/80 hover:shadow-md hover:shadow-primary/10 group">
                      <span className="text-primary font-bold flex-shrink-0 text-base">3.</span>
                      <p className="group-hover:text-foreground/80 transition-colors">Click "Parse Data" to visualize structure & analytics</p>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-background/60 border border-border/50 transition-all duration-200 hover:border-primary/40 hover:bg-background/80 hover:shadow-md hover:shadow-primary/10 group">
                      <span className="text-primary font-bold flex-shrink-0 text-base">4.</span>
                      <p className="group-hover:text-foreground/80 transition-colors">Use Tools menu for formatting, minifying, & prettifying</p>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-background/60 border border-border/50 transition-all duration-200 hover:border-primary/40 hover:bg-background/80 hover:shadow-md hover:shadow-primary/10 group">
                      <span className="text-primary font-bold flex-shrink-0 text-base">5.</span>
                      <p className="group-hover:text-foreground/80 transition-colors">Advanced search with regex, path queries, & type filters</p>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-background/60 border border-border/50 transition-all duration-200 hover:border-primary/40 hover:bg-background/80 hover:shadow-md hover:shadow-primary/10 group">
                      <span className="text-primary font-bold flex-shrink-0 text-base">6.</span>
                      <p className="group-hover:text-foreground/80 transition-colors">Explore multiple graph layouts: force, tree, radial, grid</p>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-background/60 border border-border/50 transition-all duration-200 hover:border-primary/40 hover:bg-background/80 hover:shadow-md hover:shadow-primary/10 group">
                      <span className="text-primary font-bold flex-shrink-0 text-base">7.</span>
                      <p className="group-hover:text-foreground/80 transition-colors">Comprehensive analytics, metrics, & insights</p>
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
      </div>
    </TooltipProvider>
  )
}

export default App
