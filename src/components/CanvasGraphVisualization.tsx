import { useEffect, useRef, useState, useCallback } from 'react'
import { GraphData, GraphNode, GraphLink } from '@/lib/graph-analyzer'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ArrowsOut, ArrowsIn, ArrowsClockwise } from '@phosphor-icons/react'

interface CanvasGraphVisualizationProps {
  data: GraphData
  onNodeClick?: (nodeId: string) => void
  selectedNodeId?: string
  width?: number
  height?: number
}

interface CanvasNode extends GraphNode {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

interface CanvasLink extends GraphLink {
  sourceNode?: CanvasNode
  targetNode?: CanvasNode
}

const NODE_RADIUS = 6
const LINK_STRENGTH = 0.3
const REPULSION = 1500
const DAMPING = 0.9
const FPS = 60
const FRAME_TIME = 1000 / FPS

export function CanvasGraphVisualization({
  data,
  onNodeClick,
  selectedNodeId,
  width = 800,
  height = 600
}: CanvasGraphVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [nodes, setNodes] = useState<CanvasNode[]>([])
  const [links, setLinks] = useState<CanvasLink[]>([])
  const [isSimulating, setIsSimulating] = useState(true)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const animationRef = useRef<number | undefined>(undefined)
  const lastFrameRef = useRef<number>(0)

  useEffect(() => {
    const centerX = width / 2
    const centerY = height / 2

    const canvasNodes: CanvasNode[] = data.nodes.map((node, i) => {
      const angle = (i / data.nodes.length) * Math.PI * 2
      const radius = Math.min(width, height) * 0.3
      
      return {
        ...node,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        radius: node.size ? node.size * 2 : NODE_RADIUS
      }
    })

    const nodeMap = new Map(canvasNodes.map(n => [n.id, n]))
    
    const canvasLinks: CanvasLink[] = data.links.map(link => ({
      ...link,
      sourceNode: nodeMap.get(link.source),
      targetNode: nodeMap.get(link.target)
    }))

    setNodes(canvasNodes)
    setLinks(canvasLinks)
    setIsSimulating(true)
  }, [data, width, height])

  const applyForces = useCallback((nodes: CanvasNode[], links: CanvasLink[]) => {
    links.forEach(link => {
      if (!link.sourceNode || !link.targetNode) return

      const dx = link.targetNode.x - link.sourceNode.x
      const dy = link.targetNode.y - link.sourceNode.y
      const distance = Math.sqrt(dx * dx + dy * dy) || 1

      const force = (distance - 80) * LINK_STRENGTH
      const fx = (dx / distance) * force
      const fy = (dy / distance) * force

      link.sourceNode.vx += fx
      link.sourceNode.vy += fy
      link.targetNode.vx -= fx
      link.targetNode.vy -= fy
    })

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x
        const dy = nodes[j].y - nodes[i].y
        const distSq = dx * dx + dy * dy || 1

        if (distSq < REPULSION * REPULSION) {
          const force = REPULSION / distSq
          const fx = (dx / Math.sqrt(distSq)) * force
          const fy = (dy / Math.sqrt(distSq)) * force

          nodes[i].vx -= fx
          nodes[i].vy -= fy
          nodes[j].vx += fx
          nodes[j].vy += fy
        }
      }
    }

    const centerX = width / 2
    const centerY = height / 2
    nodes.forEach(node => {
      const dx = centerX - node.x
      const dy = centerY - node.y
      node.vx += dx * 0.0001
      node.vy += dy * 0.0001
    })

    nodes.forEach(node => {
      node.x += node.vx
      node.y += node.vy
      node.vx *= DAMPING
      node.vy *= DAMPING

      const margin = node.radius
      if (node.x < margin) node.x = margin
      if (node.x > width - margin) node.x = width - margin
      if (node.y < margin) node.y = margin
      if (node.y > height - margin) node.y = height - margin
    })

    const totalEnergy = nodes.reduce((sum, node) => 
      sum + node.vx * node.vx + node.vy * node.vy, 0
    )
    
    return totalEnergy < 0.1
  }, [width, height])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, width, height)

    ctx.save()
    ctx.translate(pan.x, pan.y)
    ctx.scale(zoom, zoom)

    links.forEach(link => {
      if (!link.sourceNode || !link.targetNode) return

      ctx.strokeStyle = 'oklch(0.5 0.01 250 / 0.2)'
      ctx.lineWidth = 1 / zoom
      ctx.beginPath()
      ctx.moveTo(link.sourceNode.x, link.sourceNode.y)
      ctx.lineTo(link.targetNode.x, link.targetNode.y)
      ctx.stroke()
    })

    nodes.forEach(node => {
      const isSelected = node.id === selectedNodeId
      
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
      
      if (isSelected) {
        ctx.fillStyle = 'oklch(0.56 0.21 264.05)'
        ctx.fill()
        ctx.strokeStyle = 'oklch(0.56 0.21 264.05)'
        ctx.lineWidth = 3 / zoom
        ctx.stroke()
      } else {
        const nodeType = (node as any).group || (node as any).type || 'primitive'
        const color = nodeType === 'object' 
          ? 'oklch(0.69 0.134 210.42)'
          : nodeType === 'array'
          ? 'oklch(0.53 0.197 264.05)'
          : 'oklch(0.64 0.15 163.23)'
        
        ctx.fillStyle = color
        ctx.fill()
        ctx.strokeStyle = 'oklch(0.2 0.01 250 / 0.5)'
        ctx.lineWidth = 1 / zoom
        ctx.stroke()
      }
    })

    ctx.restore()
  }, [nodes, links, selectedNodeId, zoom, pan, width, height])

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (timestamp - lastFrameRef.current < FRAME_TIME) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      lastFrameRef.current = timestamp

      if (isSimulating) {
        const shouldStop = applyForces(nodes, links)
        if (shouldStop) {
          setIsSimulating(false)
        }
      }

      draw()

      if (isSimulating) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    if (isSimulating) {
      animationRef.current = requestAnimationFrame(animate)
    } else {
      draw()
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isSimulating, nodes, links, applyForces, draw])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left - pan.x) / zoom
    const y = (e.clientY - rect.top - pan.y) / zoom

    for (const node of nodes) {
      const dx = x - node.x
      const dy = y - node.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < node.radius) {
        if (onNodeClick) {
          onNodeClick(node.id)
        }
        break
      }
    }
  }

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoom(prev => Math.max(0.1, Math.min(4, prev * delta)))
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(4, prev * 1.2))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(0.1, prev / 1.2))
  }

  const handleReset = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
    setIsSimulating(true)
  }

  return (
    <Card className="relative overflow-hidden">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onClick={handleCanvasClick}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="cursor-grab active:cursor-grabbing"
        style={{ display: 'block' }}
      />
      
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Badge variant="secondary" className="shadow-lg">
          Zoom: {zoom.toFixed(1)}x
        </Badge>
        <Badge variant={isSimulating ? "default" : "outline"} className="shadow-lg">
          {isSimulating ? 'Simulating...' : 'Static'}
        </Badge>
      </div>

      <div className="absolute bottom-4 right-4 flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm" variant="secondary" onClick={handleZoomIn}>
              <ArrowsOut size={16} weight="duotone" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom In</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm" variant="secondary" onClick={handleZoomOut}>
              <ArrowsIn size={16} weight="duotone" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom Out</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm" variant="secondary" onClick={handleReset}>
              <ArrowsClockwise size={16} weight="duotone" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reset View</TooltipContent>
        </Tooltip>
      </div>
    </Card>
  )
}
