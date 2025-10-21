import { useKV } from '@github/spark/hooks'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { IndentSize, IndentType, FormatOptions } from '@/lib/formatter'

interface FormatOptionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApply: (options: FormatOptions) => void
}

export function FormatOptionsDialog({ open, onOpenChange, onApply }: FormatOptionsDialogProps) {
  const [indentSize, setIndentSize] = useKV<IndentSize>('format-indent-size', 2)
  const [indentType, setIndentType] = useKV<IndentType>('format-indent-type', 'spaces')
  const [sortKeys, setSortKeys] = useKV<boolean>('format-sort-keys', false)

  const handleApply = () => {
    onApply({
      indentSize: indentSize || 2,
      indentType: indentType || 'spaces',
      sortKeys: sortKeys || false
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Format Options</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Indent Size</Label>
            <RadioGroup
              value={String(indentSize || 2)}
              onValueChange={(value) => setIndentSize(() => Number(value) as IndentSize)}
            >
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="2" id="indent-2" />
                <Label htmlFor="indent-2" className="font-normal cursor-pointer flex-1">
                  2 spaces
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="4" id="indent-4" />
                <Label htmlFor="indent-4" className="font-normal cursor-pointer flex-1">
                  4 spaces
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold">Indent Type</Label>
            <RadioGroup
              value={indentType || 'spaces'}
              onValueChange={(value) => setIndentType(() => value as IndentType)}
            >
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="spaces" id="type-spaces" />
                <Label htmlFor="type-spaces" className="font-normal cursor-pointer flex-1">
                  Spaces
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="tabs" id="type-tabs" />
                <Label htmlFor="type-tabs" className="font-normal cursor-pointer flex-1">
                  Tabs
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="space-y-0.5">
                <Label htmlFor="sort-keys" className="text-sm font-semibold cursor-pointer">
                  Sort Keys Alphabetically
                </Label>
                <p className="text-xs text-muted-foreground">
                  Sort object keys in ascending order
                </p>
              </div>
              <Switch
                id="sort-keys"
                checked={sortKeys || false}
                onCheckedChange={(checked) => setSortKeys(() => checked)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={() => onOpenChange(false)}
            className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-all rounded-lg hover:bg-muted/50"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg hover:shadow-lg transition-all hover:scale-105"
          >
            Apply & Format
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
