<template>
  <div class="onboarding-page">
    <!-- Page Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Project Setup</h1>
          <p class="text-gray-600 mt-1">Complete your project setup and SDK integration</p>
        </div>
        <Badge 
          :value="currentProject?.status || 'setup_pending'"
          :severity="getStatusSeverity(currentProject?.status)"
          size="large"
        />
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="mb-6">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="currentTab = tab.id"
            class="tab-button py-2 px-1 border-b-2 font-medium text-sm transition-colors"
            :class="{
              'border-blue-500 text-blue-600': currentTab === tab.id,
              'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': currentTab !== tab.id
            }"
          >
            <i :class="tab.icon" class="mr-2"></i>
            {{ tab.name }}
          </button>
        </nav>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      <!-- Overview Tab -->
      <div v-if="currentTab === 'overview'">
        <OnboardingOverview @menu-select="handleTabChange" />
      </div>

      <!-- SDK Installation Tab -->
      <div v-if="currentTab === 'sdk'">
        <SDKInstallation />
      </div>

      <!-- Project Settings Tab -->
      <div v-if="currentTab === 'settings'">
        <div class="text-center py-12">
          <i class="pi pi-cog text-6xl text-gray-300 mb-4"></i>
          <h3 class="text-xl font-semibold text-gray-600 mb-2">Project Settings</h3>
          <p class="text-gray-500 mb-6">Configure your project settings and preferences.</p>
          <Button 
            label="Coming Soon" 
            icon="pi pi-clock"
            disabled
            size="small"
          />
        </div>
      </div>

      <!-- API Keys Tab -->
      <div v-if="currentTab === 'api-keys'">
        <div class="space-y-6">
          <Card>
            <template #title>API Keys</template>
            <template #content>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Current API Key</label>
                  <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                    <i class="pi pi-key mr-3 text-gray-400"></i>
                    <span class="font-mono text-sm flex-1">{{ maskedApiKey }}</span>
                    <Button 
                      v-if="currentProject?.api_key"
                      icon="pi pi-eye" 
                      text
                      size="small"
                      class="ml-2"
                      @click="toggleApiKeyVisibility"
                      v-tooltip="showFullApiKey ? 'Hide API Key' : 'Show API Key'"
                    />
                    <Button 
                      v-if="currentProject?.api_key"
                      icon="pi pi-copy" 
                      text
                      size="small"
                      class="ml-1"
                      @click="copyApiKey"
                      v-tooltip="'Copy API Key'"
                    />
                  </div>
                </div>
                <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <p class="text-blue-700 text-sm">Keep your API key secure and never expose it in client-side code.</p>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>

      <!-- Team Tab -->
      <div v-if="currentTab === 'team'">
        <div class="text-center py-12">
          <i class="pi pi-users text-6xl text-gray-300 mb-4"></i>
          <h3 class="text-xl font-semibold text-gray-600 mb-2">Team Management</h3>
          <p class="text-gray-500 mb-6">Invite team members and manage permissions.</p>
          <Button 
            label="Coming Soon" 
            icon="pi pi-clock"
            disabled
            size="small"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProjectsStore } from '@/stores/projects'
import { useToast } from '@/composables/useToast'
import { defineAsyncComponent } from 'vue'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import Card from 'primevue/card'

// Async Components
const OnboardingOverview = defineAsyncComponent(() => 
  import('@/components/onboarding/OnboardingOverview.vue')
)

const SDKInstallation = defineAsyncComponent(() => 
  import('@/components/onboarding/SDKInstallation.vue')
)

// Store & Composables
const projectsStore = useProjectsStore()
const { showSuccess } = useToast()

// State
const currentTab = ref('overview')
const showFullApiKey = ref(false)

// Computed
const currentProject = computed(() => projectsStore.currentProject)

const maskedApiKey = computed(() => {
  if (!currentProject.value?.api_key) return 'No API key generated'
  if (showFullApiKey.value) return currentProject.value.api_key
  const key = currentProject.value.api_key
  return `${key.substring(0, 8)}${'*'.repeat(24)}${key.substring(key.length - 4)}`
})

// Tabs Configuration
const tabs = [
  {
    id: 'overview',
    name: 'Overview',
    icon: 'pi pi-flag'
  },
  {
    id: 'sdk',
    name: 'SDK Installation',
    icon: 'pi pi-code'
  },
  {
    id: 'api-keys',
    name: 'API Keys',
    icon: 'pi pi-key'
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: 'pi pi-cog'
  },
  {
    id: 'team',
    name: 'Team',
    icon: 'pi pi-users'
  }
]

// Methods
function handleTabChange(tabId: string) {
  if (tabId === 'sdk-installation') {
    currentTab.value = 'sdk'
  } else {
    currentTab.value = tabId
  }
}

function getStatusSeverity(status?: string) {
  switch (status) {
    case 'active': return 'success'
    case 'inactive': return 'danger'
    case 'setup_pending': return 'warning'
    default: return 'info'
  }
}

function toggleApiKeyVisibility() {
  showFullApiKey.value = !showFullApiKey.value
}

function copyApiKey() {
  if (currentProject.value?.api_key) {
    navigator.clipboard.writeText(currentProject.value.api_key).then(() => {
      showSuccess('API key copied to clipboard!')
    })
  }
}
</script>

<style scoped>
.onboarding-container {
  position: relative;
  overflow: hidden;
}

.main-content {
  min-height: 100vh;
  background-color: #f9fafb;
}

.content-wrapper {
  max-width: 100%;
  overflow-x: hidden;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .main-content {
    margin-left: 0 !important;
  }
}
</style>