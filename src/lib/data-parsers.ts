/**
 * Additional data format parsers for XML, TOML, INI, and Properties files
 */

/**
 * Parse XML to JSON (basic parser)
 * For production, consider using fast-xml-parser library
 */
export function parseXML(xmlString: string): any {
  // Basic XML to JSON conversion
  // This is a simplified parser - for complex XML, use a proper library
  const result: any = {
    _note: 'Basic XML parser - some features may not be supported',
    _raw: xmlString.substring(0, 500) + (xmlString.length > 500 ? '...' : '')
  }
  
  // Extract root element
  const rootMatch = xmlString.match(/<(\w+)[^>]*>([\s\S]*)<\/\1>/)
  if (rootMatch) {
    const rootTag = rootMatch[1]
    const content = rootMatch[2]
    result[rootTag] = parseXMLContent(content)
  }
  
  return result
}

function parseXMLContent(content: string): any {
  const result: any = {}
  const tagRegex = /<(\w+)[^>]*>([\s\S]*?)<\/\1>/g
  let match
  
  while ((match = tagRegex.exec(content)) !== null) {
    const tag = match[1]
    const value = match[2].trim()
    
    // Check if value contains more XML
    if (value.includes('<')) {
      result[tag] = parseXMLContent(value)
    } else {
      result[tag] = value
    }
  }
  
  // If no tags found, return the content itself
  if (Object.keys(result).length === 0) {
    return content.trim()
  }
  
  return result
}

/**
 * Parse TOML to JSON
 * Basic TOML parser - handles common cases
 */
export function parseTOML(tomlString: string): any {
  const result: any = {}
  const lines = tomlString.split('\n')
  let currentSection: any = result
  let currentSectionPath: string[] = []
  
  for (const line of lines) {
    const trimmed = line.trim()
    
    // Skip comments and empty lines
    if (!trimmed || trimmed.startsWith('#')) continue
    
    // Section header [section]
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      const sectionName = trimmed.slice(1, -1).trim()
      const parts = sectionName.split('.')
      
      currentSection = result
      currentSectionPath = []
      
      for (const part of parts) {
        currentSectionPath.push(part)
        if (!currentSection[part]) {
          currentSection[part] = {}
        }
        currentSection = currentSection[part]
      }
      continue
    }
    
    // Key = Value
    const equalIndex = trimmed.indexOf('=')
    if (equalIndex > 0) {
      const key = trimmed.slice(0, equalIndex).trim()
      let value: any = trimmed.slice(equalIndex + 1).trim()
      
      // Remove quotes
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      // Parse numbers
      else if (!isNaN(Number(value))) {
        value = Number(value)
      }
      // Parse booleans
      else if (value === 'true') value = true
      else if (value === 'false') value = false
      // Parse arrays
      else if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map((v: string) => {
          v = v.trim()
          if ((v.startsWith('"') && v.endsWith('"')) || 
              (v.startsWith("'") && v.endsWith("'"))) {
            return v.slice(1, -1)
          }
          if (!isNaN(Number(v))) return Number(v)
          return v
        })
      }
      
      currentSection[key] = value
    }
  }
  
  return result
}

/**
 * Parse INI file to JSON
 */
export function parseINI(iniString: string): any {
  const result: any = {}
  const lines = iniString.split('\n')
  let currentSection = 'default'
  
  result[currentSection] = {}
  
  for (const line of lines) {
    const trimmed = line.trim()
    
    // Skip comments and empty lines
    if (!trimmed || trimmed.startsWith(';') || trimmed.startsWith('#')) continue
    
    // Section header [section]
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      currentSection = trimmed.slice(1, -1).trim()
      if (!result[currentSection]) {
        result[currentSection] = {}
      }
      continue
    }
    
    // Key = Value
    const equalIndex = trimmed.indexOf('=')
    if (equalIndex > 0) {
      const key = trimmed.slice(0, equalIndex).trim()
      let value: any = trimmed.slice(equalIndex + 1).trim()
      
      // Remove quotes
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      // Parse numbers
      else if (!isNaN(Number(value))) {
        value = Number(value)
      }
      // Parse booleans
      else if (value.toLowerCase() === 'true') value = true
      else if (value.toLowerCase() === 'false') value = false
      
      result[currentSection][key] = value
    }
  }
  
  return result
}

