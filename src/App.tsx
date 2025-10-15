import { useState, useCallback, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { useTheme } from '@/hooks/use-theme'
import { 
  MagnifyingGlass, 
  Funnel, 
  Copy, 
  Check, 
  CaretDown, 
  CaretRight, 
  File, 
  FileCode, 
  ChartBar,
  Sun,
  Moon,
  TextAlignLeft,
  Minus,
  ArrowsOut,
  ArrowsIn,
  Gear
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { TreeView } from '@/components/TreeView'
import { StatsPanel } from '@/components/StatsPanel'
import { FormatOptionsDialog } from '@/components/FormatOptionsDialog'
import { LintErrorsDisplay } from '@/components/LintErrorsDisplay'
import { parseData, buildTree, calculateStats, getPathString, searchNodes, TreeNode, ValueType, DataFormat } from '@/lib/parser'
import { formatJSON, minifyJSON, formatYAML, lintJSON, FormatOptions, LintError } from '@/lib/formatter'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const EXAMPLE_JSON = `{
  "user": {
    "id": 12345,
    "name": "Alex Rivera",
    "email": "alex@example.com",
    "active": true,
    "roles": ["admin", "developer"]
  },
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
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilters, setTypeFilters] = useState<ValueType[]>([])
  const [selectedPath, setSelectedPath] = useState<string[]>([])
  const [copiedPath, setCopiedPath] = useState(false)
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set())
  const [showFormatDialog, setShowFormatDialog] = useState(false)
  const [lintErrors, setLintErrors] = useState<LintError[]>([])
  const [showLintErrors, setShowLintErrors] = useState(false)
  
  const { theme, toggleTheme } = useTheme()

  const handleParse = useCallback(() => {
    const result = parseData(inputValue || '', format)
    
    if (result.success && result.data) {
      setParsedData(result.data)
      setError('')
      const nodes = buildTree(result.data)
      setTreeNodes(nodes)
      setExpandedPaths(new Set())
      
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

  const toggleTypeFilter = useCallback((type: ValueType) => {
    setTypeFilters(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type)
      }
      return [...prev, type]
    })
  }, [])

  const filteredNodes = searchNodes(treeNodes, searchTerm, typeFilters.length > 0 ? typeFilters : undefined)

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

  useEffect(() => {
    if (inputValue) {
      handleParse()
    }
  }, [])

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background transition-colors duration-300">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold tracking-tight">JSON/YAML Visualizer</h1>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  Parse, explore, and format structured data
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

        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
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
                <Card className="p-4 space-y-4">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h2 className="text-sm font-semibold">Tree View</h2>
                    
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
                  </div>

                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <MagnifyingGlass
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                        <Input
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search keys and values..."
                          className="pl-9"
                        />
                      </div>
                      
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Funnel size={16} />
                          </Button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>Filter by Type</SheetTitle>
                          </SheetHeader>
                          <div className="mt-6 space-y-2">
                            {(['string', 'number', 'boolean', 'null', 'array', 'object'] as ValueType[]).map(type => (
                              <Button
                                key={type}
                                variant={typeFilters.includes(type) ? 'default' : 'outline'}
                                className="w-full justify-start"
                                onClick={() => toggleTypeFilter(type)}
                              >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </Button>
                            ))}
                          </div>
                        </SheetContent>
                      </Sheet>
                    </div>

                    {typeFilters.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {typeFilters.map(type => (
                          <Badge
                            key={type}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => toggleTypeFilter(type)}
                          >
                            {type}
                            <span className="ml-1">×</span>
                          </Badge>
                        ))}
                      </div>
                    )}

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
                  </div>

                  <Separator />

                  <ScrollArea className="h-[400px]">
                    <TreeView
                      nodes={filteredNodes}
                      onNodeUpdate={handleNodeUpdate}
                      selectedPath={selectedPath}
                      onSelectNode={setSelectedPath}
                    />
                  </ScrollArea>
                </Card>
              )}
            </div>

            <div className="space-y-4">
              {stats && <StatsPanel stats={stats} />}
              
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
                    <p>4. Search and filter to explore</p>
                    <p>5. Click any node to copy its path</p>
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