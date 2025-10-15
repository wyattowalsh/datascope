import { useState, useRef } from 'react'
import { Upload, Link as LinkIcon, File, X } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { DataFormat } from '@/lib/parser'

interface FileInputProps {
  onDataLoaded: (data: string, detectedFormat?: DataFormat) => void
}

export function FileInput({ onDataLoaded }: FileInputProps) {
  const [inputMode, setInputMode] = useState<'file' | 'url'>('file')
  const [urlInput, setUrlInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const detectFormat = (content: string, filename?: string): DataFormat => {
    if (filename) {
      const ext = filename.split('.').pop()?.toLowerCase()
      if (ext === 'json') return 'json'
      if (ext === 'yaml' || ext === 'yml') return 'yaml'
      if (ext === 'jsonl' || ext === 'ndjson') return 'jsonl'
      if (ext === 'csv') return 'csv'
      if (ext === 'json5') return 'json5'
    }

    const trimmed = content.trim()
    
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      return 'json'
    }
    
    const lines = trimmed.split('\n')
    if (lines.length > 1 && lines.every(line => {
      const t = line.trim()
      return !t || t.startsWith('{') || t.startsWith('[')
    })) {
      return 'jsonl'
    }
    
    if (lines[0]?.includes(',') && !trimmed.startsWith('{')) {
      return 'csv'
    }
    
    if (trimmed.includes(':') && !trimmed.startsWith('{')) {
      return 'yaml'
    }
    
    return 'json'
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      const format = detectFormat(content, file.name)
      onDataLoaded(content, format)
      toast.success(`File loaded: ${file.name} (${format.toUpperCase()})`)
    }
    reader.onerror = () => {
      toast.error('Failed to read file')
    }
    reader.readAsText(file)
  }

  const handleUrlLoad = async () => {
    if (!urlInput.trim()) {
      toast.error('Please enter a URL')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(urlInput)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const content = await response.text()
      const urlPath = new URL(urlInput).pathname
      const format = detectFormat(content, urlPath)
      
      onDataLoaded(content, format)
      toast.success(`Data loaded from URL (${format.toUpperCase()})`)
      setUrlInput('')
    } catch (error) {
      toast.error(`Failed to load URL: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      const format = detectFormat(content, file.name)
      onDataLoaded(content, format)
      toast.success(`File dropped: ${file.name} (${format.toUpperCase()})`)
    }
    reader.readAsText(file)
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  return (
    <Card className="p-4 space-y-4 border-dashed border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 hover:border-primary/40 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <File size={20} weight="duotone" className="text-primary" />
          <h3 className="font-semibold text-sm">Load Data</h3>
        </div>
        
        <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as 'file' | 'url')}>
          <TabsList className="bg-muted/80 p-1 rounded-lg h-8">
            <TabsTrigger value="file" className="gap-1.5 text-xs h-6 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md">
              <Upload size={14} weight="duotone" />
              File
            </TabsTrigger>
            <TabsTrigger value="url" className="gap-1.5 text-xs h-6 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md">
              <LinkIcon size={14} weight="duotone" />
              URL
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {inputMode === 'file' && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 cursor-pointer group"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={32} weight="duotone" className="mx-auto mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
          <p className="text-sm font-medium mb-1 group-hover:text-foreground transition-colors">
            Drop file here or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            Supports JSON, YAML, JSONL, CSV, JSON5
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.yaml,.yml,.jsonl,.ndjson,.csv,.json5"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {inputMode === 'url' && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="https://api.example.com/data.json"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUrlLoad()}
              className="flex-1 font-mono text-sm rounded-lg"
              disabled={isLoading}
            />
            {urlInput && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setUrlInput('')}
                className="h-10 w-10 rounded-lg"
              >
                <X size={16} />
              </Button>
            )}
          </div>
          <Button
            onClick={handleUrlLoad}
            disabled={isLoading || !urlInput.trim()}
            className="w-full gap-2 rounded-lg"
          >
            <LinkIcon size={16} weight="duotone" />
            {isLoading ? 'Loading...' : 'Load from URL'}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Auto-detects format from URL and content
          </p>
        </div>
      )}
    </Card>
  )
}
