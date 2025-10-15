export interface GraphNode {
  id: string
  label: string
  type: 'object' | 'array' | 'primitive'
  value?: any
  depth: number
  size: number
  x?: number
  y?: number
  vx?: number
  vy?: number
}

export interface GraphLink {
  source: string
  target: string
  label?: string
  type: 'property' | 'element'
}

export interface GraphData {
  nodes: GraphNode[]
  links: GraphLink[]
}

export interface GraphAnalytics {
  totalNodes: number
  totalEdges: number
  averageDegree: number
  maxDepth: number
  nodesByDepth: Record<number, number>
  nodesByType: Record<string, number>
  largestComponent: number
  density: number
  diameter: number
  averagePath: number
  leafNodes: number
  branchingFactor: number
  clusteringCoefficient: number
  centrality: Record<string, number>
}

export function buildGraph(data: any, parentId = 'root', parentLabel = 'root', depth = 0): GraphData {
  const nodes: GraphNode[] = []
  const links: GraphLink[] = []
  
  if (data === null || data === undefined) {
    nodes.push({
      id: parentId,
      label: parentLabel,
      type: 'primitive',
      value: data,
      depth,
      size: 1
    })
    return { nodes, links }
  }

  if (typeof data === 'object') {
    if (Array.isArray(data)) {
      nodes.push({
        id: parentId,
        label: parentLabel,
        type: 'array',
        depth,
        size: data.length
      })
      
      data.forEach((item, index) => {
        const childId = `${parentId}.${index}`
        const childGraph = buildGraph(item, childId, `[${index}]`, depth + 1)
        
        nodes.push(...childGraph.nodes)
        links.push({
          source: parentId,
          target: childId,
          label: index.toString(),
          type: 'element'
        })
        links.push(...childGraph.links)
      })
    } else {
      const keys = Object.keys(data)
      nodes.push({
        id: parentId,
        label: parentLabel,
        type: 'object',
        depth,
        size: keys.length
      })
      
      keys.forEach(key => {
        const childId = `${parentId}.${key}`
        const childGraph = buildGraph(data[key], childId, key, depth + 1)
        
        nodes.push(...childGraph.nodes)
        links.push({
          source: parentId,
          target: childId,
          label: key,
          type: 'property'
        })
        links.push(...childGraph.links)
      })
    }
  } else {
    nodes.push({
      id: parentId,
      label: parentLabel,
      type: 'primitive',
      value: data,
      depth,
      size: 1
    })
  }
  
  return { nodes, links }
}

export function analyzeGraph(graph: GraphData): GraphAnalytics {
  const { nodes, links } = graph
  const totalNodes = nodes.length
  const totalEdges = links.length
  
  const adjacencyMap = new Map<string, Set<string>>()
  nodes.forEach(node => adjacencyMap.set(node.id, new Set()))
  
  links.forEach(link => {
    adjacencyMap.get(link.source)?.add(link.target)
    adjacencyMap.get(link.target)?.add(link.source)
  })
  
  const degrees = Array.from(adjacencyMap.values()).map(set => set.size)
  const averageDegree = degrees.length > 0 ? degrees.reduce((a, b) => a + b, 0) / degrees.length : 0
  
  const maxDepth = Math.max(...nodes.map(n => n.depth), 0)
  
  const nodesByDepth: Record<number, number> = {}
  nodes.forEach(node => {
    nodesByDepth[node.depth] = (nodesByDepth[node.depth] || 0) + 1
  })
  
  const nodesByType: Record<string, number> = {}
  nodes.forEach(node => {
    nodesByType[node.type] = (nodesByType[node.type] || 0) + 1
  })
  
  const largestComponent = findLargestComponent(adjacencyMap)
  
  const density = totalNodes > 1 
    ? (2 * totalEdges) / (totalNodes * (totalNodes - 1))
    : 0
  
  const { diameter, averagePath } = calculatePathMetrics(adjacencyMap)
  
  const leafNodes = nodes.filter(node => {
    const children = links.filter(l => l.source === node.id)
    return children.length === 0 && node.type === 'primitive'
  }).length
  
  const nonLeafNodes = nodes.filter(node => node.type !== 'primitive')
  const totalChildren = links.length
  const branchingFactor = nonLeafNodes.length > 0 ? totalChildren / nonLeafNodes.length : 0
  
  const clusteringCoefficient = calculateClusteringCoefficient(adjacencyMap)
  
  const centrality = calculateDegreeCentrality(adjacencyMap, totalNodes)
  
  return {
    totalNodes,
    totalEdges,
    averageDegree,
    maxDepth,
    nodesByDepth,
    nodesByType,
    largestComponent,
    density,
    diameter,
    averagePath,
    leafNodes,
    branchingFactor,
    clusteringCoefficient,
    centrality
  }
}

