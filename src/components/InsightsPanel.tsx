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
      description: `Structure has ${stats.maxDepth} levels of nesting. Consider flattening for better performance.`
    })
  }
  
  if (stats.totalKeys > 100) {
    insights.push({
      type: 'info',
      title: 'Large Dataset',
      description: `Contains ${stats.totalKeys} keys. Use search and filtering for efficient navigation.`
    })
  }
  
  const nullCount = stats.typeCount.null || 0
  const totalValues = Object.values(stats.typeCount).reduce((sum, count) => sum + count, 0)
  if (nullCount > totalValues * 0.3) {
    insights.push({
      type: 'warning',
      title: 'High Null Values',
      description: `${Math.round((nullCount / totalValues) * 100)}% of values are null. Check data completeness.`
    })
  }
  
  if (Array.isArray(data) && data.length > 0) {
    const hasConsistentKeys = data.every((item: any) => {
      if (typeof item !== 'object') return false
      const keys = Object.keys(item).sort()
      const firstKeys = Object.keys(data[0]).sort()
      return JSON.stringify(keys) === JSON.stringify(firstKeys)
    })
    
    if (hasConsistentKeys) {
      insights.push({
        type: 'tip',
        title: 'Consistent Schema',
        description: 'Array items have consistent structure. Ideal for CSV export or tabular display.'
      })
    } else {
      insights.push({
        type: 'info',
        title: 'Varied Schema',
        description: 'Array items have different structures. Schema extraction can help understand variations.'
      })
    }
  }
  
  const stringCount = stats.typeCount.string || 0
  if (stringCount > totalValues * 0.7) {
    insights.push({
      type: 'trend',
      title: 'String-Heavy Data',
      description: 'Mostly string values. Consider type conversion or format validation.'
    })
  }
  
  if (stats.maxDepth <= 3 && stats.totalKeys < 20) {
    insights.push({
      type: 'tip',
      title: 'Simple Structure',
      description: 'Flat, simple structure ideal for quick analysis and transformation.'
    })
  }
  
  const arrayCount = stats.typeCount.array || 0
  if (arrayCount > 5) {
    insights.push({
      type: 'trend',
      title: 'Multiple Arrays',
      description: `Contains ${arrayCount} arrays. Graph view can help visualize relationships.`
    })
  }

  if (insights.length === 0) {
    insights.push({
      type: 'info',
      title: 'Well-Structured Data',
      description: 'Data appears well-balanced and properly structured.'
    })
  }
  
  return insights
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
    <Card className="p-6 space-y-4 shadow-xl border-border/50 bg-card/60 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gradient-to-br from-syntax-string/20 to-primary/20">
          <Lightbulb size={20} weight="duotone" className="text-syntax-string" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Data Insights</h3>
          <p className="text-xs text-muted-foreground">AI-powered analysis & recommendations</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {insights.map((insight, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl border ${colorMap[insight.type]} transition-all duration-200 hover:shadow-md hover:scale-[1.01]`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {iconMap[insight.type]}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold">{insight.title}</h4>
                  <Badge 
                    variant="secondary" 
                    className={`rounded-md text-xs ${badgeColorMap[insight.type]}`}
                  >
                    {insight.type}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
