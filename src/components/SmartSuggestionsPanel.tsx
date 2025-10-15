import { useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Lightbulb,
  ArrowRight,
  ChartBar,
  MagnifyingGlass,
  Code,
  Download
} from '@phosphor-icons/react'

interface Suggestion {
  title: string
  description: string
  action: string
  icon: any
  color: string
  onClick: () => void
}

interface SmartSuggestionsPanelProps {
  parsedData: any
  onSwitchToGraph: () => void
  onSearch: () => void
  onTransform: () => void
  onExport: () => void
  onShowAnalytics: () => void
}

export function SmartSuggestionsPanel({
  parsedData,
  onSwitchToGraph,
  onSearch,
  onTransform,
  onExport,
  onShowAnalytics
}: SmartSuggestionsPanelProps) {
  const suggestions = useMemo((): Suggestion[] => {
    if (!parsedData) return []

    const suggs: Suggestion[] = []

    const countNodes = (obj: any): number => {
      if (typeof obj !== 'object' || obj === null) return 1
      if (Array.isArray(obj)) {
        return obj.reduce((sum: number, item) => sum + countNodes(item), 1)
      }
      return Object.values(obj).reduce((sum: number, val) => sum + countNodes(val), 1) as number
    }

    const nodeCount = countNodes(parsedData)

    if (nodeCount > 20) {
      suggs.push({
        title: 'Visualize as Graph',
        description: `With ${nodeCount} nodes, a graph view might reveal interesting patterns`,
        action: 'Switch to Graph',
        icon: ChartBar,
        color: 'text-primary',
        onClick: onSwitchToGraph
      })
    }

    if (Array.isArray(parsedData)) {
      suggs.push({
        title: 'Search Array Items',
        description: `Found ${parsedData.length} items - use search to filter specific entries`,
        action: 'Open Search',
        icon: MagnifyingGlass,
        color: 'text-accent',
        onClick: onSearch
      })
    }

    const hasNestedArrays = (obj: any): boolean => {
      if (Array.isArray(obj)) {
        return obj.some(item => Array.isArray(item) || (typeof item === 'object' && item !== null))
      }
      if (typeof obj === 'object' && obj !== null) {
        return Object.values(obj).some(val => hasNestedArrays(val))
      }
      return false
    }

    if (hasNestedArrays(parsedData)) {
      suggs.push({
        title: 'Transform Data',
        description: 'Nested arrays detected - try flattening or extracting specific fields',
        action: 'Open Transformer',
        icon: Code,
        color: 'text-syntax-boolean',
        onClick: onTransform
      })
    }

    if (typeof parsedData === 'object' && parsedData !== null) {
      const keyCount = Object.keys(parsedData).length
      if (keyCount > 10) {
        suggs.push({
          title: 'Analyze Structure',
          description: `${keyCount} top-level keys - view analytics for deeper insights`,
          action: 'Show Analytics',
          icon: ChartBar,
          color: 'text-syntax-string',
          onClick: onShowAnalytics
        })
      }
    }

    suggs.push({
      title: 'Export Data',
      description: 'Save your data in JSON, YAML, CSV, or JSONL format',
      action: 'Export Options',
      icon: Download,
      color: 'text-syntax-number',
      onClick: onExport
    })

    return suggs.slice(0, 4)
  }, [parsedData, onSwitchToGraph, onSearch, onTransform, onExport, onShowAnalytics])

  if (suggestions.length === 0) {
    return null
  }

  return (
    <Card className="p-5 space-y-4 shadow-xl border-border/50 bg-card/60 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-gradient-to-br from-syntax-number/20 to-primary/20">
          <Lightbulb size={18} weight="duotone" className="text-syntax-number" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground">Smart Suggestions</h3>
          <p className="text-xs text-muted-foreground">Based on your data</p>
        </div>
      </div>

      <ScrollArea className="max-h-[300px]">
        <div className="space-y-2">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={suggestion.onClick}
              className="w-full text-left p-3 rounded-lg border border-border/30 bg-muted/20 hover:bg-muted/40 hover:border-primary/30 transition-all duration-200 group"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-background/50 ${suggestion.color}`}>
                  <suggestion.icon size={16} weight="duotone" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {suggestion.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {suggestion.description}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>{suggestion.action}</span>
                    <ArrowRight size={12} weight="bold" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </Card>
  )
}
