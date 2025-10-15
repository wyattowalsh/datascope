import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Warning, X } from '@phosphor-icons/react'
import { LintError } from '@/lib/formatter'
import { cn } from '@/lib/utils'

interface LintErrorsDisplayProps {
  errors: LintError[]
  onClose?: () => void
}

export function LintErrorsDisplay({ errors, onClose }: LintErrorsDisplayProps) {
  if (errors.length === 0) return null

  const errorCount = errors.filter(e => e.type === 'error').length
  const warningCount = errors.filter(e => e.type === 'warning').length

  return (
    <Alert variant={errorCount > 0 ? 'destructive' : 'default'} className="relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-2 top-2 p-1 rounded-sm hover:bg-background/20 transition-colors"
        >
          <X size={16} />
        </button>
      )}
      
      <div className="flex items-start gap-3 pr-8">
        <Warning size={20} className="flex-shrink-0 mt-0.5" />
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <AlertDescription className="font-semibold">
              Validation Issues Found
            </AlertDescription>
            {errorCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {errorCount} {errorCount === 1 ? 'error' : 'errors'}
              </Badge>
            )}
            {warningCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {warningCount} {warningCount === 1 ? 'warning' : 'warnings'}
              </Badge>
            )}
          </div>

          <ScrollArea className="max-h-32">
            <div className="space-y-1.5 text-sm">
              {errors.map((error, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-2 p-2 rounded font-mono text-xs",
                    error.type === 'error' 
                      ? 'bg-destructive/10' 
                      : 'bg-muted/50'
                  )}
                >
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "flex-shrink-0 text-[10px] h-4 px-1.5",
                      error.type === 'error' 
                        ? 'border-destructive/50 text-destructive' 
                        : 'border-muted-foreground/30'
                    )}
                  >
                    {error.line}:{error.column}
                  </Badge>
                  <span className="flex-1">{error.message}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </Alert>
  )
}
