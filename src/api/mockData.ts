// Mock data for Radar-Snap analytics dashboard
import type {
  KPIMetric,
  SessionMetrics,
  UserSession,
  FeatureUsage,
  PerformanceMetric,
  APIError,
  InteractionChallenge,
  StorageAnalytics,
  StorageItem,
  StorageQuota,
  CookieConsent,
  StorageEvent,
  UserDemographics,
  DashboardData,
  ChartDataPoint
} from '@/types/analytics'

// Mock KPI Metrics
export const mockKPIs: KPIMetric[] = [
  {
    id: '1',
    label: 'Total Sessions',
    value: '12,458',
    change: '+12.5%',
    trend: 'up',
    icon: 'pi-users',
    color: 'blue'
  },
  {
    id: '2',
    label: 'Error-Free Sessions',
    value: '89.3%',
    change: '+3.2%',
    trend: 'up',
    icon: 'pi-check-circle',
    color: 'green'
  },
  {
    id: '3',
    label: 'Avg Session Duration',
    value: '4m 32s',
    change: '-8.1%',
    trend: 'down',
    icon: 'pi-clock',
    color: 'orange'
  },
  {
    id: '4',
    label: 'Success Rate',
    value: '94.7%',
    change: '+5.3%',
    trend: 'up',
    icon: 'pi-thumbs-up',
    color: 'purple'
  },
  {
    id: '5',
    label: 'API Failures',
    value: '142',
    change: '-15.2%',
    trend: 'up',
    icon: 'pi-times-circle',
    color: 'red'
  },
  {
    id: '6',
    label: 'Avg Page Load',
    value: '1.2s',
    change: '-0.3s',
    trend: 'up',
    icon: 'pi-bolt',
    color: 'green'
  }
]

// Mock Session Metrics
export const mockSessionMetrics: SessionMetrics = {
  totalSessions: 12458,
  errorFreeSessions: 11120,
  successfulActions: 47892,
  averageDuration: 272, // seconds
  errorRate: 10.7,
  successRate: 89.3
}

// Mock Recent Sessions
export const mockRecentSessions: UserSession[] = [
  {
    id: 'sess_001',
    userId: 'user_123',
    userName: 'Sarah Chen',
    userEmail: 'sarah.chen@example.com',
    startTime: '2025-10-01T14:32:15Z',
    endTime: '2025-10-01T14:47:22Z',
    duration: 907,
    pageViews: 8,
    interactions: 24,
    errorCount: 0,
    status: 'success',
    geography: 'San Francisco, CA',
    browser: 'Chrome 118',
    device: 'Desktop',
    entryPage: '/dashboard',
    exitPage: '/reports/analytics',
    actions: ['login', 'view_dashboard', 'generate_report', 'download_data']
  },
  {
    id: 'sess_002',
    userId: 'user_456',
    userName: 'Marcus Rodriguez',
    userEmail: 'marcus.r@example.com',
    startTime: '2025-10-01T14:25:33Z',
    endTime: '2025-10-01T14:28:45Z',
    duration: 192,
    pageViews: 3,
    interactions: 7,
    errorCount: 2,
    status: 'error',
    geography: 'New York, NY',
    browser: 'Firefox 119',
    device: 'Mobile',
    entryPage: '/sessions',
    exitPage: '/sessions/detail',
    actions: ['login', 'view_sessions', 'error_encountered']
  },
  {
    id: 'sess_003',
    userId: 'user_789',
    userName: 'Elena Popov',
    userEmail: 'elena.popov@example.com',
    startTime: '2025-10-01T14:15:12Z',
    endTime: '',
    duration: 1205,
    pageViews: 12,
    interactions: 31,
    errorCount: 0,
    status: 'incomplete',
    geography: 'London, UK',
    browser: 'Safari 17',
    device: 'Desktop',
    entryPage: '/performance',
    exitPage: '/performance/metrics',
    actions: ['login', 'view_performance', 'analyze_metrics', 'configure_alerts']
  },
  {
    id: 'sess_004',
    userId: 'user_321',
    userName: 'Ahmed Hassan',
    userEmail: 'ahmed.h@example.com',
    startTime: '2025-10-01T14:10:45Z',
    endTime: '2025-10-01T14:31:22Z',
    duration: 1237,
    pageViews: 15,
    interactions: 42,
    errorCount: 1,
    status: 'success',
    geography: 'Dubai, UAE',
    browser: 'Chrome 118',
    device: 'Tablet',
    entryPage: '/users',
    exitPage: '/users/demographics',
    actions: ['login', 'view_users', 'filter_data', 'export_csv']
  },
  {
    id: 'sess_005',
    userId: 'user_654',
    userName: 'Lisa Wang',
    userEmail: 'lisa.wang@example.com',
    startTime: '2025-10-01T13:55:18Z',
    endTime: '2025-10-01T14:12:33Z',
    duration: 1035,
    pageViews: 9,
    interactions: 18,
    errorCount: 0,
    status: 'success',
    geography: 'Singapore',
    browser: 'Edge 118',
    device: 'Desktop',
    entryPage: '/errors',
    exitPage: '/errors/resolved',
    actions: ['login', 'view_errors', 'resolve_issues', 'update_status']
  }
]

