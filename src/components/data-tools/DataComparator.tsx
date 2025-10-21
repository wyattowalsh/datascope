import { useState } from 'react'
import { GitDiff, Check, X } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'

interface DataComparatorProps {
  data: any
}

interface DiffResult {
  added: string[]
  removed: string[]
  modified: string[]
  unchanged: number
}

function compareObjects(obj1: any, obj2: any, path = ''): DiffResult {
  const result: DiffResult = {
    added: [],
    removed: [],
    modified: [],
    unchanged: 0
  }

  const keys1 = new Set(Object.keys(obj1 || {}))
  const keys2 = new Set(Object.keys(obj2 || {}))

  for (const key of keys2) {
    const fullPath = path ? `${path}.${key}` : key
    
    if (!keys1.has(key)) {
      result.added.push(fullPath)
    } else {
      const val1 = obj1[key]
      const val2 = obj2[key]
      
      if (typeof val1 === 'object' && typeof val2 === 'object' && val1 !== null && val2 !== null) {
        const nested = compareObjects(val1, val2, fullPath)
        result.added.push(...nested.added)
        result.removed.push(...nested.removed)
        result.modified.push(...nested.modified)
        result.unchanged += nested.unchanged
      } else if (val1 !== val2) {
        result.modified.push(fullPath)
      } else {
        result.unchanged++
      }
    }
  }

  for (const key of keys1) {
    if (!keys2.has(key)) {
      const fullPath = path ? `${path}.${key}` : key
      result.removed.push(fullPath)
    }
  }

  return result
}

export function DataComparator({ data }: DataComparatorProps) {
  const [compareData, setCompareData] = useState('')
  const [diff, setDiff] = useState<DiffResult | null>(null)
  const [error, setError] = useState('')

  const handleCompare = () => {
    try {
      const parsed = JSON.parse(compareData)
      const result = compareObjects(data, parsed)
      setDiff(result)
      setError('')
      toast.success('Comparison complete')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse comparison data')
      setDiff(null)
      toast.error('Comparison failed')
    }
  }

  return (
    <Card className="p-6 space-y-4 shadow-xl border-border/50 bg-card/60 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gradient-to-br from-destructive/20 to-syntax-string/20">
          <GitDiff size={20} weight="duotone" className="text-destructive" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Data Comparator</h3>
          <p className="text-xs text-muted-foreground">Compare with another dataset</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold">Paste JSON to Compare</label>
        <Textarea
          value={compareData}
          onChange={(e) => setCompareData(e.target.value)}
          placeholder='{"key": "value", ...}'
          className="font-mono text-sm min-h-[150px] resize-y border-border/50 rounded-xl bg-muted/40"
        />
      </div>

      {error && (
        <Alert variant="destructive" className="rounded-xl border-destructive/50 bg-destructive/10">
          <AlertDescription className="text-sm font-mono">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {diff && (
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-2">
            <div className="p-3 rounded-xl bg-syntax-string/10 border border-syntax-string/30">
              <div className="text-2xl font-bold text-syntax-string">{diff.added.length}</div>
              <div className="text-xs text-muted-foreground">Added</div>
            </div>
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30">
              <div className="text-2xl font-bold text-destructive">{diff.removed.length}</div>
              <div className="text-xs text-muted-foreground">Removed</div>
            </div>
            <div className="p-3 rounded-xl bg-syntax-number/10 border border-syntax-number/30">
              <div className="text-2xl font-bold text-syntax-number">{diff.modified.length}</div>
              <div className="text-xs text-muted-foreground">Modified</div>
            </div>
            <div className="p-3 rounded-xl bg-muted/50 border border-border/30">
              <div className="text-2xl font-bold text-foreground">{diff.unchanged}</div>
              <div className="text-xs text-muted-foreground">Unchanged</div>
            </div>
          </div>

          <ScrollArea className="h-[200px] rounded-xl border border-border/30 shadow-inner bg-muted/20">
            <div className="p-3 space-y-1">
              {diff.added.map((path, i) => (
                <div key={`add-${i}`} className="flex items-center gap-2 p-2 rounded-lg bg-syntax-string/5 hover:bg-syntax-string/10 transition-colors">
                  <Check size={16} weight="bold" className="text-syntax-string flex-shrink-0" />
                  <code className="text-xs font-mono text-syntax-string">{path}</code>
                  <Badge variant="secondary" className="ml-auto rounded-md text-xs bg-syntax-string/20 text-syntax-string">Added</Badge>
                </div>
              ))}
              {diff.removed.map((path, i) => (
                <div key={`rem-${i}`} className="flex items-center gap-2 p-2 rounded-lg bg-destructive/5 hover:bg-destructive/10 transition-colors">
                  <X size={16} weight="bold" className="text-destructive flex-shrink-0" />
                  <code className="text-xs font-mono text-destructive">{path}</code>
                  <Badge variant="secondary" className="ml-auto rounded-md text-xs bg-destructive/20 text-destructive">Removed</Badge>
                </div>
              ))}
              {diff.modified.map((path, i) => (
                <div key={`mod-${i}`} className="flex items-center gap-2 p-2 rounded-lg bg-syntax-number/5 hover:bg-syntax-number/10 transition-colors">
                  <GitDiff size={16} weight="bold" className="text-syntax-number flex-shrink-0" />
                  <code className="text-xs font-mono text-syntax-number">{path}</code>
                  <Badge variant="secondary" className="ml-auto rounded-md text-xs bg-syntax-number/20 text-syntax-number">Modified</Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      <Button
        onClick={handleCompare}
        disabled={!compareData.trim()}
        className="w-full gap-2 rounded-lg bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive/70"
      >
        <GitDiff size={18} weight="duotone" />
        Compare Data
      </Button>
    </Card>
  )
}
