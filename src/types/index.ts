// Base interfaces for the analytics dashboard

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: Date
  lastActive: Date
}

export interface Session {
  id: string
  userId: string
  startTime: Date
  endTime?: Date
  duration?: number
  pageViews: number
  deviceInfo: DeviceInfo
  location: Location
  events: SessionEvent[]
  status: 'active' | 'ended'
}

export interface DeviceInfo {
  userAgent: string
  browser: string
  os: string
  device: string
  screen: {
    width: number
    height: number
  }
  viewport: {
    width: number
    height: number
  }
}

export interface Location {
  country: string
  region: string
  city: string
  ip: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface SessionEvent {
  id: string
  type: 'click' | 'scroll' | 'navigation' | 'error' | 'custom'
  timestamp: Date
  data: Record<string, any>
  element?: string
  url: string
}

export interface PerformanceMetric {
  id: string
  url: string
  timestamp: Date
  loadTime: number
  domContentLoaded: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  firstInputDelay: number
  cumulativeLayoutShift: number
  resourceTimings: ResourceTiming[]
}

export interface ResourceTiming {
  name: string
  type: 'script' | 'stylesheet' | 'image' | 'xhr' | 'fetch' | 'other'
  size: number
  duration: number
  startTime: number
}

export interface ErrorLog {
  id: string
  type: 'javascript' | 'network' | 'console' | 'unhandled'
  message: string
  stack?: string
  url: string
  line?: number
  column?: number
  timestamp: Date
  sessionId: string
  userId?: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  resolved: boolean
  tags: string[]
}

export interface AnalyticsData {
  totalSessions: number
  totalUsers: number
  activeUsers: number
  pageViews: number
  avgSessionDuration: number
  bounceRate: number
  errorRate: number
  topPages: PageStats[]
  userGrowth: DataPoint[]
  sessionTrends: DataPoint[]
  performanceMetrics: PerformanceStats
}

export interface PageStats {
  url: string
  title: string
  views: number
  uniqueViews: number
  avgTimeOnPage: number
  bounceRate: number
}

export interface DataPoint {
  timestamp: Date
  value: number
  label?: string
}

export interface PerformanceStats {
  avgLoadTime: number
  avgFCP: number
  avgLCP: number
  avgFID: number
  avgCLS: number
  coreWebVitalsScore: 'good' | 'needs-improvement' | 'poor'
}

// API Response types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  errors?: string[]
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Route meta interface
export interface RouteMeta {
  title?: string
  icon?: string
  description?: string
  requiresAuth?: boolean
  hideInNav?: boolean
  layout?: string
}

// Chart data types
export interface ChartDataset {
  label: string
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string | string[]
  borderWidth?: number
  fill?: boolean
}

export interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}

export interface ChartOptions {
  responsive?: boolean
  maintainAspectRatio?: boolean
  plugins?: Record<string, any>
  scales?: Record<string, any>
}

// Heatmap data types
export interface HeatmapPoint {
  x: number
  y: number
  value: number
}

export interface HeatmapConfig {
  container: HTMLElement
  backgroundColor?: string
  gradient?: Record<string, string>
  radius?: number
  opacity?: number
  maxOpacity?: number
  minOpacity?: number
  blur?: number
}

// Filter and query types
export interface DateRange {
  start: Date
  end: Date
}

export interface AnalyticsFilters {
  dateRange: DateRange
  userIds?: string[]
  sessionIds?: string[]
  countries?: string[]
  devices?: string[]
  browsers?: string[]
}

// Store types (for Pinia)
export interface UserState {
  currentUser: User | null
  isAuthenticated: boolean
  permissions: string[]
}

export interface AnalyticsState {
  sessions: Session[]
  users: User[]
  errors: ErrorLog[]
  performance: PerformanceMetric[]
  filters: AnalyticsFilters
  loading: boolean
}

// Component prop types
export interface DashboardCardProps {
  title: string
  value: string | number
  icon: string
  trend?: {
    value: number
    isPositive: boolean
    period: string
  }
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
}

export interface DataTableColumn {
  field: string
  header: string
  sortable?: boolean
  filterable?: boolean
  width?: string
  format?: (value: any) => string
}