// Mock Feature Usage
export const mockFeatureUsage: FeatureUsage[] = [
  {
    featureId: 'feat_dashboard',
    featureName: 'Dashboard Analytics',
    usageCount: 8452,
    uniqueUsers: 3241,
    adoptionRate: 87.3,
    avgTimeSpent: 245, // seconds
    successRate: 96.2,
    errorRate: 3.8,
    category: 'Core',
    lastUsed: '2025-10-03T14:30:00Z'
  },
  {
    featureId: 'feat_session_replay',
    featureName: 'Session Replay',
    usageCount: 5621,
    uniqueUsers: 2103,
    adoptionRate: 56.7,
    avgTimeSpent: 420,
    successRate: 91.5,
    errorRate: 8.5,
    category: 'Analytics',
    lastUsed: '2025-10-03T13:15:00Z'
  },
  {
    featureId: 'feat_error_tracking',
    featureName: 'Error Tracking',
    usageCount: 3218,
    uniqueUsers: 1456,
    adoptionRate: 39.2,
    avgTimeSpent: 180,
    successRate: 88.9,
    errorRate: 11.1,
    category: 'Monitoring',
    lastUsed: '2025-10-03T12:45:00Z'
  },
  {
    featureId: 'feat_performance_monitor',
    featureName: 'Performance Monitor',
    usageCount: 4567,
    uniqueUsers: 1876,
    adoptionRate: 50.5,
    avgTimeSpent: 320,
    successRate: 94.3,
    errorRate: 5.7,
    category: 'Monitoring',
    lastUsed: '2025-10-03T14:00:00Z'
  },
  {
    featureId: 'feat_user_profiles',
    featureName: 'User Profiles',
    usageCount: 7234,
    uniqueUsers: 2890,
    adoptionRate: 77.8,
    avgTimeSpent: 156,
    successRate: 97.1,
    errorRate: 2.9,
    category: 'Core',
    lastUsed: '2025-10-03T14:25:00Z'
  },
  {
    featureId: 'feat_reports',
    featureName: 'Custom Reports',
    usageCount: 2145,
    uniqueUsers: 892,
    adoptionRate: 24.0,
    avgTimeSpent: 510,
    successRate: 85.4,
    errorRate: 14.6,
    category: 'Analytics',
    lastUsed: '2025-10-03T11:30:00Z'
  },
  {
    featureId: 'feat_alerts',
    featureName: 'Alert Configuration',
    usageCount: 3456,
    uniqueUsers: 1234,
    adoptionRate: 33.2,
    avgTimeSpent: 280,
    successRate: 92.8,
    errorRate: 7.2,
    category: 'Settings',
    lastUsed: '2025-10-03T13:50:00Z'
  },
  {
    featureId: 'feat_integrations',
    featureName: 'Integrations',
    usageCount: 1876,
    uniqueUsers: 654,
    adoptionRate: 17.6,
    avgTimeSpent: 390,
    successRate: 81.2,
    errorRate: 18.8,
    category: 'Settings',
    lastUsed: '2025-10-03T10:20:00Z'
  }
]