/**
 * Parse Java Properties file to JSON
 */
export function parseProperties(propertiesString: string): any {
  const result: any = {}
  const lines = propertiesString.split('\n')
  
  for (const line of lines) {
    const trimmed = line.trim()
    
    // Skip comments and empty lines
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('!')) continue
    
    // Key = Value or Key : Value
    const separatorIndex = Math.max(trimmed.indexOf('='), trimmed.indexOf(':'))
    if (separatorIndex > 0) {
      const key = trimmed.slice(0, separatorIndex).trim()
      let value: any = trimmed.slice(separatorIndex + 1).trim()
      
      // Handle nested keys (dot notation)
      const keyParts = key.split('.')
      let current = result
      
      for (let i = 0; i < keyParts.length - 1; i++) {
        const part = keyParts[i]
        if (!current[part]) {
          current[part] = {}
        }
        current = current[part]
      }
      
      const finalKey = keyParts[keyParts.length - 1]
      
      // Parse numbers
      if (!isNaN(Number(value))) {
        value = Number(value)
      }
      // Parse booleans
      else if (value.toLowerCase() === 'true') value = true
      else if (value.toLowerCase() === 'false') value = false
      
      current[finalKey] = value
    }
  }
  
  return result
}

/**
 * Detect data format from content
 */
export function detectDataFormat(content: string): string {
  const trimmed = content.trim()
  
  if (!trimmed) return 'unknown'
  
  // XML
  if (trimmed.startsWith('<?xml') || (trimmed.startsWith('<') && trimmed.endsWith('>'))) {
    return 'xml'
  }
  
  // JSONL
  if (trimmed.split('\n').length > 1 && trimmed.split('\n').every(line => {
    const l = line.trim()
    return !l || (l.startsWith('{') && l.endsWith('}'))
  })) {
    return 'jsonl'
  }
  
  // CSV
  const lines = trimmed.split('\n')
  if (lines.length > 1 && lines[0].includes(',')) {
    const hasConsistentCommas = lines.slice(0, Math.min(5, lines.length)).every(line => 
      line.includes(',')
    )
    if (hasConsistentCommas) return 'csv'
  }
  
  // TOML (check for [section] headers or key = value pairs)
  if (trimmed.includes('[') && trimmed.includes(']') && trimmed.includes('=')) {
    const hasTomlSection = /^\[[\w.]+\]/m.test(trimmed)
    if (hasTomlSection) return 'toml'
  }
  
  // INI (check for [section] headers)
  if (trimmed.includes('[') && trimmed.includes(']') && trimmed.includes('=')) {
    const hasIniSection = /^\[[^\]]+\]/m.test(trimmed)
    if (hasIniSection) return 'ini'
  }
  
  // Properties (simple key=value or key:value lines)
  if (trimmed.includes('=') || trimmed.includes(':')) {
    const looksLikeProperties = trimmed.split('\n').some(line => {
      const t = line.trim()
      return t && !t.startsWith('#') && !t.startsWith('!') && 
             (t.includes('=') || t.includes(':'))
    })
    if (looksLikeProperties && !trimmed.startsWith('{') && !trimmed.startsWith('[')) {
      return 'properties'
    }
  }
  
  // YAML (check for key: value patterns without braces/brackets)
  if (trimmed.match(/^[\w-]+:\s*.+/m) && !trimmed.startsWith('{') && !trimmed.startsWith('[')) {
    return 'yaml'
  }
  
  // JSON
  try {
    JSON.parse(trimmed)
    return 'json'
  } catch {
    return 'unknown'
  }
}
