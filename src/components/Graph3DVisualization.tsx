import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import { GraphData, GraphNode } from '@/lib/graph-analyzer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Slider } from '@/components/ui/slider'
import { 
  ArrowsClockwise, 
  Pause, 
  Play,
  Cube,
  Sphere,
  Sparkle
} from '@phosphor-icons/react'

interface Graph3DVisualizationProps {
  data: GraphData
  onNodeClick?: (nodeId: string) => void
  selectedNodeId?: string
}

interface Node3D extends GraphNode {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  mesh?: THREE.Mesh
}

export function Graph3DVisualization({ data, onNodeClick, selectedNodeId }: Graph3DVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const nodesRef = useRef<Node3D[]>([])
  const animationFrameRef = useRef<number | undefined>(undefined)
  const mouseRef = useRef({ x: 0, y: 0 })
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster())
  const [isAnimating, setIsAnimating] = useState(true)
  const [nodeSize, setNodeSize] = useState([3])
  const [linkOpacity, setLinkOpacity] = useState([0.4])
  const [rotationSpeed, setRotationSpeed] = useState([0.5])

  const colorMap = {
    object: new THREE.Color('rgb(102, 166, 231)'),
    array: new THREE.Color('rgb(139, 116, 249)'),
    primitive: new THREE.Color('rgb(126, 219, 194)')
  }

  const initScene = useCallback(() => {
    if (!containerRef.current) return

    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0a0f)
    scene.fog = new THREE.Fog(0x0a0a0f, 100, 500)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 150
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    rendererRef.current = renderer

    containerRef.current.appendChild(renderer.domElement)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const pointLight1 = new THREE.PointLight(0x8b74f9, 1.5, 300)
    pointLight1.position.set(50, 50, 50)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0x66a6e7, 1.5, 300)
    pointLight2.position.set(-50, -50, 50)
    scene.add(pointLight2)

    const pointLight3 = new THREE.PointLight(0x7edbc2, 1, 200)
    pointLight3.position.set(0, 0, -50)
    scene.add(pointLight3)

    const starGeometry = new THREE.BufferGeometry()
    const starPositions: number[] = []
    for (let i = 0; i < 1000; i++) {
      const x = (Math.random() - 0.5) * 800
      const y = (Math.random() - 0.5) * 800
      const z = (Math.random() - 0.5) * 800
      starPositions.push(x, y, z)
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3))
    const starMaterial = new THREE.PointsMaterial({ 
      color: 0xffffff, 
      size: 0.8,
      transparent: true,
      opacity: 0.6
    })
    const stars = new THREE.Points(starGeometry, starMaterial)
    scene.add(stars)
  }, [])

  const createNodes = useCallback(() => {
    if (!sceneRef.current || !data.nodes.length) return

    const scene = sceneRef.current
    const nodes: Node3D[] = data.nodes.map((node, index) => {
      const angle = (index / data.nodes.length) * Math.PI * 2
      const radius = 50 + node.size * 10
      
      return {
        ...node,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z: (Math.random() - 0.5) * 60,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        vz: (Math.random() - 0.5) * 0.5
      }
    })

    nodes.forEach(node => {
      const size = Math.max(2, Math.min(8, 2 + node.size)) * (nodeSize[0] / 3)
      const geometry = new THREE.SphereGeometry(size, 32, 32)
      const material = new THREE.MeshPhongMaterial({
        color: colorMap[node.type],
        emissive: colorMap[node.type],
        emissiveIntensity: 0.2,
        shininess: 100,
        transparent: true,
        opacity: 0.9
      })
      
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(node.x, node.y, node.z)
      mesh.userData = { nodeId: node.id }
      
      const glowGeometry = new THREE.SphereGeometry(size * 1.4, 32, 32)
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: colorMap[node.type],
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide
      })
      const glow = new THREE.Mesh(glowGeometry, glowMaterial)
      mesh.add(glow)
      
      node.mesh = mesh
      scene.add(mesh)
    })

    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: 0x444466,
      transparent: true,
      opacity: linkOpacity[0]
    })
    
    data.links.forEach(link => {
      const sourceNode = nodes.find(n => n.id === link.source)
      const targetNode = nodes.find(n => n.id === link.target)
      
      if (sourceNode && targetNode) {
        const points = [
          new THREE.Vector3(sourceNode.x, sourceNode.y, sourceNode.z),
          new THREE.Vector3(targetNode.x, targetNode.y, targetNode.z)
        ]
        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        const line = new THREE.Line(geometry, lineMaterial)
        scene.add(line)
      }
    })

    nodesRef.current = nodes
  }, [data, nodeSize, linkOpacity])

  const updatePhysics = useCallback(() => {
    const nodes = nodesRef.current
    if (!nodes.length) return

    nodes.forEach(node => {
      if (!node.mesh) return

      let fx = 0
      let fy = 0
      let fz = 0

      nodes.forEach(otherNode => {
        if (node === otherNode) return

        const dx = otherNode.x - node.x
        const dy = otherNode.y - node.y
        const dz = otherNode.z - node.z
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1

        const repulsion = 500 / (dist * dist)
        fx -= (dx / dist) * repulsion
        fy -= (dy / dist) * repulsion
        fz -= (dz / dist) * repulsion
      })

      data.links.forEach(link => {
        if (link.source === node.id || link.target === node.id) {
          const otherNodeId = link.source === node.id ? link.target : link.source
          const otherNode = nodes.find(n => n.id === otherNodeId)
          
          if (otherNode) {
            const dx = otherNode.x - node.x
            const dy = otherNode.y - node.y
            const dz = otherNode.z - node.z
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1

            const attraction = (dist - 40) * 0.01
            fx += (dx / dist) * attraction
            fy += (dy / dist) * attraction
            fz += (dz / dist) * attraction
          }
        }
      })

      const centerPull = 0.001
      fx -= node.x * centerPull
      fy -= node.y * centerPull
      fz -= node.z * centerPull

      node.vx = (node.vx + fx) * 0.85
      node.vy = (node.vy + fy) * 0.85
      node.vz = (node.vz + fz) * 0.85

      node.x += node.vx
      node.y += node.vy
      node.z += node.vz

      node.mesh.position.set(node.x, node.y, node.z)
    })
  }, [data])

  const animate = useCallback(() => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return

    if (isAnimating) {
      updatePhysics()
      
      if (cameraRef.current) {
        const time = Date.now() * 0.0001 * rotationSpeed[0]
        const radius = 150
        cameraRef.current.position.x = Math.sin(time) * radius
        cameraRef.current.position.z = Math.cos(time) * radius
        cameraRef.current.lookAt(0, 0, 0)
      }
    }

    nodesRef.current.forEach(node => {
      if (node.mesh) {
        node.mesh.rotation.x += 0.01
        node.mesh.rotation.y += 0.01

        const isSelected = node.id === selectedNodeId
        const material = node.mesh.material as THREE.MeshPhongMaterial
        material.emissiveIntensity = isSelected ? 0.6 : 0.2
        
        const targetScale = isSelected ? 1.3 : 1
        node.mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
      }
    })

    rendererRef.current.render(sceneRef.current, cameraRef.current)
    animationFrameRef.current = requestAnimationFrame(animate)
  }, [isAnimating, updatePhysics, selectedNodeId, rotationSpeed])

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  }, [])

  const handleClick = useCallback((event: MouseEvent) => {
    if (!containerRef.current || !cameraRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    raycasterRef.current.setFromCamera({ x, y }, cameraRef.current)

    const meshes = nodesRef.current.map(n => n.mesh).filter(Boolean) as THREE.Mesh[]
    const intersects = raycasterRef.current.intersectObjects(meshes)

    if (intersects.length > 0) {
      const nodeId = intersects[0].object.userData.nodeId
      onNodeClick?.(nodeId)
    }
  }, [onNodeClick])

  useEffect(() => {
    initScene()
    createNodes()

    const container = containerRef.current
    if (container) {
      container.addEventListener('mousemove', handleMouseMove)
      container.addEventListener('click', handleClick)
    }

    animate()

    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return
      
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      
      cameraRef.current.aspect = width / height
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove)
        container.removeEventListener('click', handleClick)
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose()
            if (object.material instanceof THREE.Material) {
              object.material.dispose()
            }
          }
        })
      }
    }
  }, [])

  useEffect(() => {
    if (sceneRef.current) {
      while (sceneRef.current.children.length > 0) {
        const child = sceneRef.current.children[0]
        sceneRef.current.remove(child)
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose()
          if (child.material instanceof THREE.Material) {
            child.material.dispose()
          }
        }
      }
      
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
      sceneRef.current.add(ambientLight)

      const pointLight1 = new THREE.PointLight(0x8b74f9, 1.5, 300)
      pointLight1.position.set(50, 50, 50)
      sceneRef.current.add(pointLight1)

      const pointLight2 = new THREE.PointLight(0x66a6e7, 1.5, 300)
      pointLight2.position.set(-50, -50, 50)
      sceneRef.current.add(pointLight2)

      const pointLight3 = new THREE.PointLight(0x7edbc2, 1, 200)
      pointLight3.position.set(0, 0, -50)
      sceneRef.current.add(pointLight3)

      const starGeometry = new THREE.BufferGeometry()
      const starPositions: number[] = []
      for (let i = 0; i < 1000; i++) {
        const x = (Math.random() - 0.5) * 800
        const y = (Math.random() - 0.5) * 800
        const z = (Math.random() - 0.5) * 800
        starPositions.push(x, y, z)
      }
      starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3))
      const starMaterial = new THREE.PointsMaterial({ 
        color: 0xffffff, 
        size: 0.8,
        transparent: true,
        opacity: 0.6
      })
      const stars = new THREE.Points(starGeometry, starMaterial)
      sceneRef.current.add(stars)

      createNodes()
    }
  }, [data, nodeSize, linkOpacity, createNodes])

  const handleReset = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0, 150)
      cameraRef.current.lookAt(0, 0, 0)
    }
  }

  return (
    <TooltipProvider>
      <Card className="p-4 space-y-4 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-xl border-border/50 shadow-2xl">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 shadow-lg">
              <Cube size={20} weight="duotone" className="text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                3D Graph Visualization
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Interactive force-directed 3D network
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 items-center flex-wrap">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setIsAnimating(!isAnimating)}
                  className="h-9 w-9 p-0 rounded-xl hover:scale-105 transition-all duration-200 hover:border-primary/50 hover:bg-primary/10"
                >
                  {isAnimating ? <Pause size={16} weight="duotone" /> : <Play size={16} weight="duotone" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isAnimating ? 'Pause' : 'Play'} animation</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleReset}
                  className="h-9 w-9 p-0 rounded-xl hover:scale-105 transition-all duration-200 hover:border-primary/50 hover:bg-primary/10"
                >
                  <ArrowsClockwise size={16} weight="duotone" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset camera</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Sphere size={14} weight="duotone" />
                Node Size
              </label>
              <span className="text-xs font-mono text-foreground/70">{nodeSize[0].toFixed(1)}</span>
            </div>
            <Slider
              value={nodeSize}
              onValueChange={setNodeSize}
              min={1}
              max={6}
              step={0.5}
              className="cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Sparkle size={14} weight="duotone" />
                Link Opacity
              </label>
              <span className="text-xs font-mono text-foreground/70">{linkOpacity[0].toFixed(1)}</span>
            </div>
            <Slider
              value={linkOpacity}
              onValueChange={setLinkOpacity}
              min={0.1}
              max={1}
              step={0.1}
              className="cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <ArrowsClockwise size={14} weight="duotone" />
                Rotation
              </label>
              <span className="text-xs font-mono text-foreground/70">{rotationSpeed[0].toFixed(1)}</span>
            </div>
            <Slider
              value={rotationSpeed}
              onValueChange={setRotationSpeed}
              min={0}
              max={2}
              step={0.1}
              className="cursor-pointer"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-accent/10 text-[rgb(102,166,231)] border-[rgb(102,166,231)]/20">
            <span className="w-2 h-2 rounded-full bg-[rgb(102,166,231)] mr-1.5" />
            Objects
          </Badge>
          <Badge variant="outline" className="bg-primary/10 text-[rgb(139,116,249)] border-[rgb(139,116,249)]/20">
            <span className="w-2 h-2 rounded-full bg-[rgb(139,116,249)] mr-1.5" />
            Arrays
          </Badge>
          <Badge variant="outline" className="bg-syntax-string/10 text-[rgb(126,219,194)] border-[rgb(126,219,194)]/20">
            <span className="w-2 h-2 rounded-full bg-[rgb(126,219,194)] mr-1.5" />
            Values
          </Badge>
        </div>

        <div
          ref={containerRef}
          className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#0a0a0f] to-[#12121a] shadow-2xl shadow-primary/20 ring-1 ring-border/50"
          style={{ height: '500px' }}
        >
          <div className="absolute top-3 left-3 px-3 py-2 bg-background/90 backdrop-blur-md border border-border/50 rounded-xl text-xs font-medium shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-muted-foreground">
                {isAnimating ? 'Simulating physics...' : 'Paused'}
              </span>
            </div>
          </div>
          
          <div className="absolute bottom-3 left-3 px-3 py-2 bg-background/90 backdrop-blur-md border border-border/50 rounded-xl text-xs space-y-1 shadow-lg">
            <div className="text-muted-foreground font-medium">Controls:</div>
            <div className="text-foreground/80">• Click nodes to select</div>
            <div className="text-foreground/80">• Auto-rotating camera</div>
            <div className="text-foreground/80">• Physics-based layout</div>
          </div>
        </div>
      </Card>
    </TooltipProvider>
  )
}
