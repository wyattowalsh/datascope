import { useState, useEffect } from 'react'
import { FumadocsLayout } from '@/components/layout'
import { marked } from 'marked'
import { useKV } from '@github/spark/hooks'

// Import MDX content
import indexMdx from '../../content/docs/index.mdx?raw'
import gettingStartedMdx from '../../content/docs/getting-started.mdx?raw'
import featuresMdx from '../../content/docs/features.mdx?raw'
import architectureMdx from '../../content/docs/architecture.mdx?raw'
import apiMdx from '../../content/docs/api.mdx?raw'
import developmentMdx from '../../content/docs/development.mdx?raw'
import agentsGuideMdx from '../../content/docs/agents-guide.mdx?raw'
import changelogMdx from '../../content/docs/changelog.mdx?raw'
import contributingMdx from '../../content/docs/contributing.mdx?raw'
import securityMdx from '../../content/docs/security.mdx?raw'
import projectStructureMdx from '../../content/docs/project-structure.mdx?raw'

interface DocsProps {
  onBackToApp: () => void
}

const mdxContent: Record<string, string> = {
  'index': indexMdx,
  'getting-started': gettingStartedMdx,
  'features': featuresMdx,
  'architecture': architectureMdx,
  'api': apiMdx,
  'development': developmentMdx,
  'agents-guide': agentsGuideMdx,
  'changelog': changelogMdx,
  'contributing': contributingMdx,
  'security': securityMdx,
  'project-structure': projectStructureMdx,
}

// Strip frontmatter from MDX
function stripFrontmatter(content: string): string {
  const frontmatterRegex = /^---\s*\n[\s\S]*?\n---\s*\n/
  return content.replace(frontmatterRegex, '')
}

export function Docs({ onBackToApp }: DocsProps) {
  const [currentPage, setCurrentPage] = useKV<string>('docs-current-page', 'index')
  const [renderedContent, setRenderedContent] = useState<string>('')

  useEffect(() => {
    const page = currentPage || 'index'
    const content = mdxContent[page] || mdxContent['index']
    const strippedContent = stripFrontmatter(content)
    
    // Configure marked for better rendering
    marked.setOptions({
      breaks: true,
      gfm: true,
    })

    const renderContent = async () => {
      const html = await marked(strippedContent)
      setRenderedContent(html)
    }
    
    renderContent()
  }, [currentPage])

  return (
    <FumadocsLayout
      currentPage={currentPage || 'index'}
      onNavigate={setCurrentPage}
      onBackToApp={onBackToApp}
    >
      <div dangerouslySetInnerHTML={{ __html: renderedContent }} />
    </FumadocsLayout>
  )
}