// Mock Performance Metrics
export const mockPerformanceMetrics: PerformanceMetric[] = [
  {
    id: 'perf_001',
    page: 'Dashboard',
    pageLoadTime: 1240,
    fcp: 890,
    lcp: 1450,
    tti: 2100,
    cls: 0.08,
    timestamp: '2025-10-01T14:30:00Z',
    url: '/dashboard',
    userAgent: 'Chrome/118.0.0.0'
  },
  {
    id: 'perf_002',
    page: 'Sessions',
    pageLoadTime: 1680,
    fcp: 1200,
    lcp: 2100,
    tti: 2800,
    cls: 0.12,
    timestamp: '2025-10-01T14:28:00Z',
    url: '/sessions',
    userAgent: 'Firefox/119.0'
  },
  {
    id: 'perf_003',
    page: 'Performance',
    pageLoadTime: 2340,
    fcp: 1650,
    lcp: 2890,
    tti: 3200,
    cls: 0.15,
    timestamp: '2025-10-01T14:25:00Z',
    url: '/performance',
    userAgent: 'Safari/17.0'
  },
  {
    id: 'perf_004',
    page: 'Errors',
    pageLoadTime: 1120,
    fcp: 780,
    lcp: 1320,
    tti: 1890,
    cls: 0.05,
    timestamp: '2025-10-01T14:22:00Z',
    url: '/errors',
    userAgent: 'Edge/118.0.1938.62'
  },
  {
    id: 'perf_005',
    page: 'Users',
    pageLoadTime: 1580,
    fcp: 1100,
    lcp: 1920,
    tti: 2450,
    cls: 0.09,
    timestamp: '2025-10-01T14:20:00Z',
    url: '/users',
    userAgent: 'Chrome/118.0.0.0'
  }
]

// Mock API Errors
export const mockAPIErrors: APIError[] = [
  {
    id: 'err_001',
    endpoint: '/api/sessions/load',
    method: 'GET',
    statusCode: 500,
    errorMessage: 'Internal Server Error - Database connection timeout',
    stackTrace: 'Error: Connection timeout\n  at Database.connect (db.js:45)\n  at SessionController.load (session.js:23)\n  at async Router.handle (router.js:156)',
    sessionId: 'sess_042',
    userId: 'user_890',
    timestamp: '2025-10-03T09:30:00Z',
    errorType: 'failure',
    count: 45,
    responseTime: 5200
  },
  {
    id: 'err_002',
    endpoint: '/api/user/update',
    method: 'POST',
    statusCode: 400,
    errorMessage: 'Validation Error - Invalid email format',
    sessionId: 'sess_053',
    userId: 'user_123',
    timestamp: '2025-10-03T10:45:00Z',
    errorType: 'popup',
    count: 23,
    responseTime: 320
  },
  {
    id: 'err_003',
    endpoint: '/api/auth/refresh',
    method: 'POST',
    statusCode: 401,
    errorMessage: 'Unauthorized - Token expired',
    sessionId: 'sess_065',
    userId: 'user_456',
    timestamp: '2025-10-03T11:20:00Z',
    errorType: 'redirect',
    count: 67,
    responseTime: 180
  },
  {
    id: 'err_004',
    endpoint: '/api/analytics/report',
    method: 'GET',
    statusCode: 504,
    errorMessage: 'Gateway Timeout - Report generation exceeded time limit',
    stackTrace: 'Error: Gateway timeout\n  at ReportGenerator.create (report.js:89)\n  at Analytics.generateReport (analytics.js:156)',
    sessionId: 'sess_078',
    userId: 'user_789',
    timestamp: '2025-10-03T12:15:00Z',
    errorType: 'failure',
    count: 12,
    responseTime: 30000
  },
  {
    id: 'err_005',
    endpoint: '/api/payment/process',
    method: 'POST',
    statusCode: 503,
    errorMessage: 'Service Unavailable - Payment gateway down',
    sessionId: 'sess_091',
    userId: 'user_234',
    timestamp: '2025-10-03T13:00:00Z',
    errorType: 'failure',
    count: 8,
    responseTime: 1500
  },
  {
    id: 'err_006',
    endpoint: '/api/data/export',
    method: 'GET',
    statusCode: 429,
    errorMessage: 'Too Many Requests - Rate limit exceeded',
    sessionId: 'sess_103',
    userId: 'user_567',
    timestamp: '2025-10-03T13:30:00Z',
    errorType: 'popup',
    count: 34,
    responseTime: 120
  },
  {
    id: 'err_007',
    endpoint: '/api/files/upload',
    method: 'POST',
    statusCode: 413,
    errorMessage: 'Payload Too Large - File size exceeds limit',
    sessionId: 'sess_115',
    userId: 'user_890',
    timestamp: '2025-10-03T14:00:00Z',
    errorType: 'popup',
    count: 19,
    responseTime: 450
  },
  {
    id: 'err_008',
    endpoint: '/api/search/query',
    method: 'GET',
    statusCode: 404,
    errorMessage: 'Not Found - Resource does not exist',
    sessionId: 'sess_127',
    userId: 'user_345',
    timestamp: '2025-10-03T14:25:00Z',
    errorType: 'failure',
    count: 15,
    responseTime: 200
  }
]

