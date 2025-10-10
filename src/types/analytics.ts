// Comprehensive TypeScript types for Radar-Snap analytics dashboard

export interface KPIMetric {
  id: string
  label: string
  value: string | number
  change: string
  trend: 'up' | 'down' | 'neutral'
  icon: string
  color: 'blue' | 'green' | 'orange' | 'red' | 'purple'
}

export interface SessionMetrics {
  totalSessions: number
  errorFreeSessions: number
  successfulActions: number
  averageDuration: number
  errorRate: number
  successRate: number
}

export interface UserSession {
  id: string
  userId: string
  userName: string
  userEmail: string
  startTime: string
  endTime: string
  duration: number
  pageViews: number
  interactions: number
  errorCount: number
  status: 'success' | 'error' | 'incomplete'
  geography: string
  browser: string
  device: string
  entryPage: string
  exitPage: string
  actions: string[]
}

export interface FeatureUsage {
  featureId: string
  featureName: string
  usageCount: number
  uniqueUsers: number
  adoptionRate: number
  avgTimeSpent: number
  successRate: number
  errorRate: number
  category?: string  // NEW: Core, Analytics, Monitoring, Settings
  lastUsed?: string  // NEW: ISO timestamp
  description?: string
}

export interface PerformanceMetric {
  id: string
  page: string
  pageLoadTime: number
  fcp: number
  lcp: number
  tti: number
  cls: number
  timestamp: string
  url: string
  userAgent: string
}

export interface APIError {
  id: string
  endpoint: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  statusCode: number
  errorMessage: string
  stackTrace?: string
  sessionId: string
  userId: string
  timestamp: string
  errorType: 'popup' | 'redirect' | 'failure'
  count: number
  affectedUsers?: number
  severity?: 'low' | 'medium' | 'high' | 'critical'
  responseTime?: number  // NEW: Response time in milliseconds
}

// NEW: API Response Time metrics
export interface APIResponseTime {
  endpoint: string
  avgTime: number
  p95Time: number
  p99Time: number
}

export interface InteractionChallenge {
  id: string
  type: 'rage_click' | 'dead_click' | 'form_abandonment' | 'excessive_scroll'
  page: string
  element: string
  elementLabel?: string  // Human-readable element name
  count: number
  affectedUsers: number
  frustrationScore: number
  avgClicksPerUser?: number  // Average clicks per affected user
  timestamp: string
  description: string
  impact?: 'high' | 'medium' | 'low'  // Business impact
}

// Storage & Cookie Analytics interfaces
export interface StorageItem {
  id: string
  key: string
  type: 'localStorage' | 'sessionStorage' | 'indexedDB' | 'cookie'
  size: number // in bytes
  value?: string // truncated preview
  domain?: string
  expiryDate?: string
  httpOnly?: boolean
  secure?: boolean
  sameSite?: 'Strict' | 'Lax' | 'None'
  category: 'essential' | 'functional' | 'analytics' | 'marketing' | 'preferences'
  description?: string
  lastModified: string
  createdAt: string
  persistent: boolean // survives browser restart
}

export interface StorageQuota {
  type: 'localStorage' | 'sessionStorage' | 'indexedDB' | 'cache' | 'total'
  used: number // bytes used
  available: number // bytes available
  quota: number // total quota in bytes
  percentage: number // usage percentage
  status: 'healthy' | 'warning' | 'critical' // based on usage percentage
}

export interface CookieConsent {
  id: string
  userId?: string
  sessionId: string
  consentId: string
  categories: {
    essential: boolean
    functional: boolean
    analytics: boolean
    marketing: boolean
    preferences: boolean
  }
  timestamp: string
  consentMethod: 'banner' | 'settings' | 'implicit' | 'api'
  version: string // consent banner version
  ipAddress?: string
  userAgent?: string
  tcfString?: string // TCF consent string for GDPR
  status: 'granted' | 'denied' | 'withdrawn' | 'expired'
}

export interface StorageEvent {
  id: string
  type: 'storage_set' | 'storage_get' | 'storage_remove' | 'storage_clear' | 'cookie_set' | 'cookie_delete' | 'quota_warning' | 'quota_exceeded'
  storageType: 'localStorage' | 'sessionStorage' | 'indexedDB' | 'cookie'
  key?: string
  oldValue?: string
  newValue?: string
  size?: number
  timestamp: string
  page: string
  sessionId: string
  userId?: string
  error?: boolean
  errorMessage?: string
}

export interface StorageAnalytics {
  totalItems: number
  totalSize: number // total bytes across all storage types
  quotas: StorageQuota[]
  itemsByType: Record<string, number>
  sizeByType: Record<string, number>
  itemsByCategory: Record<string, number>
  cookieConsent: {
    total: number
    accepted: number
    rejected: number
    pending: number
    withdrawn: number
    byCategory: Record<string, number>
  }
  recentEvents: StorageEvent[]
  topLargestItems: StorageItem[]
  unusedItems: StorageItem[] // items not accessed recently
  errors: {
    quotaExceeded: number
    accessErrors: number
    serialization: number
    other: number
  }
  compliance: {
    gdprCompliant: boolean
    ccpaCompliant: boolean
    cookieConsentRequired: boolean
    dataRetentionPolicy: string
  }
}

