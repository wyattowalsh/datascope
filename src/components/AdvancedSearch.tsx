import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  MagnifyingGlass, 
  X, 
  Funnel,
  TextAa,
  Code,
  Path
} from '@phosphor-icons/react'
import { ValueType } from '@/lib/parser'
import { cn } from '@/lib/utils'

export interface SearchOptions {
  searchTerm: string
  searchMode: 'text' | 'regex' | 'path'
  caseSensitive: boolean
  wholeWord: boolean
  typeFilters: ValueType[]
}

interface AdvancedSearchProps {
  options: SearchOptions
  onChange: (options: SearchOptions) => void
  resultCount?: number
}

export function AdvancedSearch({ options, onChange, resultCount }: AdvancedSearchProps) {
  const [showFilters, setShowFilters] = useState(false)

  const handleSearchChange = (value: string) => {
    onChange({ ...options, searchTerm: value })
  }

  const handleModeChange = (mode: 'text' | 'regex' | 'path') => {
    onChange({ ...options, searchMode: mode })
  }

  const toggleTypeFilter = (type: ValueType) => {
    const newFilters = options.typeFilters.includes(type)
      ? options.typeFilters.filter(t => t !== type)
      : [...options.typeFilters, type]
    onChange({ ...options, typeFilters: newFilters })
  }

  const clearAllFilters = () => {
    onChange({
      ...options,
      searchTerm: '',
      typeFilters: [],
      caseSensitive: false,
      wholeWord: false
    })
  }

  const hasActiveFilters = options.searchTerm || options.typeFilters.length > 0

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <MagnifyingGlass size={18} weight="duotone" className="text-primary" />
        <h3 className="text-sm font-semibold">Advanced Search</h3>
        {resultCount !== undefined && (
          <Badge variant="secondary" className="ml-auto">
            {resultCount} results
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MagnifyingGlass
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={options.searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={
                options.searchMode === 'regex' 
                  ? 'Enter regex pattern...' 
                  : options.searchMode === 'path'
                  ? 'Search by path...'
                  : 'Search keys and values...'
              }
              className="pl-9 pr-9"
            />
            {options.searchTerm && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          <Button
            variant={showFilters ? 'default' : 'outline'}
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Funnel size={16} />
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearAllFilters}
            >
              <X size={16} />
            </Button>
          )}
        </div>

        <Tabs value={options.searchMode} onValueChange={(v) => handleModeChange(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="text" className="text-xs gap-1.5">
              <TextAa size={14} />
              Text
            </TabsTrigger>
            <TabsTrigger value="regex" className="text-xs gap-1.5">
              <Code size={14} />
              Regex
            </TabsTrigger>
            <TabsTrigger value="path" className="text-xs gap-1.5">
              <Path size={14} />
              Path
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {showFilters && (
          <div className="space-y-4 pt-2 border-t border-border">
            <div className="space-y-3">
              <p className="text-xs font-medium">Search Options</p>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="case-sensitive" className="text-sm">
                  Case sensitive
                </Label>
                <Switch
                  id="case-sensitive"
                  checked={options.caseSensitive}
                  onCheckedChange={(checked) => 
                    onChange({ ...options, caseSensitive: checked })
                  }
                />
              </div>

              {options.searchMode === 'text' && (
                <div className="flex items-center justify-between">
                  <Label htmlFor="whole-word" className="text-sm">
                    Whole word
                  </Label>
                  <Switch
                    id="whole-word"
                    checked={options.wholeWord}
                    onCheckedChange={(checked) => 
                      onChange({ ...options, wholeWord: checked })
                    }
                  />
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-3">
              <p className="text-xs font-medium">Filter by Type</p>
              
              <div className="grid grid-cols-2 gap-2">
                {(['string', 'number', 'boolean', 'null', 'array', 'object'] as ValueType[]).map(type => {
                  const colorMap: Record<ValueType, string> = {
                    string: 'bg-syntax-string/10 text-syntax-string border-syntax-string/20 hover:bg-syntax-string/20',
                    number: 'bg-syntax-number/10 text-syntax-number border-syntax-number/20 hover:bg-syntax-number/20',
                    boolean: 'bg-syntax-boolean/10 text-syntax-boolean border-syntax-boolean/20 hover:bg-syntax-boolean/20',
                    null: 'bg-syntax-null/10 text-syntax-null border-syntax-null/20 hover:bg-syntax-null/20',
                    array: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20',
                    object: 'bg-accent/10 text-accent border-accent/20 hover:bg-accent/20'
                  }

                  return (
                    <Button
                      key={type}
                      variant="outline"
                      size="sm"
                      className={cn(
                        'justify-start transition-all',
                        options.typeFilters.includes(type) && colorMap[type]
                      )}
                      onClick={() => toggleTypeFilter(type)}
                    >
                      <span className={cn(
                        'w-2 h-2 rounded-full mr-2',
                        options.typeFilters.includes(type) ? 'opacity-100' : 'opacity-30'
                      )} style={{
                        backgroundColor: options.typeFilters.includes(type) ? 'currentColor' : 'transparent',
                        border: '1.5px solid currentColor'
                      }} />
                      {type}
                    </Button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {options.typeFilters.length > 0 && !showFilters && (
          <div className="flex flex-wrap gap-2">
            {options.typeFilters.map(type => (
              <Badge
                key={type}
                variant="secondary"
                className="cursor-pointer hover:bg-secondary/80 transition-colors"
                onClick={() => toggleTypeFilter(type)}
              >
                {type}
                <X size={12} className="ml-1" />
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
