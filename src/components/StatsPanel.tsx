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
    <Card className="p-6 shadow-lg border-border/60 transition-all duration-300 hover:shadow-xl">
      <h3 className="text-sm font-semibold mb-5 flex items-center gap-2">
        <div className="h-1 w-8 bg-gradient-to-r from-primary to-accent rounded-full"></div>
        Statistics
      </h3>
      
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-2 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <p className="text-xs text-muted-foreground font-medium">Total Keys</p>
            <p className="text-3xl font-bold tabular-nums text-primary">{stats.totalKeys}</p>
          </div>
          
          <div className="space-y-2 p-4 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
            <p className="text-xs text-muted-foreground font-medium">Max Depth</p>
            <p className="text-3xl font-bold tabular-nums text-accent">{stats.maxDepth}</p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Type Distribution</p>
          <div className="space-y-3">
            {typeStats.map(({ label, value, type }) => {
              const percentage = totalValues > 0 ? (Number(value) / totalValues) * 100 : 0
              return (
                <div key={label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className={type ? colorMap[type] : ''}
                    >
                      {label}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold tabular-nums">{value}</span>
                      <span className="text-xs text-muted-foreground">({percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <Progress 
                    value={percentage} 
                    className={type ? `h-2 ${progressColorMap[type]}` : 'h-2'}
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
