import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { useTheme } from '@/hooks/use-theme'
import { 
  Copy, 
  Check, 
  File, 
  FileCode, 
  ChartBar,
  Sun,
  Moon,
  TextAlignLeft,
  Minus,
  ArrowsOut,
  ArrowsIn,
  Gear,
  Graph,
  TreeStructure,
  Table,
  ListBullets,
  FileCsv,
  Download,
  Toolbox,
  Keyboard,
  Cube,
  Book
} from '@phosphor-icons/react'
import logoSvg from '@/assets/images/logo.svg'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { TreeView } from '@/components/TreeView'
import { FormatOptionsDialog } from '@/components/FormatOptionsDialog'
import { LintErrorsDisplay } from '@/components/LintErrorsDisplay'
import { GraphVisualization } from '@/components/GraphVisualization'
import { Graph3DVisualization } from '@/components/Graph3DVisualization'
import { AdvancedSearch, SearchOptions } from '@/components/AdvancedSearch'
import { FileInput } from '@/components/FileInput'
import { ExportDialog } from '@/components/ExportDialog'
import { SchemaExtractor } from '@/components/SchemaExtractor'
import { DataTransformer } from '@/components/DataTransformer'
import { DataComparator } from '@/components/DataComparator'
import { ShortcutsDialog, useKeyboardShortcuts } from '@/components/ShortcutsDialog'
import { DataHistory, saveToHistory } from '@/components/DataHistory'
import { StatsPanel, InsightsPanel, PerformanceAnalysis, GraphAnalyticsPanel } from '@/components/analytics'
import { QuickActionsPanel } from '@/components/QuickActionsPanel'
import { DataValidator } from '@/components/DataValidator'
import { QuickViewPanel } from '@/components/QuickViewPanel'
import { FavoritesPanel } from '@/components/FavoritesPanel'
import { SmartSuggestionsPanel } from '@/components/SmartSuggestionsPanel'
import { parseData, buildTree, calculateStats, getPathString, advancedSearchNodes, TreeNode, ValueType, DataFormat } from '@/lib/parser'
import { formatJSON, minifyJSON, formatYAML, formatJSONL, lintJSON, FormatOptions, LintError } from '@/lib/formatter'
import { buildGraph, analyzeGraph, GraphData, GraphAnalytics } from '@/lib/graph-analyzer'
import { gtmDataParsed, gtmFileLoaded, gtmViewChanged, gtmSearchPerformed, gtmFormatAction } from '@/lib/analytics'
import { toast } from 'sonner'

const EXAMPLE_JSON = `{
  "organization": {
    "id": "org_2024_alpha",
    "name": "TechCorp Global",
    "founded": "2015-03-10",
    "headquarters": {
      "address": {
        "street": "123 Innovation Drive",
        "city": "San Francisco",
        "state": "CA",
        "zip": "94105",
        "country": "USA"
      },
      "coordinates": {
        "lat": 37.7749,
        "lng": -122.4194
      }
    },
    "departments": [
      {
        "id": "dept_eng",
        "name": "Engineering",
        "head": "Sarah Chen",
        "budget": 15000000,
        "teams": [
          {
            "name": "Platform",
            "members": 45,
            "projects": ["DataScope", "CloudSync", "APIGateway"],
            "techStack": ["React", "TypeScript", "Node.js", "PostgreSQL"],
            "performance": {
              "velocity": 8.7,
              "quality": 9.2,
              "satisfaction": 8.9
            }
          },
          {
            "name": "Mobile",
            "members": 28,
            "projects": ["iOS App", "Android App"],
            "techStack": ["Swift", "Kotlin", "React Native"],
            "performance": {
              "velocity": 7.8,
              "quality": 8.5,
              "satisfaction": 8.2
            }
          },
          {
            "name": "DevOps",
            "members": 12,
            "projects": ["CI/CD Pipeline", "Infrastructure"],
            "techStack": ["Kubernetes", "Docker", "Terraform", "GitHub Actions"],
            "performance": {
              "velocity": 9.1,
              "quality": 9.5,
              "satisfaction": 9.0
            }
          }
        ]
      },
      {
        "id": "dept_product",
        "name": "Product",
        "head": "Michael Torres",
        "budget": 8500000,
        "teams": [
          {
            "name": "Design",
            "members": 18,
            "projects": ["Design System", "User Research"],
            "techStack": ["Figma", "Adobe Creative Suite"],
            "performance": {
              "velocity": 8.3,
              "quality": 9.4,
              "satisfaction": 9.1
            }
          },
          {
            "name": "Strategy",
            "members": 15,
            "projects": ["Market Analysis", "Roadmap Planning"],
            "techStack": ["Analytics", "Tableau"],
            "performance": {
              "velocity": 7.5,
              "quality": 8.8,
              "satisfaction": 8.6
            }
          }
        ]
      },
      {
        "id": "dept_sales",
        "name": "Sales & Marketing",
        "head": "Jessica Yamamoto",
        "budget": 12000000,
        "teams": [
          {
            "name": "Enterprise Sales",
            "members": 35,
            "projects": ["Q1 Campaign", "Lead Generation"],
            "techStack": ["Salesforce", "HubSpot"],
            "performance": {
              "velocity": 8.9,
              "quality": 8.7,
              "satisfaction": 8.4
            }
          }
        ]
      }
    ],
    "metrics": {
      "revenue": {
        "2023": 125000000,
        "2024": 178000000,
        "growth": 42.4
      },
      "employees": {
        "total": 453,
        "engineering": 185,
        "product": 78,
        "sales": 105,
        "operations": 85
      },
      "customers": {
        "total": 15780,
        "enterprise": 342,
        "smb": 15438,
        "retention": 94.2
      }
    },
    "products": [
      {
        "id": "prod_datascope",
        "name": "DataScope",
        "description": "Professional data visualization and analytics platform",
        "price": 49.99,
        "active": true,
        "features": ["Multi-format support", "Graph analytics", "3D visualization"],
        "users": 12500,
        "rating": 4.8
      },
      {
        "id": "prod_cloudsync",
        "name": "CloudSync",
        "description": "Real-time data synchronization service",
        "price": 29.99,
        "active": true,
        "features": ["Real-time sync", "Conflict resolution", "Encryption"],
        "users": 8900,
        "rating": 4.6
      },
      {
        "id": "prod_apigateway",
        "name": "API Gateway",
        "description": "Enterprise API management platform",
        "price": 99.99,
        "active": true,
        "features": ["Rate limiting", "Authentication", "Analytics"],
        "users": 3200,
        "rating": 4.9
      }
    ],
    "certifications": ["ISO 27001", "SOC 2 Type II", "GDPR Compliant"],
    "partnerships": {
      "strategic": ["AWS", "Google Cloud", "Microsoft Azure"],
      "technology": ["GitHub", "Stripe", "Twilio"],
      "integration": ["Salesforce", "Slack", "Zoom"]
    },
    "socialMedia": {
      "twitter": "@techcorp",
      "linkedin": "techcorp-global",
      "github": "techcorp",
      "followers": {
        "twitter": 45000,
        "linkedin": 128000,
        "github": 23000
      }
    }
  }
}`

