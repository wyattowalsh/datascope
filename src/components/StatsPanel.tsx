import { DataStats, ValueType } from '@/lib/parser'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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

  const colorMap: Record<ValueType, string> = {
    string: 'bg-syntax-string/10 text-syntax-string border-syntax-string/20',
    number: 'bg-syntax-number/10 text-syntax-number border-syntax-number/20',
    boolean: 'bg-syntax-boolean/10 text-syntax-boolean border-syntax-boolean/20',
    null: 'bg-syntax-null/10 text-syntax-null border-syntax-null/20',
    array: 'bg-primary/10 text-primary border-primary/20',
    object: 'bg-accent/10 text-accent border-accent/20'
  }

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold mb-3">Statistics</h3>
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total Keys</p>
            <p className="text-2xl font-semibold">{stats.totalKeys}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Max Depth</p>
            <p className="text-2xl font-semibold">{stats.maxDepth}</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Type Distribution</p>
          <div className="flex flex-wrap gap-2">
            {typeStats.map(({ label, value, type }) => (
              <Badge
                key={label}
                variant="outline"
                className={type ? colorMap[type] : ''}
              >
                {label}: {value}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
