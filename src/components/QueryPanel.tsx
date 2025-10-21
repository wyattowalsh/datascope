import { useState, useCallback, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { 
  MagnifyingGlass, 
  Code, 
  X, 
  Play, 
  Bookmark,
  BookmarkSimple,
  Copy,
  Check,
  Export,
  ChartBar
} from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { useWorker } from '@/hooks/use-worker'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type QueryType = 'jsonpath' | 'jq'

interface SavedQuery {
  id: string
  name: string
  query: string
  type: QueryType
  timestamp: number
}

interface QueryPanelProps {
  data: any
  onResultsUpdate?: (results: any[]) => void
  onExportResults?: (results: any[]) => void
}

export function QueryPanel({ data, onResultsUpdate, onExportResults }: QueryPanelProps) {
  const [queryType, setQueryType] = useState<QueryType>('jsonpath')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [isExecuting, setIsExecuting] = useState(false)
  const [error, setError] = useState<string>('')
  const [savedQueries, setSavedQueries] = useKV<SavedQuery[]>('saved-queries', [])
  const [copied, setCopied] = useState(false)
  
  const { postMessage } = useWorker(
    new URL('../workers/query.worker.ts', import.meta.url).href,
    {
      onError: (error) => {
        toast.error('Query worker error', { description: error.message })
      }
    }
  )

  const executeQuery = useCallback(async () => {
    if (!query.trim() || !data) return

    setIsExecuting(true)
    setError('')

    try {
      const queryResults = await postMessage<any[]>(queryType, {
        data,
        query: query.trim()
      })

      setResults(Array.isArray(queryResults) ? queryResults : [])
      
      if (onResultsUpdate) {
        onResultsUpdate(Array.isArray(queryResults) ? queryResults : [])
      }

      toast.success('Query executed', {
        description: `Found ${Array.isArray(queryResults) ? queryResults.length : 0} results`
      })

      const hash = `#query=${encodeURIComponent(queryType)}:${encodeURIComponent(query)}`
      window.history.replaceState(null, '', hash)

    } catch (err: any) {
      setError(err.message || 'Query execution failed')
      setResults([])
      toast.error('Query failed', { description: err.message })
    } finally {
      setIsExecuting(false)
    }
  }, [query, queryType, data, postMessage, onResultsUpdate])

  const saveQuery = useCallback(() => {
    if (!query.trim()) return

    const newQuery: SavedQuery = {
      id: `query-${Date.now()}`,
      name: query.substring(0, 50),
      query: query.trim(),
      type: queryType,
      timestamp: Date.now()
    }

    setSavedQueries(current => [...(current || []), newQuery])
    toast.success('Query saved')
  }, [query, queryType, setSavedQueries])

  const loadQuery = useCallback((savedQuery: SavedQuery) => {
    setQuery(savedQuery.query)
    setQueryType(savedQuery.type)
    toast.success('Query loaded')
  }, [])

  const deleteQuery = useCallback((id: string) => {
    setSavedQueries(current => (current || []).filter(q => q.id !== id))
    toast.success('Query deleted')
  }, [setSavedQueries])

  const copyResults = useCallback(() => {
    const text = JSON.stringify(results, null, 2)
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Results copied to clipboard')
  }, [results])

  const handleExport = useCallback(() => {
    if (onExportResults && results.length > 0) {
      onExportResults(results)
    }
  }, [results, onExportResults])

  useEffect(() => {
    const hash = window.location.hash
    if (hash.startsWith('#query=')) {
      const queryString = hash.substring(7)
      const [type, queryText] = queryString.split(':').map(decodeURIComponent)
      if (type && queryText) {
        setQueryType(type as QueryType)
        setQuery(queryText)
      }
    }
  }, [])

  const exampleQueries = {
    jsonpath: [
      { label: 'Root', query: '$' },
      { label: 'All keys', query: '$..*.keys()' },
      { label: 'All arrays', query: '$..[?(@.constructor.name == "Array")]' },
      { label: 'Deep scan', query: '$..name' },
      { label: 'Filter by value', query: '$.[?(@.price > 50)]' }
    ],
    jq: [
      { label: 'Identity', query: '.' },
      { label: 'Keys', query: 'keys' },
      { label: 'Values', query: 'values' },
      { label: 'Length', query: 'length' },
      { label: 'Select', query: 'select(.active == true)' }
    ]
  }

  return (
    <Card className="p-6 space-y-4 shadow-xl border-border/50 bg-card/60 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary/15 to-accent/15">
            <Code size={20} weight="duotone" className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Query Engine</h3>
            <p className="text-xs text-muted-foreground">JSONPath & jq-compatible queries</p>
          </div>
        </div>
        <Badge variant="secondary" className="gap-1">
          <ChartBar size={12} weight="bold" />
          {results.length} results
        </Badge>
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-xs font-medium mb-2 block">Query Type</Label>
          <Tabs value={queryType} onValueChange={(v) => setQueryType(v as QueryType)}>
            <TabsList className="w-full">
              <TabsTrigger value="jsonpath" className="flex-1 gap-2">
                <MagnifyingGlass size={14} weight="duotone" />
                JSONPath
              </TabsTrigger>
              <TabsTrigger value="jq" className="flex-1 gap-2">
                <Code size={14} weight="duotone" />
                jq-style
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div>
          <Label htmlFor="query-input" className="text-xs font-medium mb-2 block">
            Query Expression
          </Label>
          <div className="flex gap-2">
            <Input
              id="query-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && executeQuery()}
              placeholder={queryType === 'jsonpath' ? '$.store.books[*].title' : '.users | map(.name)'}
              className="font-mono text-xs"
            />
            <Button
              onClick={executeQuery}
              disabled={!query.trim() || isExecuting}
              size="sm"
              className="gap-2"
            >
              <Play size={14} weight="fill" />
              {isExecuting ? 'Running...' : 'Run'}
            </Button>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {exampleQueries[queryType].map((example, idx) => (
            <Button
              key={idx}
              onClick={() => setQuery(example.query)}
              variant="outline"
              size="sm"
              className="text-xs h-7 px-2"
            >
              {example.label}
            </Button>
          ))}
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-xs font-mono text-destructive">{error}</p>
          </div>
        )}

        {results.length > 0 && (
          <>
            <div className="flex gap-2">
              <Button
                onClick={saveQuery}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <BookmarkSimple size={14} weight="duotone" />
                Save Query
              </Button>
              <Button
                onClick={copyResults}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                {copied ? <Check size={14} weight="bold" /> : <Copy size={14} />}
                Copy Results
              </Button>
              {onExportResults && (
                <Button
                  onClick={handleExport}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Export size={14} weight="duotone" />
                  Export
                </Button>
              )}
            </div>

            <div>
              <Label className="text-xs font-medium mb-2 block">Results Preview</Label>
              <ScrollArea className="h-[200px] rounded-lg border bg-muted/30 p-3">
                <pre className="text-xs font-mono">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </ScrollArea>
            </div>
          </>
        )}

        {savedQueries && savedQueries.length > 0 && (
          <div>
            <Label className="text-xs font-medium mb-2 block">Saved Queries</Label>
            <ScrollArea className="max-h-[150px]">
              <div className="space-y-2">
                {(savedQueries || []).map((sq) => (
                  <div
                    key={sq.id}
                    className="flex items-center gap-2 p-2 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors group"
                  >
                    <Bookmark size={14} weight="duotone" className="text-primary flex-shrink-0" />
                    <button
                      onClick={() => loadQuery(sq)}
                      className="flex-1 text-left text-xs font-mono truncate hover:text-primary transition-colors"
                    >
                      {sq.name}
                    </button>
                    <Badge variant="outline" className="text-xs h-5 px-1.5">
                      {sq.type}
                    </Badge>
                    <Button
                      onClick={() => deleteQuery(sq.id)}
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </Card>
  )
}
