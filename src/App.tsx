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
  TreeStructure
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
import { parseData, buildTree, calculateStats, getPathString, advancedSearchNodes, TreeNode, ValueType, DataFormat } from '@/lib/parser'
import { formatJSON, minifyJSON, formatYAML, lintJSON, FormatOptions, LintError } from '@/lib/formatter'
import { buildGraph, analyzeGraph, GraphData, GraphAnalytics } from '@/lib/graph-analyzer'
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
      
      toast.success(`${result.format?.toUpperCase()} parsed successfully`)
    } else {
      setParsedData(null)
      setTreeNodes([])
      setGraphData(null)
      setGraphAnalytics(null)
      setError(result.error || 'Failed to parse')
      setLintErrors([])
      setShowLintErrors(false)
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

  const loadExample = useCallback((type: 'json' | 'yaml') => {
    setInputValue(type === 'json' ? EXAMPLE_JSON : EXAMPLE_YAML)
    setFormat(type)
  }, [setInputValue])

  const handleFormat = useCallback((options: FormatOptions) => {
    if (format === 'json') {
      const result = formatJSON(inputValue || '', options)
      if (result.success && result.formatted) {
        setInputValue(result.formatted)
        toast.success('JSON formatted successfully')
        handleParse()
      } else {
        toast.error(`Format failed: ${result.error}`)
      }
    } else {
      const result = formatYAML(inputValue || '', options)
      if (result.success && result.formatted) {
        setInputValue(result.formatted)
        toast.success('YAML formatted successfully')
        handleParse()
      } else {
        toast.error(`Format failed: ${result.error}`)
      }
    }
  }, [inputValue, format, setInputValue, handleParse])

  const handleMinify = useCallback(() => {
    if (format === 'json') {
      const result = minifyJSON(inputValue || '')
      if (result.success && result.formatted) {
        setInputValue(result.formatted)
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
    return countNodes(filteredNodes)
  }, [filteredNodes])

  useEffect(() => {
    if (inputValue) {
      handleParse()
    }
  }, [])

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background transition-all duration-[350ms] ease-out">
        <header className="sticky top-0 z-20 bg-background/85 backdrop-blur-xl border-b border-border/60 shadow-sm transition-all duration-300">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-5">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-xl md:text-2xl font-semibold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                  JSON/YAML Visualizer
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Parse, explore, analyze, and visualize structured data
                </p>
              </div>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleTheme}
                    className="flex-shrink-0 hover:scale-105 transition-transform duration-200 hover:border-primary/50"
                  >
                    {theme === 'light' ? (
                      <Moon size={18} weight="duotone" className="transition-transform duration-300" />
                    ) : (
                      <Sun size={18} weight="duotone" className="transition-transform duration-300" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Toggle {theme === 'light' ? 'dark' : 'light'} mode</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </header>

        <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            <div className="xl:col-span-2 space-y-6">
              <Card className="p-5 space-y-5 shadow-lg border-border/60 transition-all duration-300 hover:shadow-xl">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <Tabs value={format} onValueChange={(v) => setFormat(v as DataFormat)}>
                    <TabsList className="bg-muted/80">
                      <TabsTrigger value="json" className="gap-2 data-[state=active]:shadow-sm transition-all duration-200">
                        <File size={16} weight="duotone" />
                        <span className="hidden sm:inline">JSON</span>
                      </TabsTrigger>
                      <TabsTrigger value="yaml" className="gap-2 data-[state=active]:shadow-sm transition-all duration-200">
                        <FileCode size={16} weight="duotone" />
                        <span className="hidden sm:inline">YAML</span>
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <div className="flex gap-2 flex-wrap">
                    <div className="hidden md:flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => loadExample('json')}
                        className="hover:border-primary/50 transition-all duration-200 hover:scale-105"
                      >
                        JSON Example
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => loadExample('yaml')}
                        className="hover:border-primary/50 transition-all duration-200 hover:scale-105"
                      >
                        YAML Example
                      </Button>
                    </div>
                    
                    <DropdownMenu>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline" className="gap-2 hover:border-primary/50 transition-all duration-200">
                              <Gear size={16} weight="duotone" />
                              <span className="hidden sm:inline">Tools</span>
                            </Button>
                          </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">Formatting tools</TooltipContent>
                      </Tooltip>
                      <DropdownMenuContent align="end" className="w-48 shadow-lg">
                        <DropdownMenuItem onClick={() => setShowFormatDialog(true)} className="gap-2 cursor-pointer">
                          <TextAlignLeft size={16} weight="duotone" />
                          Format & Prettify
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={handleMinify}
                          disabled={format !== 'json'}
                          className="gap-2 cursor-pointer"
                        >
                          <Minus size={16} weight="duotone" />
                          Minify
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => loadExample(format as 'json' | 'yaml')} className="gap-2 cursor-pointer">
                          <File size={16} weight="duotone" />
                          Load Example
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Button onClick={handleParse} size="sm" className="shadow-sm hover:shadow transition-all duration-200 hover:scale-105">
                      Parse
                    </Button>
                  </div>
                </div>

                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={`Paste your ${format.toUpperCase()} data here...`}
                  className="font-mono text-sm min-h-[200px] resize-y transition-all duration-200 focus:ring-2 focus:ring-primary/20 border-border/60 hover:border-border"
                />

                {showLintErrors && lintErrors.length > 0 && (
                  <LintErrorsDisplay 
                    errors={lintErrors}
                    onClose={() => setShowLintErrors(false)}
                  />
                )}

                {error && !showLintErrors && (
                  <Alert variant="destructive">
                    <AlertDescription className="text-sm font-mono">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}
              </Card>

              {parsedData && (
                <>
                  <Card className="p-5 space-y-5 shadow-lg border-border/60 transition-all duration-300 hover:shadow-xl">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'tree' | 'graph')}>
                        <TabsList className="bg-muted/80">
                          <TabsTrigger value="tree" className="gap-2 data-[state=active]:shadow-sm transition-all duration-200">
                            <TreeStructure size={16} weight="duotone" />
                            <span className="hidden sm:inline">Tree View</span>
                          </TabsTrigger>
                          <TabsTrigger value="graph" className="gap-2 data-[state=active]:shadow-sm transition-all duration-200">
                            <Graph size={16} weight="duotone" />
                            <span className="hidden sm:inline">Graph View</span>
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
                                className="hover:border-primary/50 transition-all duration-200 hover:scale-105"
                              >
                                <ArrowsOut size={16} weight="duotone" />
                                <span className="hidden sm:inline ml-2">Expand All</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">Expand all nodes</TooltipContent>
                          </Tooltip>
                          
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCollapseAll}
                                className="hover:border-primary/50 transition-all duration-200 hover:scale-105"
                              >
                                <ArrowsIn size={16} weight="duotone" />
                                <span className="hidden sm:inline ml-2">Collapse All</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">Collapse all nodes</TooltipContent>
                          </Tooltip>
                        </div>
                      )}
                    </div>

                    {viewMode === 'tree' && (
                      <>
                        {selectedPath.length > 0 && (
                          <div className="flex items-center gap-2 p-3 bg-muted/60 rounded-lg border border-border/40 backdrop-blur-sm transition-all duration-200 hover:bg-muted/80">
                            <code className="flex-1 text-xs font-mono truncate text-foreground/90">
                              {getPathString(selectedPath, 'dot')}
                            </code>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 flex-shrink-0 hover:bg-primary/10 hover:text-primary transition-all duration-200"
                              onClick={handleCopyPath}
                            >
                              {copiedPath ? (
                                <Check size={14} className="text-syntax-string" weight="bold" />
                              ) : (
                                <Copy size={14} />
                              )}
                            </Button>
                          </div>
                        )}

                        <Separator className="bg-border/50" />

                        <ScrollArea className="h-[500px] rounded-md">
                          <TreeView
                            nodes={filteredNodes}
                            onNodeUpdate={handleNodeUpdate}
                            selectedPath={selectedPath}
                            onSelectNode={setSelectedPath}
                          />
                        </ScrollArea>
                      </>
                    )}

                    {viewMode === 'graph' && graphData && (
                      <GraphVisualization 
                        data={graphData}
                        onNodeClick={handleGraphNodeClick}
                        selectedNodeId={selectedPath.length > 0 ? `root.${selectedPath.join('.')}` : 'root'}
                      />
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
              
              {!parsedData && (
                <Card className="p-8 space-y-6 shadow-lg border-border/60 bg-gradient-to-br from-card to-muted/20">
                  <div className="flex items-center gap-3 text-foreground/80">
                    <ChartBar size={24} weight="duotone" className="text-primary" />
                    <h3 className="text-base font-semibold">Quick Start Guide</h3>
                  </div>
                  <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/40 transition-all duration-200 hover:border-primary/30">
                      <span className="text-primary font-semibold flex-shrink-0">1.</span>
                      <p>Paste JSON or YAML data into the editor</p>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/40 transition-all duration-200 hover:border-primary/30">
                      <span className="text-primary font-semibold flex-shrink-0">2.</span>
                      <p>Click Parse to visualize your data structure</p>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/40 transition-all duration-200 hover:border-primary/30">
                      <span className="text-primary font-semibold flex-shrink-0">3.</span>
                      <p>Use Tools menu to format or minify content</p>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/40 transition-all duration-200 hover:border-primary/30">
                      <span className="text-primary font-semibold flex-shrink-0">4.</span>
                      <p>Advanced search with regex & path support</p>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/40 transition-all duration-200 hover:border-primary/30">
                      <span className="text-primary font-semibold flex-shrink-0">5.</span>
                      <p>Switch between tree and graph views</p>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/40 transition-all duration-200 hover:border-primary/30">
                      <span className="text-primary font-semibold flex-shrink-0">6.</span>
                      <p>Explore comprehensive analytics & metrics</p>
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
