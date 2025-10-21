import axios, { type AxiosInstance } from 'axios'
import { setupInterceptors } from './interceptors'

// API base URL from environment
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Create main Axios instance with authentication
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
})

// Setup interceptors (will handle auth tokens and refresh)
setupInterceptors(apiClient)

// Export a separate instance for public endpoints (no auth required)
export const publicClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Default authenticated client
export default apiClient