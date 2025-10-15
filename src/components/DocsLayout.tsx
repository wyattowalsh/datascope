import { useState } from 'react'
import { Book, List, X, FileText, Code, Stack, Package, Wrench } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Card } from '@/components/ui/card'
import logoSvg from '@/assets/images/logo.svg'

interface DocsPage {
  id: string
  title: string
  icon: any
}

const pages: DocsPage[] = [
  { id: 'index', title: 'Introduction', icon: Book },
  { id: 'getting-started', title: 'Getting Started', icon: FileText },
  { id: 'features', title: 'Features', icon: Stack },
  { id: 'architecture', title: 'Architecture', icon: Package },
  { id: 'api', title: 'API Reference', icon: Code },
  { id: 'development', title: 'Development', icon: Wrench },
]

interface DocsLayoutProps {
  children: React.ReactNode
  currentPage: string | undefined
  onPageChange: (pageId: string) => void
  onBackToApp?: () => void
}

export function DocsLayout({ children, currentPage, onPageChange, onBackToApp }: DocsLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mr-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <List size={20} />}
          </Button>
          
          <div className="flex items-center gap-2 mr-4">
            <img src={logoSvg} alt="DataScope" className="w-6 h-6" />
            <span className="font-bold">DataScope</span>
          </div>

          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center gap-2">
              {onBackToApp && (
                <Button variant="ghost" size="sm" onClick={onBackToApp}>
                  App
                </Button>
              )}
            </nav>
          </div>
        </div>
      </header>

      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside 
          className={`fixed top-14 z-30 -ml-2 h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block ${
            sidebarOpen ? 'block' : 'hidden'
          }`}
        >
          <ScrollArea className="h-full py-6 pr-6 lg:py-8">
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 text-sm font-semibold">Documentation</h4>
                <div className="space-y-1">
                  {pages.map((page) => {
                    const Icon = page.icon
                    return (
                      <Button
                        key={page.id}
                        variant={currentPage === page.id ? 'secondary' : 'ghost'}
                        className="w-full justify-start gap-2"
                        onClick={() => {
                          onPageChange(page.id)
                          setSidebarOpen(false)
                        }}
                      >
                        <Icon size={16} weight="duotone" />
                        {page.title}
                      </Button>
                    )
                  })}
                </div>
              </div>
            </div>
          </ScrollArea>
        </aside>

        <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
          <div className="mx-auto w-full min-w-0">
            <Card className="p-6 md:p-8">
              {children}
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
