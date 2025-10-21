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
    <Card className="p-5 space-y-5 border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/8 via-accent/5 to-primary/8 hover:border-primary/50 transition-all duration-300 rounded-2xl shadow-lg hover:shadow-xl backdrop-blur-sm relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 shadow-md">
            <File size={20} weight="duotone" className="text-primary" />
          </div>
          <h3 className="font-bold text-base bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Load Data</h3>
        </div>
        
        <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as 'file' | 'url')}>
          <TabsList className="bg-muted/80 p-1 rounded-xl h-9 shadow-md border border-border/50">
            <TabsTrigger value="file" className="gap-2 text-xs h-7 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-accent/20 data-[state=active]:text-primary rounded-lg font-medium transition-all">
              <Upload size={16} weight="duotone" />
              File
            </TabsTrigger>
            <TabsTrigger value="url" className="gap-2 text-xs h-7 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-accent/20 data-[state=active]:text-primary rounded-lg font-medium transition-all">
              <LinkIcon size={16} weight="duotone" />
              URL
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {inputMode === 'file' && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-border/50 rounded-2xl p-8 text-center hover:border-primary/60 hover:bg-gradient-to-br hover:from-primary/10 hover:to-accent/10 transition-all duration-300 cursor-pointer group/drop relative overflow-hidden backdrop-blur-sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-accent/0 to-primary/0 group-hover/drop:from-primary/5 group-hover/drop:via-accent/5 group-hover/drop:to-primary/5 transition-all duration-500" />
          <Upload size={40} weight="duotone" className="mx-auto mb-4 text-muted-foreground group-hover/drop:text-primary transition-all duration-300 group-hover/drop:scale-110" />
          <p className="text-sm font-semibold mb-2 group-hover/drop:text-foreground transition-colors">
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
        <div className="space-y-3 relative z-10">
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="https://api.example.com/data.json"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUrlLoad()}
              className="flex-1 font-mono text-sm rounded-xl border-border/50 focus:border-primary/50 bg-background/50 backdrop-blur-sm"
              disabled={isLoading}
            />
            {urlInput && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setUrlInput('')}
                className="h-10 w-10 rounded-xl hover:bg-destructive/10 hover:text-destructive"
              >
                <X size={18} weight="duotone" />
              </Button>
            )}
          </div>
          <Button
            onClick={handleUrlLoad}
            disabled={isLoading || !urlInput.trim()}
            className="w-full gap-2 rounded-xl h-10 bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-200 font-semibold disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <LinkIcon size={18} weight="duotone" />
                <span>Load from URL</span>
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground/80 text-center">
            Auto-detects format from URL and content
          </p>
        </div>
      )}
    </Card>
  )
}
