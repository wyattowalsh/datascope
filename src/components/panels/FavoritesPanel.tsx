import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Star,
  Trash,
  MagnifyingGlass,
  Copy,
  Check
} from '@phosphor-icons/react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { STORAGE_KEYS } from '@/constants/storage-keys'

interface Favorite {
  path: string
  label: string
  timestamp: number
}

interface FavoritesPanelProps {
  currentPath: string[]
  onNavigate: (path: string[]) => void
}

export function FavoritesPanel({ currentPath, onNavigate }: FavoritesPanelProps) {
  const [favorites, setFavorites] = useKV<Favorite[]>(STORAGE_KEYS.FAVORITES, [])
  const { copy, copied } = useCopyToClipboard()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const addFavorite = () => {
    if (currentPath.length === 0) {
      toast.error('No path selected')
      return
    }

    const pathStr = currentPath.join('.')
    const existingFav = favorites?.find(f => f.path === pathStr)

    if (existingFav) {
      toast.info('Already in favorites')
      return
    }

    setFavorites((current) => [
      ...(current || []),
      {
        path: pathStr,
        label: currentPath[currentPath.length - 1] || 'root',
        timestamp: Date.now()
      }
    ])

    toast.success('Added to favorites')
  }

  const removeFavorite = (path: string) => {
    setFavorites((current) => (current || []).filter(f => f.path !== path))
    toast.success('Removed from favorites')
  }

  const handleNavigate = (pathStr: string) => {
    const pathArray = pathStr.split('.')
    onNavigate(pathArray)
    toast.success('Navigated to path')
  }

  const handleCopy = (pathStr: string) => {
    copy(pathStr, 'Path copied')
    setCopiedId(pathStr)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const isCurrentPath = currentPath.join('.') === favorites?.find(f => f.path === currentPath.join('.'))?.path
  const favList = favorites || []

  return (
    <Card className="p-5 space-y-4 shadow-xl border-border/50 bg-card/60 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-gradient-to-br from-syntax-number/20 to-accent/20">
          <Star size={18} weight="duotone" className="text-syntax-number" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground">Favorites</h3>
          <p className="text-xs text-muted-foreground">Bookmarked paths</p>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              onClick={addFavorite}
              disabled={currentPath.length === 0 || isCurrentPath}
              className="h-8 px-3 gap-1.5 hover:border-syntax-number/50 hover:bg-syntax-number/10"
            >
              <Star size={14} weight="duotone" />
              <span className="text-xs">Add</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Bookmark current path</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {favList.length === 0 ? (
        <div className="flex items-center justify-center h-[150px] text-muted-foreground">
          <div className="text-center space-y-2">
            <Star size={48} weight="duotone" className="mx-auto opacity-30" />
            <p className="text-sm">No favorites yet</p>
            <p className="text-xs">Navigate to a path and click "Add"</p>
          </div>
        </div>
      ) : (
        <ScrollArea className="h-[200px]">
          <div className="space-y-2">
            {favList.map((fav) => (
              <div
                key={fav.path}
                className="group p-3 rounded-lg border border-border/30 bg-muted/30 hover:bg-muted/50 hover:border-primary/30 transition-all duration-200"
              >
                <div className="flex items-start gap-2">
                  <Star
                    size={14}
                    weight="fill"
                    className="mt-1 flex-shrink-0 text-syntax-number"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground truncate">
                        {fav.label}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {fav.path.split('.').length} levels
                      </Badge>
                    </div>
                    <code className="text-xs text-muted-foreground block truncate">
                      {fav.path}
                    </code>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleNavigate(fav.path)}
                          className="h-7 w-7 hover:bg-primary/10 hover:text-primary"
                        >
                          <MagnifyingGlass size={14} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Navigate</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleCopy(fav.path)}
                          className="h-7 w-7 hover:bg-accent/10 hover:text-accent"
                        >
                          {copiedId === fav.path ? (
                            <Check size={14} className="text-syntax-string" weight="bold" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Copy path</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeFavorite(fav.path)}
                          className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash size={14} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Remove</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      {favList.length > 0 && (
        <div className="pt-3 border-t border-border/30">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setFavorites([])}
            className="w-full text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash size={12} className="mr-1.5" />
            Clear All Favorites
          </Button>
        </div>
      )}
    </Card>
  )
}
