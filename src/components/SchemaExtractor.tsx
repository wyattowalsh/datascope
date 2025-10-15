import { useState } from 'react'
import { BracketsAngle, Copy, Check } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface SchemaExtractorProps {
  data: any
}

function inferSchema(data: any, depth = 0): any {
  if (data === null) return { type: 'null' }
  
  const type = Array.isArray(data) ? 'array' : typeof data
  
  if (type === 'array') {
    if (data.length === 0) {
      return { type: 'array', items: {} }
    }
    
    const itemSchemas = data.map((item: any) => inferSchema(item, depth + 1))
    const merged = mergeSchemas(itemSchemas)
    
    return {
      type: 'array',
      items: merged,
      minItems: data.length,
      maxItems: data.length
    }
  }
  
  if (type === 'object') {
    const properties: Record<string, any> = {}
    const required: string[] = []
    
    for (const [key, value] of Object.entries(data)) {
      properties[key] = inferSchema(value, depth + 1)
      if (value !== null && value !== undefined) {
        required.push(key)
      }
    }
    
    return {
      type: 'object',
      properties,
      required: required.length > 0 ? required : undefined
    }
  }
  
  if (type === 'number') {
    return {
      type: Number.isInteger(data) ? 'integer' : 'number'
    }
  }
  
  if (type === 'string') {
    const schema: any = { type: 'string' }
    if (data.match(/^\d{4}-\d{2}-\d{2}/)) {
      schema.format = 'date-time'
    } else if (data.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      schema.format = 'email'
    } else if (data.match(/^https?:\/\//)) {
      schema.format = 'uri'
    }
    return schema
  }
  
  return { type }
}

function mergeSchemas(schemas: any[]): any {
  if (schemas.length === 0) return {}
  if (schemas.length === 1) return schemas[0]
  
  const types = [...new Set(schemas.map(s => s.type))]
  
  if (types.length === 1) {
    const type = types[0]
    
    if (type === 'object') {
      const allKeys = [...new Set(schemas.flatMap(s => Object.keys(s.properties || {})))]
      const properties: Record<string, any> = {}
      
      for (const key of allKeys) {
        const keySchemas = schemas
          .filter(s => s.properties && s.properties[key])
          .map(s => s.properties[key])
        properties[key] = keySchemas.length > 0 ? mergeSchemas(keySchemas) : {}
      }
      
      return { type: 'object', properties }
    }
    
    return schemas[0]
  }
  
  return { oneOf: schemas }
}

export function SchemaExtractor({ data }: SchemaExtractorProps) {
  const [copied, setCopied] = useState(false)
  
  const schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    ...inferSchema(data)
  }
  
  const schemaString = JSON.stringify(schema, null, 2)
  
  const handleCopy = () => {
    navigator.clipboard.writeText(schemaString)
    setCopied(true)
    toast.success('Schema copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <Card className="p-6 space-y-4 shadow-xl border-border/50 bg-card/60 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
            <BracketsAngle size={20} weight="duotone" className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">JSON Schema</h3>
            <p className="text-xs text-muted-foreground">Auto-generated from data structure</p>
          </div>
        </div>
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
              Copy Schema
            </>
          )}
        </Button>
      </div>
      
      <div className="flex gap-2 flex-wrap">
        <Badge variant="secondary" className="rounded-lg">
          Draft-07
        </Badge>
        <Badge variant="secondary" className="rounded-lg">
          Type Inference
        </Badge>
        <Badge variant="secondary" className="rounded-lg">
          Format Detection
        </Badge>
      </div>
      
      <ScrollArea className="h-[300px] rounded-xl border border-border/30 shadow-inner bg-muted/40">
        <pre className="p-4 font-mono text-sm">
          <code>{schemaString}</code>
        </pre>
      </ScrollArea>
    </Card>
  )
}
