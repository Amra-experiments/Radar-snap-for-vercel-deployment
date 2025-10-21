import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { storage } from '@/utils/storage'
import router from '@/router'

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else if (token) {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

export function setupInterceptors(apiClient: AxiosInstance) {
  // Request interceptor - Add auth token to headers
  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
      
      const token = storage.tokens.getAccess()
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      
      return config
    },
    (error: AxiosError) => {
      console.error('❌ Request Error:', error)
      return Promise.reject(error)
    }
  )

  // Response interceptor - Handle token refresh and errors
  apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`)
      return response
    },
    async (error: AxiosError) => {
      console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`)
      
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

      // If error is 401 and we haven't retried yet
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // Queue the request while token is being refreshed
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              return apiClient(originalRequest)
            })
            .catch((err) => {
              return Promise.reject(err)
            })
        }

        originalRequest._retry = true
        isRefreshing = true

        const refreshToken = storage.tokens.getRefresh()

        if (!refreshToken) {
          // No refresh token, redirect to login
          console.log('🔄 No refresh token, redirecting to login')
          storage.tokens.clearTokens()
          storage.user.clear()
          router.push('/login')
          return Promise.reject(error)
        }

        try {
          console.log('🔄 Attempting token refresh')
          // Attempt to refresh token
          const response = await apiClient.post('/api/v1/auth/refresh', {
            refresh: refreshToken,
          })

          const { access, refresh } = response.data
          
          // Store new tokens
          storage.tokens.setAccess(access)
          if (refresh) {
            storage.tokens.setRefresh(refresh)
          }

          console.log('✅ Token refreshed successfully')

          // Update authorization header
          originalRequest.headers.Authorization = `Bearer ${access}`

          // Process queued requests
          processQueue(null, access)

          // Retry original request
          return apiClient(originalRequest)
        } catch (refreshError) {
          // Refresh failed, logout user
          console.error('❌ Token refresh failed, logging out')
          processQueue(refreshError, null)
          storage.tokens.clearTokens()
          storage.user.clear()
          router.push('/login')
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      return Promise.reject(error)
    }
  )
}