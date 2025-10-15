import { useState } from 'react'
import { CaretRight, CaretDown, Copy, Check } from '@phosphor-icons/react'
import { TreeNode, getPathString, ValueType } from '@/lib/parser'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { toast } from 'sonner'

interface TreeViewProps {
  nodes: TreeNode[]
  onNodeUpdate?: (path: string[], isExpanded: boolean) => void
  selectedPath?: string[]
  onSelectNode?: (path: string[]) => void
}

export function TreeView({ nodes, onNodeUpdate, selectedPath, onSelectNode }: TreeViewProps) {
  return (
    <TooltipProvider>
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
    </TooltipProvider>
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
    toast.success('Path copied')
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
          "group flex items-start gap-2 py-2 px-3 hover:bg-muted/60 rounded-lg transition-all duration-150 cursor-pointer min-h-[44px] md:min-h-0 border border-transparent hover:border-border/40",
          isSelected && "bg-accent/15 border-l-[3px] border-l-accent shadow-sm"
        )}
        style={{ paddingLeft: `${depth * (window.innerWidth < 768 ? 16 : 24) + 12}px` }}
        onClick={handleSelect}
      >
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          {hasChildren ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleToggle()
                  }}
                  className="flex-shrink-0 p-1 hover:bg-muted/70 rounded-md transition-all duration-150 touch-manipulation hover:scale-110"
                >
                  {node.isExpanded ? (
                    <CaretDown size={16} weight="bold" className="text-syntax-bracket transition-transform duration-200" />
                  ) : (
                    <CaretRight size={16} weight="bold" className="text-syntax-bracket transition-transform duration-200" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{node.isExpanded ? 'Collapse' : 'Expand'}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <div className="w-[24px] flex-shrink-0" />
          )}

          <span className="text-syntax-key font-medium flex-shrink-0 break-all">
            {node.key}
          </span>
          
          <span className="text-syntax-bracket flex-shrink-0">:</span>

          <TypeBadge type={node.type} />

          <ValuePreview node={node} />
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="opacity-0 group-hover:opacity-100 transition-all duration-200 h-8 w-8 md:h-7 md:w-7 flex-shrink-0 touch-manipulation hover:bg-primary/10 hover:text-primary"
              onClick={handleCopyPath}
            >
              {copiedPath ? (
                <Check size={14} className="text-syntax-string" weight="bold" />
              ) : (
                <Copy size={14} />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Copy path</p>
          </TooltipContent>
        </Tooltip>
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
    string: 'bg-syntax-string/15 text-syntax-string border-syntax-string/30 shadow-sm',
    number: 'bg-syntax-number/15 text-syntax-number border-syntax-number/30 shadow-sm',
    boolean: 'bg-syntax-boolean/15 text-syntax-boolean border-syntax-boolean/30 shadow-sm',
    null: 'bg-syntax-null/15 text-syntax-null border-syntax-null/30 shadow-sm',
    array: 'bg-primary/15 text-primary border-primary/30 shadow-sm',
    object: 'bg-accent/15 text-accent border-accent/30 shadow-sm'
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[10px] h-5 px-2 font-semibold flex-shrink-0 transition-all duration-150",
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
      <span className={cn("truncate break-all", colorMap[node.type])}>
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
    <span className={cn("truncate break-all", colorMap[node.type])}>
      {String(node.value)}
    </span>
  )
}
