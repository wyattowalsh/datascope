import { useKV } from '@github/spark/hooks'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { IndentSize, IndentType, FormatOptions } from '@/lib/formatter'

interface FormatOptionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApply: (options: FormatOptions) => void
}

export function FormatOptionsDialog({ open, onOpenChange, onApply }: FormatOptionsDialogProps) {
  const [indentSize, setIndentSize] = useKV<IndentSize>('format-indent-size', 2)
  const [indentType, setIndentType] = useKV<IndentType>('format-indent-type', 'spaces')

  const handleApply = () => {
    onApply({
      indentSize: indentSize || 2,
      indentType: indentType || 'spaces'
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Format Options</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label>Indent Size</Label>
            <RadioGroup
              value={String(indentSize || 2)}
              onValueChange={(value) => setIndentSize(() => Number(value) as IndentSize)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="indent-2" />
                <Label htmlFor="indent-2" className="font-normal cursor-pointer">
                  2 spaces
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4" id="indent-4" />
                <Label htmlFor="indent-4" className="font-normal cursor-pointer">
                  4 spaces
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>Indent Type</Label>
            <RadioGroup
              value={indentType || 'spaces'}
              onValueChange={(value) => setIndentType(() => value as IndentType)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="spaces" id="type-spaces" />
                <Label htmlFor="type-spaces" className="font-normal cursor-pointer">
                  Spaces
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tabs" id="type-tabs" />
                <Label htmlFor="type-tabs" className="font-normal cursor-pointer">
                  Tabs
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Apply & Format
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
