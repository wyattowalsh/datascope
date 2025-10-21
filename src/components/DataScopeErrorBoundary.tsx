import React from 'react'
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  AlertTriangle, 
  RefreshCw, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp,
  FileText 
} from 'lucide-react'
import { toast } from 'sonner'
import { useStateRecovery } from '@/lib/state-recovery'

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
  componentStack?: string
  viewMode?: string
  graphLayout?: string
}

function ErrorFallbackUI({ 
  error, 
  resetErrorBoundary, 
  componentStack,
  viewMode = 'unknown',
  graphLayout 
}: ErrorFallbackProps) {
  const [showDetails, setShowDetails] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  const { savedState, saveCrashReport, clearSavedState } = useStateRecovery()

  React.useEffect(() => {
    saveCrashReport(error, { componentStack }, { viewMode, graphLayout })
  }, [error, componentStack, viewMode, graphLayout, saveCrashReport])

  const handleCopy = () => {
    const errorReport = `
DataScope Crash Report
=====================
Time: ${new Date().toISOString()}
View Mode: ${viewMode}
${graphLayout ? `Graph Layout: ${graphLayout}` : ''}

Error: ${error.message}

Stack Trace:
${error.stack || 'No stack trace available'}

${componentStack ? `Component Stack:\n${componentStack}` : ''}
    `.trim()

    navigator.clipboard.writeText(errorReport)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Error details copied to clipboard')
  }

  const handleRecover = () => {
    if (savedState && savedState.input) {
      toast.info('Attempting to recover your last session...')
      resetErrorBoundary()
    } else {
      clearSavedState()
      resetErrorBoundary()
    }
  }

  const handleReset = () => {
    clearSavedState()
    resetErrorBoundary()
  }

  const hasRecoveryData = savedState && savedState.input && savedState.input.trim()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <div className="flex-1 space-y-2">
            <h2 className="text-xl font-semibold">Something went wrong</h2>
            <p className="text-sm text-muted-foreground">
              DataScope encountered an unexpected error. Your work has been auto-saved and can be recovered.
            </p>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="destructive">Error</Badge>
              <Badge variant="outline">{viewMode}</Badge>
              {graphLayout && <Badge variant="outline">{graphLayout}</Badge>}
            </div>
            {hasRecoveryData && (
              <Badge variant="secondary" className="gap-1">
                <FileText className="h-3 w-3" />
                Recovery Available
              </Badge>
            )}
          </div>

          <Alert variant="destructive">
            <AlertTitle>Error Message</AlertTitle>
            <AlertDescription className="font-mono text-xs mt-2">
              {error.message}
            </AlertDescription>
          </Alert>

          {showDetails && (
            <Card className="p-4 bg-muted/50">
              <h3 className="font-semibold text-sm mb-2">Technical Details</h3>
              <pre className="text-xs overflow-auto max-h-64 p-3 bg-background rounded border">
                {error.stack || 'No stack trace available'}
                {componentStack && `\n\nComponent Stack:\n${componentStack}`}
              </pre>
            </Card>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="w-full"
          >
            {showDetails ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                Hide Details
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                Show Details
              </>
            )}
          </Button>
        </div>

        <Separator />

        <div className="flex gap-2">
          {hasRecoveryData ? (
            <>
              <Button onClick={handleRecover} className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Recover Session
              </Button>
              <Button onClick={handleReset} variant="outline" className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Start Fresh
              </Button>
            </>
          ) : (
            <Button onClick={handleReset} className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
          <Button onClick={handleCopy} variant="outline">
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          If this problem persists, please report it with the error details above.
        </p>
      </Card>
    </div>
  )
}

interface DataScopeErrorBoundaryProps {
  children: React.ReactNode
  viewMode?: string
  graphLayout?: string
}

export function DataScopeErrorBoundary({ 
  children, 
  viewMode, 
  graphLayout 
}: DataScopeErrorBoundaryProps) {
  const handleError = (error: Error, errorInfo: { componentStack?: string }) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('DataScope Error Boundary caught:', error, errorInfo)
    }
  }

  return (
    <ReactErrorBoundary
      FallbackComponent={(props) => (
        <ErrorFallbackUI 
          {...props} 
          viewMode={viewMode}
          graphLayout={graphLayout}
        />
      )}
      onError={handleError}
      onReset={() => {
        window.location.reload()
      }}
    >
      {children}
    </ReactErrorBoundary>
  )
}

export function GraphErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ReactErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <Card className="p-6 space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Graph Rendering Error</AlertTitle>
            <AlertDescription>
              The graph visualization encountered an error. Your data is safe.
            </AlertDescription>
          </Alert>
          <div className="text-sm font-mono text-muted-foreground bg-muted p-3 rounded">
            {error.message}
          </div>
          <Button onClick={resetErrorBoundary} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Visualization
          </Button>
        </Card>
      )}
      onError={(error) => {
        if (process.env.NODE_ENV === 'development') {
          console.error('Graph rendering error:', error)
        }
        toast.error('Graph visualization failed', {
          description: 'Try switching to tree view or refreshing the page'
        })
      }}
    >
      {children}
    </ReactErrorBoundary>
  )
}
