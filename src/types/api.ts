// Common API response types

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface APIResponse<T = any> {
  data: T
  message?: string
}

export interface APIErrorResponse {
  message: string
  code?: string
  errors?: Record<string, string[]>
}

// Authentication types
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  user: User
}

export interface RegisterRequest {
  email: string
  password: string
  first_name: string
  last_name: string
}

export interface RegisterResponse {
  access_token: string
  refresh_token: string
  user: User
}

export interface RefreshTokenRequest {
  refresh_token: string
}

export interface RefreshTokenResponse {
  access_token: string
  refresh_token?: string
}

export interface ChangePasswordRequest {
  old_password: string
  new_password: string
}

export interface LogoutRequest {
  refresh_token: string
}

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  email_verified: boolean
  created_at: string
  updated_at: string
}

// Project types
export interface Project {
  id: string
  name: string
  website_url: string
  api_key: string
  owner: string
  is_active: boolean
  data_retention_days: number
  created_at: string
  updated_at: string
  role?: 'owner' | 'admin' | 'developer' | 'viewer'
  member_count?: number
}

export interface CreateProjectRequest {
  name: string
  website_url: string
}

export interface UpdateProjectRequest {
  name?: string
  website_url?: string
  is_active?: boolean
  data_retention_days?: number
}

export interface ProjectMember {
  id: string
  user: {
    id: string
    email: string
    first_name: string
    last_name: string
  }
  role: 'owner' | 'admin' | 'developer' | 'viewer'
  invited_by: {
    id: string
    email: string
    first_name: string
    last_name: string
  }
  invited_at: string
  joined_at: string | null
}

export interface ProjectInvitation {
  id: string
  email: string
  role: 'admin' | 'developer' | 'viewer'
  invited_by: {
    id: string
    email: string
    first_name: string
    last_name: string
  }
  created_at: string
  expires_at: string
  is_expired: boolean
}

export interface InviteTeamMemberRequest {
  email: string
  role: 'admin' | 'developer' | 'viewer'
}

export interface UpdateMemberRoleRequest {
  role: 'admin' | 'developer' | 'viewer'
}

export interface RegenerateApiKeyResponse {
  api_key: string
}

// Analytics Dashboard types
export interface DashboardMetrics {
  total_sessions: number
  unique_users: number
  page_views: number
  bounce_rate: number
  avg_session_duration: number
  conversion_rate?: number
}

export interface SessionData {
  id: string
  user_id: string
  start_time: string
  end_time: string | null
  duration: number | null
  page_views: number
  events: number
  ip_address: string
  user_agent: string
  country?: string
  city?: string
  device_type: 'desktop' | 'mobile' | 'tablet'
  browser: string
  os: string
}

export interface PerformanceMetrics {
  page_load_time: number
  first_contentful_paint: number
  largest_contentful_paint: number
  cumulative_layout_shift: number
  first_input_delay: number
  time_to_interactive: number
}

export interface ErrorData {
  id: string
  type: 'javascript' | 'network' | 'console'
  message: string
  stack?: string
  url: string
  line_number?: number
  column_number?: number
  timestamp: string
  user_agent: string
  count: number
}

// Event Ingestion types
export interface AnalyticsEvent {
  type: string
  timestamp: number
  session_id: string
  user_id?: string
  data: Record<string, any>
}

export interface BatchEventRequest {
  events: AnalyticsEvent[]
}

export interface SingleEventRequest extends AnalyticsEvent {}

// Dashboard API response types
export interface ProjectDashboardResponse {
  metrics: DashboardMetrics
  session_trends: Array<{
    date: string
    sessions: number
    unique_users: number
  }>
  top_pages: Array<{
    url: string
    views: number
    bounce_rate: number
  }>
  device_breakdown: Array<{
    device_type: string
    percentage: number
  }>
  browser_breakdown: Array<{
    browser: string
    percentage: number
  }>
}

export interface SessionsResponse extends PaginatedResponse<SessionData> {}

export interface PerformanceResponse {
  metrics: PerformanceMetrics
  trends: Array<{
    date: string
    avg_load_time: number
    avg_fcp: number
    avg_lcp: number
  }>
  slow_pages: Array<{
    url: string
    avg_load_time: number
    samples: number
  }>
}

export interface ErrorsResponse extends PaginatedResponse<ErrorData> {}

// Analytics Dashboard Types
export interface DashboardOverview {
  total_sessions: number
  total_page_views: number
  total_events: number
  unique_visitors: number
  avg_session_duration: number
  bounce_rate: number
  sessions_trend: TrendData[]
  page_views_trend: TrendData[]
  top_pages: PageStats[]
  top_events: EventStats[]
  devices: DeviceStats[]
  browsers: BrowserStats[]
  time_range: {
    start: string
    end: string
  }
}

export interface TrendData {
  date: string
  value: number
}

export interface PageStats {
  page_url: string
  page_title: string
  views: number
  unique_visitors: number
  avg_time_on_page: number
  bounce_rate: number
}

export interface EventStats {
  event_name: string
  count: number
  unique_users: number
}

export interface DeviceStats {
  device_type: string
  count: number
  percentage: number
}

export interface BrowserStats {
  browser_name: string
  browser_version: string
  count: number
  percentage: number
}

// Session Types
export interface Session {
  id: string
  session_id: string
  user_id: string | null
  device_type: string
  browser: string
  os: string
  country: string
  city: string
  started_at: string
  ended_at: string | null
  duration: number
  page_views: number
  events_count: number
  is_bounce: boolean
}

export interface SessionDetail extends Session {
  pages: SessionPage[]
  events: SessionEvent[]
  user_properties: Record<string, any>
}

export interface SessionPage {
  id: string
  page_url: string
  page_title: string
  referrer: string | null
  visited_at: string
  time_on_page: number
}

export interface SessionEvent {
  id: string
  event_name: string
  event_data: Record<string, any>
  page_url: string
  timestamp: string
}

// Performance Metrics Types
export interface PerformanceMetrics {
  avg_page_load_time: number
  avg_dom_content_loaded: number
  avg_first_contentful_paint: number
  avg_time_to_interactive: number
  slow_pages: SlowPage[]
  performance_trend: PerformanceTrend[]
}

export interface SlowPage {
  page_url: string
  avg_load_time: number
  samples: number
}

export interface PerformanceTrend {
  date: string
  avg_load_time: number
}

// Error Tracking Types
export interface ErrorSummary {
  total_errors: number
  unique_errors: number
  affected_users: number
  error_rate: number
  errors_by_type: ErrorByType[]
  recent_errors: ErrorDetail[]
}

export interface ErrorByType {
  error_type: string
  count: number
  percentage: number
}

export interface ErrorDetail {
  id: string
  error_message: string
  error_type: string
  page_url: string
  user_agent: string
  occurred_at: string
  stack_trace: string | null
  occurrences: number
}

// Query Parameters
export interface DashboardQueryParams {
  start_date?: string
  end_date?: string
  timezone?: string
}

export interface SessionsQueryParams extends DashboardQueryParams {
  page?: number
  page_size?: number
  device_type?: string
  browser?: string
  country?: string
}

// Analytics Stats (for SDK verification)
export interface AnalyticsStats {
  total_events: number
  total_sessions: number
  events_today: number
  sessions_today: number
  last_event_at: string | null
}