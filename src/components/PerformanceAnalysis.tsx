import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Gauge, 
  Clock, 
  Lightning,
  ChartLine,
  CheckCircle,
  Warning
} from '@phosphor-icons/react'

interface PerformanceMetrics {
  parseTime: number
  dataSize: number
  nodeCount: number
  edgeCount: number
  renderTime?: number
}

interface PerformanceAnalysisProps {
  metrics: PerformanceMetrics
}

function getPerformanceRating(parseTime: number, nodeCount: number): {
  rating: 'Excellent' | 'Good' | 'Fair' | 'Poor'
  color: string
  score: number
} {
  let score = 100
  
  if (parseTime > 1000) score -= 40
  else if (parseTime > 500) score -= 25
  else if (parseTime > 200) score -= 15
  else if (parseTime > 100) score -= 5
  
  if (nodeCount > 1000) score -= 30
  else if (nodeCount > 500) score -= 20
  else if (nodeCount > 200) score -= 10
  
  score = Math.max(0, score)
  
  let rating: 'Excellent' | 'Good' | 'Fair' | 'Poor'
  let color: string
  
  if (score >= 80) {
    rating = 'Excellent'
    color = 'text-syntax-string'
  } else if (score >= 60) {
    rating = 'Good'
    color = 'text-syntax-number'
  } else if (score >= 40) {
    rating = 'Fair'
    color = 'text-syntax-boolean'
  } else {
    rating = 'Poor'
    color = 'text-destructive'
  }
  
  return { rating, color, score }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

function formatTime(ms: number): string {
  if (ms < 1) return `${(ms * 1000).toFixed(0)}μs`
  if (ms < 1000) return `${ms.toFixed(0)}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

export function PerformanceAnalysis({ metrics }: PerformanceAnalysisProps) {
  const performance = getPerformanceRating(metrics.parseTime, metrics.nodeCount)
  const throughput = metrics.dataSize / (metrics.parseTime / 1000)
  const nodesPerMs = metrics.nodeCount / metrics.parseTime
  
  const recommendations: string[] = []
  const optimizations: string[] = []
  
  if (metrics.parseTime > 500) {
    recommendations.push('Consider reducing data complexity for faster parsing')
  }
  if (metrics.nodeCount > 500) {
    recommendations.push('Large node count may impact graph rendering performance')
  }
  if (metrics.edgeCount > 1000) {
    recommendations.push('High edge count - consider using simplified graph layouts')
  }
  
  if (metrics.parseTime < 100) {
    optimizations.push('Optimal parse time - data structure is efficient')
  }
  if (metrics.dataSize < 100000) {
    optimizations.push('Reasonable data size for browser processing')
  }
  if (metrics.nodeCount < 200) {
    optimizations.push('Node count is optimal for all visualizations')
  }
  
  return (
    <Card className="p-5 space-y-4 shadow-xl border-border/50 bg-card/60 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gauge size={20} weight="duotone" className="text-primary" />
          <h3 className="text-sm font-bold">Performance Analysis</h3>
        </div>
        <Badge variant="outline" className={`${performance.color} border-current/30 bg-current/10 font-bold`}>
          {performance.rating}
        </Badge>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Performance Score</span>
          <span className="font-bold">{performance.score}/100</span>
        </div>
        <Progress value={performance.score} className="h-2" />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={14} weight="duotone" className="text-primary" />
            <p className="text-xs font-semibold text-muted-foreground">Parse Time</p>
          </div>
          <p className="text-lg font-bold text-primary">{formatTime(metrics.parseTime)}</p>
        </div>
        
        <div className="p-3 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
          <div className="flex items-center gap-2 mb-1">
            <Lightning size={14} weight="duotone" className="text-accent" />
            <p className="text-xs font-semibold text-muted-foreground">Data Size</p>
          </div>
          <p className="text-lg font-bold text-accent">{formatBytes(metrics.dataSize)}</p>
        </div>
      </div>
      
      <div className="p-3 rounded-xl bg-muted/40 border border-border/30 space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <ChartLine size={16} weight="duotone" className="text-primary" />
          <p className="text-xs font-semibold text-muted-foreground">Throughput Metrics</p>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-muted-foreground mb-1">Processing Speed</p>
            <p className="font-bold text-primary">{formatBytes(throughput)}/s</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Node Rate</p>
            <p className="font-bold text-primary">{nodesPerMs.toFixed(1)} nodes/ms</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle size={16} weight="duotone" className="text-primary" />
          <p className="text-xs font-semibold text-muted-foreground">Graph Complexity</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex justify-between p-2 rounded-lg bg-muted/40">
            <span className="text-foreground/70">Nodes</span>
            <span className="font-bold text-primary">{metrics.nodeCount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between p-2 rounded-lg bg-muted/40">
            <span className="text-foreground/70">Edges</span>
            <span className="font-bold text-primary">{metrics.edgeCount.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      {optimizations.length > 0 && (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CheckCircle size={14} weight="duotone" className="text-syntax-string" />
            <p className="text-xs font-semibold text-syntax-string">Optimizations</p>
          </div>
          {optimizations.map((opt, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs p-2 rounded-lg bg-syntax-string/5 border border-syntax-string/20">
              <span className="text-syntax-string mt-0.5">✓</span>
              <span className="text-foreground/80">{opt}</span>
            </div>
          ))}
        </div>
      )}
      
      {recommendations.length > 0 && (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Warning size={14} weight="duotone" className="text-syntax-number" />
            <p className="text-xs font-semibold text-syntax-number">Recommendations</p>
          </div>
          {recommendations.map((rec, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs p-2 rounded-lg bg-syntax-number/5 border border-syntax-number/20">
              <span className="text-syntax-number mt-0.5">→</span>
              <span className="text-foreground/80">{rec}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
