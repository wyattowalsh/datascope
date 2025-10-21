# AGENTS.md - Documentation System

This file provides context for working on DataScope's documentation in `content/docs/`.

## Documentation structure

All documentation is MDX format with frontmatter in `content/docs/`:

1. `index.mdx` - Documentation home
2. `getting-started.mdx` - Quick start guide
3. `features.mdx` - Feature reference
4. `architecture.mdx` - System architecture
5. `api.mdx` - API documentation
6. `development.mdx` - Development guide
7. `changelog.mdx` - Version history
8. `contributing.mdx` - Contribution guidelines
9. `security.mdx` - Security policy
10. `project-structure.mdx` - File organization

## MDX conventions

### Frontmatter

Every MDX file must have frontmatter:

```yaml
---
title: "Page Title"
description: "Brief description for SEO"
---
```

### Code blocks

Use language identifiers for syntax highlighting:

````markdown
```typescript
// TypeScript code here
```

```bash
# Shell commands here
```
````

### Links

- Internal: Use relative paths `[Link](./other-page)`
- External: Include full URLs `[Link](https://example.com)`

## Navigation

Navigation is controlled by `content/docs/meta.json`:

```json
{
  "index": "Documentation",
  "getting-started": "Getting Started",
  "features": "Features"
}
```

Order in meta.json determines sidebar order.

## Rendering system

Documentation is rendered by `src/pages/Docs.tsx`:

- Uses `marked` for markdown parsing
- `FumadocsLayout` wrapper provides navigation
- `stripFrontmatter()` removes YAML before rendering
- State persisted with `useKV('docs-current-page')`

## Adding new documentation pages

1. Create `new-page.mdx` in `content/docs/`
2. Add frontmatter (title, description)
3. Write content in MDX
4. Add entry to `meta.json`
5. Import in `Docs.tsx`:

```typescript
import newPageContent from '@/content/docs/new-page.mdx?raw'

const pages = {
  // ...existing pages
  'new-page': newPageContent,
}
```

6. Test navigation and rendering

## Common issues

### Missing frontmatter

Error: "Cannot read property 'title' of undefined"

Solution: Add frontmatter block to MDX file

### Broken navigation

Check `meta.json` - ensure key matches filename without `.mdx`

### Code blocks not highlighting

Verify language identifier is on same line as opening ```

## Style guide

- Headings: Use sentence case
- Lists: Use `-` for unordered, `1.` for ordered
- Emphasis: `**bold**` for important, `*italic*` for emphasis
- Code: Use backticks for inline code, code blocks for multi-line
- Links: Descriptive text, not "click here"

---

**Last Updated**: 2025-01-16
