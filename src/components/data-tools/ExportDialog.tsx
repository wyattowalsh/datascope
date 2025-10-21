import { useState } from 'react'
import { Download, FileCode, FileCsv, File, FileText, FileTs } from '@phosphor-icons/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { stringify as stringifyYAML } from 'yaml'

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: any
  currentFormat: string
}

type ExportFormat = 'json' | 'yaml' | 'csv' | 'jsonl' | 'typescript' | 'text'
type IndentSize = 2 | 4

export function ExportDialog({ open, onOpenChange, data, currentFormat }: ExportDialogProps) {
  const [exportFormat, setExportFormat] = useState<ExportFormat>('json')
  const [prettify, setPrettify] = useState(true)
  const [sortKeys, setSortKeys] = useState(false)
  const [customFilename, setCustomFilename] = useState('')
  const [indentSize, setIndentSize] = useState<IndentSize>(2)
  const [includeMetadata, setIncludeMetadata] = useState(false)
  const [flattenArrays, setFlattenArrays] = useState(false)

  const sortObjectKeys = (obj: any): any => {
    if (obj === null || typeof obj !== 'object') {
      return obj
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sortObjectKeys)
    }
    
    const sorted: any = {}
    Object.keys(obj).sort().forEach(key => {
      sorted[key] = sortObjectKeys(obj[key])
    })
    return sorted
  }

  const flattenData = (obj: any, prefix = ''): any => {
    const flattened: any = {}
    
    for (const key in obj) {
      const value = obj[key]
      const newKey = prefix ? `${prefix}.${key}` : key
      
      if (value === null || value === undefined) {
        flattened[newKey] = value
      } else if (Array.isArray(value)) {
        if (flattenArrays) {
          value.forEach((item, index) => {
            if (typeof item === 'object' && item !== null) {
              Object.assign(flattened, flattenData(item, `${newKey}[${index}]`))
            } else {
              flattened[`${newKey}[${index}]`] = item
            }
          })
        } else {
          flattened[newKey] = value
        }
      } else if (typeof value === 'object') {
        Object.assign(flattened, flattenData(value, newKey))
      } else {
        flattened[newKey] = value
      }
    }
    
    return flattened
  }

  const generateTypeScriptInterface = (obj: any, name = 'DataType'): string => {
    const getType = (value: any): string => {
      if (value === null) return 'null'
      if (Array.isArray(value)) {
        if (value.length === 0) return 'any[]'
        return `${getType(value[0])}[]`
      }
      if (typeof value === 'object') return name
      return typeof value
    }

    const generateInterface = (obj: any, interfaceName: string): string => {
      let result = `interface ${interfaceName} {\n`
      for (const key in obj) {
        const value = obj[key]
        const type = getType(value)
        result += `  ${key}: ${type}\n`
      }
      result += '}\n'
      return result
    }

    return generateInterface(obj, name)
  }

  const handleExport = () => {
    let content = ''
    let filename = ''
    let mimeType = ''

    try {
      let processedData = data

      if (sortKeys && exportFormat !== 'typescript' && exportFormat !== 'text') {
        processedData = sortObjectKeys(data)
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
      const baseFilename = customFilename || `datascope-export-${timestamp}`

      switch (exportFormat) {
        case 'json': {
          if (includeMetadata) {
            const wrapped = {
              metadata: {
                exportedAt: new Date().toISOString(),
                format: currentFormat,
                dataSize: JSON.stringify(data).length,
                exportTool: 'DataScope'
              },
              data: processedData
            }
            content = prettify 
              ? JSON.stringify(wrapped, null, indentSize)
              : JSON.stringify(wrapped)
          } else {
            content = prettify 
              ? JSON.stringify(processedData, null, indentSize)
              : JSON.stringify(processedData)
          }
          filename = `${baseFilename}.json`
          mimeType = 'application/json'
          break
        }
        
        case 'yaml': {
          if (includeMetadata) {
            const wrapped = {
              metadata: {
                exportedAt: new Date().toISOString(),
                format: currentFormat,
                dataSize: JSON.stringify(data).length,
                exportTool: 'DataScope'
              },
              data: processedData
            }
            content = stringifyYAML(wrapped, { indent: indentSize, sortMapEntries: sortKeys })
          } else {
            content = stringifyYAML(processedData, { indent: indentSize, sortMapEntries: sortKeys })
          }
          filename = `${baseFilename}.yaml`
          mimeType = 'text/yaml'
          break
        }
        
        case 'csv': {
          if (Array.isArray(processedData)) {
            const flatData = flattenArrays ? processedData.map(item => flattenData(item)) : processedData
            const allKeys = new Set<string>()
            flatData.forEach((item: any) => {
              Object.keys(item || {}).forEach(key => allKeys.add(key))
            })
            const headers = Array.from(allKeys)
            
            const rows = flatData.map((item: any) => 
              headers.map(h => {
                const val = item?.[h]
                if (val === null || val === undefined) return ''
                const str = typeof val === 'object' ? JSON.stringify(val) : String(val)
                return str.includes(',') || str.includes('"') || str.includes('\n') 
                  ? `"${str.replace(/"/g, '""')}"` 
                  : str
              }).join(',')
            )
            content = [headers.join(','), ...rows].join('\n')
          } else if (typeof processedData === 'object') {
            const flattened = flattenData(processedData)
            const headers = Object.keys(flattened)
            const values = headers.map(h => {
              const val = flattened[h]
              if (val === null || val === undefined) return ''
              const str = typeof val === 'object' ? JSON.stringify(val) : String(val)
              return str.includes(',') || str.includes('"') || str.includes('\n')
                ? `"${str.replace(/"/g, '""')}"` 
                : str
            })
            content = [headers.join(','), values.join(',')].join('\n')
          } else {
            throw new Error('CSV export requires object or array data')
          }
          filename = `${baseFilename}.csv`
          mimeType = 'text/csv'
          break
        }
        
        case 'jsonl': {
          if (Array.isArray(processedData)) {
            content = processedData.map(item => 
              prettify ? JSON.stringify(item, null, indentSize) : JSON.stringify(item)
            ).join('\n')
          } else {
            content = JSON.stringify(processedData)
          }
          filename = `${baseFilename}.jsonl`
          mimeType = 'application/jsonl'
          break
        }

        case 'typescript': {
          content = generateTypeScriptInterface(processedData, 'DataType')
          if (includeMetadata) {
            content = `// Generated by DataScope on ${new Date().toISOString()}\n// Source format: ${currentFormat}\n\n${content}`
          }
          filename = `${baseFilename}.d.ts`
          mimeType = 'text/typescript'
          break
        }

        case 'text': {
          content = prettify 
            ? JSON.stringify(processedData, null, indentSize)
            : JSON.stringify(processedData)
          if (includeMetadata) {
            content = `DataScope Export\nDate: ${new Date().toISOString()}\nFormat: ${currentFormat}\n${'='.repeat(50)}\n\n${content}`
          }
          filename = `${baseFilename}.txt`
          mimeType = 'text/plain'
          break
        }
      }

      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
      
      toast.success(`Exported as ${exportFormat.toUpperCase()}`)
      onOpenChange(false)
    } catch (error) {
      toast.error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border-border/50">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Download size={24} weight="duotone" className="text-primary" />
            Export Data
          </DialogTitle>
          <DialogDescription>
            Download your data in various formats with advanced options
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Export Format</Label>
            <RadioGroup value={exportFormat} onValueChange={(v) => setExportFormat(v as ExportFormat)}>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border/50">
                  <RadioGroupItem value="json" id="json" />
                  <Label htmlFor="json" className="flex-1 cursor-pointer flex items-center gap-2">
                    <File size={18} weight="duotone" className="text-primary" />
                    <span className="text-sm">JSON</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border/50">
                  <RadioGroupItem value="yaml" id="yaml" />
                  <Label htmlFor="yaml" className="flex-1 cursor-pointer flex items-center gap-2">
                    <FileCode size={18} weight="duotone" className="text-primary" />
                    <span className="text-sm">YAML</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border/50">
                  <RadioGroupItem value="csv" id="csv" />
                  <Label htmlFor="csv" className="flex-1 cursor-pointer flex items-center gap-2">
                    <FileCsv size={18} weight="duotone" className="text-primary" />
                    <span className="text-sm">CSV</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border/50">
                  <RadioGroupItem value="jsonl" id="jsonl" />
                  <Label htmlFor="jsonl" className="flex-1 cursor-pointer flex items-center gap-2">
                    <FileCode size={18} weight="duotone" className="text-primary" />
                    <span className="text-sm">JSONL</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border/50">
                  <RadioGroupItem value="typescript" id="typescript" />
                  <Label htmlFor="typescript" className="flex-1 cursor-pointer flex items-center gap-2">
                    <FileTs size={18} weight="duotone" className="text-primary" />
                    <span className="text-sm">TypeScript</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border/50">
                  <RadioGroupItem value="text" id="text" />
                  <Label htmlFor="text" className="flex-1 cursor-pointer flex items-center gap-2">
                    <FileText size={18} weight="duotone" className="text-primary" />
                    <span className="text-sm">Plain Text</span>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3 pt-2 border-t border-border/50">
            <Label className="text-sm font-semibold">Filename (optional)</Label>
            <Input 
              placeholder="datascope-export" 
              value={customFilename}
              onChange={(e) => setCustomFilename(e.target.value)}
              className="rounded-lg"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty for automatic timestamp-based naming
            </p>
          </div>

          {(exportFormat === 'json' || exportFormat === 'yaml' || exportFormat === 'jsonl') && (
            <div className="space-y-3 pt-2 border-t border-border/50">
              <Label className="text-sm font-semibold">Formatting Options</Label>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex-1">
                  <Label htmlFor="prettify" className="cursor-pointer font-medium">
                    Prettify Output
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Add indentation and line breaks for readability
                  </p>
                </div>
                <Switch id="prettify" checked={prettify} onCheckedChange={setPrettify} />
              </div>

              {prettify && (exportFormat === 'json' || exportFormat === 'yaml' || exportFormat === 'jsonl') && (
                <div className="space-y-2">
                  <Label className="text-sm">Indent Size</Label>
                  <Select value={String(indentSize)} onValueChange={(v) => setIndentSize(Number(v) as IndentSize)}>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="2">2 spaces</SelectItem>
                      <SelectItem value="4">4 spaces</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex-1">
                  <Label htmlFor="sort-keys" className="cursor-pointer font-medium">
                    Sort Keys Alphabetically
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Organize object keys in alphabetical order
                  </p>
                </div>
                <Switch id="sort-keys" checked={sortKeys} onCheckedChange={setSortKeys} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex-1">
                  <Label htmlFor="metadata" className="cursor-pointer font-medium">
                    Include Metadata
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Add export timestamp and source information
                  </p>
                </div>
                <Switch id="metadata" checked={includeMetadata} onCheckedChange={setIncludeMetadata} />
              </div>
            </div>
          )}

          {exportFormat === 'csv' && (
            <div className="space-y-3 pt-2 border-t border-border/50">
              <Label className="text-sm font-semibold">CSV Options</Label>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex-1">
                  <Label htmlFor="flatten" className="cursor-pointer font-medium">
                    Flatten Nested Objects
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Convert nested structures to dot-notation columns
                  </p>
                </div>
                <Switch id="flatten" checked={flattenArrays} onCheckedChange={setFlattenArrays} />
              </div>

              <div className="p-3 rounded-lg bg-muted/20 border border-border/30">
                <p className="text-xs text-muted-foreground">
                  <strong>Note:</strong> CSV export works best with flat array data. Objects will be flattened into a single row.
                </p>
              </div>
            </div>
          )}

          {exportFormat === 'typescript' && (
            <div className="p-4 rounded-lg bg-muted/20 border border-border/30 space-y-2">
              <p className="text-sm font-medium">TypeScript Interface Generation</p>
              <p className="text-xs text-muted-foreground">
                Generates a TypeScript interface definition based on your data structure. 
                Perfect for strongly-typed API integrations.
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2 border-t border-border/50">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 rounded-lg">
            Cancel
          </Button>
          <Button onClick={handleExport} className="flex-1 rounded-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
            <Download size={18} weight="duotone" className="mr-2" />
            Export
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
