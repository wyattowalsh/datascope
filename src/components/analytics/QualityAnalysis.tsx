import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Target } from '@phosphor-icons/react'
import { DataStats } from '@/lib/parser'

interface DataQuality {
  score: number
  issues: string[]
  strengths: string[]
}

function analyzeDataQuality(stats: DataStats, data: any): DataQuality {
  const issues: string[] = []
  const strengths: string[] = []
  let score = 100
  
  const nullCount = stats.typeCount.null || 0
  const totalValues = Object.values(stats.typeCount).reduce((a, b) => a + b, 0)
  const nullPercentage = (nullCount / totalValues) * 100
  
  if (nullPercentage > 30) {
    issues.push(`High null values (${nullPercentage.toFixed(1)}%)`)
    score -= 20
  } else if (nullPercentage > 10) {
    issues.push(`Moderate null values (${nullPercentage.toFixed(1)}%)`)
    score -= 10
  } else if (nullPercentage < 5) {
    strengths.push('Low null value presence')
  }
  
  if (stats.maxDepth > 10) {
    issues.push(`Excessive nesting depth (${stats.maxDepth} levels)`)
    score -= 15
  } else if (stats.maxDepth <= 3) {
    strengths.push('Optimal nesting depth')
  }
  
  const typeCountKeys = Object.keys(stats.typeCount).length
  if (typeCountKeys >= 5) {
    strengths.push('Rich type diversity')
  } else if (typeCountKeys <= 2) {
    issues.push('Limited type variety')
    score -= 5
  }
  
  if (stats.totalKeys > 1000) {
    issues.push('Very large dataset (may impact performance)')
    score -= 10
  } else if (stats.totalKeys > 100) {
    strengths.push('Substantial data volume')
  }
  
  const hasStructure = stats.typeCount.object > 0 || stats.typeCount.array > 0
  if (hasStructure) {
    strengths.push('Well-structured hierarchical data')
  } else {
    issues.push('Flat structure (limited relationships)')
    score -= 10
  }
  
  return { score: Math.max(0, score), issues, strengths }
}

function getQualityColor(score: number) {
  if (score >= 80) return 'text-syntax-string'
  if (score >= 60) return 'text-syntax-number'
  if (score >= 40) return 'text-syntax-boolean'
  return 'text-destructive'
}

interface QualityAnalysisProps {
  stats: DataStats
  data: any
}

export function QualityAnalysis({ stats, data }: QualityAnalysisProps) {
  const quality = analyzeDataQuality(stats, data)
  
  return (
    <Card className="p-5 space-y-4 shadow-xl border-border/50 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:border-primary/20 group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="flex items-center gap-3 relative z-10">
        <div className="p-2 rounded-xl bg-gradient-to-br from-syntax-string/20 via-primary/15 to-accent/10 shadow-lg shadow-syntax-string/20 ring-1 ring-syntax-string/20 group-hover:scale-110 transition-transform duration-300">
          <Target size={18} weight="duotone" className="text-syntax-string" />
        </div>
        <h3 className="text-sm font-bold bg-gradient-to-r from-foreground to-primary/80 bg-clip-text text-transparent">
          Quality Analysis
        </h3>
      </div>
      
      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-muted/60 to-muted/40 border border-border/50 transition-all duration-200 hover:border-primary/40 hover:shadow-md">
          <div className="flex items-center gap-2">
            <Target size={18} weight="duotone" className="text-primary" />
            <span className="text-sm font-medium">Quality Score</span>
          </div>
          <Badge variant="outline" className={`${getQualityColor(quality.score)} border-current/30 bg-current/10 font-bold`}>
            {quality.score}/100
          </Badge>
        </div>
        
        <div className="space-y-2">
          <Progress value={quality.score} className="h-2 shadow-inner" />
        </div>
        
        {quality.issues.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-destructive/90">Issues Detected:</p>
            <div className="space-y-1">
              {quality.issues.map((issue, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs p-2 rounded-lg bg-destructive/5 border border-destructive/20 transition-all duration-200 hover:bg-destructive/10">
                  <span className="text-destructive mt-0.5 flex-shrink-0">⚠</span>
                  <span className="text-foreground/80">{issue}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {quality.strengths.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-syntax-string">Strengths:</p>
            <div className="space-y-1">
              {quality.strengths.map((strength, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs p-2 rounded-lg bg-syntax-string/5 border border-syntax-string/20 transition-all duration-200 hover:bg-syntax-string/10">
                  <span className="text-syntax-string mt-0.5 flex-shrink-0">✓</span>
                  <span className="text-foreground/80">{strength}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