// Mock Interaction Challenges
export const mockInteractionChallenges: InteractionChallenge[] = [
  {
    id: 'int_001',
    type: 'rage_click',
    page: '/checkout/payment',
    element: 'button#submit-payment',
    elementLabel: 'Submit Button (Payment Form)',
    count: 45,
    affectedUsers: 23,
    frustrationScore: 8.5,
    avgClicksPerUser: 12,
    timestamp: '2025-10-01T14:00:00Z',
    description: 'Button appears clickable but form validation prevents submission',
    impact: 'high'
  },
  {
    id: 'int_002',
    type: 'dead_click',
    page: '/products',
    element: 'select#product-filter',
    elementLabel: 'Product Filter Dropdown',
    count: 67,
    affectedUsers: 34,
    frustrationScore: 6.2,
    avgClicksPerUser: 8,
    timestamp: '2025-10-01T13:45:00Z',
    description: 'Dropdown takes too long to load options',
    impact: 'medium'
  },
  {
    id: 'int_003',
    type: 'rage_click',
    page: '/signup',
    element: 'button#create-account',
    elementLabel: 'Create Account Button',
    count: 38,
    affectedUsers: 19,
    frustrationScore: 7.8,
    avgClicksPerUser: 10,
    timestamp: '2025-10-01T14:10:00Z',
    description: 'Password requirements not clearly displayed',
    impact: 'high'
  },
  {
    id: 'int_004',
    type: 'dead_click',
    page: '/dashboard',
    element: 'div.chart-legend',
    elementLabel: 'Chart Legend Items',
    count: 28,
    affectedUsers: 15,
    frustrationScore: 4.5,
    avgClicksPerUser: 6,
    timestamp: '2025-10-01T13:30:00Z',
    description: 'Legend items look clickable but have no interaction',
    impact: 'low'
  },
  {
    id: 'int_005',
    type: 'rage_click',
    page: '/checkout/shipping',
    element: 'input#address-autocomplete',
    elementLabel: 'Address Search Field',
    count: 31,
    affectedUsers: 16,
    frustrationScore: 7.2,
    avgClicksPerUser: 9,
    timestamp: '2025-10-01T13:15:00Z',
    description: 'Autocomplete suggestions not appearing fast enough',
    impact: 'medium'
  }
]

// Mock Storage Items
export const mockStorageItems: StorageItem[] = [
  {
    id: 'st_1',
    key: 'auth-token',
    type: 'localStorage',
    size: 2048,
    value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    category: 'essential',
    description: 'User authentication token',
    lastModified: '2024-12-19T10:30:00Z',
    createdAt: '2024-12-19T08:15:00Z',
    persistent: true
  },
  {
    id: 'st_2',
    key: 'user-preferences',
    type: 'localStorage',
    size: 1536,
    value: '{"theme":"dark","language":"en","notifications":true}',
    category: 'functional',
    description: 'User interface preferences',
    lastModified: '2024-12-19T09:45:00Z',
    createdAt: '2024-12-18T14:20:00Z',
    persistent: true
  },
  {
    id: 'st_3',
    key: 'session-data',
    type: 'sessionStorage',
    size: 892,
    value: '{"currentPage":"dashboard","filters":{"date":"7d"}}',
    category: 'functional',
    description: 'Current session state data',
    lastModified: '2024-12-19T11:00:00Z',
    createdAt: '2024-12-19T11:00:00Z',
    persistent: false
  },
  {
    id: 'st_4',
    key: 'analytics_consent',
    type: 'cookie',
    size: 256,
    value: 'granted',
    domain: 'radar-snap.com',
    expiryDate: '2025-12-19T00:00:00Z',
    httpOnly: false,
    secure: true,
    sameSite: 'Lax',
    category: 'analytics',
    description: 'Analytics tracking consent',
    lastModified: '2024-12-19T08:00:00Z',
    createdAt: '2024-12-19T08:00:00Z',
    persistent: true
  },
  {
    id: 'st_5',
    key: 'cached-dashboard-data',
    type: 'localStorage',
    size: 15680,
    value: '{"kpis":[...],"sessions":[...],"lastUpdated":"2024-12-19T10:30:00Z"}',
    category: 'functional',
    description: 'Cached dashboard analytics data',
    lastModified: '2024-12-19T10:30:00Z',
    createdAt: '2024-12-19T10:25:00Z',
    persistent: true
  },
  {
    id: 'st_6',
    key: 'marketing_tracking',
    type: 'cookie',
    size: 128,
    value: 'utm_source=google&utm_medium=cpc',
    domain: 'radar-snap.com',
    expiryDate: '2024-12-26T00:00:00Z',
    httpOnly: false,
    secure: true,
    sameSite: 'None',
    category: 'marketing',
    description: 'Marketing campaign tracking',
    lastModified: '2024-12-19T08:00:00Z',
    createdAt: '2024-12-19T08:00:00Z',
    persistent: true
  },
  {
    id: 'st_7',
    key: 'temp-form-data',
    type: 'sessionStorage',
    size: 456,
    value: '{"formId":"contact","draft":{"name":"John","email":"john@example.com"}}',
    category: 'functional',
    description: 'Temporary form draft data',
    lastModified: '2024-12-19T10:45:00Z',
    createdAt: '2024-12-19T10:45:00Z',
    persistent: false
  },
  {
    id: 'st_8',
    key: 'feature-flags',
    type: 'localStorage',
    size: 678,
    value: '{"newDashboard":true,"betaFeatures":false,"advancedCharts":true}',
    category: 'functional',
    description: 'Feature flag configuration',
    lastModified: '2024-12-19T09:00:00Z',
    createdAt: '2024-12-18T16:30:00Z',
    persistent: true
  }
]

