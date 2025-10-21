import { ReactNode, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { 
  ArrowLeft, 
  MagnifyingGlass, 
  List, 
  X,
  House,
  FileCode,
  Cube,
  GitBranch,
  Code,
  Wrench
} from '@phosphor-icons/react'
import { useTheme } from '@/hooks/use-theme'
import logoSvg from '@/assets/images/logo.svg'

interface FumadocsLayoutProps {
  children: ReactNode
  currentPage: string
  onNavigate: (page: string) => void
  onBackToApp: () => void
}

interface NavItem {
  id: string
  title: string
  icon: ReactNode
}

const navigation: NavItem[] = [
  { id: 'index', title: 'Overview', icon: <House weight="duotone" size={18} /> },
  { id: 'getting-started', title: 'Getting Started', icon: <FileCode weight="duotone" size={18} /> },
  { id: 'features', title: 'Features', icon: <Cube weight="duotone" size={18} /> },
  { id: 'architecture', title: 'Architecture', icon: <GitBranch weight="duotone" size={18} /> },
  { id: 'api', title: 'API Reference', icon: <Code weight="duotone" size={18} /> },
  { id: 'development', title: 'Development', icon: <Wrench weight="duotone" size={18} /> },
]

export function FumadocsLayout({ children, currentPage, onNavigate, onBackToApp }: FumadocsLayoutProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { theme } = useTheme()

  const filteredNav = navigation.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-card/70 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToApp}
              className="gap-2"
            >
              <ArrowLeft size={18} />
              Back to App
            </Button>
            
            <div className="h-6 w-px bg-border/50" />
            
            <div className="flex items-center gap-2">
              <img src={logoSvg} alt="DataScope" className="h-8 w-8" />
              <span className="text-lg font-semibold">DataScope Docs</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <X size={20} /> : <List size={20} />}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed inset-y-16 left-0 z-40 w-64 border-r border-border/50 bg-card/70 backdrop-blur-md transition-transform lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:translate-x-0`}
        >
          <div className="flex h-full flex-col">
            {/* Search */}
            <div className="p-4">
              <div className="relative">
                <MagnifyingGlass
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  type="text"
                  placeholder="Search docs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 px-4">
              <nav className="space-y-1 pb-4">
                {filteredNav.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id)
                      if (window.innerWidth < 1024) {
                        setSidebarOpen(false)
                      }
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      currentPage === item.id
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-foreground/70 hover:bg-accent/10 hover:text-foreground'
                    }`}
                  >
                    {item.icon}
                    {item.title}
                  </button>
                ))}
              </nav>
            </ScrollArea>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
            <article className="prose prose-slate dark:prose-invert max-w-none">
              {children}
            </article>
          </div>
        </main>
      </div>
    </div>
  )
}
