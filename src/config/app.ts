// Global app configuration and utilities
export const APP_CONFIG = {
  name: 'Radar-Snap',
  version: '1.0.0',
  description: 'Modern analytics dashboard for tracking user sessions, performance metrics, and errors',
  api: {
    baseURL: import.meta.env.PROD 
      ? 'https://api.radar-snap.com'
      : 'http://localhost:8000',
    timeout: 30000,
  },
  storage: {
    prefix: 'radar_snap_',
    keys: {
      token: 'auth_token',
      user: 'user_data',
      currentProject: 'current_project',
      preferences: 'user_preferences'
    }
  },
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100
  },
  charts: {
    defaultColors: [
      '#3B82F6', // Blue
      '#10B981', // Green
      '#F59E0B', // Yellow
      '#EF4444', // Red
      '#8B5CF6', // Purple
      '#F97316', // Orange
      '#06B6D4', // Cyan
      '#84CC16', // Lime
    ],
    theme: 'light'
  },
  toast: {
    defaultDuration: 3000,
    position: 'top-right'
  }
} as const

export type AppConfig = typeof APP_CONFIG