import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Play,
  FloppyDisk,
  Trash,
  Copy,
  Check,
  Download,
  Sparkle,
  BookmarkSimple,
  Clock,
  Path as PathIcon
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import {
  executeJSONPath,
  validateJSONPath,
  SavedQuery,
  JSONPATH_EXAMPLES,
  buildQueryFromSelection,
  suggestQueries,
  parseQueryResultPath
} from '@/lib/query-engine'

interface QueryPanelProps {
  data: any
  selectedPath?: string[]
  onResultsSelect?: (results: any[]) => void
  onPathNavigate?: (path: string[]) => void
}

export function QueryPanel({ data, selectedPath, onResultsSelect, onPathNavigate }: QueryPanelProps) {
  const [query, setQuery] = useState('$')
  const [results, setResults] = useState<any[]>([])
  const [resultPaths, setResultPaths] = useState<string[]>([])
  const [executionTime, setExecutionTime] = useState<number>(0)
  const [error, setError] = useState<string>('')
  const [savedQueries, setSavedQueries] = useKV<SavedQuery[]>(STORAGE_KEYS.QUERY_HISTORY, [])
  const [queryName, setQueryName] = useState('')
  const { copy } = useCopyToClipboard()
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [suggestedQueries, setSuggestedQueries] = useState<SavedQuery[]>([])

  useEffect(() => {
    if (data) {
      const suggestions = suggestQueries(data)
      setSuggestedQueries(suggestions)
    }
  }, [data])

  useEffect(() => {
    if (selectedPath && selectedPath.length > 0) {
      const pathQuery = buildQueryFromSelection(selectedPath)
      setQuery(pathQuery)
    }
  }, [selectedPath])

  const executeQuery = () => {
    if (!data) {
      toast.error('No data loaded')
      return
    }

    const validation = validateJSONPath(query)
    if (!validation.valid) {
      setError(validation.error || 'Invalid query')
      toast.error('Invalid query', { description: validation.error })
      return
    }

    const result = executeJSONPath(data, query)
    
    if (result.success) {
      setResults(result.results)
      setResultPaths(result.paths)
      setExecutionTime(result.executionTime)
      setError('')
      
      if (onResultsSelect) {
        onResultsSelect(result.results)
      }
      
      toast.success(`Found ${result.count} result${result.count !== 1 ? 's' : ''}`, {
        description: `Executed in ${result.executionTime.toFixed(2)}ms`
      })
    } else {
      setError(result.error || 'Query failed')
      setResults([])
      setResultPaths([])
      toast.error('Query failed', { description: result.error })
    }
  }

  const saveQuery = () => {
    if (!query.trim()) {
      toast.error('Query cannot be empty')
      return
    }

    const name = queryName.trim() || `Query ${(savedQueries?.length || 0) + 1}`
    
    const newQuery: SavedQuery = {
      id: `query-${Date.now()}`,
      name,
      query,
      language: 'jsonpath',
      timestamp: Date.now(),
      resultCount: results.length
    }

    setSavedQueries(current => [newQuery, ...(current || [])].slice(0, 50))
    setQueryName('')
    toast.success('Query saved')
  }

  const loadQuery = (savedQuery: SavedQuery) => {
    setQuery(savedQuery.query)
    toast.info(`Loaded: ${savedQuery.name}`)
  }

  const deleteQuery = (id: string) => {
    setSavedQueries(current => (current || []).filter(q => q.id !== id))
    toast.success('Query deleted')
  }

  const copyResult = (result: any, index: number) => {
    const text = typeof result === 'string' ? result : JSON.stringify(result, null, 2)
    copy(text, 'Result copied')
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const navigateToResult = (index: number) => {
    if (onPathNavigate && resultPaths[index]) {
      const path = parseQueryResultPath(resultPaths[index])
      onPathNavigate(path)
      toast.info('Navigated to result')
    }
  }

  const exportResults = () => {
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `query-results-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Results exported')
  }

  return (
    <Card className="p-4 space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <PathIcon className="h-4 w-4" weight="duotone" />
          JSONPath Query
        </h3>
        <Badge variant="secondary">{results.length} results</Badge>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="query">Query Expression</Label>
          <div className="flex gap-2">
            <Input
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="$.items[?(@.price < 100)]"
              className="font-mono text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  executeQuery()
                }
              }}
            />
            <Button onClick={executeQuery} size="sm">
              <Play className="h-4 w-4" weight="fill" />
            </Button>
          </div>
          {executionTime > 0 && (
            <p className="text-xs text-muted-foreground">
              Executed in {executionTime.toFixed(2)}ms
            </p>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription className="text-sm">{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Input
            value={queryName}
            onChange={(e) => setQueryName(e.target.value)}
            placeholder="Query name (optional)"
            className="flex-1 text-sm"
          />
          <Button onClick={saveQuery} variant="outline" size="sm">
            <BookmarkSimple className="h-4 w-4" weight="duotone" />
          </Button>
          {results.length > 0 && (
            <Button onClick={exportResults} variant="outline" size="sm">
              <Download className="h-4 w-4" weight="duotone" />
            </Button>
          )}
        </div>
      </div>

      <Separator />

      <ScrollArea className="flex-1">
        <Accordion type="multiple" className="space-y-2">
          {suggestedQueries.length > 0 && (
            <AccordionItem value="suggestions">
              <AccordionTrigger className="text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Sparkle className="h-4 w-4" weight="duotone" />
                  Suggested Queries ({suggestedQueries.length})
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {suggestedQueries.map((sq) => (
                    <Card
                      key={sq.id}
                      className="p-3 cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => loadQuery(sq)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{sq.name}</p>
                          <code className="text-xs text-muted-foreground block truncate">
                            {sq.query}
                          </code>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          <AccordionItem value="examples">
            <AccordionTrigger className="text-sm font-medium">
              Examples ({JSONPATH_EXAMPLES.length})
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {JSONPATH_EXAMPLES.map((example, index) => (
                  <Card
                    key={index}
                    className="p-3 cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => setQuery(example.query)}
                  >
                    <p className="font-medium text-sm">{example.name}</p>
                    <code className="text-xs text-muted-foreground block">
                      {example.query}
                    </code>
                    <p className="text-xs text-muted-foreground mt-1">
                      {example.description}
                    </p>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {savedQueries && savedQueries.length > 0 && (
            <AccordionItem value="saved">
              <AccordionTrigger className="text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" weight="duotone" />
                  Saved Queries ({savedQueries.length})
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {savedQueries.map((sq) => (
                    <Card key={sq.id} className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div
                          className="flex-1 min-w-0 cursor-pointer"
                          onClick={() => loadQuery(sq)}
                        >
                          <p className="font-medium text-sm">{sq.name}</p>
                          <code className="text-xs text-muted-foreground block truncate">
                            {sq.query}
                          </code>
                          {sq.resultCount !== undefined && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {sq.resultCount} results
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteQuery(sq.id)
                          }}
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {results.length > 0 && (
            <AccordionItem value="results">
              <AccordionTrigger className="text-sm font-medium">
                Results ({results.length})
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {results.map((result, index) => (
                    <Card key={index} className="p-3">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {index + 1}
                        </Badge>
                        <div className="flex gap-1">
                          {onPathNavigate && resultPaths[index] && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigateToResult(index)}
                            >
                              <PathIcon className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyResult(result, index)}
                          >
                            {copiedIndex === index ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                        {typeof result === 'string'
                          ? result
                          : JSON.stringify(result, null, 2)}
                      </pre>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </ScrollArea>

      <div className="text-xs text-muted-foreground">
        <p>Tip: Press Ctrl/Cmd + Enter to execute</p>
      </div>
    </Card>
  )
}
