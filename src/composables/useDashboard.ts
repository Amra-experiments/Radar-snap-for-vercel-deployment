// Vue Query composables for Radar-Snap dashboard data fetching
import { useQuery, useQueryClient } from '@tanstack/vue-query'
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