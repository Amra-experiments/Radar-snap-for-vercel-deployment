// Export all API modules for easy importing
export { authAPI } from './auth'
export { projectsAPI } from './projects'
export { analyticsAPI } from './analytics'
export { default as apiClient, publicClient } from './client'

// Export utilities
export * from '@/utils/storage'
export * from '@/utils/errors'
export * from '@/types/api'