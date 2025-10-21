import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Lightning,
  Copy,
  Download,
  TextAlignLeft,
  Minus,
  MagnifyingGlass,
  ArrowsClockwise,
  CheckCircle,
  Sparkle
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface QuickActionsPanelProps {
  onFormat: () => void
  onMinify: () => void
  onExport: () => void
  onValidate: () => void
  onCopyAll: () => void
  hasData: boolean
}

export function QuickActionsPanel({
  onFormat,
  onMinify,
  onExport,
  onValidate,
  onCopyAll,
  hasData
}: QuickActionsPanelProps) {
  const [actionHistory, setActionHistory] = useState<string[]>([])

  const handleAction = (action: string, callback: () => void) => {
    callback()
    setActionHistory(prev => [action, ...prev.slice(0, 4)])
  }

  const actions = [
    {
      id: 'format',
      label: 'Prettify',
      icon: TextAlignLeft,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      hoverColor: 'hover:bg-primary/20',
      onClick: () => handleAction('Formatted', onFormat),
      disabled: !hasData,
      tooltip: 'Format and prettify data'
    },
    {
      id: 'minify',
      label: 'Minify',
      icon: Minus,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      hoverColor: 'hover:bg-accent/20',
      onClick: () => handleAction('Minified', onMinify),
      disabled: !hasData,
      tooltip: 'Compress data to minimal format'
    },
    {
      id: 'validate',
      label: 'Validate',
      icon: CheckCircle,
      color: 'text-syntax-string',
      bgColor: 'bg-syntax-string/10',
      hoverColor: 'hover:bg-syntax-string/20',
      onClick: () => handleAction('Validated', onValidate),
      disabled: !hasData,
      tooltip: 'Check data structure and types'
    },
    {
      id: 'copy',
      label: 'Copy All',
      icon: Copy,
      color: 'text-syntax-number',
      bgColor: 'bg-syntax-number/10',
      hoverColor: 'hover:bg-syntax-number/20',
      onClick: () => handleAction('Copied', onCopyAll),
      disabled: !hasData,
      tooltip: 'Copy entire data to clipboard'
    },
    {
      id: 'export',
      label: 'Export',
      icon: Download,
      color: 'text-syntax-boolean',
      bgColor: 'bg-syntax-boolean/10',
      hoverColor: 'hover:bg-syntax-boolean/20',
      onClick: () => handleAction('Exported', onExport),
      disabled: !hasData,
      tooltip: 'Download in various formats'
    }
  ]

  return (
    <Card className="p-5 space-y-4 shadow-xl border-border/50 bg-card/60 backdrop-blur-sm group hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
          <Lightning size={18} weight="duotone" className="text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground">Quick Actions</h3>
          <p className="text-xs text-muted-foreground">One-click operations</p>
        </div>
        <Sparkle size={16} weight="duotone" className="text-primary/50 animate-pulse" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <Tooltip key={action.id}>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={action.onClick}
                disabled={action.disabled}
                className={`h-auto py-3 flex-col gap-2 ${action.bgColor} ${action.hoverColor} border-border/50 hover:border-primary/30 transition-all duration-200 hover:scale-105 disabled:hover:scale-100 group/btn`}
              >
                <action.icon size={20} weight="duotone" className={`${action.color} group-hover/btn:scale-110 transition-transform`} />
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="font-medium">
              <p>{action.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      {actionHistory.length > 0 && (
        <div className="pt-3 border-t border-border/30">
          <div className="flex items-center gap-2 mb-2">
            <ArrowsClockwise size={12} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">Recent Actions</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {actionHistory.map((action, idx) => (
              <Badge
                key={`${action}-${idx}`}
                variant="secondary"
                className="text-xs px-2 py-0.5 bg-muted/50"
              >
                {action}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
