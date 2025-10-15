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
      <div className="min-h-screen bg-background transition-colors duration-300">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold tracking-tight">JSON/YAML Visualizer</h1>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  Parse, explore, analyze, and visualize structured data
                </p>
              </div>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleTheme}
                    className="flex-shrink-0"
                  >
                    {theme === 'light' ? (
                      <Moon size={18} weight="duotone" />
                    ) : (
                      <Sun size={18} weight="duotone" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle {theme === 'light' ? 'dark' : 'light'} mode</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </header>

        <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-4">
              <Card className="p-4 space-y-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <Tabs value={format} onValueChange={(v) => setFormat(v as DataFormat)}>
                    <TabsList>
                      <TabsTrigger value="json" className="gap-2">
                        <File size={16} />
                        <span className="hidden sm:inline">JSON</span>
                      </TabsTrigger>
                      <TabsTrigger value="yaml" className="gap-2">
                        <FileCode size={16} />
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
                      >
                        JSON Example
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => loadExample('yaml')}
                      >
                        YAML Example
                      </Button>
                    </div>
                    
                    <DropdownMenu>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline" className="gap-2">
                              <Gear size={16} />
                              <span className="hidden sm:inline">Tools</span>
                            </Button>
                          </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent>Formatting tools</TooltipContent>
                      </Tooltip>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setShowFormatDialog(true)}>
                          <TextAlignLeft size={16} className="mr-2" />
                          Format & Prettify
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={handleMinify}
                          disabled={format !== 'json'}
                        >
                          <Minus size={16} className="mr-2" />
                          Minify
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => loadExample(format as 'json' | 'yaml')}>
                          <File size={16} className="mr-2" />
                          Load Example
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Button onClick={handleParse} size="sm">
                      Parse
                    </Button>
                  </div>
                </div>

                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={`Paste your ${format.toUpperCase()} data here...`}
                  className="font-mono text-sm min-h-[200px] resize-y transition-colors"
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
                  <Card className="p-4 space-y-4">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'tree' | 'graph')}>
                        <TabsList>
                          <TabsTrigger value="tree" className="gap-2">
                            <TreeStructure size={16} />
                            <span className="hidden sm:inline">Tree View</span>
                          </TabsTrigger>
                          <TabsTrigger value="graph" className="gap-2">
                            <Graph size={16} />
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
                              >
                                <ArrowsOut size={16} />
                                <span className="hidden sm:inline ml-2">Expand All</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Expand all nodes</TooltipContent>
                          </Tooltip>
                          
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCollapseAll}
                              >
                                <ArrowsIn size={16} />
                                <span className="hidden sm:inline ml-2">Collapse All</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Collapse all nodes</TooltipContent>
                          </Tooltip>
                        </div>
                      )}
                    </div>

                    {viewMode === 'tree' && (
                      <>
                        {selectedPath.length > 0 && (
                          <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                            <code className="flex-1 text-xs font-mono truncate">
                              {getPathString(selectedPath, 'dot')}
                            </code>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6 flex-shrink-0"
                              onClick={handleCopyPath}
                            >
                              {copiedPath ? (
                                <Check size={14} className="text-syntax-string" />
                              ) : (
                                <Copy size={14} />
                              )}
                            </Button>
                          </div>
                        )}

                        <Separator />

                        <ScrollArea className="h-[500px]">
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

            <div className="space-y-4">
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
                <Card className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ChartBar size={20} />
                    <h3 className="text-sm font-semibold">Quick Start</h3>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>1. Paste JSON or YAML data</p>
                    <p>2. Click Parse to visualize</p>
                    <p>3. Use Tools to format or minify</p>
                    <p>4. Advanced search with regex support</p>
                    <p>5. Explore tree or graph view</p>
                    <p>6. Analyze graph metrics</p>
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
