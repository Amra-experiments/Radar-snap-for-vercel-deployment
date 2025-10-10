import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'

interface User {
  id: string
  email: string
  name: string
  email_verified: boolean
  created_at: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const loading = ref(false)
  const { showSuccess, showError } = useToast()

  // Set auth token in axios headers
  function setAuthHeader(authToken: string | null) {
    if (authToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
      localStorage.setItem('auth_token', authToken)
      token.value = authToken
    } else {
      delete axios.defaults.headers.common['Authorization']
      localStorage.removeItem('auth_token')
      token.value = null
    }
  }

  // Login
  async function login(email: string, password: string) {
    loading.value = true
    try {
      const response = await axios.post('/api/v1/auth/login', { email, password })
      const { token: authToken, user: userData } = response.data
      
      user.value = userData
      setAuthHeader(authToken)
      
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
  async function register(name: string, email: string, password: string) {
    loading.value = true
    try {
      const response = await axios.post('/api/v1/auth/register', { 
        name, 
        email, 
        password 
      })
      const { token: authToken, user: userData } = response.data
      
      user.value = userData
      setAuthHeader(authToken)
      
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
      // Call logout endpoint if token exists
      if (token.value) {
        await axios.post('/api/v1/auth/logout')
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local state regardless of API response
      user.value = null
      setAuthHeader(null)
      loading.value = false
      
      showSuccess('See you soon!', 'Logged Out')
      
      // Redirect to login
      const router = useRouter()
      router.push('/login')
    }
  }

  // Fetch current user
  async function fetchUser() {
    if (!token.value) return
    
    loading.value = true
    try {
      const response = await axios.get('/api/v1/auth/me')
      user.value = response.data
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

  // Forgot password
  async function forgotPassword(email: string) {
    loading.value = true
    try {
      await axios.post('/api/v1/auth/forgot-password', { email })
      return { success: true }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          'Failed to send reset email'
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  // Initialize auth on store creation
  if (token.value) {
    setAuthHeader(token.value)
  }

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
    forgotPassword,
    setAuthHeader
  }
})