// Mock Storage Quotas
export const mockStorageQuotas: StorageQuota[] = [
  {
    type: 'localStorage',
    used: 5242880, // 5MB
    available: 5242880, // 5MB remaining
    quota: 10485760, // 10MB total
    percentage: 50,
    status: 'healthy'
  },
  {
    type: 'sessionStorage',
    used: 1048576, // 1MB
    available: 9437184, // 9MB remaining
    quota: 10485760, // 10MB total
    percentage: 10,
    status: 'healthy'
  },
  {
    type: 'indexedDB',
    used: 52428800, // 50MB
    available: 157286400, // 150MB remaining
    quota: 209715200, // 200MB total
    percentage: 25,
    status: 'healthy'
  },
  {
    type: 'cache',
    used: 104857600, // 100MB
    available: 419430400, // 400MB remaining
    quota: 524288000, // 500MB total
    percentage: 20,
    status: 'healthy'
  },
  {
    type: 'total',
    used: 163577856, // ~156MB
    available: 590020608, // ~563MB remaining
    quota: 753664000, // ~719MB total
    percentage: 22,
    status: 'healthy'
  }
]

// Mock Cookie Consents
export const mockCookieConsents: CookieConsent[] = [
  {
    id: 'cc_1',
    userId: 'user_789',
    sessionId: 'session_456',
    consentId: 'consent_2024_v1.2',
    categories: {
      essential: true,
      functional: true,
      analytics: true,
      marketing: false,
      preferences: true
    },
    timestamp: '2024-12-19T08:00:00Z',
    consentMethod: 'banner',
    version: '1.2',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    status: 'granted'
  },
  {
    id: 'cc_2',
    userId: 'user_456',
    sessionId: 'session_123',
    consentId: 'consent_2024_v1.2',
    categories: {
      essential: true,
      functional: true,
      analytics: false,
      marketing: false,
      preferences: false
    },
    timestamp: '2024-12-19T09:15:00Z',
    consentMethod: 'settings',
    version: '1.2',
    ipAddress: '10.0.0.50',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    tcfString: 'CO4_jOkO4_jOkAGABCENCX-AAAAAAAACoAAAAAA',
    status: 'granted'
  },
  {
    id: 'cc_3',
    sessionId: 'session_789',
    consentId: 'consent_2024_v1.2',
    categories: {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
      preferences: false
    },
    timestamp: '2024-12-19T10:30:00Z',
    consentMethod: 'banner',
    version: '1.2',
    ipAddress: '172.16.0.20',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
    status: 'denied'
  }
]

