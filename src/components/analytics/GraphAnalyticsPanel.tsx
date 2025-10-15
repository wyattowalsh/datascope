import { GraphAnalytics } from '@/lib/graph-analyzer'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ChartBar, 
  GitBranch, 
  TreeStructure, 
  Graph,
  Rows,
  Target
} from '@phosphor-icons/react'

interface GraphAnalyticsProps {
  analytics: GraphAnalytics
}

export function GraphAnalyticsPanel({ analytics }: GraphAnalyticsProps) {
  const topCentralNodes = Object.entries(analytics.centrality)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <Card className="p-6 shadow-xl border-border/40 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:border-border/60">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-xl bg-primary/10">
          <Graph size={22} weight="duotone" className="text-primary" />
        </div>
        <h3 className="text-sm font-semibold">Graph Analytics</h3>
      </div>

      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted/80 p-1 rounded-xl">
          <TabsTrigger value="metrics" className="text-xs gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-200 rounded-lg">
            <ChartBar size={14} weight="duotone" />
            Metrics
          </TabsTrigger>
          <TabsTrigger value="structure" className="text-xs gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-200 rounded-lg">
            <TreeStructure size={14} weight="duotone" />
            Structure
          </TabsTrigger>
          <TabsTrigger value="centrality" className="text-xs gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-200 rounded-lg">
            <Target size={14} weight="duotone" />
            Centrality
          </TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-5 mt-5">
          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              label="Nodes"
              value={analytics.totalNodes}
              icon={<Rows size={18} weight="duotone" />}
              accent="primary"
            />
            <MetricCard
              label="Edges"
              value={analytics.totalEdges}
              icon={<GitBranch size={18} weight="duotone" />}
              accent="accent"
            />
            <MetricCard
              label="Avg Degree"
              value={analytics.averageDegree.toFixed(2)}
            />
            <MetricCard
              label="Max Depth"
              value={analytics.maxDepth}
            />
            <MetricCard
              label="Diameter"
              value={analytics.diameter}
            />
            <MetricCard
              label="Avg Path"
              value={analytics.averagePath.toFixed(2)}
            />
            <MetricCard
              label="Density"
              value={(analytics.density * 100).toFixed(1) + '%'}
            />
            <MetricCard
              label="Clustering"
              value={analytics.clusteringCoefficient.toFixed(3)}
            />
          </div>
        </TabsContent>

        <TabsContent value="structure" className="space-y-5 mt-5">
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Depth Distribution</p>
            <ScrollArea className="h-[240px]">
              <div className="space-y-3 pr-4">
                {Object.entries(analytics.nodesByDepth)
                  .sort(([a], [b]) => Number(a) - Number(b))
                  .map(([depth, count]) => {
                    const percentage = (Number(count) / analytics.totalNodes) * 100
                    return (
                      <div key={depth} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Level {depth}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold tabular-nums">{count}</span>
                            <span className="text-xs text-muted-foreground">({percentage.toFixed(1)}%)</span>
                          </div>
                        </div>
                        <Progress 
                          value={percentage}
                          className="[&>div]:bg-primary h-2"
                        />
                      </div>
                    )
                  })}
              </div>
            </ScrollArea>
          </div>

          <Separator className="bg-border/50" />

          <div className="space-y-4">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Node Type Distribution</p>
            <div className="space-y-3">
              {Object.entries(analytics.nodesByType).map(([type, count]) => {
                const percentage = (count / analytics.totalNodes) * 100
                const colorMap: Record<string, string> = {
                  object: 'bg-accent/15 text-accent border-accent/30 shadow-sm',
                  array: 'bg-primary/15 text-primary border-primary/30 shadow-sm',
                  primitive: 'bg-syntax-string/15 text-syntax-string border-syntax-string/30 shadow-sm'
                }
                const progressColorMap: Record<string, string> = {
                  object: '[&>div]:bg-accent',
                  array: '[&>div]:bg-primary',
                  primitive: '[&>div]:bg-syntax-string'
                }
                return (
                  <div key={type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={colorMap[type]}>
                        {type}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold tabular-nums">{count}</span>
                        <span className="text-xs text-muted-foreground">({percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                    <Progress 
                      value={percentage}
                      className={`${progressColorMap[type]} h-2`}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="centrality" className="space-y-4 mt-5">
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Top Central Nodes</p>
              <p className="text-xs text-muted-foreground">Nodes with the most connections</p>
            </div>
            
            <ScrollArea className="h-[320px]">
              <div className="space-y-3 pr-4">
                {topCentralNodes.map(([nodeId, centrality], index) => {
                  const displayId = nodeId.split('.').pop() || nodeId
                  const percentage = centrality * 100
                  
                  return (
                    <div key={nodeId} className="space-y-2 p-3 rounded-lg bg-muted/40 border border-border/40 hover:bg-muted/60 transition-all duration-200">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <Badge 
                            variant="outline" 
                            className="flex-shrink-0 bg-primary/15 text-primary border-primary/30 shadow-sm font-semibold"
                          >
                            #{index + 1}
                          </Badge>
                          <code className="text-xs font-mono truncate text-foreground/90">
                            {displayId}
                          </code>
                        </div>
                        <span className="text-sm font-bold tabular-nums flex-shrink-0 text-primary">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                      <Progress 
                        value={percentage}
                        className="[&>div]:bg-primary h-2"
                      />
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}

function MetricCard({ 
  label, 
  value, 
  icon,
  accent
}: { 
  label: string
  value: string | number
  icon?: React.ReactNode
  accent?: 'primary' | 'accent'
}) {
  const accentColors = accent === 'primary' 
    ? 'from-primary/15 to-primary/5 border-primary/30'
    : accent === 'accent'
    ? 'from-accent/15 to-accent/5 border-accent/30'
    : 'from-muted/60 to-muted/30 border-border/40'
  
  const textColor = accent === 'primary'
    ? 'text-primary'
    : accent === 'accent'
    ? 'text-accent'
    : 'text-foreground'

  return (
    <div className={`space-y-2 p-4 rounded-xl bg-gradient-to-br ${accentColors} border transition-all duration-200 hover:shadow-md hover:scale-[1.02]`}>
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <p className="text-xs font-semibold">{label}</p>
      </div>
      <p className={`text-2xl font-bold tabular-nums ${textColor}`}>{value}</p>
    </div>
  )
}
