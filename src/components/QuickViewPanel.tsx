import { useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Eye,
  Copy,
  Check,
  Hash,
  TextAa,
  ToggleLeft,
  ListBullets,
  Cube,
  Minus
} from '@phosphor-icons/react'
import { useState } from 'react'
import { toast } from 'sonner'

interface QuickViewPanelProps {
  data: any
  selectedPath: string[]
}

export function QuickViewPanel({ data, selectedPath }: QuickViewPanelProps) {
  const [copied, setCopied] = useState(false)

  const selectedValue = useMemo(() => {
    if (!data || selectedPath.length === 0) return null

    let current = data
    for (const key of selectedPath) {
      const cleanKey = key.replace(/^\[|\]$/g, '')
      if (current === null || current === undefined) return null
      current = current[cleanKey]
    }
    return current
  }, [data, selectedPath])

  const valueInfo = useMemo(() => {
    if (selectedValue === null) return { type: 'null', icon: Minus, color: 'text-syntax-null' }
    if (selectedValue === undefined) return { type: 'undefined', icon: Minus, color: 'text-muted-foreground' }
    if (typeof selectedValue === 'string') return { type: 'string', icon: TextAa, color: 'text-syntax-string' }
    if (typeof selectedValue === 'number') return { type: 'number', icon: Hash, color: 'text-syntax-number' }
    if (typeof selectedValue === 'boolean') return { type: 'boolean', icon: ToggleLeft, color: 'text-syntax-boolean' }
    if (Array.isArray(selectedValue)) return { type: 'array', icon: ListBullets, color: 'text-accent', length: selectedValue.length }
    if (typeof selectedValue === 'object') return { type: 'object', icon: Cube, color: 'text-primary', keys: Object.keys(selectedValue).length }
    return { type: 'unknown', icon: Minus, color: 'text-muted-foreground' }
  }, [selectedValue])

  const handleCopy = () => {
    if (selectedValue !== null && selectedValue !== undefined) {
      const text = typeof selectedValue === 'object'
        ? JSON.stringify(selectedValue, null, 2)
        : String(selectedValue)
      navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('Value copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const renderValue = () => {
    if (selectedValue === null) return <code className="text-syntax-null">null</code>
    if (selectedValue === undefined) return <code className="text-muted-foreground">undefined</code>

    if (typeof selectedValue === 'string') {
      return (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            Length: {selectedValue.length} characters
          </div>
          <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
            <code className="text-xs text-syntax-string break-all whitespace-pre-wrap">
              "{selectedValue}"
            </code>
          </div>
        </div>
      )
    }

    if (typeof selectedValue === 'number') {
      return (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            {Number.isInteger(selectedValue) ? 'Integer' : 'Float'}
          </div>
          <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
            <code className="text-lg font-mono text-syntax-number">
              {selectedValue.toLocaleString()}
            </code>
          </div>
        </div>
      )
    }

    if (typeof selectedValue === 'boolean') {
      return (
        <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
          <code className="text-lg font-mono text-syntax-boolean">
            {selectedValue.toString()}
          </code>
        </div>
      )
    }

    if (Array.isArray(selectedValue)) {
      return (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            {selectedValue.length} items
          </div>
          <ScrollArea className="h-[200px] rounded-lg border border-border/30 bg-muted/30">
            <pre className="p-3 text-xs font-mono">
              {JSON.stringify(selectedValue, null, 2)}
            </pre>
          </ScrollArea>
        </div>
      )
    }

    if (typeof selectedValue === 'object') {
      const keys = Object.keys(selectedValue)
      return (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            {keys.length} keys: {keys.slice(0, 5).join(', ')}
            {keys.length > 5 && `, +${keys.length - 5} more`}
          </div>
          <ScrollArea className="h-[200px] rounded-lg border border-border/30 bg-muted/30">
            <pre className="p-3 text-xs font-mono">
              {JSON.stringify(selectedValue, null, 2)}
            </pre>
          </ScrollArea>
        </div>
      )
    }

    return <code className="text-muted-foreground">No preview available</code>
  }

  if (selectedPath.length === 0) {
    return (
      <Card className="p-5 space-y-4 shadow-xl border-border/50 bg-card/60 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
            <Eye size={18} weight="duotone" className="text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground">Quick View</h3>
            <p className="text-xs text-muted-foreground">Select a node to preview</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          <div className="text-center space-y-2">
            <Eye size={48} weight="duotone" className="mx-auto opacity-30" />
            <p className="text-sm">Click any node in the tree to see details</p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-5 space-y-4 shadow-xl border-border/50 bg-card/60 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
          <Eye size={18} weight="duotone" className="text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground">Quick View</h3>
          <p className="text-xs text-muted-foreground">Selected node preview</p>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleCopy}
          className="h-8 w-8 hover:bg-primary/10"
        >
          {copied ? (
            <Check size={16} className="text-syntax-string" weight="bold" />
          ) : (
            <Copy size={16} />
          )}
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className={`${valueInfo.color} gap-1.5 px-2 py-1`}>
            <valueInfo.icon size={14} weight="duotone" />
            <span className="text-xs font-medium">{valueInfo.type}</span>
          </Badge>
          {'length' in valueInfo && (
            <Badge variant="outline" className="text-xs">
              {valueInfo.length} items
            </Badge>
          )}
          {'keys' in valueInfo && (
            <Badge variant="outline" className="text-xs">
              {valueInfo.keys} keys
            </Badge>
          )}
        </div>

        <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />

        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">Current Path</div>
          <code className="text-xs block p-2 rounded bg-muted/30 border border-border/30 break-all">
            {selectedPath.join('.')}
          </code>
        </div>

        <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />

        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">Value</div>
          {renderValue()}
        </div>
      </div>
    </Card>
  )
}
