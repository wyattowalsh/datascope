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
    <Card className="p-4 md:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Graph size={20} weight="duotone" className="text-primary" />
        <h3 className="text-sm font-semibold">Graph Analytics</h3>
      </div>

      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metrics" className="text-xs">
            <ChartBar size={14} className="mr-1" />
            Metrics
          </TabsTrigger>
          <TabsTrigger value="structure" className="text-xs">
            <TreeStructure size={14} className="mr-1" />
            Structure
          </TabsTrigger>
          <TabsTrigger value="centrality" className="text-xs">
            <Target size={14} className="mr-1" />
            Centrality
          </TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              label="Nodes"
              value={analytics.totalNodes}
              icon={<Rows size={16} />}
            />
            <MetricCard
              label="Edges"
              value={analytics.totalEdges}
              icon={<GitBranch size={16} />}
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
              value={(analytics.clusteringCoefficient * 100).toFixed(1) + '%'}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Advanced Metrics</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Leaf Nodes</span>
                <Badge variant="secondary">{analytics.leafNodes}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Branching Factor</span>
                <Badge variant="secondary">{analytics.branchingFactor.toFixed(2)}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Largest Component</span>
                <Badge variant="secondary">{analytics.largestComponent}</Badge>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="structure" className="space-y-4 mt-4">
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground font-medium">Depth Distribution</p>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2 pr-4">
                {Object.entries(analytics.nodesByDepth)
                  .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
                  .map(([depth, count]) => {
                    const percentage = (count / analytics.totalNodes) * 100
                    return (
                      <div key={depth} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Level {depth}</span>
                          <span className="text-sm font-medium tabular-nums">{count}</span>
                        </div>
                        <Progress 
                          value={percentage}
                          className="[&>div]:bg-primary"
                        />
                      </div>
                    )
                  })}
              </div>
            </ScrollArea>
          </div>

          <Separator />

          <div className="space-y-3">
            <p className="text-xs text-muted-foreground font-medium">Node Type Distribution</p>
            <div className="space-y-2">
              {Object.entries(analytics.nodesByType).map(([type, count]) => {
                const percentage = (count / analytics.totalNodes) * 100
                const colorMap: Record<string, string> = {
                  object: 'bg-accent/10 text-accent border-accent/20',
                  array: 'bg-primary/10 text-primary border-primary/20',
                  primitive: 'bg-syntax-string/10 text-syntax-string border-syntax-string/20'
                }
                const progressColorMap: Record<string, string> = {
                  object: '[&>div]:bg-accent',
                  array: '[&>div]:bg-primary',
                  primitive: '[&>div]:bg-syntax-string'
                }
                return (
                  <div key={type} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={colorMap[type]}>
                        {type}
                      </Badge>
                      <span className="text-sm font-medium tabular-nums">{count}</span>
                    </div>
                    <Progress 
                      value={percentage}
                      className={progressColorMap[type]}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="centrality" className="space-y-4 mt-4">
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground font-medium">
              Top Nodes by Centrality
            </p>
            <p className="text-xs text-muted-foreground">
              Nodes with the most connections
            </p>
            
            <ScrollArea className="h-[280px]">
              <div className="space-y-2 pr-4">
                {topCentralNodes.map(([nodeId, centrality], index) => {
                  const displayId = nodeId.split('.').pop() || nodeId
                  const percentage = centrality * 100
                  
                  return (
                    <div key={nodeId} className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <Badge 
                            variant="outline" 
                            className="flex-shrink-0 bg-primary/10 text-primary border-primary/20"
                          >
                            #{index + 1}
                          </Badge>
                          <code className="text-xs font-mono truncate">
                            {displayId}
                          </code>
                        </div>
                        <span className="text-sm font-medium tabular-nums flex-shrink-0">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                      <Progress 
                        value={percentage}
                        className="[&>div]:bg-primary"
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
  icon 
}: { 
  label: string
  value: string | number
  icon?: React.ReactNode 
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <p className="text-xs">{label}</p>
      </div>
      <p className="text-xl font-semibold tabular-nums">{value}</p>
    </div>
  )
}
