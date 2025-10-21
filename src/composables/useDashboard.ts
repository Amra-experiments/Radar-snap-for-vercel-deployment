// Vue Query composables for Radar-Snap dashboard data fetching
import { ref, computed, watch } from 'vue'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { useProjectsStore } from '@/stores/projects'
import { analyticsAPI } from '@/api/analytics'
import { getErrorMessage } from '@/utils/errors'
import type { 
  DashboardData, 
  KPIMetric, 
  UserSession, 
  SessionMetrics,
  FeatureUsage,
  PerformanceMetric,
  APIError,
  UserDemographics
} from '@/types/analytics'
import type { DashboardOverview, DashboardQueryParams } from '@/types/api'
import { 
  fetchDashboardData,
  fetchKPIs,
  fetchSessions,
  fetchSessionMetrics,
  fetchFeatureUsage,
  fetchPerformanceMetrics,
  fetchAPIErrors,
  fetchUserDemographics
} from '@/api/mockData'

// Main dashboard data hook
export function useDashboardData() {
  return useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Auto-refresh every minute
    refetchOnWindowFocus: false,
    retry: 2
  })
}

// KPI metrics hook
export function useKPIs() {
  return useQuery<KPIMetric[]>({
    queryKey: ['kpis'],
    queryFn: fetchKPIs,
    staleTime: 30000,
    refetchInterval: 60000,
    refetchOnWindowFocus: false,
    retry: 2
  })
}

// Recent sessions hook
export function useSessions() {
  return useQuery<UserSession[]>({
    queryKey: ['sessions'],
    queryFn: fetchSessions,
    staleTime: 15000, // 15 seconds for more frequent updates
    refetchInterval: 30000, // Refresh every 30 seconds
    refetchOnWindowFocus: false,
    retry: 2
  })
}

// Session metrics hook
export function useSessionMetrics() {
  return useQuery<SessionMetrics>({
    queryKey: ['session-metrics'],
    queryFn: fetchSessionMetrics,
    staleTime: 30000,
    refetchInterval: 60000,
    refetchOnWindowFocus: false,
    retry: 2
  })
}

// Feature usage hook
export function useFeatureUsage() {
  return useQuery<FeatureUsage[]>({
    queryKey: ['feature-usage'],
    queryFn: fetchFeatureUsage,
    staleTime: 120000, // 2 minutes (feature data changes less frequently)
    refetchInterval: 300000, // Refresh every 5 minutes
    refetchOnWindowFocus: false,
    retry: 2
  })
}

// Performance metrics hook
export function usePerformanceMetrics() {
  return useQuery<PerformanceMetric[]>({
    queryKey: ['performance-metrics'],
    queryFn: fetchPerformanceMetrics,
    staleTime: 45000, // 45 seconds
    refetchInterval: 90000, // Refresh every 1.5 minutes
    refetchOnWindowFocus: false,
    retry: 2
  })
}

// API errors hook
export function useAPIErrors() {
  return useQuery<APIError[]>({
    queryKey: ['api-errors'],
    queryFn: fetchAPIErrors,
    staleTime: 20000, // 20 seconds (errors need more frequent updates)
    refetchInterval: 45000, // Refresh every 45 seconds
    refetchOnWindowFocus: false,
    retry: 2
  })
}

// User demographics hook
export function useUserDemographics() {
  return useQuery<UserDemographics>({
    queryKey: ['user-demographics'],
    queryFn: fetchUserDemographics,
    staleTime: 300000, // 5 minutes (demographics change slowly)
    refetchInterval: 600000, // Refresh every 10 minutes
    refetchOnWindowFocus: false,
    retry: 2
  })
}

// Utility hook for manual refresh
export function useRefreshDashboard() {
  const queryClient = useQueryClient()
  
  const refreshAll = async () => {
    await queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    await queryClient.invalidateQueries({ queryKey: ['kpis'] })
    await queryClient.invalidateQueries({ queryKey: ['sessions'] })
    await queryClient.invalidateQueries({ queryKey: ['session-metrics'] })
  }
  
  const refreshKPIs = async () => {
    await queryClient.invalidateQueries({ queryKey: ['kpis'] })
  }
  
  const refreshSessions = async () => {
    await queryClient.invalidateQueries({ queryKey: ['sessions'] })
    await queryClient.invalidateQueries({ queryKey: ['session-metrics'] })
  }
  
  return {
    refreshAll,
    refreshKPIs,
    refreshSessions
  }
}

