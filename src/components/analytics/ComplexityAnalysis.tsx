import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { TreeStructure, Lightning } from '@phosphor-icons/react'
import { DataStats } from '@/lib/parser'

interface DataComplexity {
  score: number
  level: 'Simple' | 'Moderate' | 'Complex' | 'Very Complex'
  factors: string[]
}

function calculateComplexity(stats: DataStats, data: any): DataComplexity {
  let score = 0
  const factors: string[] = []
  
  if (stats.maxDepth <= 2) {
    score += 10
  } else if (stats.maxDepth <= 4) {
    score += 25
    factors.push('Moderate nesting depth')
  } else if (stats.maxDepth <= 8) {
    score += 50
    factors.push('Deep nesting structure')
  } else {
    score += 75
    factors.push('Very deep nesting (performance impact)')
  }
  
  if (stats.totalKeys < 20) {
    score += 5
  } else if (stats.totalKeys < 100) {
    score += 15
    factors.push('Large number of keys')
  } else {
    score += 30
    factors.push('Extensive key structure')
  }
  
  const typeCount = Object.keys(stats.typeCount).length
  if (typeCount >= 5) {
    score += 15
    factors.push('Multiple data types')
  }
  
  const hasArrays = stats.typeCount.array > 0
  const hasObjects = stats.typeCount.object > 0
  if (hasArrays && hasObjects) {
    score += 10
    factors.push('Mixed arrays and objects')
  }
  
  let level: DataComplexity['level']
  if (score < 25) level = 'Simple'
  else if (score < 50) level = 'Moderate'
  else if (score < 75) level = 'Complex'
  else level = 'Very Complex'
  
  return { score, level, factors }
}

function getComplexityColor(level: string) {
  switch (level) {
    case 'Simple': return 'text-syntax-string'
    case 'Moderate': return 'text-syntax-number'
    case 'Complex': return 'text-syntax-boolean'
    case 'Very Complex': return 'text-destructive'
    default: return 'text-foreground'
  }
}

interface ComplexityAnalysisProps {
  stats: DataStats
  data: any
}

export function ComplexityAnalysis({ stats, data }: ComplexityAnalysisProps) {
  const complexity = calculateComplexity(stats, data)
  
  return (
    <Card className="p-5 space-y-4 shadow-xl border-border/50 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:border-primary/20 group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="flex items-center gap-3 relative z-10">
        <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 via-accent/15 to-primary/10 shadow-lg shadow-primary/20 ring-1 ring-primary/20 group-hover:scale-110 transition-transform duration-300">
          <TreeStructure size={18} weight="duotone" className="text-primary" />
        </div>
        <h3 className="text-sm font-bold bg-gradient-to-r from-foreground to-primary/80 bg-clip-text text-transparent">
          Complexity Analysis
        </h3>
      </div>
      
      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-muted/60 to-muted/40 border border-border/50 transition-all duration-200 hover:border-primary/40 hover:shadow-md">
          <div className="flex items-center gap-2">
            <TreeStructure size={18} weight="duotone" className="text-primary" />
            <span className="text-sm font-medium">Complexity Level</span>
          </div>
          <Badge variant="outline" className={`${getComplexityColor(complexity.level)} border-current/30 bg-current/10 font-bold`}>
            {complexity.level}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Complexity Score</span>
            <span className="font-bold">{complexity.score}/100</span>
          </div>
          <Progress value={complexity.score} className="h-2 shadow-inner" />
        </div>
        
        {complexity.factors.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">Contributing Factors:</p>
            <div className="space-y-1">
              {complexity.factors.map((factor, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs p-2 rounded-lg bg-muted/40 border border-border/30 transition-all duration-200 hover:border-primary/40 hover:bg-muted/60">
                  <Lightning size={14} weight="duotone" className="text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground/80">{factor}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
