export interface ErrorTelemetryData {
  timestamp: string
  message: string
  stack?: string
  viewMode: string
  layout?: string
  nodeCount?: number
  componentStack?: string
  userAgent: string
  url: string
}

export function logErrorTelemetry(error: Error, context: {
  viewMode?: string
  layout?: string
  nodeCount?: number
  componentStack?: string
}): ErrorTelemetryData {
  const telemetry: ErrorTelemetryData = {
    timestamp: new Date().toISOString(),
    message: error.message,
    stack: error.stack,
    viewMode: context.viewMode || 'unknown',
    layout: context.layout,
    nodeCount: context.nodeCount,
    componentStack: context.componentStack,
    userAgent: navigator.userAgent,
    url: window.location.href
  }

  console.error('[Error Telemetry]', {
    message: telemetry.message,
    viewMode: telemetry.viewMode,
    layout: telemetry.layout,
    nodeCount: telemetry.nodeCount,
    timestamp: telemetry.timestamp
  })

  if (window.gtag) {
    window.gtag('event', 'exception', {
      description: telemetry.message,
      fatal: false,
      viewMode: telemetry.viewMode,
      layout: telemetry.layout
    })
  }

  return telemetry
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}