function findLargestComponent(adjacencyMap: Map<string, Set<string>>): number {
  const visited = new Set<string>()
  let maxSize = 0
  
  const dfs = (nodeId: string): number => {
    if (visited.has(nodeId)) return 0
    visited.add(nodeId)
    
    let size = 1
    const neighbors = adjacencyMap.get(nodeId) || new Set()
    neighbors.forEach(neighbor => {
      size += dfs(neighbor)
    })
    return size
  }
  
  adjacencyMap.forEach((_, nodeId) => {
    if (!visited.has(nodeId)) {
      const componentSize = dfs(nodeId)
      maxSize = Math.max(maxSize, componentSize)
    }
  })
  
  return maxSize
}

function calculatePathMetrics(adjacencyMap: Map<string, Set<string>>): { diameter: number, averagePath: number } {
  const nodes = Array.from(adjacencyMap.keys())
  let maxDistance = 0
  let totalDistance = 0
  let pathCount = 0
  
  const bfs = (start: string): Map<string, number> => {
    const distances = new Map<string, number>()
    const queue = [start]
    distances.set(start, 0)
    
    while (queue.length > 0) {
      const current = queue.shift()!
      const currentDist = distances.get(current)!
      
      const neighbors = adjacencyMap.get(current) || new Set()
      neighbors.forEach(neighbor => {
        if (!distances.has(neighbor)) {
          distances.set(neighbor, currentDist + 1)
          queue.push(neighbor)
        }
      })
    }
    
    return distances
  }
  
  nodes.forEach(node => {
    const distances = bfs(node)
    distances.forEach((dist, target) => {
      if (target !== node) {
        maxDistance = Math.max(maxDistance, dist)
        totalDistance += dist
        pathCount++
      }
    })
  })
  
  return {
    diameter: maxDistance,
    averagePath: pathCount > 0 ? totalDistance / pathCount : 0
  }
}

function calculateClusteringCoefficient(adjacencyMap: Map<string, Set<string>>): number {
  let totalCoefficient = 0
  let nodeCount = 0
  
  adjacencyMap.forEach((neighbors, nodeId) => {
    const degree = neighbors.size
    if (degree < 2) return
    
    let triangles = 0
    const neighborArray = Array.from(neighbors)
    
    for (let i = 0; i < neighborArray.length; i++) {
      for (let j = i + 1; j < neighborArray.length; j++) {
        const neighbor1 = neighborArray[i]
        const neighbor2 = neighborArray[j]
        
        if (adjacencyMap.get(neighbor1)?.has(neighbor2)) {
          triangles++
        }
      }
    }
    
    const possibleTriangles = (degree * (degree - 1)) / 2
    const coefficient = possibleTriangles > 0 ? triangles / possibleTriangles : 0
    
    totalCoefficient += coefficient
    nodeCount++
  })
  
  return nodeCount > 0 ? totalCoefficient / nodeCount : 0
}

function calculateDegreeCentrality(adjacencyMap: Map<string, Set<string>>, totalNodes: number): Record<string, number> {
  const centrality: Record<string, number> = {}
  
  adjacencyMap.forEach((neighbors, nodeId) => {
    centrality[nodeId] = totalNodes > 1 ? neighbors.size / (totalNodes - 1) : 0
  })
  
  return centrality
}
