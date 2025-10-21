/**
 * RadarSnap Composable
 * Provides reactive access to RadarSnap SDK functionality
 */

import { ref, computed } from 'vue'
import { radarSnapService, type RadarSnapConfig } from '@/services/radarSnapConfig'

export const useRadarSnap = () => {
  const isInitialized = ref(radarSnapService.isSDKInitialized())
  const config = ref(radarSnapService.getConfig())
  
  // Reactive computed for initialization status
  const isReady = computed(() => isInitialized.value)
  
  /**
   * Initialize RadarSnap for a specific project
   * @param projectApiKey - Project-specific API key
   */
  const initializeForProject = async (projectApiKey: string) => {
    try {
      // Update config with project-specific API key
      radarSnapService.updateConfig({
        apiKey: projectApiKey
      })
      
      // Initialize if not already done
      if (!isInitialized.value) {
        await radarSnapService.initialize()
        isInitialized.value = true
      }
      
      config.value = radarSnapService.getConfig()
      
      return true
    } catch (error) {
      console.error('Failed to initialize RadarSnap for project:', error)
      return false
    }
  }
  
  /**
   * Update RadarSnap configuration
   * @param newConfig - Partial configuration to update
   */
  const updateConfiguration = (newConfig: Partial<RadarSnapConfig>) => {
    radarSnapService.updateConfig(newConfig)
    config.value = radarSnapService.getConfig()
  }
  
  /**
   * Get current configuration
   */
  const getCurrentConfig = () => {
    return radarSnapService.getConfig()
  }
  
  /**
   * Generate integration script for a project
   * @param projectApiKey - Project-specific API key
   * @param customEndpoints - Optional custom endpoints
   */
  const generateIntegrationScript = (
    projectApiKey: string,
    customEndpoints?: {
      sessionEndpoint?: string
      eventsEndpoint?: string
    }
  ) => {
    const currentConfig = radarSnapService.getConfig()
    
    return `<!-- RadarSnap SDK Integration -->
<script src="${import.meta.env.VITE_SDK_URL || 'https://cdn.jsdelivr.net/npm/@radar-snap/sdk@1.0.0/dist/radar-snap.js'}"></script>
<script>
  // Initialize RadarSnap
  RadarSnap.init({
    apiKey: '${projectApiKey}',
    sessionEndpoint: '${customEndpoints?.sessionEndpoint || currentConfig.sessionEndpoint}',
    eventsEndpoint: '${customEndpoints?.eventsEndpoint || currentConfig.eventsEndpoint}',
    debug: ${currentConfig.debug}  // Enable debug mode to see logs
  });

  // Start recording (if you have a startRecording method)
  RadarSnap.startRecording();
</script>`
  }
  
  return {
    isReady,
    config: computed(() => config.value),
    initializeForProject,
    updateConfiguration,
    getCurrentConfig,
    generateIntegrationScript
  }
}