const EXAMPLE_YAML = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: datascope-web
  namespace: production
  labels:
    app: datascope
    tier: frontend
    version: v2.5.0
  annotations:
    deployment.kubernetes.io/revision: "42"
    description: "DataScope web application deployment"
spec:
  replicas: 5
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 2
      maxUnavailable: 1
  selector:
    matchLabels:
      app: datascope
      tier: frontend
  template:
    metadata:
      labels:
        app: datascope
        tier: frontend
        version: v2.5.0
    spec:
      containers:
        - name: web
          image: datascope/web:2.5.0
          ports:
            - containerPort: 3000
              name: http
              protocol: TCP
            - containerPort: 9090
              name: metrics
              protocol: TCP
          env:
            - name: NODE_ENV
              value: production
            - name: API_URL
              value: https://api.datascope.w4w.dev
            - name: REDIS_HOST
              valueFrom:
                configMapKeyRef:
                  name: redis-config
                  key: host
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: database-credentials
                  key: url
          resources:
            requests:
              memory: "512Mi"
              cpu: "500m"
            limits:
              memory: "1Gi"
              cpu: "1000m"
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 10
            timeoutSeconds: 5
            failureThreshold: 3
          readinessProbe:
            httpGet:
              path: /ready
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
            timeoutSeconds: 3
            successThreshold: 1
          volumeMounts:
            - name: config
              mountPath: /app/config
              readOnly: true
            - name: cache
              mountPath: /app/cache
        - name: sidecar-proxy
          image: envoyproxy/envoy:v1.25.0
          ports:
            - containerPort: 8080
              name: proxy
          resources:
            requests:
              memory: "128Mi"
              cpu: "100m"
            limits:
              memory: "256Mi"
              cpu: "200m"
      volumes:
        - name: config
          configMap:
            name: app-config
        - name: cache
          emptyDir:
            sizeLimit: 1Gi
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              podAffinityTerm:
                labelSelector:
                  matchExpressions:
                    - key: app
                      operator: In
                      values:
                        - datascope
                topologyKey: kubernetes.io/hostname
      nodeSelector:
        node.kubernetes.io/instance-type: m5.large
        environment: production
      tolerations:
        - key: dedicated
          operator: Equal
          value: frontend
          effect: NoSchedule`

const EXAMPLE_JSONL = `{"timestamp": "2024-03-20T10:15:32.442Z", "level": "info", "service": "api-gateway", "requestId": "req_a8f3d9e1", "method": "POST", "path": "/api/v1/users", "statusCode": 201, "duration": 145, "ip": "203.0.113.42", "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", "userId": "usr_88291", "message": "User created successfully"}
{"timestamp": "2024-03-20T10:15:33.128Z", "level": "info", "service": "auth-service", "requestId": "req_b9c4e2a8", "method": "POST", "path": "/auth/login", "statusCode": 200, "duration": 89, "ip": "198.51.100.23", "userAgent": "Chrome/122.0.0.0", "userId": "usr_45672", "message": "Login successful", "metadata": {"mfa": true, "device": "desktop"}}
{"timestamp": "2024-03-20T10:15:34.557Z", "level": "error", "service": "database", "requestId": "req_c1d5f3b2", "error": "Connection timeout", "query": "SELECT * FROM users WHERE active = true", "duration": 5000, "retries": 3, "message": "Database query timeout after 3 retries"}
{"timestamp": "2024-03-20T10:15:35.223Z", "level": "warn", "service": "cache", "requestId": "req_d2e6g4c3", "key": "user:45672:profile", "operation": "GET", "hit": false, "message": "Cache miss - fetching from database", "metadata": {"ttl": 3600}}
{"timestamp": "2024-03-20T10:15:36.891Z", "level": "info", "service": "analytics", "requestId": "req_e3f7h5d4", "event": "page_view", "page": "/dashboard", "userId": "usr_45672", "sessionId": "ses_xyz789", "duration": 1234, "message": "Page view tracked", "properties": {"referrer": "direct", "device": "desktop", "country": "US"}}
{"timestamp": "2024-03-20T10:15:37.445Z", "level": "info", "service": "payment", "requestId": "req_f4g8i6e5", "method": "POST", "path": "/api/v1/payments", "statusCode": 200, "amount": 4999, "currency": "USD", "userId": "usr_12345", "message": "Payment processed", "metadata": {"provider": "stripe", "cardType": "visa", "last4": "4242"}}
{"timestamp": "2024-03-20T10:15:38.667Z", "level": "debug", "service": "search", "requestId": "req_g5h9j7f6", "query": "data visualization tools", "results": 142, "duration": 28, "filters": {"category": "analytics", "minRating": 4.0}, "message": "Search query executed"}
{"timestamp": "2024-03-20T10:15:39.112Z", "level": "info", "service": "notification", "requestId": "req_h6i0k8g7", "type": "email", "recipient": "user@example.com", "template": "welcome", "status": "sent", "message": "Email notification sent", "metadata": {"provider": "sendgrid", "messageId": "msg_abc123"}}
{"timestamp": "2024-03-20T10:15:40.334Z", "level": "error", "service": "storage", "requestId": "req_i7j1l9h8", "operation": "upload", "filename": "report.pdf", "size": 2048576, "error": "Quota exceeded", "userId": "usr_99888", "message": "File upload failed - storage quota exceeded"}
{"timestamp": "2024-03-20T10:15:41.778Z", "level": "info", "service": "api-gateway", "requestId": "req_j8k2m0i9", "method": "GET", "path": "/api/v1/analytics/dashboard", "statusCode": 200, "duration": 67, "ip": "192.0.2.15", "userId": "usr_45672", "message": "Analytics data retrieved", "metadata": {"cacheHit": true, "dataPoints": 1250}}`

const EXAMPLE_CSV = `userId,username,email,signupDate,subscription,monthlySpend,active,country,lastLogin,sessionsCount,conversionRate,lifetimeValue
1001,alex_rivera,alex.rivera@techmail.com,2023-01-15,premium,89.99,true,USA,2024-03-20T14:32:10Z,342,12.5,3599.58
1002,sarah_chen,sarah.c@cloudservices.io,2023-02-22,enterprise,249.99,true,Canada,2024-03-20T09:15:33Z,567,18.3,9999.58
1003,michael_torres,m.torres@startup.dev,2023-03-10,free,0.00,true,Mexico,2024-03-19T22:44:55Z,45,3.2,0.00
1004,jessica_yamamoto,jyamamoto@corp.com,2023-01-08,premium,89.99,true,Japan,2024-03-20T06:22:17Z,891,22.1,8099.10
1005,david_kim,david.k@innovate.ai,2023-04-05,business,149.99,true,South Korea,2024-03-20T11:08:42Z,234,9.8,4349.71
1006,emily_anderson,emily.a@design.studio,2023-05-18,premium,89.99,false,UK,2024-02-28T16:55:03Z,123,7.4,1349.85
1007,carlos_rodriguez,carlos.r@analytics.pro,2023-02-14,enterprise,249.99,true,Spain,2024-03-20T13:11:29Z,678,25.6,12499.50
1008,anna_kowalski,a.kowalski@tech.pl,2023-06-22,free,0.00,true,Poland,2024-03-18T19:33:14Z,67,5.1,0.00
1009,raj_patel,raj.p@software.in,2023-03-30,business,149.99,true,India,2024-03-20T08:47:21Z,445,15.7,5849.58
1010,lisa_mueller,l.mueller@enterprise.de,2023-01-20,enterprise,249.99,true,Germany,2024-03-20T10:29:36Z,789,31.2,15749.25
1011,tom_wilson,tom.w@freelance.com,2023-07-11,premium,89.99,true,Australia,2024-03-20T02:14:08Z,156,8.9,1889.79
1012,maria_silva,maria.s@startup.br,2023-04-25,free,0.00,true,Brazil,2024-03-17T20:05:42Z,34,2.8,0.00
1013,chen_wang,c.wang@platform.cn,2023-02-08,business,149.99,true,China,2024-03-20T07:38:55Z,523,19.4,7049.54
1014,olivia_brown,olivia.b@agency.uk,2023-05-03,premium,89.99,true,UK,2024-03-20T15:22:17Z,267,11.3,2969.67
1015,pierre_dubois,p.dubois@tech.fr,2023-03-17,enterprise,249.99,true,France,2024-03-20T12:44:29Z,612,28.7,13499.45`

interface AppProps {
  onNavigateToDocs?: () => void
}

function App({ onNavigateToDocs }: AppProps = {}) {
  const [inputValue, setInputValue] = useKV('visualizer-input', '')
  const [detectedFormat, setDetectedFormat] = useState<DataFormat>('json')
  const [parsedData, setParsedData] = useState<any>(null)
  const [error, setError] = useState<string>('')
  const [treeNodes, setTreeNodes] = useState<TreeNode[]>([])
  const [selectedPath, setSelectedPath] = useState<string[]>([])
  const [copiedPath, setCopiedPath] = useState(false)
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set())
  const [showFormatDialog, setShowFormatDialog] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [showShortcutsDialog, setShowShortcutsDialog] = useState(false)
  const [lintErrors, setLintErrors] = useState<LintError[]>([])
  const [showLintErrors, setShowLintErrors] = useState(false)
  const [graphData, setGraphData] = useState<GraphData | null>(null)
  const [graphAnalytics, setGraphAnalytics] = useState<GraphAnalytics | null>(null)
  const [viewMode, setViewMode] = useState<'tree' | 'graph' | 'graph3d'>('tree')
  const [toolsExpanded, setToolsExpanded] = useState(false)
  const [parseMetrics, setParseMetrics] = useState<{parseTime: number, dataSize: number, nodeCount: number, edgeCount: number} | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [history, setHistory] = useKV<any[]>('data-history', [])
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    searchTerm: '',
    searchMode: 'text',
    caseSensitive: false,
    wholeWord: false,
    typeFilters: []
  })
  
  const { theme, toggleTheme } = useTheme()

  const detectFormat = useCallback((data: string): DataFormat => {
    if (!data || typeof data !== 'string') return 'json'
    
    const trimmed = data.trim()
    
    if (!trimmed) return 'json'
    
    if (trimmed.split('\n').length > 1 && trimmed.split('\n').every(line => {
      const l = line.trim()
      return !l || (l.startsWith('{') && l.endsWith('}'))
    })) {
      return 'jsonl'
    }
    
    const lines = trimmed.split('\n')
    if (lines.length > 1 && lines[0].includes(',')) {
      const hasConsistentCommas = lines.slice(0, Math.min(5, lines.length)).every(line => 
        line.includes(',')
      )
      if (hasConsistentCommas) return 'csv'
    }
    
    if (trimmed.match(/^[\w-]+:\s*.+/m) && !trimmed.startsWith('{') && !trimmed.startsWith('[')) {
      return 'yaml'
    }
    
    try {
      JSON.parse(trimmed)
      return 'json'
    } catch {
      return 'yaml'
    }
  }, [])

  useEffect(() => {
    if (inputValue) {
      const detected = detectFormat(inputValue)
      setDetectedFormat(detected)
    }
  }, [inputValue, detectFormat])

  const handleViewModeChange = useCallback((newMode: 'tree' | 'graph' | 'graph3d') => {
    setViewMode(newMode)
    gtmViewChanged(newMode)
  }, [])

  const handleParse = useCallback(() => {
    const startTime = performance.now()
    const result = parseData(inputValue || '', detectedFormat)
    const parseTime = performance.now() - startTime
    
    if (result.success && result.data) {
      setParsedData(result.data)
      setError('')
      const nodes = buildTree(result.data)
      setTreeNodes(nodes)
      setExpandedPaths(new Set())
      
      const graph = buildGraph(result.data)
      setGraphData(graph)
      
      const analytics = analyzeGraph(graph)
      setGraphAnalytics(analytics)
      
      setParseMetrics({
        parseTime,
        dataSize: new Blob([inputValue || '']).size,
        nodeCount: graph.nodes.length,
        edgeCount: graph.links.length
      })
      
      if (detectedFormat === 'json') {
        const errors = lintJSON(inputValue || '')
        setLintErrors(errors)
        setShowLintErrors(errors.length > 0)
      } else {
        setLintErrors([])
        setShowLintErrors(false)
      }
      
      saveToHistory(inputValue || '', detectedFormat, setHistory)
      
      gtmDataParsed(detectedFormat, true)
      toast.success(`${result.format?.toUpperCase()} parsed successfully`)
    } else {
      setParsedData(null)
      setTreeNodes([])
      setGraphData(null)
      setGraphAnalytics(null)
      setParseMetrics(null)
      setError(result.error || 'Failed to parse')
      setLintErrors([])
      setShowLintErrors(false)
      gtmDataParsed(detectedFormat, false)
      toast.error('Parse failed')
    }
  }, [inputValue, detectedFormat, setHistory])

  const stats = parsedData ? calculateStats(parsedData) : null

  const handleNodeUpdate = useCallback((path: string[], isExpanded: boolean) => {
    const pathKey = path.join('.')
    setExpandedPaths(prev => {
      const next = new Set(prev)
      if (isExpanded) {
        next.add(pathKey)
      } else {
        next.delete(pathKey)
      }
      return next
    })

    setTreeNodes(prevNodes => {
      const updateNode = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map(node => {
          if (JSON.stringify(node.path) === JSON.stringify(path)) {
            return { ...node, isExpanded }
          }
          if (node.children) {
            return { ...node, children: updateNode(node.children) }
          }
          return node
        })
      }
      return updateNode(prevNodes)
    })
  }, [])

  const handleExpandAll = useCallback(() => {
    const expandAllNodes = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map(node => {
        const updated = { ...node, isExpanded: true }
        if (node.children) {
          updated.children = expandAllNodes(node.children)
          node.children.forEach(child => {
            expandedPaths.add(child.path.join('.'))
          })
        }
        return updated
      })
    }
    setTreeNodes(expandAllNodes(treeNodes))
  }, [treeNodes, expandedPaths])

  const handleCollapseAll = useCallback(() => {
    const collapseAllNodes = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map(node => {
        const updated = { ...node, isExpanded: false }
        if (node.children) {
          updated.children = collapseAllNodes(node.children)
        }
        return updated
      })
    }
    setTreeNodes(collapseAllNodes(treeNodes))
    setExpandedPaths(new Set())
  }, [treeNodes])

  const handleCopyPath = useCallback(() => {
    const pathStr = getPathString(selectedPath, 'dot')
    navigator.clipboard.writeText(pathStr)
    setCopiedPath(true)
    toast.success('Path copied to clipboard')
    setTimeout(() => setCopiedPath(false), 2000)
  }, [selectedPath])

  const loadExample = useCallback((type: DataFormat) => {
    const examples: Record<DataFormat, string> = {
      json: EXAMPLE_JSON,
      yaml: EXAMPLE_YAML,
      jsonl: EXAMPLE_JSONL,
      csv: EXAMPLE_CSV,
      json5: EXAMPLE_JSON,
      unknown: EXAMPLE_JSON
    }
    setInputValue(examples[type] || EXAMPLE_JSON)
    setDetectedFormat(type)
  }, [setInputValue])

  const handleFileLoaded = useCallback((data: string, detectedFormatFromFile?: DataFormat) => {
    setInputValue(data)
    if (detectedFormatFromFile) {
      setDetectedFormat(detectedFormatFromFile)
    }
    saveToHistory(data, detectedFormatFromFile || detectedFormat, setHistory)
    gtmFileLoaded('file', detectedFormatFromFile)
  }, [setInputValue, detectedFormat, setHistory])

  const handleFormat = useCallback((options: FormatOptions) => {
    let result
    if (detectedFormat === 'json' || detectedFormat === 'json5') {
      result = formatJSON(inputValue || '', options)
    } else if (detectedFormat === 'jsonl') {
      result = formatJSONL(inputValue || '', options)
    } else if (detectedFormat === 'yaml') {
      result = formatYAML(inputValue || '', options)
    } else {
      toast.error('Format not supported for this data type')
      return
    }
    
    if (result.success && result.formatted) {
      setInputValue(result.formatted)
      gtmFormatAction('format', detectedFormat)
      toast.success(`${detectedFormat.toUpperCase()} formatted successfully`)
      handleParse()
    } else {
      toast.error(`Format failed: ${result.error}`)
    }
  }, [inputValue, detectedFormat, setInputValue, handleParse])

  const handleMinify = useCallback(() => {
    if (detectedFormat === 'json') {
      const result = minifyJSON(inputValue || '')
      if (result.success && result.formatted) {
        setInputValue(result.formatted)
        gtmFormatAction('minify', detectedFormat)
        toast.success('JSON minified successfully')
        handleParse()
      } else {
        toast.error(`Minify failed: ${result.error}`)
      }
    } else {
      toast.error('Minify is only available for JSON')
    }
  }, [inputValue, detectedFormat, setInputValue, handleParse])

  const handleGraphNodeClick = useCallback((nodeId: string) => {
    const pathArray = nodeId.replace(/^root\.?/, '').split('.')
    setSelectedPath(pathArray.length === 1 && pathArray[0] === '' ? [] : pathArray)
  }, [])

  const handleTransformedData = useCallback((transformedData: any) => {
    setParsedData(transformedData)
    const nodes = buildTree(transformedData)
    setTreeNodes(nodes)
    setExpandedPaths(new Set())
    
    const graph = buildGraph(transformedData)
    setGraphData(graph)
    
    const analytics = analyzeGraph(graph)
    setGraphAnalytics(analytics)
    
    toast.success('Data updated with transformation')
  }, [])

  const handleHistoryRestore = useCallback((data: string, historyFormat: string) => {
    setInputValue(data)
    setDetectedFormat(historyFormat as DataFormat)
  }, [setInputValue])

  const filteredNodes = useMemo(() => {
    return advancedSearchNodes(treeNodes, searchOptions)
  }, [treeNodes, searchOptions])

  const searchResultCount = useMemo(() => {
    const countNodes = (nodes: TreeNode[]): number => {
      return nodes.reduce((count, node) => {
        let nodeCount = 1
        if (node.children) {
          nodeCount += countNodes(node.children)
        }
        return count + nodeCount
      }, 0)
    }
    const count = countNodes(filteredNodes)
    
    if (searchOptions.searchTerm && count > 0) {
      gtmSearchPerformed(searchOptions.searchMode, count)
    }
    
    return count
  }, [filteredNodes, searchOptions])

  useEffect(() => {
    if (inputValue) {
      handleParse()
    }
  }, [])

  useKeyboardShortcuts({
    focusSearch: () => searchInputRef.current?.focus(),
    parseData: handleParse,
    exportData: () => parsedData && setShowExportDialog(true),
    toggleTheme: toggleTheme,
    showShortcuts: () => setShowShortcutsDialog(true),
    switchToTree: () => parsedData && setViewMode('tree'),
    switchToGraph: () => parsedData && setViewMode('graph'),
    expandAll: () => parsedData && handleExpandAll(),
    collapseAll: () => parsedData && handleCollapseAll(),
    formatData: () => setShowFormatDialog(true),
    minifyData: handleMinify,
  })

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 transition-all duration-[350ms] ease-out relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent pointer-events-none" />
        
        <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg transition-all duration-300 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 opacity-50" />
          <div className="max-w-[1800px] mx-auto px-4 md:px-6 lg:px-8 py-6 relative">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-gradient-to-br from-primary/20 via-accent/15 to-primary/10 backdrop-blur-sm shadow-2xl shadow-primary/20 ring-1 ring-primary/10 hover:scale-105 transition-transform duration-300">
                    <img src={logoSvg} alt="DataScope Logo" className="w-10 h-10" />
                  </div>
                  <div>
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                      DataScope
                    </h1>
                    <p className="text-xs md:text-sm text-muted-foreground/90 font-medium">
                      Parse, explore, analyze structured data • Automatic format detection
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 items-center">
                {onNavigateToDocs && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={onNavigateToDocs}
                        className="flex-shrink-0 h-10 w-10 rounded-xl hover:scale-105 transition-all duration-200 hover:border-primary/50 hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/20 group"
                      >
                        <Book size={20} weight="duotone" className="transition-transform duration-300 group-hover:scale-110" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="font-medium">
                      <p>Documentation</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowShortcutsDialog(true)}
                      className="flex-shrink-0 h-10 w-10 rounded-xl hover:scale-105 transition-all duration-200 hover:border-primary/50 hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/20 group"
                    >
                      <Keyboard size={20} weight="duotone" className="transition-transform duration-300 group-hover:scale-110" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="font-medium">
                    <p>Keyboard shortcuts (?)</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleTheme}
                      className="flex-shrink-0 h-10 w-10 rounded-xl hover:scale-105 transition-all duration-200 hover:border-primary/50 hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/20 group"
                    >
                      {theme === 'light' ? (
                        <Moon size={20} weight="duotone" className="transition-transform duration-300 group-hover:rotate-12" />
                      ) : (
                        <Sun size={20} weight="duotone" className="transition-transform duration-300 group-hover:rotate-90" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="font-medium">
                    <p>Toggle {theme === 'light' ? 'dark' : 'light'} mode</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-[1800px] mx-auto p-4 md:p-6 lg:p-8 relative z-10">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            <div className="xl:col-span-2 space-y-6">
              <Card className="p-4 md:p-5 space-y-4 shadow-2xl border-border/50 bg-card/70 backdrop-blur-md transition-all duration-300 hover:shadow-[0_20px_70px_-15px_rgba(0,0,0,0.3)] hover:border-primary/30 hover:bg-card/80 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="flex items-center justify-between gap-2 flex-wrap relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary/15 via-accent/15 to-primary/10 border border-primary/30 shadow-md">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      {detectedFormat === 'json' && <File size={14} weight="duotone" className="text-primary" />}
                      {detectedFormat === 'yaml' && <FileCode size={14} weight="duotone" className="text-primary" />}
                      {detectedFormat === 'jsonl' && <ListBullets size={14} weight="duotone" className="text-primary" />}
                      {detectedFormat === 'csv' && <FileCsv size={14} weight="duotone" className="text-primary" />}
                      {detectedFormat === 'json5' && <Table size={14} weight="duotone" className="text-primary" />}
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">{detectedFormat}</span>
                    </div>
                  </div>

                  <div className="flex gap-1.5 flex-wrap">
                    <DropdownMenu>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline" className="h-8 px-3 gap-1.5 hover:border-primary/50 transition-all duration-200 rounded-lg hover:bg-primary/10">
                              <File size={14} weight="duotone" />
                              <span className="text-xs">Examples</span>
                            </Button>
                          </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">Load example data</TooltipContent>
                      </Tooltip>
                      <DropdownMenuContent align="end" className="w-44 shadow-xl rounded-xl">
                        <DropdownMenuItem onClick={() => loadExample('json')} className="gap-2 cursor-pointer rounded-lg text-sm">
                          <File size={14} weight="duotone" />
                          JSON Example
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => loadExample('yaml')} className="gap-2 cursor-pointer rounded-lg text-sm">
                          <FileCode size={14} weight="duotone" />
                          YAML Example
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => loadExample('jsonl')} className="gap-2 cursor-pointer rounded-lg text-sm">
                          <ListBullets size={14} weight="duotone" />
                          JSONL Example
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => loadExample('csv')} className="gap-2 cursor-pointer rounded-lg text-sm">
                          <FileCsv size={14} weight="duotone" />
                          CSV Example
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <DropdownMenu>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline" className="h-8 px-3 gap-1.5 hover:border-primary/50 transition-all duration-200 rounded-lg hover:bg-primary/10">
                              <Gear size={14} weight="duotone" />
                              <span className="text-xs">Tools</span>
                            </Button>
                          </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">Formatting tools</TooltipContent>
                      </Tooltip>
                      <DropdownMenuContent align="end" className="w-48 shadow-xl rounded-xl">
                        <DropdownMenuItem onClick={() => setShowFormatDialog(true)} className="gap-2 cursor-pointer rounded-lg text-sm">
                          <TextAlignLeft size={14} weight="duotone" />
                          Format & Prettify
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={handleMinify}
                          disabled={detectedFormat !== 'json' && detectedFormat !== 'jsonl'}
                          className="gap-2 cursor-pointer rounded-lg text-sm"
                        >
                          <Minus size={14} weight="duotone" />
                          Minify
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {parsedData && (
                      <Button 
                        onClick={() => setShowExportDialog(true)} 
                        size="sm"
                        variant="outline"
                        className="h-8 px-3 gap-1.5 hover:border-accent/50 transition-all duration-200 rounded-lg hover:bg-accent/10"
                      >
                        <Download size={14} weight="duotone" />
                        <span className="text-xs">Export</span>
                      </Button>
                    )}

                    <Button 
                      onClick={handleParse} 
                      size="sm" 
                      className="h-8 px-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 bg-gradient-to-r from-primary via-primary to-primary/80 rounded-lg font-semibold text-xs"
                    >
                      Parse
                    </Button>
                  </div>
                </div>

                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={`Paste ${detectedFormat.toUpperCase()} data or load from file/URL...\n\n• JSON: {"key": "value"}\n• YAML: key: value\n• JSONL: {...}\\n{...}\n• CSV: name,age\\nAlice,30`}
                  className="font-mono text-xs md:text-sm min-h-[180px] md:min-h-[200px] resize-y transition-all duration-200 focus:ring-2 focus:ring-primary/30 border-border/50 hover:border-border/70 rounded-xl bg-muted/40 focus:bg-background shadow-inner hover:shadow-lg"
                />

                {showLintErrors && lintErrors.length > 0 && (
                  <LintErrorsDisplay 
                    errors={lintErrors}
                    onClose={() => setShowLintErrors(false)}
                  />
                )}

                {error && !showLintErrors && (
                  <Alert variant="destructive" className="rounded-xl border-destructive/50 bg-destructive/10">
                    <AlertDescription className="text-xs md:text-sm font-mono">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}
              </Card>

              {parsedData && (
                <>
                  <Card className="p-6 space-y-5 shadow-2xl border-border/50 bg-card/70 backdrop-blur-md transition-all duration-300 hover:shadow-[0_20px_70px_-15px_rgba(0,0,0,0.3)] hover:border-primary/30 hover:bg-card/80 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <div className="relative z-10">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <Tabs value={viewMode} onValueChange={(v) => handleViewModeChange(v as 'tree' | 'graph' | 'graph3d')}>
                        <TabsList className="bg-muted/80 p-1 rounded-xl shadow-inner">
                          <TabsTrigger value="tree" className="gap-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/15 data-[state=active]:to-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-md transition-all duration-200 rounded-lg">
                            <TreeStructure size={16} weight="duotone" />
                            <span className="hidden sm:inline font-medium">Tree</span>
                          </TabsTrigger>
                          <TabsTrigger value="graph" className="gap-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/15 data-[state=active]:to-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-md transition-all duration-200 rounded-lg">
                            <Graph size={16} weight="duotone" />
                            <span className="hidden sm:inline font-medium">2D Graph</span>
                          </TabsTrigger>
                          <TabsTrigger value="graph3d" className="gap-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/15 data-[state=active]:to-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-md transition-all duration-200 rounded-lg">
                            <Cube size={16} weight="duotone" />
                            <span className="hidden sm:inline font-medium">3D Graph</span>
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                      
                      {viewMode === 'tree' && (
                        <div className="flex gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleExpandAll}
                                className="hover:border-primary/50 transition-all duration-200 hover:scale-105 rounded-lg hover:bg-primary/10 hover:shadow-md hover:shadow-primary/20 group"
                              >
                                <ArrowsOut size={16} weight="duotone" className="group-hover:scale-110 transition-transform" />
                                <span className="hidden sm:inline ml-2">Expand All</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="font-medium">Expand all nodes</TooltipContent>
                          </Tooltip>
                          
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCollapseAll}
                                className="hover:border-primary/50 transition-all duration-200 hover:scale-105 rounded-lg hover:bg-primary/10 hover:shadow-md hover:shadow-primary/20 group"
                              >
                                <ArrowsIn size={16} weight="duotone" className="group-hover:scale-90 transition-transform" />
                                <span className="hidden sm:inline ml-2">Collapse All</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="font-medium">Collapse all nodes</TooltipContent>
                          </Tooltip>
                        </div>
                      )}
                    </div>

                    {viewMode === 'tree' && (
                      <>
                        {selectedPath.length > 0 && (
                          <div className="flex items-center gap-2 p-3.5 bg-gradient-to-r from-muted/70 via-muted/60 to-muted/50 rounded-xl border border-border/50 backdrop-blur-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:shadow-primary/10 group">
                            <code className="flex-1 text-xs font-mono truncate text-foreground/90 group-hover:text-foreground transition-colors">
                              {getPathString(selectedPath, 'dot')}
                            </code>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 flex-shrink-0 hover:bg-primary/10 hover:text-primary transition-all duration-200 rounded-lg"
                              onClick={handleCopyPath}
                            >
                              {copiedPath ? (
                                <Check size={16} className="text-syntax-string" weight="bold" />
                              ) : (
                                <Copy size={16} />
                              )}
                            </Button>
                          </div>
                        )}

                        <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                        <ScrollArea className="h-[500px] md:h-[560px] rounded-xl border border-border/30 shadow-inner">
                          <div className="p-2">
                            <TreeView
                              nodes={filteredNodes}
                              onNodeUpdate={handleNodeUpdate}
                              selectedPath={selectedPath}
                              onSelectNode={setSelectedPath}
                            />
                          </div>
                        </ScrollArea>
                      </>
                    )}

                    {viewMode === 'graph' && graphData && (
                      <div className="rounded-xl border border-border/30 overflow-hidden shadow-inner">
                        <GraphVisualization 
                          data={graphData}
                          onNodeClick={handleGraphNodeClick}
                          selectedNodeId={selectedPath.length > 0 ? `root.${selectedPath.join('.')}` : 'root'}
                        />
                      </div>
                    )}

                    {viewMode === 'graph3d' && graphData && (
                      <Graph3DVisualization 
                        data={graphData}
                        onNodeClick={handleGraphNodeClick}
                        selectedNodeId={selectedPath.length > 0 ? `root.${selectedPath.join('.')}` : 'root'}
                      />
                    )}
                    </div>
                  </Card>
                </>
              )}
            </div>

            <div className="space-y-6">
              {parsedData && (
                <>
                  <QuickActionsPanel
                    onFormat={() => setShowFormatDialog(true)}
                    onMinify={handleMinify}
                    onExport={() => setShowExportDialog(true)}
                    onValidate={handleParse}
                    onCopyAll={() => {
                      navigator.clipboard.writeText(inputValue || '')
                      toast.success('Data copied to clipboard')
                    }}
                    hasData={!!parsedData}
                  />

                  <AdvancedSearch 
                    options={searchOptions}
                    onChange={setSearchOptions}
                    resultCount={searchResultCount}
                  />

                  <SmartSuggestionsPanel
                    parsedData={parsedData}
                    onSwitchToGraph={() => setViewMode('graph')}
                    onSearch={() => searchInputRef.current?.focus()}
                    onTransform={() => setToolsExpanded(true)}
                    onExport={() => setShowExportDialog(true)}
                    onShowAnalytics={() => {}}
                  />

                  <QuickViewPanel 
                    data={parsedData}
                    selectedPath={selectedPath}
                  />

                  <FavoritesPanel
                    currentPath={selectedPath}
                    onNavigate={setSelectedPath}
                  />

                  <DataValidator data={parsedData} />

                  {parseMetrics && (
                    <PerformanceAnalysis metrics={parseMetrics} />
                  )}

                  {stats && <StatsPanel stats={stats} />}

                  {graphAnalytics && (
                    <GraphAnalyticsPanel analytics={graphAnalytics} />
                  )}

                  <Card className="p-6 space-y-4 shadow-xl border-border/50 bg-card/60 backdrop-blur-sm">
                    <Button
                      onClick={() => setToolsExpanded(!toolsExpanded)}
                      variant="outline"
                      className="w-full gap-2 hover:border-accent/50 transition-all duration-200 rounded-lg hover:bg-accent/10"
                    >
                      <Toolbox size={20} weight="duotone" />
                      Advanced Tools
                      <span className="ml-auto text-xs text-muted-foreground">
                        {toolsExpanded ? 'Hide' : 'Show'}
                      </span>
                    </Button>
                    
                    {toolsExpanded && (
                      <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                        <SchemaExtractor data={parsedData} />
                        <DataTransformer data={parsedData} onTransformed={handleTransformedData} />
                        <DataComparator data={parsedData} />
                      </div>
                    )}
                  </Card>
                </>
              )}
              
              <FileInput onDataLoaded={handleFileLoaded} />

              <DataHistory onRestore={handleHistoryRestore} />
              
              {!parsedData && (
                <Card className="p-8 space-y-6 shadow-2xl border-border/50 bg-gradient-to-br from-card/70 to-muted/50 backdrop-blur-md hover:shadow-[0_20px_70px_-15px_rgba(0,0,0,0.3)] transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="relative z-10">
                  <div className="flex items-center gap-3 text-foreground/80">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 via-accent/20 to-primary/15 shadow-lg shadow-primary/20 ring-1 ring-primary/20">
                      <ChartBar size={28} weight="duotone" className="text-primary" />
                    </div>
                    <h3 className="text-lg font-bold bg-gradient-to-r from-foreground to-primary/80 bg-clip-text text-transparent">Quick Start Guide</h3>
                  </div>
                  <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-background/60 border border-border/50 transition-all duration-200 hover:border-primary/40 hover:bg-background/80 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] group/item">
                      <span className="text-primary font-bold flex-shrink-0 text-base w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover/item:bg-primary/20 transition-colors">1</span>
                      <p className="group-hover/item:text-foreground/80 transition-colors">Load data from file, URL, or paste directly</p>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-background/60 border border-border/50 transition-all duration-200 hover:border-primary/40 hover:bg-background/80 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] group/item">
                      <span className="text-primary font-bold flex-shrink-0 text-base w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover/item:bg-primary/20 transition-colors">2</span>
                      <p className="group-hover/item:text-foreground/80 transition-colors">Format automatically detected (JSON, YAML, JSONL, CSV)</p>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-background/60 border border-border/50 transition-all duration-200 hover:border-primary/40 hover:bg-background/80 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] group/item">
                      <span className="text-primary font-bold flex-shrink-0 text-base w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover/item:bg-primary/20 transition-colors">3</span>
                      <p className="group-hover/item:text-foreground/80 transition-colors">Click "Parse Data" to visualize structure & analytics</p>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-background/60 border border-border/50 transition-all duration-200 hover:border-primary/40 hover:bg-background/80 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] group/item">
                      <span className="text-primary font-bold flex-shrink-0 text-base w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover/item:bg-primary/20 transition-colors">4</span>
                      <p className="group-hover/item:text-foreground/80 transition-colors">Use Tools menu for formatting, minifying, & prettifying</p>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-background/60 border border-border/50 transition-all duration-200 hover:border-primary/40 hover:bg-background/80 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] group/item">
                      <span className="text-primary font-bold flex-shrink-0 text-base w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover/item:bg-primary/20 transition-colors">5</span>
                      <p className="group-hover/item:text-foreground/80 transition-colors">Advanced search with regex, path queries, & type filters</p>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-background/60 border border-border/50 transition-all duration-200 hover:border-primary/40 hover:bg-background/80 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] group/item">
                      <span className="text-primary font-bold flex-shrink-0 text-base w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover/item:bg-primary/20 transition-colors">6</span>
                      <p className="group-hover/item:text-foreground/80 transition-colors">Explore multiple graph layouts: force, tree, radial, grid</p>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-background/60 border border-border/50 transition-all duration-200 hover:border-primary/40 hover:bg-background/80 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] group/item">
                      <span className="text-primary font-bold flex-shrink-0 text-base w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover/item:bg-primary/20 transition-colors">7</span>
                      <p className="group-hover/item:text-foreground/80 transition-colors">Comprehensive analytics, metrics, & insights</p>
                    </div>
                  </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>

        <FormatOptionsDialog
          open={showFormatDialog}
          onOpenChange={setShowFormatDialog}
          onApply={handleFormat}
        />

        <ExportDialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          data={parsedData}
          currentFormat={detectedFormat}
        />

        <ShortcutsDialog
          open={showShortcutsDialog}
          onOpenChange={setShowShortcutsDialog}
        />
      </div>

      <footer className="max-w-[1800px] mx-auto px-4 md:px-6 lg:px-8 py-8 mt-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-br from-muted/60 to-muted/40 border border-border/30 shadow-xl backdrop-blur-md hover:shadow-2xl hover:border-primary/20 transition-all duration-300 group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="p-1.5 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 group-hover:scale-110 transition-transform duration-300">
              <img src={logoSvg} alt="DataScope" className="w-8 h-8 opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-sm text-muted-foreground">
              <strong className="text-foreground font-bold">DataScope</strong> • Professional data analytics & visualization
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground relative z-10">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-all duration-200 hover:scale-105 font-medium"
            >
              GitHub
            </a>
            <span>•</span>
            <a 
              href="https://datascope.w4w.dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-all duration-200 hover:scale-105 font-medium"
            >
              Docs
            </a>
            <span>•</span>
            <span className="font-medium">© {new Date().getFullYear()} DataScope</span>
          </div>
        </div>
      </footer>
    </TooltipProvider>
  )
}

export default App
