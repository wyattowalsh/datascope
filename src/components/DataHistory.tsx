import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { ClockCounterClockwise, Trash, Check } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface HistoryItem {
  id: string
  timestamp: number
  format: string
  preview: string
  data: string
}

interface DataHistoryProps {
  onRestore: (data: string, format: string) => void
}

export function DataHistory({ onRestore }: DataHistoryProps) {
  const [history, setHistory, deleteHistory] = useKV<HistoryItem[]>('data-history', [])
  
  const handleRestore = (item: HistoryItem) => {
    onRestore(item.data, item.format)
    toast.success('Data restored from history')
  }
  
  const handleClear = () => {
    setHistory([])
    toast.success('History cleared')
  }
  
  const handleDelete = (id: string) => {
    setHistory((current) => (current || []).filter(item => item.id !== id))
    toast.success('Item removed from history')
  }
  
  if (!history || history.length === 0) {
    return null
  }
  
  return (
    <Card className="p-6 space-y-4 shadow-xl border-border/50 bg-card/60 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30">
            <ClockCounterClockwise size={20} weight="duotone" className="text-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Recent History</h3>
            <p className="text-xs text-muted-foreground">{history.length} item{history.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={handleClear}
          className="gap-2 hover:bg-destructive/10 hover:text-destructive rounded-lg"
        >
          <Trash size={16} weight="duotone" />
          Clear All
        </Button>
      </div>
      
      <ScrollArea className="h-[200px] rounded-xl">
        <div className="space-y-2 pr-3">
          {(history || []).slice().reverse().map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/40 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="rounded-md text-xs">
                      {item.format.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-muted-foreground truncate">
                    {item.preview}
                  </p>
                </div>
                
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRestore(item)}
                    className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary rounded-lg"
                  >
                    <Check size={16} weight="duotone" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(item.id)}
                    className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive rounded-lg"
                  >
                    <Trash size={16} weight="duotone" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  )
}

export function saveToHistory(data: string, format: string, setHistory: (updater: (current: HistoryItem[]) => HistoryItem[]) => void) {
  const preview = data.slice(0, 100).replace(/\s+/g, ' ')
  const item: HistoryItem = {
    id: Date.now().toString(),
    timestamp: Date.now(),
    format,
    preview,
    data
  }
  
  setHistory((current) => {
    const filtered = current.filter(h => h.data !== data)
    const updated = [item, ...filtered].slice(0, 10)
    return updated
  })
}
