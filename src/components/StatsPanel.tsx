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
    string: 'bg-syntax-string/10 text-syntax-string border-syntax-string/20',
    number: 'bg-syntax-number/10 text-syntax-number border-syntax-number/20',
    boolean: 'bg-syntax-boolean/10 text-syntax-boolean border-syntax-boolean/20',
    null: 'bg-syntax-null/10 text-syntax-null border-syntax-null/20',
    array: 'bg-primary/10 text-primary border-primary/20',
    object: 'bg-accent/10 text-accent border-accent/20'
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
    <Card className="p-4 md:p-6">
      <h3 className="text-sm font-semibold mb-4">Statistics</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total Keys</p>
            <p className="text-2xl font-semibold tabular-nums">{stats.totalKeys}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Max Depth</p>
            <p className="text-2xl font-semibold tabular-nums">{stats.maxDepth}</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs text-muted-foreground font-medium">Type Distribution</p>
          <div className="space-y-2">
            {typeStats.map(({ label, value, type }) => {
              const percentage = totalValues > 0 ? (Number(value) / totalValues) * 100 : 0
              return (
                <div key={label} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className={type ? colorMap[type] : ''}
                    >
                      {label}
                    </Badge>
                    <span className="text-sm font-medium tabular-nums">{value}</span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className={type ? progressColorMap[type] : ''}
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
