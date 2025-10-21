import { AxiosError } from 'axios'

export interface APIError {
  message: string
  code?: string
  field?: string
  details?: any
}

/**
 * Extract user-friendly error message from API error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    // Check for response data
    if (error.response?.data) {
      const data = error.response.data

      // Handle different error response formats
      if (typeof data === 'string') {
        return data
      }

      if (data.message) {
        return data.message
      }

      if (data.detail) {
        return data.detail
      }

      if (data.error) {
        return typeof data.error === 'string' ? data.error : data.error.message
      }

      // Handle validation errors
      if (data.errors) {
        if (Array.isArray(data.errors)) {
          return data.errors.map((e: any) => e.message || e).join(', ')
        }
        if (typeof data.errors === 'object') {
          return Object.values(data.errors).flat().join(', ')
        }
      }
    }

    // Network error
    if (error.message === 'Network Error') {
      return 'Network error. Please check your connection.'
    }

    // Timeout error
    if (error.code === 'ECONNABORTED') {
      return 'Request timeout. Please try again.'
    }

    // Default Axios error message
    return error.message
  }

  // Generic error
  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred'
}

/**
 * Parse validation errors from API response
 */
export function parseValidationErrors(error: unknown): Record<string, string[]> {
  if (!(error instanceof AxiosError)) {
    return {}
  }

  const data = error.response?.data
  if (!data || !data.errors) {
    return {}
  }

  // Handle different error formats
  if (typeof data.errors === 'object' && !Array.isArray(data.errors)) {
    return data.errors
  }

  return {}
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  return error instanceof AxiosError && error.message === 'Network Error'
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
  return (
    error instanceof AxiosError &&
    (error.response?.status === 401 || error.response?.status === 403)
  )
}

/**
 * Check if error is a validation error
 */
export function isValidationError(error: unknown): boolean {
  return error instanceof AxiosError && error.response?.status === 422
}

/**
 * Check if error is a rate limiting error
 */
export function isRateLimitError(error: unknown): boolean {
  return error instanceof AxiosError && error.response?.status === 429
}

/**
 * Check if error is a server error
 */
export function isServerError(error: unknown): boolean {
  return (
    error instanceof AxiosError &&
    error.response?.status !== undefined &&
    error.response.status >= 500
  )
}