// Mock Storage Events
export const mockStorageEvents: StorageEvent[] = [
  {
    id: 'se_1',
    type: 'storage_set',
    storageType: 'localStorage',
    key: 'user-preferences',
    oldValue: '{"theme":"light"}',
    newValue: '{"theme":"dark","language":"en"}',
    size: 1536,
    timestamp: '2024-12-19T09:45:00Z',
    page: '/dashboard',
    sessionId: 'session_456',
    userId: 'user_789'
  },
  {
    id: 'se_2',
    type: 'cookie_set',
    storageType: 'cookie',
    key: 'analytics_consent',
    newValue: 'granted',
    size: 256,
    timestamp: '2024-12-19T08:00:00Z',
    page: '/home',
    sessionId: 'session_456',
    userId: 'user_789'
  },
  {
    id: 'se_3',
    type: 'storage_remove',
    storageType: 'sessionStorage',
    key: 'old-filter-state',
    oldValue: '{"filters":{"status":"active"}}',
    timestamp: '2024-12-19T10:15:00Z',
    page: '/dashboard',
    sessionId: 'session_456',
    userId: 'user_789'
  },
  {
    id: 'se_4',
    type: 'quota_warning',
    storageType: 'localStorage',
    timestamp: '2024-12-19T10:30:00Z',
    page: '/dashboard',
    sessionId: 'session_123',
    userId: 'user_456',
    error: true,
    errorMessage: 'localStorage quota approaching limit (85% used)'
  },
  {
    id: 'se_5',
    type: 'storage_clear',
    storageType: 'sessionStorage',
    timestamp: '2024-12-19T11:00:00Z',
    page: '/logout',
    sessionId: 'session_789'
  }
]

// Mock Storage Analytics
export const mockStorageAnalytics: StorageAnalytics = {
  totalItems: 8,
  totalSize: 21520384, // ~20.5MB total across all storage types
  quotas: mockStorageQuotas,
  itemsByType: {
    'localStorage': 4,
    'sessionStorage': 2,
    'cookie': 2,
    'indexedDB': 0
  },
  sizeByType: {
    'localStorage': 20004,   // ~19.5KB
    'sessionStorage': 1348,  // ~1.3KB
    'cookie': 384,           // 384 bytes
    'indexedDB': 0
  },
  itemsByCategory: {
    'essential': 1,
    'functional': 5,
    'analytics': 1,
    'marketing': 1,
    'preferences': 0
  },
  cookieConsent: {
    total: 10604,
    accepted: 8945,
    rejected: 1203,
    pending: 456,
    withdrawn: 127,
    byCategory: {
      'essential': 10604,    // Always accepted
      'functional': 9456,
      'analytics': 7832,
      'marketing': 4567,
      'preferences': 8234
    }
  },
  recentEvents: mockStorageEvents.slice(0, 10),
  topLargestItems: mockStorageItems
    .sort((a, b) => b.size - a.size)
    .slice(0, 5),
  unusedItems: mockStorageItems.filter(item => {
    const lastModified = new Date(item.lastModified)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return lastModified < thirtyDaysAgo
  }),
  errors: {
    quotaExceeded: 3,
    accessErrors: 12,
    serialization: 5,
    other: 3
  },
  compliance: {
    gdprCompliant: true,
    ccpaCompliant: true,
    cookieConsentRequired: true,
    dataRetentionPolicy: '365 days'
  }
}

// Mock User Demographics
export const mockUserDemographics: UserDemographics = {
  totalUsers: 10604,
  newUsers: 1248,
  returningUsers: 9356,
  byBrowser: {
    'Chrome': 6832,
    'Safari': 1892,
    'Firefox': 1245,
    'Edge': 635
  },
  byDevice: {
    'Desktop': 7234,
    'Mobile': 2567,
    'Tablet': 803
  },
  byGeography: {
    'United States': 3421,
    'United Kingdom': 1567,
    'Germany': 1234,
    'France': 987,
    'Canada': 856,
    'Australia': 723,
    'Other': 2816
  },
  byTimezone: {
    'UTC-8': 1892,
    'UTC-5': 2156,
    'UTC+0': 1834,
    'UTC+1': 1456,
    'UTC+8': 1123,
    'Other': 2143
  },
  averageSessionsPerUser: 3.2,
  mostActiveRegion: 'United States',
  peakUsageTime: '2:00 PM - 4:00 PM UTC'
}

// Chart data for trends
export const mockSessionTrends: ChartDataPoint[] = [
  { timestamp: '2025-09-24', value: 1045, label: 'Sep 24' },
  { timestamp: '2025-09-25', value: 1123, label: 'Sep 25' },
  { timestamp: '2025-09-26', value: 1089, label: 'Sep 26' },
  { timestamp: '2025-09-27', value: 1245, label: 'Sep 27' },
  { timestamp: '2025-09-28', value: 1367, label: 'Sep 28' },
  { timestamp: '2025-09-29', value: 1456, label: 'Sep 29' },
  { timestamp: '2025-09-30', value: 1398, label: 'Sep 30' },
  { timestamp: '2025-10-01', value: 1523, label: 'Oct 01' }
]