// Hook for real-time data status
export function useDataStatus() {
  const dashboard = useDashboardData()
  const kpis = useKPIs()
  const sessions = useSessions()
  
  const isLoading = dashboard.isLoading.value || kpis.isLoading.value || sessions.isLoading.value
  const hasError = dashboard.isError.value || kpis.isError.value || sessions.isError.value
  const lastUpdated = dashboard.data.value?.lastUpdated
  
  return {
    isLoading,
    hasError,
    lastUpdated,
    errors: {
      dashboard: dashboard.error.value,
      kpis: kpis.error.value,
      sessions: sessions.error.value
    }
  }
}

/**
 * Main dashboard composable for project-specific analytics
 * Integrates with real API endpoints and project store
 */
export function useDashboard() {
  const projectsStore = useProjectsStore()
  
  // State
  const dashboardData = ref<DashboardOverview | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Date range state
  const dateRange = ref<{ start: Date; end: Date }>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    end: new Date()
  })
  
  // Computed
  const hasData = computed(() => !!dashboardData.value)
  const totalSessions = computed(() => dashboardData.value?.total_sessions || 0)
  const totalPageViews = computed(() => dashboardData.value?.total_page_views || 0)
  const uniqueVisitors = computed(() => dashboardData.value?.unique_visitors || 0)
  const bounceRate = computed(() => dashboardData.value?.bounce_rate || 0)
  const avgSessionDuration = computed(() => dashboardData.value?.avg_session_duration || 0)
  
  /**
   * Fetch dashboard data
   */
  async function fetchDashboard(params?: DashboardQueryParams) {
    const projectId = projectsStore.currentProjectId
    if (!projectId) {
      error.value = 'No project selected'
      return { success: false, error: 'No project selected' }
    }
    
    loading.value = true
    error.value = null
    
    try {
      // Build query params
      const queryParams: DashboardQueryParams = {
        start_date: dateRange.value.start.toISOString(),
        end_date: dateRange.value.end.toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        ...params
      }
      
      const data = await analyticsAPI.getDashboardOverview(projectId, queryParams)
      dashboardData.value = data
      
      return { success: true, data }
    } catch (err) {
      const message = getErrorMessage(err)
      error.value = message
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Set date range and refresh data
   */
  function setDateRange(start: Date, end: Date) {
    dateRange.value = { start, end }
    fetchDashboard()
  }
  
  /**
   * Set preset date range
   */
  function setPresetRange(preset: 'today' | '7d' | '30d' | '90d') {
    const end = new Date()
    let start: Date
    
    switch (preset) {
      case 'today':
        start = new Date()
        start.setHours(0, 0, 0, 0)
        break
      case '7d':
        start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        start = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
        break
      default:
        start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    }
    
    setDateRange(start, end)
  }
  
  /**
   * Format duration in human-readable format
   */
  function formatDuration(seconds: number): string {
    if (seconds < 60) return `${Math.round(seconds)}s`
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`
    return `${(seconds / 3600).toFixed(1)}h`
  }
  
  /**
   * Format percentage
   */
  function formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`
  }
  
  // Watch for project changes
  watch(
    () => projectsStore.currentProjectId,
    () => {
      dashboardData.value = null
      if (projectsStore.currentProjectId) {
        fetchDashboard()
      }
    },
    { immediate: true }
  )
  
  return {
    // State
    dashboardData,
    loading,
    error,
    dateRange,
    
    // Computed
    hasData,
    totalSessions,
    totalPageViews,
    uniqueVisitors,
    bounceRate,
    avgSessionDuration,
    
    // Methods
    fetchDashboard,
    setDateRange,
    setPresetRange,
    formatDuration,
    formatPercentage,
  }
}