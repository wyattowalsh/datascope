import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { GraphData, GraphNode, GraphLink } from '@/lib/graph-analyzer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ArrowsOut, ArrowsIn, ArrowsClockwise } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface GraphVisualizationProps {
  data: GraphData
  onNodeClick?: (nodeId: string) => void
  selectedNodeId?: string
}

export function GraphVisualization({ data, onNodeClick, selectedNodeId }: GraphVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [zoom, setZoom] = useState(1)

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

    const simulation = d3.forceSimulation(data.nodes as any)
      .force('link', d3.forceLink(data.links)
        .id((d: any) => d.id)
        .distance(80))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30))

    const colorMap = {
      object: 'oklch(0.69 0.134 210.42)',
      array: 'oklch(0.53 0.197 264.05)',
      primitive: 'oklch(0.64 0.15 163.23)'
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
      .call(d3.drag<any, GraphNode>()
        .on('start', (event, d: any) => {
          if (!event.active) simulation.alphaTarget(0.3).restart()
          d.fx = d.x
          d.fy = d.y
        })
        .on('drag', (event, d: any) => {
          d.fx = event.x
          d.fy = event.y
        })
        .on('end', (event, d: any) => {
          if (!event.active) simulation.alphaTarget(0)
          d.fx = null
          d.fy = null
        }))
      .on('click', (event, d) => {
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

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`)
    })

    return () => {
      simulation.stop()
    }
  }, [data, dimensions, selectedNodeId, onNodeClick])

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
      <Card className="p-4 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold">Graph Visualization</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Interactive structure map
            </p>
          </div>
          
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" onClick={handleZoomIn}>
                  <ArrowsOut size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom in</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" onClick={handleZoomOut}>
                  <ArrowsIn size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom out</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" onClick={handleReset}>
                  <ArrowsClockwise size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset view</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
            <span className="w-2 h-2 rounded-full bg-accent mr-1.5" />
            Objects
          </Badge>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary mr-1.5" />
            Arrays
          </Badge>
          <Badge variant="outline" className="bg-syntax-string/10 text-syntax-string border-syntax-string/20">
            <span className="w-2 h-2 rounded-full bg-syntax-string mr-1.5" />
            Values
          </Badge>
        </div>

        <div
          ref={containerRef}
          className="relative border border-border rounded-lg overflow-hidden bg-muted/20"
          style={{ height: '500px' }}
        >
          <svg
            ref={svgRef}
            width={dimensions.width}
            height={dimensions.height}
            className="bg-background"
          />
          
          <div className="absolute bottom-3 right-3 px-2 py-1 bg-background/80 backdrop-blur-sm border border-border rounded text-xs font-mono">
            Zoom: {(zoom * 100).toFixed(0)}%
          </div>
        </div>
      </Card>
    </TooltipProvider>
  )
}
