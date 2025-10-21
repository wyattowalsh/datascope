import { useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  ShieldCheck,
  Warning,
  CheckCircle,
  XCircle,
  Info,
  Lightbulb
} from '@phosphor-icons/react'

interface ValidationIssue {
  type: 'error' | 'warning' | 'info'
  message: string
  path?: string
  suggestion?: string
}

interface DataValidatorProps {
  data: any
}

export function DataValidator({ data }: DataValidatorProps) {
  const validation = useMemo(() => {
    const issues: ValidationIssue[] = []
    let score = 100

    const validateNode = (node: any, path: string[] = [], depth = 0) => {
      if (depth > 20) {
        issues.push({
          type: 'warning',
          message: 'Very deep nesting detected',
          path: path.join('.'),
          suggestion: 'Consider flattening your data structure for better performance'
        })
        score -= 5
      }

      if (node === null || node === undefined) {
        issues.push({
          type: 'info',
          message: 'Null or undefined value found',
          path: path.join('.'),
          suggestion: 'Ensure this is intentional'
        })
        score -= 1
      }

      if (typeof node === 'object' && node !== null) {
        const keys = Object.keys(node)

        if (keys.length === 0) {
          issues.push({
            type: 'info',
            message: 'Empty object detected',
            path: path.join('.'),
            suggestion: 'Remove empty objects if not needed'
          })
          score -= 2
        }

        if (keys.length > 50) {
          issues.push({
            type: 'warning',
            message: `Large object with ${keys.length} keys`,
            path: path.join('.'),
            suggestion: 'Consider breaking into smaller, more focused objects'
          })
          score -= 3
        }

        const duplicateKeys = keys.filter((key, idx) => keys.indexOf(key) !== idx)
        if (duplicateKeys.length > 0) {
          issues.push({
            type: 'error',
            message: `Duplicate keys detected: ${duplicateKeys.join(', ')}`,
            path: path.join('.'),
            suggestion: 'Remove duplicate keys to avoid data loss'
          })
          score -= 10
        }

        const invalidKeys = keys.filter(key => /^\d/.test(key))
        if (invalidKeys.length > 0) {
          issues.push({
            type: 'warning',
            message: `Keys starting with numbers: ${invalidKeys.slice(0, 3).join(', ')}`,
            path: path.join('.'),
            suggestion: 'Prefix numeric keys for better compatibility'
          })
          score -= 2
        }

        if (Array.isArray(node)) {
          if (node.length > 1000) {
            issues.push({
              type: 'warning',
              message: `Very large array with ${node.length} items`,
              path: path.join('.'),
              suggestion: 'Consider pagination or chunking for large datasets'
            })
            score -= 3
          }

          const types = new Set(node.map(item => typeof item))
          if (types.size > 1) {
            issues.push({
              type: 'info',
              message: 'Mixed types in array',
              path: path.join('.'),
              suggestion: 'Arrays work best with consistent types'
            })
            score -= 2
          }

          if (node.length === 0) {
            issues.push({
              type: 'info',
              message: 'Empty array found',
              path: path.join('.'),
              suggestion: 'Remove empty arrays if not needed'
            })
            score -= 1
          }

          node.forEach((item, idx) => {
            validateNode(item, [...path, `[${idx}]`], depth + 1)
          })
        } else {
          keys.forEach(key => {
            validateNode(node[key], [...path, key], depth + 1)
          })
        }
      }

      if (typeof node === 'string') {
        if (node.length > 10000) {
          issues.push({
            type: 'warning',
            message: `Very long string (${node.length} chars)`,
            path: path.join('.'),
            suggestion: 'Consider storing large text separately'
          })
          score -= 2
        }

        if (node.trim() === '') {
          issues.push({
            type: 'info',
            message: 'Empty or whitespace-only string',
            path: path.join('.'),
            suggestion: 'Use null or remove if not needed'
          })
          score -= 1
        }

        if (/^\s|\s$/.test(node)) {
          issues.push({
            type: 'warning',
            message: 'String with leading or trailing whitespace',
            path: path.join('.'),
            suggestion: 'Trim whitespace for cleaner data'
          })
          score -= 1
        }
      }

      if (typeof node === 'number') {
        if (!Number.isFinite(node)) {
          issues.push({
            type: 'error',
            message: 'Invalid number (Infinity or NaN)',
            path: path.join('.'),
            suggestion: 'Replace with null or valid number'
          })
          score -= 5
        }
      }
    }

    validateNode(data)

    return {
      score: Math.max(0, Math.min(100, score)),
      issues,
      errorCount: issues.filter(i => i.type === 'error').length,
      warningCount: issues.filter(i => i.type === 'warning').length,
      infoCount: issues.filter(i => i.type === 'info').length
    }
  }, [data])

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-syntax-string'
    if (score >= 70) return 'text-syntax-number'
    if (score >= 50) return 'text-syntax-boolean'
    return 'text-destructive'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent'
    if (score >= 70) return 'Good'
    if (score >= 50) return 'Fair'
    return 'Needs Improvement'
  }

  return (
    <Card className="p-5 space-y-4 shadow-xl border-border/50 bg-card/60 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-gradient-to-br from-syntax-string/20 to-accent/20">
          <ShieldCheck size={18} weight="duotone" className="text-syntax-string" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground">Data Quality</h3>
          <p className="text-xs text-muted-foreground">Validation & suggestions</p>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${getScoreColor(validation.score)}`}>
            {validation.score}
          </div>
          <div className="text-xs text-muted-foreground">{getScoreLabel(validation.score)}</div>
        </div>
      </div>

      <Progress value={validation.score} className="h-2" />

      <div className="grid grid-cols-3 gap-2">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-destructive/10">
          <XCircle size={16} weight="fill" className="text-destructive" />
          <div>
            <div className="text-xs font-bold text-foreground">{validation.errorCount}</div>
            <div className="text-xs text-muted-foreground">Errors</div>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-syntax-number/10">
          <Warning size={16} weight="fill" className="text-syntax-number" />
          <div>
            <div className="text-xs font-bold text-foreground">{validation.warningCount}</div>
            <div className="text-xs text-muted-foreground">Warnings</div>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/10">
          <Info size={16} weight="fill" className="text-primary" />
          <div>
            <div className="text-xs font-bold text-foreground">{validation.infoCount}</div>
            <div className="text-xs text-muted-foreground">Info</div>
          </div>
        </div>
      </div>

      {validation.issues.length > 0 && (
        <ScrollArea className="h-[200px] rounded-lg border border-border/30">
          <div className="p-3 space-y-2">
            {validation.issues.slice(0, 20).map((issue, idx) => (
              <Alert
                key={idx}
                variant={issue.type === 'error' ? 'destructive' : 'default'}
                className="py-2 px-3 text-xs"
              >
                <div className="flex items-start gap-2">
                  {issue.type === 'error' && <XCircle size={14} className="mt-0.5 flex-shrink-0 text-destructive" weight="fill" />}
                  {issue.type === 'warning' && <Warning size={14} className="mt-0.5 flex-shrink-0 text-syntax-number" weight="fill" />}
                  {issue.type === 'info' && <Info size={14} className="mt-0.5 flex-shrink-0 text-primary" weight="fill" />}
                  <div className="flex-1 space-y-1">
                    <AlertDescription className="text-xs font-medium">
                      {issue.message}
                    </AlertDescription>
                    {issue.path && (
                      <code className="text-xs text-muted-foreground block">
                        Path: {issue.path}
                      </code>
                    )}
                    {issue.suggestion && (
                      <div className="flex items-start gap-1.5 text-xs text-muted-foreground mt-1">
                        <Lightbulb size={12} className="mt-0.5 flex-shrink-0" weight="duotone" />
                        <span>{issue.suggestion}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Alert>
            ))}
            {validation.issues.length > 20 && (
              <div className="text-xs text-muted-foreground text-center py-2">
                +{validation.issues.length - 20} more issues
              </div>
            )}
          </div>
        </ScrollArea>
      )}

      {validation.issues.length === 0 && (
        <Alert className="bg-syntax-string/10 border-syntax-string/30">
          <CheckCircle size={16} weight="fill" className="text-syntax-string" />
          <AlertDescription className="text-xs">
            No issues found! Your data structure looks great.
          </AlertDescription>
        </Alert>
      )}
    </Card>
  )
}
