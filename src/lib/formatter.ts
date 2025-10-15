import { stringify as stringifyYAML } from 'yaml'

export type IndentSize = 2 | 4
export type IndentType = 'spaces' | 'tabs'

export interface FormatOptions {
  indentSize: IndentSize
  indentType: IndentType
}

export interface FormatResult {
  success: boolean
  formatted?: string
  error?: string
}

export function formatJSON(input: string, options: FormatOptions): FormatResult {
  try {
    const parsed = JSON.parse(input)
    const indent = options.indentType === 'tabs' ? '\t' : ' '.repeat(options.indentSize)
    const formatted = JSON.stringify(parsed, null, indent)
    return { success: true, formatted }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export function minifyJSON(input: string): FormatResult {
  try {
    const parsed = JSON.parse(input)
    const formatted = JSON.stringify(parsed)
    return { success: true, formatted }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export function formatYAML(input: string, options: FormatOptions): FormatResult {
  try {
    const parsed = JSON.parse(input)
    const indent = options.indentType === 'tabs' ? 1 : options.indentSize
    const formatted = stringifyYAML(parsed, { indent })
    return { success: true, formatted }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export interface LintError {
  line: number
  column: number
  message: string
  type: 'error' | 'warning'
}

export function lintJSON(input: string): LintError[] {
  const errors: LintError[] = []
  
  if (!input.trim()) {
    return [{ line: 1, column: 1, message: 'Empty input', type: 'error' }]
  }

  try {
    JSON.parse(input)
  } catch (error: any) {
    const match = error.message.match(/position (\d+)/)
    const position = match ? parseInt(match[1]) : 0
    const lines = input.substring(0, position).split('\n')
    const line = lines.length
    const column = lines[lines.length - 1].length + 1
    
    errors.push({
      line,
      column,
      message: error.message,
      type: 'error'
    })
  }

  const trailingCommaRegex = /,(\s*[}\]])/g
  let match
  while ((match = trailingCommaRegex.exec(input)) !== null) {
    const lines = input.substring(0, match.index).split('\n')
    errors.push({
      line: lines.length,
      column: lines[lines.length - 1].length + 1,
      message: 'Trailing comma (not valid in strict JSON)',
      type: 'warning'
    })
  }

  return errors
}

export function validateIndentation(input: string, expectedSize: IndentSize): LintError[] {
  const errors: LintError[] = []
  const lines = input.split('\n')
  
  lines.forEach((line, index) => {
    const leadingSpaces = line.match(/^(\s*)/)?.[1] || ''
    if (leadingSpaces.length > 0 && leadingSpaces.length % expectedSize !== 0) {
      errors.push({
        line: index + 1,
        column: 1,
        message: `Inconsistent indentation (expected multiples of ${expectedSize})`,
        type: 'warning'
      })
    }
  })
  
  return errors
}
