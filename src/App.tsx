import { useState, useCallback, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { MagnifyingGlass, Funnel, Copy, Check, CaretDown, CaretRight, File, FileCode, ChartBar } from '@phosphor-icons/react'
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
import { TreeView } from '@/components/TreeView'
import { StatsPanel } from '@/components/StatsPanel'
import { parseData, buildTree, calculateStats, getPathString, searchNodes, TreeNode, ValueType, DataFormat } from '@/lib/parser'
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

  const handleParse = useCallback(() => {
    const result = parseData(inputValue || '', format)
    
    if (result.success && result.data) {
      setParsedData(result.data)
      setError('')
      const nodes = buildTree(result.data)
      setTreeNodes(nodes)
      setExpandedPaths(new Set())
      toast.success(`${result.format?.toUpperCase()} parsed successfully`)
    } else {
      setParsedData(null)
      setTreeNodes([])
      setError(result.error || 'Failed to parse')
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

  useEffect(() => {
    if (inputValue) {
      handleParse()
    }
  }, [])

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">JSON/YAML Visualizer</h1>
          <p className="text-sm text-muted-foreground">
            Parse, explore, and analyze structured data with powerful search and filtering
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-4 space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <Tabs value={format} onValueChange={(v) => setFormat(v as DataFormat)}>
                  <TabsList>
                    <TabsTrigger value="json" className="gap-2">
                      <File size={16} />
                      JSON
                    </TabsTrigger>
                    <TabsTrigger value="yaml" className="gap-2">
                      <FileCode size={16} />
                      YAML
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => loadExample('json')}
                  >
                    Load JSON Example
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => loadExample('yaml')}
                  >
                    Load YAML Example
                  </Button>
                  <Button onClick={handleParse}>
                    Parse
                  </Button>
                </div>
              </div>

              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`Paste your ${format.toUpperCase()} data here...`}
                className="font-mono text-sm min-h-[200px] resize-y"
              />

              {error && (
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
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleExpandAll}
                    >
                      <CaretDown size={16} />
                      Expand All
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCollapseAll}
                    >
                      <CaretRight size={16} />
                      Collapse All
                    </Button>
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
                  <p>3. Use search and filters to explore</p>
                  <p>4. Click any node to copy its path</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App