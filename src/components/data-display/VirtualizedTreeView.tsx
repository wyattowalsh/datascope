import { memo, useMemo, useCallback, useState, useRef, useEffect } from 'react'
import { TreeNode, getPathString } from '@/lib/parser'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CaretRight, CaretDown, Copy } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface VirtualizedTreeViewProps {
  tree: TreeNode
  height: number
  onSelect?: (path: string[]) => void
  selectedPath?: string[]
  searchResults?: Set<string>
}

interface FlatNode {
  node: TreeNode
  depth: number
  path: string[]
  isVisible: boolean
}

const ROW_HEIGHT = 32
const OVERSCAN_COUNT = 5

function flattenTree(
  node: TreeNode,
  expandedPaths: Set<string>,
  depth = 0,
  result: FlatNode[] = []
): FlatNode[] {
  const pathStr = getPathString(node.path)
  const isExpanded = expandedPaths.has(pathStr)
  
  result.push({
    node,
    depth,
    path: node.path,
    isVisible: true
  })

  if (isExpanded && node.children && node.children.length > 0) {
    for (const child of node.children) {
      flattenTree(child, expandedPaths, depth + 1, result)
    }
  }

  return result
}

function TreeNodeRow({
  flatNode,
  isSelected,
  isMatched,
  onToggle,
  onSelect,
  onCopy,
  style
}: {
  flatNode: FlatNode
  isSelected: boolean
  isMatched: boolean
  onToggle: () => void
  onSelect: () => void
  onCopy: () => void
  style: React.CSSProperties
}) {
  const { node, depth } = flatNode
  const hasChildren = node.children && node.children.length > 0
  const isExpandable = node.type === 'object' || node.type === 'array'

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'string': return 'text-emerald-600 dark:text-emerald-400'
      case 'number': return 'text-amber-600 dark:text-amber-400'
      case 'boolean': return 'text-purple-600 dark:text-purple-400'
      case 'null': return 'text-slate-500 dark:text-slate-400'
      case 'object': return 'text-blue-600 dark:text-blue-400'
      case 'array': return 'text-cyan-600 dark:text-cyan-400'
      default: return 'text-foreground'
    }
  }

  const renderValue = () => {
    if (node.type === 'object') {
      return (
        <span className="text-muted-foreground">
          {`{${node.children?.length || 0} ${node.children?.length === 1 ? 'property' : 'properties'}}`}
        </span>
      )
    }
    if (node.type === 'array') {
      return (
        <span className="text-muted-foreground">
          {`[${node.children?.length || 0} ${node.children?.length === 1 ? 'item' : 'items'}]`}
        </span>
      )
    }
    if (node.type === 'string') {
      return (
        <span className={getTypeColor('string')}>
          "{String(node.value)}"
        </span>
      )
    }
    if (node.type === 'null') {
      return <span className={getTypeColor('null')}>null</span>
    }
    if (node.type === 'boolean') {
      return <span className={getTypeColor('boolean')}>{String(node.value)}</span>
    }
    return <span className={getTypeColor('number')}>{String(node.value)}</span>
  }

  return (
    <div
      style={{
        ...style,
        paddingLeft: `${depth * 20 + 8}px`
      }}
      className={cn(
        'flex items-center gap-2 py-1 px-2 hover:bg-accent/50 transition-colors cursor-pointer font-mono text-sm',
        isSelected && 'bg-accent/80 border-l-2 border-primary',
        isMatched && 'bg-yellow-500/10'
      )}
      onClick={onSelect}
    >
      {isExpandable ? (
        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0"
          onClick={(e) => {
            e.stopPropagation()
            onToggle()
          }}
        >
          {hasChildren && node.isExpanded ? (
            <CaretDown className="h-3 w-3" weight="bold" />
          ) : (
            <CaretRight className="h-3 w-3" weight="bold" />
          )}
        </Button>
      ) : (
        <div className="w-5" />
      )}

      <span className="font-medium text-blue-700 dark:text-blue-300">
        {node.key}:
      </span>

      {renderValue()}

      <Badge variant="secondary" className="ml-auto text-xs">
        {node.type}
      </Badge>

      <Button
        variant="ghost"
        size="sm"
        className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation()
          onCopy()
        }}
      >
        <Copy className="h-3 w-3" />
      </Button>
    </div>
  )
}

const MemoizedTreeNodeRow = memo(TreeNodeRow)

export function VirtualizedTreeView({
  tree,
  height,
  onSelect,
  selectedPath,
  searchResults
}: VirtualizedTreeViewProps) {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(() => {
    const initial = new Set<string>()
    
    function collectExpanded(node: TreeNode) {
      if (node.isExpanded) {
        initial.add(getPathString(node.path))
      }
      if (node.children) {
        node.children.forEach(collectExpanded)
      }
    }
    
    collectExpanded(tree)
    return initial
  })

  const flatNodes = useMemo(() => {
    return flattenTree(tree, expandedPaths)
  }, [tree, expandedPaths])

  const toggleNode = useCallback((path: string[]) => {
    const pathStr = getPathString(path)
    setExpandedPaths(prev => {
      const next = new Set(prev)
      if (next.has(pathStr)) {
        next.delete(pathStr)
      } else {
        next.add(pathStr)
      }
      return next
    })
  }, [])

  const handleSelect = useCallback((path: string[]) => {
    if (onSelect) {
      onSelect(path)
    }
  }, [onSelect])

  const handleCopy = useCallback((node: TreeNode) => {
    const value = node.type === 'object' || node.type === 'array'
      ? JSON.stringify(node, null, 2)
      : String(node.value)
    
    navigator.clipboard.writeText(value)
    toast.success('Copied to clipboard')
  }, [])

  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)

  const handleScroll = useCallback((event: any) => {
    setScrollTop(event.currentTarget.scrollTop)
  }, [])

  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN_COUNT)
    const endIndex = Math.min(
      flatNodes.length,
      Math.ceil((scrollTop + height) / ROW_HEIGHT) + OVERSCAN_COUNT
    )
    return { startIndex, endIndex }
  }, [scrollTop, height, flatNodes.length])

  const visibleNodes = useMemo(() => {
    return flatNodes.slice(visibleRange.startIndex, visibleRange.endIndex)
  }, [flatNodes, visibleRange])

  const totalHeight = flatNodes.length * ROW_HEIGHT

  return (
    <div
      ref={scrollRef}
      className="border rounded-md overflow-auto"
      style={{ height }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleNodes.map((flatNode, i) => {
          const index = visibleRange.startIndex + i
          const pathStr = getPathString(flatNode.path)
          const isSelected = Boolean(selectedPath && getPathString(selectedPath) === pathStr)
          const isMatched = searchResults?.has(pathStr) || false

          return (
            <div
              key={pathStr}
              style={{
                position: 'absolute',
                top: index * ROW_HEIGHT,
                height: ROW_HEIGHT,
                width: '100%'
              }}
            >
              <MemoizedTreeNodeRow
                flatNode={flatNode}
                isSelected={isSelected}
                isMatched={isMatched}
                onToggle={() => toggleNode(flatNode.path)}
                onSelect={() => handleSelect(flatNode.path)}
                onCopy={() => handleCopy(flatNode.node)}
                style={{}}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
