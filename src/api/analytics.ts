import apiClient from './client'
import type {
  DashboardOverview,
  Session,
  SessionDetail,
  SessionsQueryParams,
  PerformanceMetrics,
  ErrorSummary,
  DashboardQueryParams,
  AnalyticsStats,
} from '@/types/api'

/**
 * Analytics API Service
 * Handles all analytics and dashboard API calls
 */

export const analyticsAPI = {
  /**
   * Get dashboard overview for a project
   */
  async getDashboardOverview(
    projectId: string,
    params?: DashboardQueryParams
  ): Promise<DashboardOverview> {
    const response = await apiClient.get<DashboardOverview>(
      `/api/v1/dashboard/projects/${projectId}/dashboard`,
      { params }
    )
    return response.data
  },

  /**
   * List sessions for a project
   */
  async listSessions(
    projectId: string,
    params?: SessionsQueryParams
  ): Promise<{ results: Session[]; count: number; next: string | null; previous: string | null }> {
    const response = await apiClient.get(
      `/api/v1/dashboard/projects/${projectId}/sessions`,
      { params }
    )
    return response.data
  },

  /**
   * Get session detail
   */
  async getSessionDetail(projectId: string, sessionId: string): Promise<SessionDetail> {
    const response = await apiClient.get<SessionDetail>(
      `/api/v1/dashboard/projects/${projectId}/sessions/${sessionId}`
    )
    return response.data
  },

  /**
   * Get performance metrics
   */
  async getPerformanceMetrics(
    projectId: string,
    params?: DashboardQueryParams
  ): Promise<PerformanceMetrics> {
    const response = await apiClient.get<PerformanceMetrics>(
      `/api/v1/dashboard/projects/${projectId}/performance`,
      { params }
    )
    return response.data
  },

  /**
   * Get error tracking summary
   */
  async getErrorSummary(
    projectId: string,
    params?: DashboardQueryParams
  ): Promise<ErrorSummary> {
    const response = await apiClient.get<ErrorSummary>(
      `/api/v1/dashboard/projects/${projectId}/errors`,
      { params }
    )
    return response.data
  },

  /**
   * Get analytics stats (for SDK verification)
   */
  async getAnalyticsStats(projectId: string): Promise<AnalyticsStats> {
    const response = await apiClient.get<AnalyticsStats>(
      `/api/v1/analytics/stats`,
      {
        params: { project_id: projectId }
      }
    )
    return response.data
  },
}