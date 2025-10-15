import { useState } from 'react'
import { ClipboardText, Play, Copy, Check } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'

interface DataTransformerProps {
  data: any
  onTransformed: (data: any) => void
}

export function DataTransformer({ data, onTransformed }: DataTransformerProps) {
  const [transformCode, setTransformCode] = useState(`// Transform the data
// 'data' is the current parsed data
// Return the transformed result

return data`)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleTransform = () => {
    try {
      const func = new Function('data', transformCode)
      const transformed = func(data)
      setResult(transformed)
      setError('')
      toast.success('Transformation applied successfully')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transformation failed')
      setResult(null)
      toast.error('Transformation failed')
    }
  }

  const handleApply = () => {
    if (result) {
      onTransformed(result)
      toast.success('Transformed data applied to main view')
    }
  }

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2))
      setCopied(true)
      toast.success('Result copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const examples = [
    {
      name: 'Extract Keys',
      code: `// Extract all keys from objects in array
if (Array.isArray(data)) {
  return data.map(item => Object.keys(item))
}
return Object.keys(data)`
    },
    {
      name: 'Filter Array',
      code: `// Filter array by condition
if (Array.isArray(data)) {
  return data.filter(item => item.active === true)
}
return data`
    },
    {
      name: 'Map Values',
      code: `// Transform array values
if (Array.isArray(data)) {
  return data.map(item => ({
    ...item,
    timestamp: Date.now()
  }))
}
return data`
    },
    {
      name: 'Flatten',
      code: `// Flatten nested structure
function flatten(obj, prefix = '') {
  return Object.keys(obj).reduce((acc, key) => {
    const fullKey = prefix ? \`\${prefix}.\${key}\` : key
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      return { ...acc, ...flatten(obj[key], fullKey) }
    }
    return { ...acc, [fullKey]: obj[key] }
  }, {})
}
return flatten(data)`
    }
  ]

  return (
    <Card className="p-6 space-y-4 shadow-xl border-border/50 bg-card/60 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20">
          <ClipboardText size={20} weight="duotone" className="text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Data Transformer</h3>
          <p className="text-xs text-muted-foreground">Apply JavaScript transformations</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">Transform Code</Label>
          <div className="flex gap-1">
            {examples.map((example, i) => (
              <Button
                key={i}
                size="sm"
                variant="ghost"
                onClick={() => setTransformCode(example.code)}
                className="text-xs h-7 px-2 hover:bg-primary/10 rounded-lg"
              >
                {example.name}
              </Button>
            ))}
          </div>
        </div>
        
        <Textarea
          value={transformCode}
          onChange={(e) => setTransformCode(e.target.value)}
          className="font-mono text-sm min-h-[200px] resize-y border-border/50 rounded-xl bg-muted/40"
          placeholder="// Your transformation code here..."
        />
      </div>

      {error && (
        <Alert variant="destructive" className="rounded-xl border-destructive/50 bg-destructive/10">
          <AlertDescription className="text-sm font-mono">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {result && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold">Result Preview</Label>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopy}
                className="gap-2 hover:border-primary/50 transition-all duration-200 rounded-lg hover:bg-primary/10"
              >
                {copied ? (
                  <>
                    <Check size={16} weight="bold" className="text-syntax-string" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={16} weight="duotone" />
                    Copy
                  </>
                )}
              </Button>
              <Button
                size="sm"
                onClick={handleApply}
                className="gap-2 rounded-lg bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70"
              >
                Apply to Main View
              </Button>
            </div>
          </div>
          <pre className="p-4 font-mono text-sm bg-muted/40 rounded-xl border border-border/30 overflow-auto max-h-[200px]">
            <code>{JSON.stringify(result, null, 2)}</code>
          </pre>
        </div>
      )}

      <Button
        onClick={handleTransform}
        className="w-full gap-2 rounded-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
      >
        <Play size={18} weight="duotone" />
        Run Transformation
      </Button>
    </Card>
  )
}
