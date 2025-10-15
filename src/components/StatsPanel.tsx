import { DataStats, ValueType } from '@/lib/parser'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface StatsInfo {
  label: string
  value: string | number
  type?: ValueType
}

export function StatsPanel({ stats }: { stats: DataStats }) {
  const typeStats: StatsInfo[] = (Object.entries(stats.typeCount) as [ValueType, number][])
    .filter(([_, count]) => count > 0)
    .map(([type, count]) => ({
      label: type.charAt(0).toUpperCase() + type.slice(1),
      value: count,
      type
    }))

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
    <Card className="p-6 shadow-xl border-border/40 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:border-border/60">
      <h3 className="text-sm font-semibold mb-5 flex items-center gap-2">
        <div className="h-1 w-10 bg-gradient-to-r from-primary via-accent to-primary rounded-full animate-pulse"></div>
        Statistics & Metrics
      </h3>
      
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 p-5 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/30 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Total Keys</p>
            <p className="text-3xl md:text-4xl font-bold tabular-nums bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">{stats.totalKeys}</p>
          </div>
          
          <div className="space-y-2 p-5 rounded-xl bg-gradient-to-br from-accent/15 to-accent/5 border border-accent/30 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Max Depth</p>
            <p className="text-3xl md:text-4xl font-bold tabular-nums bg-gradient-to-br from-accent to-accent/70 bg-clip-text text-transparent">{stats.maxDepth}</p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-2">
            <span className="h-px w-6 bg-border"></span>
            Type Distribution
          </p>
          <div className="space-y-3">
            {typeStats.map(({ label, value, type }) => {
              const percentage = totalValues > 0 ? (Number(value) / totalValues) * 100 : 0
              return (
                <div key={label} className="space-y-2.5 group">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className={`${type ? colorMap[type] : ''} px-3 py-1 text-xs font-semibold transition-all duration-200 group-hover:scale-105`}
                    >
                      {label}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold tabular-nums">{value}</span>
                      <span className="text-xs text-muted-foreground font-medium">({percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <Progress 
                    value={percentage} 
                    className={type ? `h-2.5 rounded-full ${progressColorMap[type]}` : 'h-2.5 rounded-full'}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Card>
  )
}