export interface UserDemographics {
  totalUsers: number
  newUsers: number
  returningUsers: number
  byBrowser: Record<string, number>
  byDevice: Record<string, number>
  byGeography: Record<string, number>
  byTimezone: Record<string, number>
  averageSessionsPerUser: number
  mostActiveRegion: string
  peakUsageTime: string
}

export interface DateRange {
  start: Date
  end: Date
  label?: string
}

export interface ChartDataPoint {
  timestamp: string
  value: number
  label?: string
  category?: string
}

export interface SessionReplay {
  id: string
  sessionId: string
  duration: number
  events: ReplayEvent[]
  screenshots: string[]
  status: 'recording' | 'completed' | 'failed'
  size: number
  createdAt: string
}

export interface ReplayEvent {
  id: string
  type: 'click' | 'scroll' | 'input' | 'navigation' | 'error' | 'api_call'
  timestamp: number
  data: Record<string, any>
  element?: {
    tagName: string
    id?: string
    className?: string
    text?: string
  }
  coordinates?: {
    x: number
    y: number
  }
}

export interface UserFlow {
  path: string[]
  userCount: number
  conversionRate: number
  dropOffPoints: string[]
  avgTimeToComplete: number
}

export interface FeatureAnalytics {
  mostUsedFeatures: FeatureUsage[]
  leastUsedFeatures: FeatureUsage[]
  newFeatureAdoption: FeatureUsage[]
  featureEngagementTrends: ChartDataPoint[]
}

export interface PerformanceOverview {
  averageMetrics: {
    pageLoadTime: number
    fcp: number
    lcp: number
    tti: number
    cls: number
  }
  slowestPages: PerformanceMetric[]
  performanceTrends: ChartDataPoint[]
  webVitalsScore: 'good' | 'needs-improvement' | 'poor'
}

export interface ErrorAnalytics {
  totalErrors: number
  errorsByType: Record<string, number>
  errorsByPage: Record<string, number>
  errorTrends: ChartDataPoint[]
  mostFrequentErrors: APIError[]
  resolvedErrors: number
  newErrors: number
}

export interface DashboardData {
  kpis: KPIMetric[]
  sessionMetrics: SessionMetrics
  recentSessions: UserSession[]
  featureUsage: FeatureUsage[]
  performanceMetrics: PerformanceMetric[]
  topErrors: APIError[]
  interactionChallenges: InteractionChallenge[]
  storageAnalytics: StorageAnalytics
  storageItems: StorageItem[]
  storageQuotas: StorageQuota[]
  cookieConsents: CookieConsent[]
  storageEvents: StorageEvent[]
  userDemographics: UserDemographics
  userFlows: UserFlow[]
  lastUpdated: string
}

// API Response types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  timestamp: string
  errors?: string[]
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Filter types
export interface AnalyticsFilters {
  dateRange: DateRange
  userIds?: string[]
  sessionIds?: string[]
  countries?: string[]
  devices?: string[]
  browsers?: string[]
  featureIds?: string[]
  errorSeverity?: string[]
  performanceThreshold?: number
}

// Chart configuration types
export interface ChartConfiguration {
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'heatmap'
  title: string
  data: ChartDataPoint[]
  xAxisLabel?: string
  yAxisLabel?: string
  colors?: string[]
  showLegend?: boolean
  responsive?: boolean
}

// Component prop types
export interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: number
    direction: 'up' | 'down' | 'neutral'
    period: string
  }
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'gray'
  icon?: string
  loading?: boolean
}

export interface TableColumn<T> {
  field: keyof T
  header: string
  sortable?: boolean
  filterable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  format?: (value: any, row: T) => string
  className?: string
}

// Real-time updates
export interface RealtimeEvent {
  id: string
  type: 'session_start' | 'session_end' | 'error' | 'performance_issue' | 'user_action'
  data: Record<string, any>
  timestamp: string
  severity?: 'info' | 'warning' | 'error' | 'critical'
}

// Export status
export interface ExportOptions {
  format: 'csv' | 'json' | 'xlsx' | 'pdf'
  dateRange: DateRange
  filters?: AnalyticsFilters
  includeCharts?: boolean
}

export interface ExportStatus {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  downloadUrl?: string
  error?: string
  createdAt: string
}

// User preferences
export interface UserPreferences {
  dashboardLayout: string[]
  defaultDateRange: string
  autoRefresh: boolean
  refreshInterval: number
  notifications: {
    email: boolean
    browser: boolean
    errorThreshold: number
    performanceThreshold: number
  }
  theme: 'light' | 'dark' | 'auto'
}

// Utility types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export type SortDirection = 'asc' | 'desc'

export interface SortConfig<T> {
  field: keyof T
  direction: SortDirection
}

export interface PaginationConfig {
  page: number
  limit: number
  total?: number
}

// Error types
export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface ApiError {
  message: string
  code: string
  details?: Record<string, any>
  timestamp: string
}