import axios from 'axios'
import { mockLogin, mockRegister, mockFetchProjects, mockCreateProject } from './mockAuth'

// Enable mock mode when backend is not available
const MOCK_MODE = import.meta.env.DEV && !import.meta.env.VITE_DISABLE_MOCK

if (MOCK_MODE) {
  console.log('🔧 Mock mode enabled - using simulated backend')
  
  // Intercept authentication requests
  axios.interceptors.request.use(async (config) => {
    const url = config.url || ''
    
    try {
      // Mock login endpoint
      if (url.includes('/api/v1/auth/login') && config.method === 'post') {
        const { email, password } = config.data
        const result = await mockLogin(email, password)
        
        // Simulate successful response
        const mockResponse = {
          data: result,
          status: 200,
          statusText: 'OK',
          headers: {},
          config
        }
        
        // Return resolved promise to skip actual request
        return Promise.reject({
          response: mockResponse,
          isAxiosError: true,
          config,
          isMockSuccess: true
        })
      }
      
      // Mock register endpoint  
      if (url.includes('/api/v1/auth/register') && config.method === 'post') {
        const { name, email, password } = config.data
        const result = await mockRegister(name, email, password)
        
        const mockResponse = {
          data: result,
          status: 201,
          statusText: 'Created', 
          headers: {},
          config
        }
        
        return Promise.reject({
          response: mockResponse,
          isAxiosError: true,
          config,
          isMockSuccess: true
        })
      }
      
      // Mock projects fetch
      if (url.includes('/api/v1/projects') && config.method === 'get') {
        const userId = 'current-user' // Would get from auth header in real app
        const result = await mockFetchProjects(userId)
        
        const mockResponse = {
          data: result,
          status: 200,
          statusText: 'OK',
          headers: {},
          config
        }
        
        return Promise.reject({
          response: mockResponse,
          isAxiosError: true,
          config,
          isMockSuccess: true
        })
      }
      
      // Mock project creation
      if (url.includes('/api/v1/projects') && config.method === 'post') {
        const { name, website_url } = config.data
        const userId = 'current-user'
        const result = await mockCreateProject(name, website_url, userId)
        
        const mockResponse = {
          data: result,
          status: 201,
          statusText: 'Created',
          headers: {},
          config
        }
        
        return Promise.reject({
          response: mockResponse,
          isAxiosError: true,
          config,
          isMockSuccess: true
        })
      }
      
      // Mock user fetch (me endpoint)
      if (url.includes('/api/v1/auth/me') && config.method === 'get') {
        // Return stored user data (would validate token in real app)
        const userData = {
          id: 'user-1',
          name: 'Demo User', 
          email: 'demo@radar-snap.com',
          role: 'admin'
        }
        
        const mockResponse = {
          data: userData,
          status: 200,
          statusText: 'OK',
          headers: {},
          config
        }
        
        return Promise.reject({
          response: mockResponse,
          isAxiosError: true,
          config,
          isMockSuccess: true
        })
      }
      
      // Mock logout endpoint
      if (url.includes('/api/v1/auth/logout') && config.method === 'post') {
        const mockResponse = {
          data: { message: 'Logged out successfully' },
          status: 200,
          statusText: 'OK',
          headers: {},
          config
        }
        
        return Promise.reject({
          response: mockResponse,
          isAxiosError: true,
          config,
          isMockSuccess: true
        })
      }
      
    } catch (error: any) {
      // Handle mock authentication errors
      return Promise.reject({
        response: {
          data: { detail: error.message },
          status: 401,
          statusText: 'Unauthorized',
          headers: {},
        },
        isAxiosError: true,
        config,
        isMockError: true
      })
    }
    
    return config
  })
  
  // Handle mock responses
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      // If this is a mock success, return the response
      if (error.isMockSuccess) {
        return Promise.resolve(error.response)
      }
      
      // If this is a mock error, reject with proper format
      if (error.isMockError) {
        return Promise.reject(error)
      }
      
      // For real network errors or other errors, pass through
      return Promise.reject(error)
    }
  )
}

export { MOCK_MODE }