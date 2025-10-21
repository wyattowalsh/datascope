import { useEffect, useRef, useState, memo } from 'react'
import * as d3 from 'd3'
import { GraphData, GraphNode, GraphLink } from '@/lib/graph-analyzer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowsOut, ArrowsIn, ArrowsClockwise, Circle, Tree, Rows, Graph } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export type GraphLayout = 'force' | 'tree' | 'radial' | 'grid'

interface GraphVisualizationProps {
  data: GraphData
  onNodeClick?: (nodeId: string) => void
  selectedNodeId?: string
}

export const GraphVisualization = memo(function GraphVisualization({ data, onNodeClick, selectedNodeId }: GraphVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [zoom, setZoom] = useState(1)
  const [layout, setLayout] = useState<GraphLayout>('force')

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setDimensions({ width: rect.width, height: Math.max(500, rect.height) })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const { width, height } = dimensions

    const g = svg.append('g')

    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
        setZoom(event.transform.k)
      })

    svg.call(zoomBehavior)

    const colorMap = {
      object: 'oklch(0.69 0.134 210.42)',
      array: 'oklch(0.53 0.197 264.05)',
      primitive: 'oklch(0.64 0.15 163.23)'
    }

    let simulation: d3.Simulation<any, any> | null = null

    if (layout === 'force') {
      simulation = d3.forceSimulation(data.nodes as any)
        .force('link', d3.forceLink(data.links)
          .id((d: any) => d.id)
          .distance(80))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(30))
    } else if (layout === 'tree') {
      const root = d3.stratify<GraphNode>()
        .id(d => d.id)
        .parentId(d => {
          const link = data.links.find(l => l.target === d.id)
          return link ? link.source : null
        })(data.nodes as any)

      const treeLayout = d3.tree<any>().size([width - 100, height - 100])
      const treeData = treeLayout(root)

      treeData.descendants().forEach(d => {
        const node = data.nodes.find(n => n.id === d.id)
        if (node) {
          node.x = d.x + 50
          node.y = d.y + 50
        }
      })
    } else if (layout === 'radial') {
      const root = d3.stratify<GraphNode>()
        .id(d => d.id)
        .parentId(d => {
          const link = data.links.find(l => l.target === d.id)
          return link ? link.source : null
        })(data.nodes as any)

      const radialLayout = d3.tree<any>()
        .size([2 * Math.PI, Math.min(width, height) / 2 - 100])
        .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth)

      const radialData = radialLayout(root)

      radialData.descendants().forEach(d => {
        const node = data.nodes.find(n => n.id === d.id)
        if (node) {
          node.x = d.y * Math.cos(d.x - Math.PI / 2) + width / 2
          node.y = d.y * Math.sin(d.x - Math.PI / 2) + height / 2
        }
      })
    } else if (layout === 'grid') {
      const columns = Math.ceil(Math.sqrt(data.nodes.length))
      const cellWidth = width / columns
      const cellHeight = height / Math.ceil(data.nodes.length / columns)

      data.nodes.forEach((node, i) => {
        node.x = (i % columns) * cellWidth + cellWidth / 2
        node.y = Math.floor(i / columns) * cellHeight + cellHeight / 2
      })
    }

    const link = g.append('g')
      .selectAll('line')
      .data(data.links)
      .join('line')
      .attr('stroke', 'oklch(0.48 0.014 252.73 / 0.3)')
      .attr('stroke-width', 2)

    const node = g.append('g')
      .selectAll('g')
      .data(data.nodes)
      .join('g')
      .attr('cursor', 'pointer')

    if (layout === 'force') {
      node.call(d3.drag<any, GraphNode>()
        .on('start', (event, d: any) => {
          if (!event.active) simulation?.alphaTarget(0.3).restart()
          d.fx = d.x
          d.fy = d.y
        })
        .on('drag', (event, d: any) => {
          d.fx = event.x
          d.fy = event.y
        })
        .on('end', (event, d: any) => {
          if (!event.active) simulation?.alphaTarget(0)
          d.fx = null
          d.fy = null
        }))
    }

    node.on('click', (event, d) => {
      event.stopPropagation()
      onNodeClick?.(d.id)
    })

    node.append('circle')
      .attr('r', (d) => Math.max(8, Math.min(20, 8 + d.size * 2)))
      .attr('fill', (d) => colorMap[d.type])
      .attr('stroke', (d) => d.id === selectedNodeId ? 'oklch(0.72 0.16 65.28)' : 'oklch(0.99 0 0)')
      .attr('stroke-width', (d) => d.id === selectedNodeId ? 3 : 2)
      .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))')

    node.append('text')
      .text((d) => d.label.length > 15 ? d.label.substring(0, 15) + '...' : d.label)
      .attr('x', 0)
      .attr('y', (d) => Math.max(8, Math.min(20, 8 + d.size * 2)) + 14)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('font-weight', '500')
      .attr('fill', 'currentColor')

    if (layout === 'force' && simulation) {
      simulation.on('tick', () => {
        link
          .attr('x1', (d: any) => d.source.x)
          .attr('y1', (d: any) => d.source.y)
          .attr('x2', (d: any) => d.target.x)
          .attr('y2', (d: any) => d.target.y)

        node.attr('transform', (d: any) => `translate(${d.x},${d.y})`)
      })
    } else {
      link
        .attr('x1', (d: any) => {
          const source = data.nodes.find(n => n.id === d.source)
          return source?.x || 0
        })
        .attr('y1', (d: any) => {
          const source = data.nodes.find(n => n.id === d.source)
          return source?.y || 0
        })
        .attr('x2', (d: any) => {
          const target = data.nodes.find(n => n.id === d.target)
          return target?.x || 0
        })
        .attr('y2', (d: any) => {
          const target = data.nodes.find(n => n.id === d.target)
          return target?.y || 0
        })

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`)
    }

    return () => {
      simulation?.stop()
    }
  }, [data, dimensions, selectedNodeId, onNodeClick, layout])

  const handleZoomIn = () => {
    const svg = d3.select(svgRef.current!)
    const newZoom = Math.min(zoom * 1.3, 4)
    svg.transition().call(
      d3.zoom<SVGSVGElement, unknown>().scaleTo as any,
      newZoom
    )
  }

  const handleZoomOut = () => {
    const svg = d3.select(svgRef.current!)
    const newZoom = Math.max(zoom / 1.3, 0.1)
    svg.transition().call(
      d3.zoom<SVGSVGElement, unknown>().scaleTo as any,
      newZoom
    )
  }

  const handleReset = () => {
    const svg = d3.select(svgRef.current!)
    svg.transition().call(
      d3.zoom<SVGSVGElement, unknown>().transform as any,
      d3.zoomIdentity
    )
  }

  return (
    <TooltipProvider>
      <Card className="p-4 space-y-4 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-xl border-border/50 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <div className="flex items-center justify-between gap-2 flex-wrap relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 shadow-lg">
              <Graph size={20} weight="duotone" className="text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                2D Graph Visualization
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Interactive structure map with multiple layouts
              </p>
            </div>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <Tabs value={layout} onValueChange={(v) => setLayout(v as GraphLayout)}>
              <TabsList className="bg-muted/80 p-1 rounded-xl shadow-inner h-9">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger value="force" className="gap-1.5 text-xs h-7 px-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/15 data-[state=active]:to-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-md transition-all duration-200 rounded-lg">
                      <Circle size={14} weight="duotone" />
                      <span className="hidden sm:inline font-medium">Force</span>
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Force-directed layout</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger value="tree" className="gap-1.5 text-xs h-7 px-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/15 data-[state=active]:to-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-md transition-all duration-200 rounded-lg">
                      <Tree size={14} weight="duotone" />
                      <span className="hidden sm:inline font-medium">Tree</span>
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Hierarchical tree layout</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger value="radial" className="gap-1.5 text-xs h-7 px-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/15 data-[state=active]:to-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-md transition-all duration-200 rounded-lg">
                      <Circle size={14} weight="duotone" />
                      <span className="hidden sm:inline font-medium">Radial</span>
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Radial tree layout</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger value="grid" className="gap-1.5 text-xs h-7 px-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/15 data-[state=active]:to-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-md transition-all duration-200 rounded-lg">
                      <Rows size={14} weight="duotone" />
                      <span className="hidden sm:inline font-medium">Grid</span>
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Grid layout</TooltipContent>
                </Tooltip>
              </TabsList>
            </Tabs>
            
            <div className="flex gap-1.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="outline" onClick={handleZoomIn} className="h-9 w-9 p-0 rounded-xl hover:scale-105 transition-all duration-200 hover:border-primary/50 hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/20">
                    <ArrowsOut size={16} weight="duotone" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Zoom in</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="outline" onClick={handleZoomOut} className="h-9 w-9 p-0 rounded-xl hover:scale-105 transition-all duration-200 hover:border-primary/50 hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/20">
                    <ArrowsIn size={16} weight="duotone" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Zoom out</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="outline" onClick={handleReset} className="h-9 w-9 p-0 rounded-xl hover:scale-105 transition-all duration-200 hover:border-primary/50 hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/20">
                    <ArrowsClockwise size={16} weight="duotone" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reset view</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 relative z-10">
          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-accent mr-1.5 shadow-sm shadow-accent/50" />
            Objects
          </Badge>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary mr-1.5 shadow-sm shadow-primary/50" />
            Arrays
          </Badge>
          <Badge variant="outline" className="bg-syntax-string/10 text-syntax-string border-syntax-string/30 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-syntax-string mr-1.5 shadow-sm shadow-syntax-string/50" />
            Values
          </Badge>
        </div>

        <div
          ref={containerRef}
          className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10 shadow-2xl shadow-primary/10 ring-1 ring-border/50 transition-all duration-300 hover:shadow-primary/20 relative z-10"
          style={{ height: '500px' }}
        >
          <svg
            ref={svgRef}
            width={dimensions.width}
            height={dimensions.height}
            className="bg-background/50"
          />
          
          <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-background/90 backdrop-blur-md border border-border/50 rounded-xl text-xs font-mono shadow-lg">
            Zoom: {(zoom * 100).toFixed(0)}%
          </div>
        </div>
      </Card>
    </TooltipProvider>
  )
})