// Async API functions with realistic delays
export const fetchDashboardData = async (): Promise<DashboardData> => {
  await new Promise(resolve => setTimeout(resolve, 450))
  
  return {
    kpis: mockKPIs,
    sessionMetrics: mockSessionMetrics,
    recentSessions: mockRecentSessions,
    featureUsage: mockFeatureUsage,
    performanceMetrics: mockPerformanceMetrics,
    topErrors: mockAPIErrors,
    interactionChallenges: mockInteractionChallenges,
    storageAnalytics: mockStorageAnalytics,
    storageItems: mockStorageItems,
    storageQuotas: mockStorageQuotas,
    cookieConsents: mockCookieConsents,
    storageEvents: mockStorageEvents,
    userDemographics: mockUserDemographics,
    userFlows: [],
    lastUpdated: new Date().toISOString()
  }
}

export const fetchKPIs = async (): Promise<KPIMetric[]> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockKPIs
}

export const fetchSessions = async (): Promise<UserSession[]> => {
  await new Promise(resolve => setTimeout(resolve, 380))
  return mockRecentSessions
}

export const fetchSessionMetrics = async (): Promise<SessionMetrics> => {
  await new Promise(resolve => setTimeout(resolve, 320))
  return mockSessionMetrics
}

export const fetchFeatureUsage = async (): Promise<FeatureUsage[]> => {
  await new Promise(resolve => setTimeout(resolve, 420))
  return mockFeatureUsage
}

export const fetchPerformanceMetrics = async (): Promise<PerformanceMetric[]> => {
  await new Promise(resolve => setTimeout(resolve, 410))
  return mockPerformanceMetrics
}

export const fetchAPIErrors = async (): Promise<APIError[]> => {
  await new Promise(resolve => setTimeout(resolve, 350))
  return mockAPIErrors
}

export const fetchUserDemographics = async (): Promise<UserDemographics> => {
  await new Promise(resolve => setTimeout(resolve, 390))
  return mockUserDemographics
}

// ========================================
// CHARTS DATA - Time Series and Visualizations
// ========================================

// Error rate trends over time
export const mockErrorRateTrends = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  data: [12.3, 10.8, 9.5, 11.2, 8.9, 10.1, 9.3]
}

// Performance metrics timeline throughout the day
export const mockPerformanceTrends = {
  labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
  series: [
    { name: 'FCP', data: [850, 820, 780, 890, 920, 880], color: '#3B82F6' },
    { name: 'LCP', data: [1100, 1050, 980, 1150, 1200, 1100], color: '#10B981' },
    { name: 'TTI', data: [1500, 1450, 1380, 1580, 1620, 1550], color: '#F59E0B' }
  ]
}

// Transform existing demographics data for charts
export const getBrowserChartData = () => {
  return Object.entries(mockUserDemographics.byBrowser).map(([name, value]) => ({
    name,
    value
  }))
}

export const getDeviceChartData = () => {
  return Object.entries(mockUserDemographics.byDevice).map(([name, value]) => ({
    name,
    value
  }))
}

export const getGeographyChartData = () => {
  return Object.entries(mockUserDemographics.byGeography)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5) // Top 5 locations
}

// ========================================
// FEATURE ANALYTICS - Engagement & Usage Tracking
// ========================================

// Feature engagement trends over time
export const mockFeatureEngagementTrends = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  series: [
    { 
      name: 'Dashboard', 
      data: [1245, 1390, 1534, 1276, 1645, 1398, 1503], 
      color: '#3B82F6' 
    },
    { 
      name: 'Session Replay', 
      data: [756, 821, 897, 745, 923, 834, 892], 
      color: '#10B981' 
    },
    { 
      name: 'Performance', 
      data: [567, 623, 701, 589, 734, 645, 698], 
      color: '#F59E0B' 
    }
  ]
}

// Helper to get feature categories
export const getFeaturesByCategory = () => {
  const categories: Record<string, FeatureUsage[]> = {}
  mockFeatureUsage.forEach(feature => {
    if (!categories[feature.category || 'Other']) {
      categories[feature.category || 'Other'] = []
    }
    categories[feature.category || 'Other'].push(feature)
  })
  return categories
}

