import { Card } from '@/components/ui/card'
import { BracketsAngle, TrendUp, Database } from '@phosphor-icons/react'
import { DataStats } from '@/lib/parser'

interface DensityMetrics {
  avgBranchingFactor: number
  maxWidth: number
}

function calculateDensity(data: any, depth = 0): DensityMetrics {
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

interface DensityAnalysisProps {
  stats: DataStats
  data: any
}

export function DensityAnalysis({ stats, data }: DensityAnalysisProps) {
  const density = calculateDensity(data)
  const totalValues = Object.values(stats.typeCount).reduce((a, b) => a + b, 0)
  const avgKeysPerLevel = stats.totalKeys / Math.max(1, stats.maxDepth)
  
  return (
    <Card className="p-5 space-y-4 shadow-xl border-border/50 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:border-primary/20 group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="flex items-center gap-3 relative z-10">
        <div className="p-2 rounded-xl bg-gradient-to-br from-accent/20 via-primary/15 to-accent/10 shadow-lg shadow-accent/20 ring-1 ring-accent/20 group-hover:scale-110 transition-transform duration-300">
          <Database size={18} weight="duotone" className="text-accent" />
        </div>
        <h3 className="text-sm font-bold bg-gradient-to-r from-foreground to-primary/80 bg-clip-text text-transparent">
          Density Analysis
        </h3>
      </div>
      
      <div className="space-y-3 relative z-10">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 transition-all duration-300 hover:shadow-lg hover:scale-[1.03] cursor-default">
            <div className="flex items-center gap-2 mb-2">
              <BracketsAngle size={16} weight="duotone" className="text-primary" />
              <p className="text-xs font-semibold text-muted-foreground">Avg Branching</p>
            </div>
            <p className="text-2xl font-bold text-primary tabular-nums">{density.avgBranchingFactor.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">children per node</p>
          </div>
          
          <div className="p-4 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 transition-all duration-300 hover:shadow-lg hover:scale-[1.03] cursor-default">
            <div className="flex items-center gap-2 mb-2">
              <TrendUp size={16} weight="duotone" className="text-accent" />
              <p className="text-xs font-semibold text-muted-foreground">Max Width</p>
            </div>
            <p className="text-2xl font-bold text-accent tabular-nums">{density.maxWidth}</p>
            <p className="text-xs text-muted-foreground mt-1">widest level</p>
          </div>
        </div>
        
        <div className="p-4 rounded-xl bg-muted/40 border border-border/30 transition-all duration-200 hover:border-primary/40 hover:bg-muted/60">
          <div className="flex items-center gap-2 mb-3">
            <Database size={16} weight="duotone" className="text-primary" />
            <p className="text-xs font-semibold text-muted-foreground">Structure Density</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-foreground/70">Keys per level</span>
              <span className="font-bold text-primary tabular-nums">{avgKeysPerLevel.toFixed(1)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-foreground/70">Total values</span>
              <span className="font-bold text-primary tabular-nums">{totalValues.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
