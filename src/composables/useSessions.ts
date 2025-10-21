import { ref, computed } from 'vue'
import { useProjectsStore } from '@/stores/projects'
import { analyticsAPI } from '@/api/analytics'
import { getErrorMessage } from '@/utils/errors'
import type { Session, SessionDetail, SessionsQueryParams } from '@/types/api'

export function useSessions() {
  const projectsStore = useProjectsStore()
  
  // State
  const sessions = ref<Session[]>([])
  const currentSession = ref<SessionDetail | null>(null)
  const totalSessions = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Pagination
  const currentPage = ref(1)
  const pageSize = ref(20)
  
  // Filters
  const filters = ref<Partial<SessionsQueryParams>>({})
  
  // Computed
  const hasSessions = computed(() => sessions.value.length > 0)
  const totalPages = computed(() => Math.ceil(totalSessions.value / pageSize.value))
  
  /**
   * Fetch sessions list
   */
  async function fetchSessions(params?: SessionsQueryParams) {
    const projectId = projectsStore.currentProjectId
    if (!projectId) {
      error.value = 'No project selected'
      return { success: false, error: 'No project selected' }
    }
    
    loading.value = true
    error.value = null
    
    try {
      const queryParams: SessionsQueryParams = {
        page: currentPage.value,
        page_size: pageSize.value,
        ...filters.value,
        ...params
      }
      
      const data = await analyticsAPI.listSessions(projectId, queryParams)
      sessions.value = data.results
      totalSessions.value = data.count
      
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
   * Fetch session detail
   */
  async function fetchSessionDetail(sessionId: string) {
    const projectId = projectsStore.currentProjectId
    if (!projectId) {
      error.value = 'No project selected'
      return { success: false, error: 'No project selected' }
    }
    
    loading.value = true
    error.value = null
    
    try {
      const data = await analyticsAPI.getSessionDetail(projectId, sessionId)
      currentSession.value = data
      
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
   * Set filters and refresh
   */
  function setFilters(newFilters: Partial<SessionsQueryParams>) {
    filters.value = newFilters
    currentPage.value = 1
    fetchSessions()
  }
  
  /**
   * Go to page
   */
  function goToPage(page: number) {
    currentPage.value = page
    fetchSessions()
  }
  
  /**
   * Clear filters
   */
  function clearFilters() {
    filters.value = {}
    currentPage.value = 1
    fetchSessions()
  }
  
  return {
    // State
    sessions,
    currentSession,
    totalSessions,
    loading,
    error,
    currentPage,
    pageSize,
    filters,
    
    // Computed
    hasSessions,
    totalPages,
    
    // Methods
    fetchSessions,
    fetchSessionDetail,
    setFilters,
    goToPage,
    clearFilters,
  }
}