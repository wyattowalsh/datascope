import { useState, useEffect, memo } from 'react'
import { DataStats, ValueType } from '@/lib/parser'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ChartBar } from '@phosphor-icons/react'

interface StatsInfo {
  label: string
  value: string | number
  type?: ValueType
}

function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let start = 0
    const duration = 800
    const increment = value / (duration / 16)
    
    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [value])

  return <span className={className}>{displayValue}</span>
}

export const StatsPanel = memo(function StatsPanel({ stats }: { stats: DataStats }) {
  const typeStats: StatsInfo[] = (Object.entries(stats.typeCount) as [ValueType, number][])
    .filter(([_, count]) => count > 0)
    .map(([type, count]) => ({
      label: type.charAt(0).toUpperCase() + type.slice(1),
      value: count,
      type
    }))
    .sort((a, b) => Number(b.value) - Number(a.value))

  const totalValues = Object.values(stats.typeCount).reduce((sum, count) => sum + count, 0)

  const colorMap: Record<ValueType, string> = {
    string: 'bg-syntax-string/15 text-syntax-string border-syntax-string/30 shadow-sm',
    number: 'bg-syntax-number/15 text-syntax-number border-syntax-number/30 shadow-sm',
    boolean: 'bg-syntax-boolean/15 text-syntax-boolean border-syntax-boolean/30 shadow-sm',
    null: 'bg-syntax-null/15 text-syntax-null border-syntax-null/30 shadow-sm',
    array: 'bg-primary/15 text-primary border-primary/30 shadow-sm',
    object: 'bg-accent/15 text-accent border-accent/30 shadow-sm'
  }

  const progressColorMap: Record<ValueType, string> = {
    string: '[&>div]:bg-syntax-string',
    number: '[&>div]:bg-syntax-number',
    boolean: '[&>div]:bg-syntax-boolean',
    null: '[&>div]:bg-syntax-null',
    array: '[&>div]:bg-primary',
    object: '[&>div]:bg-accent'
  }

  return (
    <Card className="p-6 shadow-xl border-border/40 bg-gradient-to-br from-card/60 to-card/40 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:border-primary/20 group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-5 relative z-10">
        <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 via-accent/15 to-primary/10 shadow-lg shadow-primary/20 ring-1 ring-primary/20 group-hover:scale-110 transition-transform duration-300">
          <ChartBar size={18} weight="duotone" className="text-primary" />
        </div>
        <h3 className="text-sm font-bold bg-gradient-to-r from-foreground to-primary/80 bg-clip-text text-transparent">
          Statistics & Metrics
        </h3>
      </div>
      
      <div className="space-y-6 relative z-10">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 p-5 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/30 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 cursor-default">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Total Keys</p>
            <p className="text-3xl md:text-4xl font-bold tabular-nums bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
              <AnimatedNumber value={stats.totalKeys} />
            </p>
          </div>
          
          <div className="space-y-2 p-5 rounded-xl bg-gradient-to-br from-accent/15 to-accent/5 border border-accent/30 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 cursor-default">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Max Depth</p>
            <p className="text-3xl md:text-4xl font-bold tabular-nums bg-gradient-to-br from-accent to-accent/70 bg-clip-text text-transparent">
              <AnimatedNumber value={stats.maxDepth} />
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-2">
            <span className="h-px w-6 bg-gradient-to-r from-border to-transparent"></span>
            Type Distribution
            <Badge variant="outline" className="ml-auto bg-muted/50 text-foreground/70 border-border/50 text-xs px-2">
              {typeStats.length} types
            </Badge>
          </p>
          <div className="space-y-3">
            {typeStats.map(({ label, value, type }, i) => {
              const percentage = totalValues > 0 ? (Number(value) / totalValues) * 100 : 0
              return (
                <div 
                  key={label} 
                  className="space-y-2.5 group/item animate-in slide-in-from-left-2"
                  style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'backwards' }}
                >
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className={`${type ? colorMap[type] : ''} px-3 py-1 text-xs font-semibold transition-all duration-200 group-hover/item:scale-105 group-hover/item:shadow-md`}
                    >
                      {label}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold tabular-nums">
                        <AnimatedNumber value={Number(value)} />
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">({percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <Progress 
                    value={percentage} 
                    className={type ? `h-2.5 rounded-full ${progressColorMap[type]} shadow-inner` : 'h-2.5 rounded-full shadow-inner'}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Card>
  )
})
