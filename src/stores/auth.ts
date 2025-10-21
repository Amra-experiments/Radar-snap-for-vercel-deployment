import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI } from '@/api/auth'
import { useToast } from '@/composables/useToast'
import { storage } from '@/utils/storage'
import type { User, RegisterRequest, ChangePasswordRequest } from '@/types/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(storage.user.get())
  const token = ref<string | null>(storage.tokens.getAccess())
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const loading = ref(false)
  const { showSuccess, showError } = useToast()

  // Set auth token in storage and update refs
  function setAuthHeader(authToken: string | null, refreshToken?: string | null) {
    if (authToken) {
      storage.tokens.setAccess(authToken)
      token.value = authToken
      if (refreshToken) {
        storage.tokens.setRefresh(refreshToken)
      }
    } else {
      storage.tokens.clearTokens()
      storage.user.clear()
      token.value = null
    }
  }

  // Login
  async function login(email: string, password: string) {
    loading.value = true
    try {
      const response = await authAPI.login({ email, password })
      
      // Debug: Log the full response to see the token structure
      console.log('🔍 Backend login response:', response)
      
      const { access_token: authToken, refresh_token: refreshToken, user: userData } = response
      
      console.log('🔍 Extracted access_token:', authToken)
      console.log('🔍 Extracted refresh_token:', refreshToken)
      console.log('🔍 Extracted user:', userData)
      
      user.value = userData
      storage.user.set(userData)
      setAuthHeader(authToken, refreshToken)
      
      // Debug: Check if tokens were stored
      console.log('🔍 After setAuthHeader - localStorage check:')
      console.log('- Access token:', storage.tokens.getAccess())
      console.log('- Stored user:', storage.user.get())
      
      showSuccess('Welcome back!', 'Login Successful')
      return { success: true }
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Login failed'
      showError(errorMessage, 'Login Failed')
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  // Register
  async function register(data: RegisterRequest) {
    loading.value = true
    try {
      const response = await authAPI.register(data)
      
      const { access_token: authToken, refresh_token: refreshToken, user: userData } = response
      
      user.value = userData
      storage.user.set(userData)
      setAuthHeader(authToken, refreshToken)
      
      showSuccess('Welcome to Radar-Snap!', 'Registration Successful')
      return { success: true }
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Registration failed'
      showError(errorMessage, 'Registration Failed')
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  // Logout
  async function logout() {
    loading.value = true
    try {
      // Call logout endpoint if refresh token exists
      const refreshToken = storage.tokens.getRefresh()
      if (refreshToken) {
        await authAPI.logout({ refresh_token: refreshToken })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local state regardless of API response
      user.value = null
      setAuthHeader(null)
      loading.value = false
      
      showSuccess('See you soon!', 'Logged Out')
    }
  }

  // Fetch current user
  async function fetchUser() {
    if (!token.value) return
    
    loading.value = true
    try {
      const userData = await authAPI.getCurrentUser()
      user.value = userData
      storage.user.set(userData)
      return { success: true }
    } catch (error) {
      console.error('Failed to fetch user:', error)
      // Invalid token - logout
      logout()
      return { success: false }
    } finally {
      loading.value = false
    }
  }

  // Change password
  async function changePassword(data: ChangePasswordRequest) {
    loading.value = true
    try {
      await authAPI.changePassword(data)
      showSuccess('Password changed successfully!')
      return { success: true }
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 
                          'Failed to change password'
      showError(errorMessage, 'Password Change Failed')
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  // Note: Token is automatically loaded from storage and handled by interceptors

  return {
    // State
    user,
    token,
    loading,
    
    // Computed
    isAuthenticated,
    
    // Actions
    login,
    register,
    logout,
    fetchUser,
    changePassword,
    setAuthHeader
  }
})