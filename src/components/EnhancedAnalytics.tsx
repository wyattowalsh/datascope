import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  ChartBar, 
  TrendUp, 
  Lightning, 
  Database,
  Target,
  BracketsAngle,
  TreeStructure,
  Percent
} from '@phosphor-icons/react'

interface DataStats {
  totalKeys: number
  maxDepth: number
  typeCount: Record<string, number>
}

interface EnhancedAnalyticsProps {
  stats: DataStats
  data: any
}

interface DataComplexity {
  score: number
  level: 'Simple' | 'Moderate' | 'Complex' | 'Very Complex'
  factors: string[]
}

interface DataQuality {
  score: number
  issues: string[]
  strengths: string[]
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

function calculateDensity(data: any, depth = 0): { avgBranchingFactor: number; maxWidth: number } {
  if (!data || typeof data !== 'object') {
    return { avgBranchingFactor: 0, maxWidth: 0 }
  }
  
  const children = Array.isArray(data) ? data : Object.values(data)
  const width = children.length
  
  const childMetrics = children.map(child => calculateDensity(child, depth + 1))
  const totalBranching = childMetrics.reduce((sum, m) => sum + m.avgBranchingFactor, 0)
  const maxChildWidth = Math.max(0, ...childMetrics.map(m => m.maxWidth))
  
  return {
    avgBranchingFactor: children.length > 0 ? (totalBranching + width) / (children.length + 1) : 0,
    maxWidth: Math.max(width, maxChildWidth)
  }
}

export function EnhancedAnalytics({ stats, data }: EnhancedAnalyticsProps) {
  const complexity = calculateComplexity(stats, data)
  const quality = analyzeDataQuality(stats, data)
  const density = calculateDensity(data)
  
  const totalValues = Object.values(stats.typeCount).reduce((a, b) => a + b, 0)
  const avgKeysPerLevel = stats.totalKeys / Math.max(1, stats.maxDepth)
  
  const getComplexityColor = (level: string) => {
    switch (level) {
      case 'Simple': return 'text-syntax-string'
      case 'Moderate': return 'text-syntax-number'
      case 'Complex': return 'text-syntax-boolean'
      case 'Very Complex': return 'text-destructive'
      default: return 'text-foreground'
    }
  }
  
  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-syntax-string'
    if (score >= 60) return 'text-syntax-number'
    if (score >= 40) return 'text-syntax-boolean'
    return 'text-destructive'
  }
  
  return (
    <Card className="p-5 space-y-4 shadow-xl border-border/50 bg-card/60 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <ChartBar size={20} weight="duotone" className="text-primary" />
        <h3 className="text-sm font-bold">Enhanced Analytics</h3>
      </div>
      
      <Tabs defaultValue="complexity" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-muted/80 p-1 rounded-xl">
          <TabsTrigger value="complexity" className="text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/15 data-[state=active]:to-primary/10 rounded-lg">
            Complexity
          </TabsTrigger>
          <TabsTrigger value="quality" className="text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/15 data-[state=active]:to-primary/10 rounded-lg">
            Quality
          </TabsTrigger>
          <TabsTrigger value="density" className="text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/15 data-[state=active]:to-primary/10 rounded-lg">
            Density
          </TabsTrigger>
          <TabsTrigger value="metrics" className="text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/15 data-[state=active]:to-primary/10 rounded-lg">
            Metrics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="complexity" className="space-y-3 mt-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-muted/60 to-muted/40 border border-border/50">
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
            <Progress value={complexity.score} className="h-2" />
          </div>
          
          {complexity.factors.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">Contributing Factors:</p>
              <div className="space-y-1">
                {complexity.factors.map((factor, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs p-2 rounded-lg bg-muted/40 border border-border/30">
                    <Lightning size={14} weight="duotone" className="text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground/80">{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="quality" className="space-y-3 mt-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-muted/60 to-muted/40 border border-border/50">
            <div className="flex items-center gap-2">
              <Target size={18} weight="duotone" className="text-primary" />
              <span className="text-sm font-medium">Quality Score</span>
            </div>
            <Badge variant="outline" className={`${getQualityColor(quality.score)} border-current/30 bg-current/10 font-bold`}>
              {quality.score}/100
            </Badge>
          </div>
          
          <div className="space-y-2">
            <Progress value={quality.score} className="h-2" />
          </div>
          
          {quality.issues.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-destructive/90">Issues Detected:</p>
              <div className="space-y-1">
                {quality.issues.map((issue, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs p-2 rounded-lg bg-destructive/5 border border-destructive/20">
                    <span className="text-destructive mt-0.5">⚠</span>
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
                  <div key={idx} className="flex items-start gap-2 text-xs p-2 rounded-lg bg-syntax-string/5 border border-syntax-string/20">
                    <span className="text-syntax-string mt-0.5">✓</span>
                    <span className="text-foreground/80">{strength}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="density" className="space-y-3 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <BracketsAngle size={16} weight="duotone" className="text-primary" />
                <p className="text-xs font-semibold text-muted-foreground">Avg Branching</p>
              </div>
              <p className="text-xl font-bold text-primary">{density.avgBranchingFactor.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">children per node</p>
            </div>
            
            <div className="p-3 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendUp size={16} weight="duotone" className="text-accent" />
                <p className="text-xs font-semibold text-muted-foreground">Max Width</p>
              </div>
              <p className="text-xl font-bold text-accent">{density.maxWidth}</p>
              <p className="text-xs text-muted-foreground mt-1">widest level</p>
            </div>
          </div>
          
          <div className="p-3 rounded-xl bg-muted/40 border border-border/30">
            <div className="flex items-center gap-2 mb-2">
              <Database size={16} weight="duotone" className="text-primary" />
              <p className="text-xs font-semibold text-muted-foreground">Structure Density</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-foreground/70">Keys per level</span>
                <span className="font-bold text-primary">{avgKeysPerLevel.toFixed(1)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-foreground/70">Total values</span>
                <span className="font-bold text-primary">{totalValues.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="metrics" className="space-y-3 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-muted/60 to-muted/40 border border-border/50">
              <p className="text-xs font-semibold text-muted-foreground mb-1">Total Keys</p>
              <p className="text-2xl font-bold text-primary">{stats.totalKeys.toLocaleString()}</p>
            </div>
            
            <div className="p-3 rounded-xl bg-gradient-to-br from-muted/60 to-muted/40 border border-border/50">
              <p className="text-xs font-semibold text-muted-foreground mb-1">Max Depth</p>
              <p className="text-2xl font-bold text-accent">{stats.maxDepth}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Percent size={16} weight="duotone" className="text-primary" />
              <p className="text-xs font-semibold text-muted-foreground">Type Distribution</p>
            </div>
            {Object.entries(stats.typeCount)
              .sort(([, a], [, b]) => b - a)
              .map(([type, count]) => {
                const percentage = (count / totalValues) * 100
                return (
                  <div key={type} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="capitalize text-foreground/80">{type}</span>
                      <span className="font-semibold text-primary">{percentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={percentage} className="h-1.5" />
                  </div>
                )
              })}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}