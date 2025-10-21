import { useEffect, useRef, useState, useCallback, memo } from 'react'
import { TreeNode } from '@/lib/parser'
import { cn } from '@/lib/utils'
import { CaretRight, CaretDown } from '@phosphor-icons/react'

interface VirtualizedTreeProps {
  nodes: TreeNode[]
  onNodeUpdate: (path: string[], isExpanded: boolean) => void
  selectedPath: string[]
  onSelectNode: (path: string[]) => void
  height?: number
}

interface FlatNode extends TreeNode {
  level: number
  index: number
}

const ITEM_HEIGHT = 28
const OVERSCAN = 5

function flattenNodes(nodes: TreeNode[], level = 0, result: FlatNode[] = []): FlatNode[] {
  nodes.forEach((node, index) => {
    result.push({ ...node, level, index })
    if (node.isExpanded && node.children && node.children.length > 0) {
      flattenNodes(node.children, level + 1, result)
    }
  })
  return result
}

const TreeNodeItem = memo(({ 
  node, 
  isSelected, 
  onToggle, 
  onSelect 
}: { 
  node: FlatNode
  isSelected: boolean
  onToggle: () => void
  onSelect: () => void
}) => {
  const hasChildren = node.children && node.children.length > 0
  
  const getValueColor = (type: string) => {
    switch (type) {
      case 'string': return 'text-syntax-string'
      case 'number': return 'text-syntax-number'
      case 'boolean': return 'text-syntax-boolean'
      case 'null': return 'text-syntax-null'
      default: return 'text-foreground'
    }
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 py-1 px-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors group',
        isSelected && 'bg-primary/10 ring-1 ring-primary/30'
      )}
      style={{ paddingLeft: `${node.level * 20 + 8}px` }}
      onClick={onSelect}
    >
      {hasChildren ? (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggle()
          }}
          className="flex-shrink-0 p-0.5 hover:bg-muted rounded transition-colors"
        >
          {node.isExpanded ? (
            <CaretDown size={14} weight="bold" className="text-muted-foreground" />
          ) : (
            <CaretRight size={14} weight="bold" className="text-muted-foreground" />
          )}
        </button>
      ) : (
        <span className="w-5" />
      )}
      
      <span className="text-xs font-mono text-syntax-key font-medium">
        {node.key}
      </span>
      
      {node.type !== 'object' && node.type !== 'array' && (
        <>
          <span className="text-xs text-muted-foreground">:</span>
          <span className={cn('text-xs font-mono flex-1 truncate', getValueColor(node.type))}>
            {node.type === 'string' ? `"${node.value}"` : String(node.value)}
          </span>
        </>
      )}
      
      {(node.type === 'object' || node.type === 'array') && (
        <span className="text-xs text-syntax-bracket">
          {node.type === 'object' ? '{ }' : '[ ]'}
        </span>
      )}
      
      {node.children && node.children.length > 0 && (
        <span className="text-xs text-muted-foreground/60 ml-auto">
          {node.children.length}
        </span>
      )}
    </div>
  )
})

TreeNodeItem.displayName = 'TreeNodeItem'

export function VirtualizedTree({
  nodes,
  onNodeUpdate,
  selectedPath,
  onSelectNode,
  height = 500
}: VirtualizedTreeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const flatNodes = flattenNodes(nodes)

  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - OVERSCAN)
  const endIndex = Math.min(
    flatNodes.length,
    Math.ceil((scrollTop + height) / ITEM_HEIGHT) + OVERSCAN
  )

  const visibleNodes = flatNodes.slice(startIndex, endIndex)
  const totalHeight = flatNodes.length * ITEM_HEIGHT
  const offsetY = startIndex * ITEM_HEIGHT

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  const handleToggle = useCallback((node: FlatNode) => {
    onNodeUpdate(node.path, !node.isExpanded)
  }, [onNodeUpdate])

  const handleSelect = useCallback((node: FlatNode) => {
    onSelectNode(node.path)
  }, [onSelectNode])

  const isSelected = useCallback((node: FlatNode) => {
    return JSON.stringify(node.path) === JSON.stringify(selectedPath)
  }, [selectedPath])

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="overflow-auto"
      style={{ height: `${height}px` }}
    >
      <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleNodes.map((node) => (
            <TreeNodeItem
              key={`${node.path.join('.')}-${node.index}`}
              node={node}
              isSelected={isSelected(node)}
              onToggle={() => handleToggle(node)}
              onSelect={() => handleSelect(node)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
