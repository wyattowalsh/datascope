import { useState } from 'react'
import { CaretRight, CaretDown, Copy, Check } from '@phosphor-icons/react'
import { TreeNode, getPathString, ValueType } from '@/lib/parser'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface TreeViewProps {
  nodes: TreeNode[]
  onNodeUpdate?: (path: string[], isExpanded: boolean) => void
  selectedPath?: string[]
  onSelectNode?: (path: string[]) => void
}

export function TreeView({ nodes, onNodeUpdate, selectedPath, onSelectNode }: TreeViewProps) {
  return (
    <div className="font-mono text-[13px]">
      {nodes.map((node, index) => (
        <TreeNodeView
          key={`${node.path.join('.')}-${index}`}
          node={node}
          depth={0}
          onNodeUpdate={onNodeUpdate}
          selectedPath={selectedPath}
          onSelectNode={onSelectNode}
        />
      ))}
    </div>
  )
}

interface TreeNodeViewProps {
  node: TreeNode
  depth: number
  onNodeUpdate?: (path: string[], isExpanded: boolean) => void
  selectedPath?: string[]
  onSelectNode?: (path: string[]) => void
}

function TreeNodeView({ node, depth, onNodeUpdate, selectedPath, onSelectNode }: TreeNodeViewProps) {
  const [copiedPath, setCopiedPath] = useState(false)
  const hasChildren = node.children && node.children.length > 0
  const isSelected = selectedPath && JSON.stringify(selectedPath) === JSON.stringify(node.path)

  const handleToggle = () => {
    if (hasChildren && onNodeUpdate) {
      onNodeUpdate(node.path, !node.isExpanded)
    }
  }

  const handleCopyPath = (e: React.MouseEvent) => {
    e.stopPropagation()
    const pathStr = getPathString(node.path, 'dot')
    navigator.clipboard.writeText(pathStr)
    setCopiedPath(true)
    toast.success('Path copied to clipboard')
    setTimeout(() => setCopiedPath(false), 2000)
  }

  const handleSelect = () => {
    if (onSelectNode) {
      onSelectNode(node.path)
    }
  }

  return (
    <div>
      <div
        className={cn(
          "group flex items-start gap-2 py-1 px-2 hover:bg-muted/50 rounded transition-colors cursor-pointer",
          isSelected && "bg-accent/10 border-l-2 border-accent"
        )}
        style={{ paddingLeft: `${depth * 24 + 8}px` }}
        onClick={handleSelect}
      >
        <div className="flex items-center gap-1 min-w-0 flex-1">
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleToggle()
              }}
              className="flex-shrink-0 p-0.5 hover:bg-muted rounded transition-colors"
            >
              {node.isExpanded ? (
                <CaretDown size={16} weight="bold" className="text-syntax-bracket" />
              ) : (
                <CaretRight size={16} weight="bold" className="text-syntax-bracket" />
              )}
            </button>
          ) : (
            <div className="w-[24px] flex-shrink-0" />
          )}

          <span className="text-syntax-key font-medium flex-shrink-0">
            {node.key}
          </span>
          
          <span className="text-syntax-bracket flex-shrink-0">:</span>

          <TypeBadge type={node.type} />

          <ValuePreview node={node} />
        </div>

        <Button
          size="icon"
          variant="ghost"
          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 flex-shrink-0"
          onClick={handleCopyPath}
        >
          {copiedPath ? (
            <Check size={14} className="text-syntax-string" />
          ) : (
            <Copy size={14} />
          )}
        </Button>
      </div>

      {hasChildren && node.isExpanded && node.children && (
        <div>
          {node.children.map((child, index) => (
            <TreeNodeView
              key={`${child.path.join('.')}-${index}`}
              node={child}
              depth={depth + 1}
              onNodeUpdate={onNodeUpdate}
              selectedPath={selectedPath}
              onSelectNode={onSelectNode}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function TypeBadge({ type }: { type: ValueType }) {
  const colorMap: Record<ValueType, string> = {
    string: 'bg-syntax-string/10 text-syntax-string border-syntax-string/20',
    number: 'bg-syntax-number/10 text-syntax-number border-syntax-number/20',
    boolean: 'bg-syntax-boolean/10 text-syntax-boolean border-syntax-boolean/20',
    null: 'bg-syntax-null/10 text-syntax-null border-syntax-null/20',
    array: 'bg-primary/10 text-primary border-primary/20',
    object: 'bg-accent/10 text-accent border-accent/20'
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[10px] h-4 px-1.5 font-medium flex-shrink-0",
        colorMap[type]
      )}
    >
      {type}
    </Badge>
  )
}

function ValuePreview({ node }: { node: TreeNode }) {
  const colorMap: Record<ValueType, string> = {
    string: 'text-syntax-string',
    number: 'text-syntax-number',
    boolean: 'text-syntax-boolean',
    null: 'text-syntax-null',
    array: 'text-syntax-bracket',
    object: 'text-syntax-bracket'
  }

  if (node.type === 'object') {
    const count = node.children?.length || 0
    return (
      <span className={cn("text-xs truncate", colorMap[node.type])}>
        {'{ '}
        {count} {count === 1 ? 'property' : 'properties'}
        {' }'}
      </span>
    )
  }

  if (node.type === 'array') {
    const count = node.children?.length || 0
    return (
      <span className={cn("text-xs truncate", colorMap[node.type])}>
        {'[ '}
        {count} {count === 1 ? 'item' : 'items'}
        {' ]'}
      </span>
    )
  }

  if (node.type === 'string') {
    const preview = node.value.length > 50 ? node.value.substring(0, 50) + '...' : node.value
    return (
      <span className={cn("truncate", colorMap[node.type])}>
        "{preview}"
      </span>
    )
  }

  if (node.type === 'null') {
    return (
      <span className={cn(colorMap[node.type])}>
        null
      </span>
    )
  }

  return (
    <span className={cn("truncate", colorMap[node.type])}>
      {String(node.value)}
    </span>
  )
}
