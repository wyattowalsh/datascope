import { useState } from 'react'
import { Download, FileCode, FileCsv, File } from '@phosphor-icons/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: any
  currentFormat: string
}

export function ExportDialog({ open, onOpenChange, data, currentFormat }: ExportDialogProps) {
  const [exportFormat, setExportFormat] = useState<'json' | 'yaml' | 'csv' | 'jsonl'>('json')
  const [prettify, setPrettify] = useState(true)
  const [sortKeys, setSortKeys] = useState(false)

  const handleExport = () => {
    let content = ''
    let filename = ''
    let mimeType = ''

    try {
      switch (exportFormat) {
        case 'json':
          content = prettify 
            ? JSON.stringify(data, sortKeys ? Object.keys(data).sort() : null, 2)
            : JSON.stringify(data, sortKeys ? Object.keys(data).sort() : null)
          filename = `export-${Date.now()}.json`
          mimeType = 'application/json'
          break
        
        case 'yaml':
          const yaml = require('yaml')
          content = yaml.stringify(data, { sortMapEntries: sortKeys })
          filename = `export-${Date.now()}.yaml`
          mimeType = 'text/yaml'
          break
        
        case 'csv':
          if (Array.isArray(data)) {
            const headers = Object.keys(data[0] || {})
            const rows = data.map((item: any) => 
              headers.map(h => {
                const val = item[h]
                const str = val === null ? '' : String(val)
                return str.includes(',') || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str
              }).join(',')
            )
            content = [headers.join(','), ...rows].join('\n')
          } else {
            throw new Error('CSV export requires array data')
          }
          filename = `export-${Date.now()}.csv`
          mimeType = 'text/csv'
          break
        
        case 'jsonl':
          if (Array.isArray(data)) {
            content = data.map(item => JSON.stringify(item)).join('\n')
          } else {
            throw new Error('JSONL export requires array data')
          }
          filename = `export-${Date.now()}.jsonl`
          mimeType = 'application/jsonl'
          break
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
      <DialogContent className="sm:max-w-md rounded-2xl shadow-2xl border-border/50">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Download size={24} weight="duotone" className="text-primary" />
            Export Data
          </DialogTitle>
          <DialogDescription>
            Download your data in various formats
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Export Format</Label>
            <RadioGroup value={exportFormat} onValueChange={(v) => setExportFormat(v as any)}>
              <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="json" id="json" />
                <Label htmlFor="json" className="flex-1 cursor-pointer flex items-center gap-2">
                  <File size={18} weight="duotone" className="text-primary" />
                  JSON
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="yaml" id="yaml" />
                <Label htmlFor="yaml" className="flex-1 cursor-pointer flex items-center gap-2">
                  <FileCode size={18} weight="duotone" className="text-primary" />
                  YAML
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="flex-1 cursor-pointer flex items-center gap-2">
                  <FileCsv size={18} weight="duotone" className="text-primary" />
                  CSV (Arrays only)
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="jsonl" id="jsonl" />
                <Label htmlFor="jsonl" className="flex-1 cursor-pointer flex items-center gap-2">
                  <FileCode size={18} weight="duotone" className="text-primary" />
                  JSONL (Arrays only)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {(exportFormat === 'json' || exportFormat === 'yaml') && (
            <div className="space-y-4 pt-2 border-t border-border/50">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <Label htmlFor="prettify" className="cursor-pointer">
                  Prettify Output
                </Label>
                <Switch id="prettify" checked={prettify} onCheckedChange={setPrettify} />
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <Label htmlFor="sort-keys" className="cursor-pointer">
                  Sort Keys Alphabetically
                </Label>
                <Switch id="sort-keys" checked={sortKeys} onCheckedChange={setSortKeys} />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
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
