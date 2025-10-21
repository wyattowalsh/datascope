import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { WarningCircle, ArrowCounterClockwise } from '@phosphor-icons/react'
import { logErrorTelemetry } from '@/lib/error-telemetry'
import { toast } from 'sonner'

interface Props {
  children: ReactNode
  fallbackComponent?: React.ComponentType<{ error: Error; reset: () => void }>
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  context?: {
    viewMode?: string
    layout?: string
    nodeCount?: number
  }
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logErrorTelemetry(error, {
      ...this.props.context,
      componentStack: errorInfo.componentStack || undefined
    })

    this.setState({
      errorInfo
    })

    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    toast.error('Component error detected', {
      description: 'Your data has been preserved. Click "Recover" to continue.',
      duration: 10000
    })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
    
    toast.success('App recovered successfully')
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallbackComponent) {
        const FallbackComponent = this.props.fallbackComponent
        return <FallbackComponent error={this.state.error!} reset={this.handleReset} />
      }

      return (
        <Card className="p-6 m-4 max-w-2xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-destructive/10">
              <WarningCircle size={32} weight="duotone" className="text-destructive" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-destructive mb-1">
                  Component Error Detected
                </h3>
                <p className="text-sm text-muted-foreground">
                  A component encountered an error. Your data has been automatically saved and you can recover safely.
                </p>
              </div>

              <Alert variant="destructive" className="bg-destructive/5">
                <AlertTitle className="text-sm font-mono">Error Details</AlertTitle>
                <AlertDescription className="text-xs font-mono mt-2 overflow-auto max-h-32">
                  {this.state.error?.message}
                </AlertDescription>
              </Alert>

              {this.props.context && (
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>View Mode: <span className="font-mono">{this.props.context.viewMode}</span></div>
                  {this.props.context.layout && (
                    <div>Layout: <span className="font-mono">{this.props.context.layout}</span></div>
                  )}
                  {this.props.context.nodeCount && (
                    <div>Node Count: <span className="font-mono">{this.props.context.nodeCount}</span></div>
                  )}
                </div>
              )}

              <Button onClick={this.handleReset} className="gap-2">
                <ArrowCounterClockwise size={16} weight="bold" />
                Recover & Continue
              </Button>
            </div>
          </div>
        </Card>
      )
    }

    return this.props.children
  }
}
