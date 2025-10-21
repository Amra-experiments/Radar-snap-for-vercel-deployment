import apiClient, { publicClient } from './client'
import type { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest,
  RegisterResponse, 
  RefreshTokenRequest, 
  RefreshTokenResponse,
  ChangePasswordRequest,
  LogoutRequest,
  User 
} from '@/types/api'

/**
 * Authentication API endpoints
 */
export const authAPI = {
  /**
   * User registration
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await publicClient.post<RegisterResponse>('/api/v1/auth/register', data)
    return response.data
  },

  /**
   * User login
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await publicClient.post<LoginResponse>('/api/v1/auth/login', data)
    return response.data
  },

  /**
   * Refresh access token
   */
  async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const response = await publicClient.post<RefreshTokenResponse>('/api/v1/auth/refresh', data)
    return response.data
  },

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/api/v1/auth/me')
    return response.data
  },

  /**
   * Logout user
   */
  async logout(data: LogoutRequest): Promise<{ message: string }> {
    const response = await apiClient.post('/api/v1/auth/logout', data)
    return response.data
  },

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    const response = await apiClient.put('/api/v1/auth/change-password', data)
    return response.data
  },
}

export default authAPI