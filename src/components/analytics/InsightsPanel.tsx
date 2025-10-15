import { Lightbulb, TrendUp, Warning, Info } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DataStats } from '@/lib/parser'

interface InsightsPanelProps {
  stats: DataStats
  data: any
}

interface Insight {
  type: 'tip' | 'warning' | 'info' | 'trend'
  title: string
  description: string
}

function generateInsights(stats: DataStats, data: any): Insight[] {
  const insights: Insight[] = []
  
  if (stats.maxDepth > 10) {
    insights.push({
      type: 'warning',
      title: 'Deep Nesting Detected',
      description: `Structure has ${stats.maxDepth} levels of nesting. Consider flattening for better performance and readability.`
    })
  } else if (stats.maxDepth > 6) {
    insights.push({
      type: 'info',
      title: 'Moderate Nesting',
      description: `${stats.maxDepth} levels deep. Use tree view collapse/expand for easier navigation.`
    })
  }
  
  if (stats.totalKeys > 500) {
    insights.push({
      type: 'warning',
      title: 'Very Large Dataset',
      description: `Contains ${stats.totalKeys} keys. Performance may be impacted. Consider pagination or chunking.`
    })
  } else if (stats.totalKeys > 100) {
    insights.push({
      type: 'info',
      title: 'Large Dataset',
      description: `Contains ${stats.totalKeys} keys. Use advanced search and filtering for efficient navigation.`
    })
  }
  
  const nullCount = stats.typeCount.null || 0
  const totalValues = Object.values(stats.typeCount).reduce((sum, count) => sum + count, 0)
  if (nullCount > totalValues * 0.4) {
    insights.push({
      type: 'warning',
      title: 'High Null Values',
      description: `${Math.round((nullCount / totalValues) * 100)}% of values are null. Data quality may be compromised.`
    })
  } else if (nullCount > totalValues * 0.1 && nullCount > 0) {
    insights.push({
      type: 'info',
      title: 'Some Null Values',
      description: `${Math.round((nullCount / totalValues) * 100)}% null values detected. May indicate optional fields.`
    })
  }
  
  if (Array.isArray(data) && data.length > 0) {
    const hasConsistentKeys = data.every((item: any) => {
      if (typeof item !== 'object' || item === null) return false
      const keys = Object.keys(item).sort()
      const firstKeys = Object.keys(data[0]).sort()
      return JSON.stringify(keys) === JSON.stringify(firstKeys)
    })
    
    if (hasConsistentKeys) {
      insights.push({
        type: 'tip',
        title: 'Consistent Schema',
        description: `All ${data.length} array items share identical structure. Perfect for CSV export or table view.`
      })
    } else {
      insights.push({
        type: 'info',
        title: 'Varied Schema',
        description: 'Array items have different structures. Use schema extraction to understand variations.'
      })
    }
    
    if (data.length > 1000) {
      insights.push({
        type: 'trend',
        title: 'Large Array Dataset',
        description: `${data.length} items in array. Consider pagination or virtual scrolling for display.`
      })
    }
  }
  
  const stringCount = stats.typeCount.string || 0
  const numberCount = stats.typeCount.number || 0
  const booleanCount = stats.typeCount.boolean || 0
  
  if (stringCount > totalValues * 0.7) {
    insights.push({
      type: 'trend',
      title: 'String-Heavy Data',
      description: `${Math.round((stringCount / totalValues) * 100)}% strings. Consider type conversion or validation.`
    })
  }
  
  if (numberCount > totalValues * 0.5) {
    insights.push({
      type: 'trend',
      title: 'Numeric-Heavy Data',
      description: `${Math.round((numberCount / totalValues) * 100)}% numbers. Good candidate for statistical analysis.`
    })
  }
  
  if (stats.maxDepth <= 3 && stats.totalKeys < 20) {
    insights.push({
      type: 'tip',
      title: 'Simple Structure',
      description: 'Flat, simple structure ideal for quick analysis, transformation, and API integration.'
    })
  }
  
  const arrayCount = stats.typeCount.array || 0
  const objectCount = stats.typeCount.object || 0
  
  if (arrayCount > 10) {
    insights.push({
      type: 'trend',
      title: 'Multiple Arrays',
      description: `Contains ${arrayCount} arrays. 3D graph view can reveal collection relationships.`
    })
  }
  
  if (objectCount > 20) {
    insights.push({
      type: 'trend',
      title: 'Complex Object Hierarchy',
      description: `${objectCount} nested objects detected. Graph analytics show entity relationships.`
    })
  }
  
  const typeVariety = Object.keys(stats.typeCount).length
  if (typeVariety >= 6) {
    insights.push({
      type: 'info',
      title: 'Rich Type Diversity',
      description: `${typeVariety} different data types. Well-structured mixed-type dataset.`
    })
  }

  if (insights.length === 0) {
    insights.push({
      type: 'tip',
      title: 'Well-Structured Data',
      description: 'Data appears well-balanced and properly structured with good type distribution.'
    })
  }
  
  return insights.slice(0, 6)
}

export function InsightsPanel({ stats, data }: InsightsPanelProps) {
  const insights = generateInsights(stats, data)
  
  const iconMap = {
    tip: <Lightbulb size={18} weight="duotone" className="text-syntax-string" />,
    warning: <Warning size={18} weight="duotone" className="text-syntax-number" />,
    info: <Info size={18} weight="duotone" className="text-primary" />,
    trend: <TrendUp size={18} weight="duotone" className="text-accent" />
  }
  
  const colorMap = {
    tip: 'bg-syntax-string/10 border-syntax-string/30',
    warning: 'bg-syntax-number/10 border-syntax-number/30',
    info: 'bg-primary/10 border-primary/30',
    trend: 'bg-accent/10 border-accent/30'
  }
  
  const badgeColorMap = {
    tip: 'bg-syntax-string/20 text-syntax-string',
    warning: 'bg-syntax-number/20 text-syntax-number',
    info: 'bg-primary/20 text-primary',
    trend: 'bg-accent/20 text-accent'
  }
  
  return (
    <Card className="p-6 space-y-4 shadow-xl border-border/50 bg-gradient-to-br from-card/70 to-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:border-primary/20 group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="flex items-center gap-3 relative z-10">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-syntax-string/20 via-primary/15 to-accent/10 shadow-lg shadow-syntax-string/20 ring-1 ring-syntax-string/20 group-hover:scale-110 transition-transform duration-300">
          <Lightbulb size={20} weight="duotone" className="text-syntax-string" />
        </div>
        <div>
          <h3 className="text-lg font-bold bg-gradient-to-r from-foreground to-primary/80 bg-clip-text text-transparent">Data Insights</h3>
          <p className="text-xs text-muted-foreground mt-0.5">AI-powered analysis & recommendations</p>
        </div>
        <Badge variant="outline" className="ml-auto bg-primary/10 text-primary border-primary/20 font-semibold">
          {insights.length}
        </Badge>
      </div>
      
      <div className="space-y-2.5 relative z-10">
        {insights.map((insight, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl border ${colorMap[insight.type]} transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5 cursor-default animate-in slide-in-from-bottom-2`}
            style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'backwards' }}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {iconMap[insight.type]}
              </div>
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-semibold text-foreground/90">{insight.title}</h4>
                  <Badge 
                    variant="secondary" 
                    className={`rounded-md text-xs font-medium ${badgeColorMap[insight.type]} px-2 py-0.5`}
                  >
                    {insight.type}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
