/**
 * RadarSnap SDK Configuration Service
 * Handles initialization and configuration of the RadarSnap SDK
 */

interface RadarSnapConfig {
  apiKey: string
  sessionEndpoint: string
  eventsEndpoint: string
  debug: boolean
}

interface RadarSnapSDK {
  init: (config: RadarSnapConfig) => void
  startRecording: () => void
}

declare global {
  interface Window {
    RadarSnap?: RadarSnapSDK
  }
}

class RadarSnapService {
  private config: RadarSnapConfig
  private isInitialized = false

  constructor() {
    this.config = {
      apiKey: import.meta.env.VITE_RADAR_SNAP_API_KEY || 'dev_api_key_12345',
      sessionEndpoint: import.meta.env.VITE_RADAR_SNAP_SESSION_ENDPOINT || 'http://localhost:8000/api/v1/sessions',
      eventsEndpoint: import.meta.env.VITE_RADAR_SNAP_EVENTS_ENDPOINT || 'http://localhost:8000/api/v1/events',
      debug: import.meta.env.VITE_RADAR_SNAP_DEBUG === 'true' || import.meta.env.MODE === 'development'
    }
  }

  /**
   * Load RadarSnap SDK dynamically
   */
  private async loadSDK(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.RadarSnap) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = import.meta.env.VITE_SDK_URL || 'https://cdn.jsdelivr.net/npm/@radar-snap/sdk@1.0.0/dist/radar-snap.js'
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load RadarSnap SDK'))
      document.head.appendChild(script)
    })
  }

  /**
   * Initialize RadarSnap SDK
   */
  async initialize(): Promise<void> {
    try {
      if (this.isInitialized) {
        console.warn('RadarSnap already initialized')
        return
      }

      // Load SDK
      await this.loadSDK()

      // Check if SDK is available
      if (!window.RadarSnap || typeof window.RadarSnap.init !== 'function') {
        throw new Error('RadarSnap SDK not available or init method missing')
      }

      // Initialize with config
      window.RadarSnap.init(this.config)
      this.isInitialized = true

      console.log('RadarSnap initialized successfully', this.config.debug ? this.config : '')

      // Start recording if method is available
      if (typeof window.RadarSnap.startRecording === 'function') {
        window.RadarSnap.startRecording()
        console.log('RadarSnap recording started')
      }

    } catch (error) {
      console.error('Failed to initialize RadarSnap:', error)
      throw error
    }
  }

  /**
   * Update configuration (useful for project-specific API keys)
   */
  updateConfig(newConfig: Partial<RadarSnapConfig>): void {
    this.config = { ...this.config, ...newConfig }
    if (this.isInitialized && window.RadarSnap) {
      // Re-initialize with new config
      window.RadarSnap.init(this.config)
      console.log('RadarSnap configuration updated')
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): RadarSnapConfig {
    return { ...this.config }
  }

  /**
   * Check if SDK is initialized
   */
  isSDKInitialized(): boolean {
    return this.isInitialized
  }
}

// Export singleton instance
export const radarSnapService = new RadarSnapService()
export type { RadarSnapConfig }