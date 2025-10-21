/**
 * Type-safe localStorage wrapper with automatic JSON parsing
 */

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
  USER: 'auth_user',
  CURRENT_PROJECT_ID: 'current_project_id',
} as const

export const storage = {
  // Get item
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      if (!item) return null
      return JSON.parse(item) as T
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error)
      return null
    }
  },

  // Set item
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error)
    }
  },

  // Remove item
  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error)
    }
  },

  // Clear all
  clear(): void {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  },

  // Token management
  tokens: {
    getAccess: () => storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN),
    getRefresh: () => storage.get<string>(STORAGE_KEYS.REFRESH_TOKEN),
    setAccess: (token: string) => storage.set(STORAGE_KEYS.ACCESS_TOKEN, token),
    setRefresh: (token: string) => storage.set(STORAGE_KEYS.REFRESH_TOKEN, token),
    clearTokens: () => {
      storage.remove(STORAGE_KEYS.ACCESS_TOKEN)
      storage.remove(STORAGE_KEYS.REFRESH_TOKEN)
    },
  },

  // User data
  user: {
    get: () => storage.get<any>(STORAGE_KEYS.USER),
    set: (user: any) => storage.set(STORAGE_KEYS.USER, user),
    clear: () => storage.remove(STORAGE_KEYS.USER),
  },

  // Current project
  currentProject: {
    getId: () => storage.get<string>(STORAGE_KEYS.CURRENT_PROJECT_ID),
    setId: (id: string) => storage.set(STORAGE_KEYS.CURRENT_PROJECT_ID, id),
    clear: () => storage.remove(STORAGE_KEYS.CURRENT_PROJECT_ID),
  },
}

export default storage