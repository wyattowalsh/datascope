import { useState, useEffect } from 'react'
import { Keyboard, X } from '@phosphor-icons/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ShortcutsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const shortcuts = [
  {
    category: 'General',
    items: [
      { keys: ['Ctrl', 'K'], description: 'Focus search' },
      { keys: ['Ctrl', 'P'], description: 'Parse data' },
      { keys: ['Ctrl', 'E'], description: 'Export data' },
      { keys: ['Ctrl', 'T'], description: 'Toggle theme' },
      { keys: ['?'], description: 'Show shortcuts' },
    ]
  },
  {
    category: 'Navigation',
    items: [
      { keys: ['Ctrl', '1'], description: 'Switch to tree view' },
      { keys: ['Ctrl', '2'], description: 'Switch to graph view' },
      { keys: ['Tab'], description: 'Next format' },
      { keys: ['Shift', 'Tab'], description: 'Previous format' },
    ]
  },
  {
    category: 'Tree View',
    items: [
      { keys: ['E'], description: 'Expand all nodes' },
      { keys: ['C'], description: 'Collapse all nodes' },
      { keys: ['Ctrl', 'C'], description: 'Copy selected path' },
    ]
  },
  {
    category: 'Editing',
    items: [
      { keys: ['Ctrl', 'F'], description: 'Format data' },
      { keys: ['Ctrl', 'M'], description: 'Minify data' },
      { keys: ['Ctrl', 'S'], description: 'Save/Export' },
    ]
  }
]

export function ShortcutsDialog({ open, onOpenChange }: ShortcutsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl rounded-2xl shadow-2xl border-border/50 max-h-[80vh]">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Keyboard size={24} weight="duotone" className="text-primary" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6">
            {shortcuts.map((section, i) => (
              <div key={i} className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  {section.category}
                </h3>
                <div className="space-y-2">
                  {section.items.map((item, j) => (
                    <div
                      key={j}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <span className="text-sm">{item.description}</span>
                      <div className="flex gap-1">
                        {item.keys.map((key, k) => (
                          <Badge
                            key={k}
                            variant="secondary"
                            className="rounded-md font-mono text-xs px-2 py-1 bg-background border border-border/50"
                          >
                            {key}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex justify-end pt-2 border-t border-border/50">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-lg"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function useKeyboardShortcuts(handlers: Record<string, () => void>) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      const ctrl = e.ctrlKey || e.metaKey
      const shift = e.shiftKey
      
      if ((e.target as HTMLElement).tagName === 'TEXTAREA' || (e.target as HTMLElement).tagName === 'INPUT') {
        return
      }

      if (ctrl && key === 'k') {
        e.preventDefault()
        handlers.focusSearch?.()
      } else if (ctrl && key === 'p') {
        e.preventDefault()
        handlers.parseData?.()
      } else if (ctrl && key === 'e') {
        e.preventDefault()
        handlers.exportData?.()
      } else if (ctrl && key === 't') {
        e.preventDefault()
        handlers.toggleTheme?.()
      } else if (key === '?') {
        e.preventDefault()
        handlers.showShortcuts?.()
      } else if (ctrl && key === '1') {
        e.preventDefault()
        handlers.switchToTree?.()
      } else if (ctrl && key === '2') {
        e.preventDefault()
        handlers.switchToGraph?.()
      } else if (key === 'e' && !ctrl) {
        e.preventDefault()
        handlers.expandAll?.()
      } else if (key === 'c' && !ctrl) {
        e.preventDefault()
        handlers.collapseAll?.()
      } else if (ctrl && key === 'f') {
        e.preventDefault()
        handlers.formatData?.()
      } else if (ctrl && key === 'm') {
        e.preventDefault()
        handlers.minifyData?.()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handlers])
}