// Top/Bottom features
export const getTopFeatures = (count: number = 5) => {
  return [...mockFeatureUsage]
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, count)
}

export const getLowAdoptionFeatures = (threshold: number = 30) => {
  return mockFeatureUsage.filter(f => f.adoptionRate < threshold)
}

// ========================================
// API ERROR ANALYTICS - Monitoring & Tracking
// ========================================

// API Error trends over time
export const mockAPIErrorTrends = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  series: [
    { name: '5xx Errors', data: [34, 28, 42, 31, 25, 29, 35], color: '#EF4444' },
    { name: '4xx Errors', data: [56, 62, 48, 59, 51, 47, 53], color: '#F59E0B' },
    { name: '3xx Errors', data: [12, 15, 9, 14, 11, 13, 10], color: '#3B82F6' }
  ]
}

// API Response time by endpoint
export const mockAPIResponseTimes = [
  { endpoint: '/api/sessions/load', avgTime: 1250, p95Time: 2100, p99Time: 4800 },
  { endpoint: '/api/user/update', avgTime: 320, p95Time: 580, p99Time: 920 },
  { endpoint: '/api/auth/refresh', avgTime: 180, p95Time: 350, p99Time: 560 },
  { endpoint: '/api/analytics/report', avgTime: 5400, p95Time: 12000, p99Time: 28000 },
  { endpoint: '/api/payment/process', avgTime: 890, p95Time: 1500, p99Time: 2300 }
]

// Error distribution by status code
export const getErrorsByStatusCode = () => {
  const distribution: Record<string, number> = {}
  mockAPIErrors.forEach(error => {
    const statusRange = `${Math.floor(error.statusCode / 100)}xx`
    distribution[statusRange] = (distribution[statusRange] || 0) + error.count
  })
  return Object.entries(distribution).map(([name, value]) => ({ name, value }))
}

// Top problematic endpoints
export const getTopErrorEndpoints = (count: number = 5) => {
  const endpointErrors: Record<string, { count: number; errors: APIError[] }> = {}
  
  mockAPIErrors.forEach(error => {
    if (!endpointErrors[error.endpoint]) {
      endpointErrors[error.endpoint] = { count: 0, errors: [] }
    }
    endpointErrors[error.endpoint].count += error.count
    endpointErrors[error.endpoint].errors.push(error)
  })
  
  return Object.entries(endpointErrors)
    .map(([endpoint, data]) => ({
      endpoint,
      totalErrors: data.count,
      uniqueErrorTypes: data.errors.length,
      errors: data.errors
    }))
    .sort((a, b) => b.totalErrors - a.totalErrors)
    .slice(0, count)
}

// Errors by type
export const getErrorsByType = () => {
  const types: Record<string, number> = {}
  mockAPIErrors.forEach(error => {
    types[error.errorType] = (types[error.errorType] || 0) + error.count
  })
  return Object.entries(types).map(([name, value]) => ({ name, value }))
}

// Storage Analytics Helper Functions
export const getStorageUsageByType = () => {
  return Object.entries(mockStorageAnalytics.sizeByType)
    .map(([type, size]) => ({ name: type, value: size }))
    .sort((a, b) => b.value - a.value)
}

export const getStorageItemsByCategory = () => {
  return Object.entries(mockStorageAnalytics.itemsByCategory)
    .map(([category, count]) => ({ name: category, value: count }))
    .sort((a, b) => b.value - a.value)
}

export const formatStorageSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const getStorageQuotaStatus = (quota: StorageQuota): 'healthy' | 'warning' | 'critical' => {
  if (quota.percentage >= 90) return 'critical'
  if (quota.percentage >= 75) return 'warning'
  return 'healthy'
}

export const getCookieConsentTrends = (): ChartDataPoint[] => {
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    return {
      timestamp: date.toISOString().split('T')[0],
      value: Math.floor(Math.random() * 100) + 200, // Mock consent events per day
      label: `Day ${i + 1}`
    }
  })
  return last30Days
}

export const getStorageEvents = (limit = 10) => {
  return mockStorageEvents
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit)
}

export const getStorageComplianceScore = (): number => {
  let score = 0
  const compliance = mockStorageAnalytics.compliance
  
  if (compliance.gdprCompliant) score += 25
  if (compliance.ccpaCompliant) score += 25
  if (compliance.cookieConsentRequired) score += 25
  if (compliance.dataRetentionPolicy) score += 25
  
  return score
}