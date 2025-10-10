<template>
  <div class="onboarding-overview p-6 max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center">
            <i class="pi pi-flag mr-3 text-blue-600"></i>
            Onboarding Overview
          </h1>
          <p class="text-gray-600 mt-1">Complete these steps to get your analytics up and running</p>
        </div>
        <Badge 
          :value="completionPercentage + '%'" 
          :severity="completionPercentage === 100 ? 'success' : 'info'"
          size="large"
        />
      </div>
      
      <!-- Progress Bar -->
      <ProgressBar 
        :value="completionPercentage" 
        :showValue="false"
        class="mb-4"
      />
      <p class="text-sm text-gray-500">{{ completedSteps }}/{{ totalSteps }} steps completed</p>
    </div>

    <!-- Project Information -->
    <Card class="mb-8">
      <template #title>
        <div class="flex items-center">
          <i class="pi pi-info-circle mr-2 text-blue-600"></i>
          Project Information
        </div>
      </template>
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
            <div class="flex items-center p-3 bg-gray-50 rounded-lg">
              <i class="pi pi-globe mr-3 text-gray-400"></i>
              <span class="font-medium">{{ currentProject?.name || 'No project selected' }}</span>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
            <div class="flex items-center p-3 bg-gray-50 rounded-lg">
              <i class="pi pi-external-link mr-3 text-gray-400"></i>
              <span>{{ currentProject?.website_url || 'Not specified' }}</span>
              <Button 
                v-if="currentProject?.website_url"
                icon="pi pi-copy" 
                text
                size="small"
                class="ml-auto"
                @click="copyToClipboard(currentProject.website_url)"
                v-tooltip="'Copy URL'"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Project ID</label>
            <div class="flex items-center p-3 bg-gray-50 rounded-lg">
              <i class="pi pi-hashtag mr-3 text-gray-400"></i>
              <span class="font-mono text-sm">{{ currentProject?.id || 'N/A' }}</span>
              <Button 
                v-if="currentProject?.id"
                icon="pi pi-copy" 
                text
                size="small"
                class="ml-auto"
                @click="copyToClipboard(currentProject.id)"
                v-tooltip="'Copy Project ID'"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">API Key</label>
            <div class="flex items-center p-3 bg-gray-50 rounded-lg">
              <i class="pi pi-key mr-3 text-gray-400"></i>
              <span class="font-mono text-sm">{{ maskedApiKey }}</span>
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
                @click="copyToClipboard(currentProject.api_key)"
                v-tooltip="'Copy API Key'"
              />
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- Onboarding Steps -->
    <div class="space-y-6">
      <h2 class="text-xl font-semibold text-gray-900 flex items-center">
        <i class="pi pi-list-check mr-2 text-blue-600"></i>
        Setup Checklist
      </h2>

      <div class="space-y-4">
        <Card 
          v-for="step in onboardingSteps" 
          :key="step.id"
          class="onboarding-step"
          :class="{ 
            'border-l-4 border-l-green-500 bg-green-50': step.completed,
            'border-l-4 border-l-blue-500 bg-blue-50': step.current && !step.completed,
            'opacity-75': !step.completed && !step.current
          }"
        >
          <template #content>
            <div class="flex items-start">
              <!-- Step Icon -->
              <div class="flex-shrink-0 mr-4">
                <div 
                  class="w-10 h-10 rounded-full flex items-center justify-center"
                  :class="{
                    'bg-green-500 text-white': step.completed,
                    'bg-blue-500 text-white': step.current && !step.completed,
                    'bg-gray-300 text-gray-600': !step.completed && !step.current
                  }"
                >
                  <i v-if="step.completed" class="pi pi-check text-sm"></i>
                  <i v-else :class="step.icon" class="text-sm"></i>
                </div>
              </div>

              <!-- Step Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-lg font-semibold text-gray-900">{{ step.title }}</h3>
                  <Badge 
                    v-if="step.completed" 
                    value="Complete" 
                    severity="success"
                  />
                  <Badge 
                    v-else-if="step.current" 
                    value="Current" 
                    severity="info"
                  />
                </div>
                <p class="text-gray-600 mb-4">{{ step.description }}</p>
                
                <!-- Step Actions -->
                <div class="flex items-center space-x-3">
                  <Button 
                    v-if="!step.completed && step.actionLabel"
                    :label="step.actionLabel"
                    :icon="step.actionIcon"
                    @click="handleStepAction(step)"
                    size="small"
                  />
                  <Button 
                    v-if="step.docsUrl"
                    label="View Docs"
                    icon="pi pi-book"
                    text
                    size="small"
                    @click="openDocs(step.docsUrl)"
                  />
                  <span v-if="step.completed" class="text-sm text-green-600 flex items-center">
                    <i class="pi pi-check-circle mr-1"></i>
                    Completed {{ formatDate(step.completedAt) }}
                  </span>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Next Steps -->
    <Card class="mt-8">
      <template #title>
        <div class="flex items-center">
          <i class="pi pi-arrow-right mr-2 text-blue-600"></i>
          What's Next?
        </div>
      </template>
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
            <i class="pi pi-chart-line text-3xl text-blue-600 mb-3"></i>
            <h4 class="font-semibold text-gray-900 mb-2">View Analytics</h4>
            <p class="text-sm text-gray-600 mb-4">Start monitoring your website's performance and user behavior</p>
            <Button label="Go to Dashboard" size="small" @click="$router.push('/dashboard')" />
          </div>
          <div class="text-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
            <i class="pi pi-users text-3xl text-green-600 mb-3"></i>
            <h4 class="font-semibold text-gray-900 mb-2">Invite Team</h4>
            <p class="text-sm text-gray-600 mb-4">Collaborate with your team members and share insights</p>
            <Button label="Manage Team" size="small" @click="$emit('menu-select', 'team-members')" />
          </div>
          <div class="text-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
            <i class="pi pi-cog text-3xl text-purple-600 mb-3"></i>
            <h4 class="font-semibold text-gray-900 mb-2">Customize</h4>
            <p class="text-sm text-gray-600 mb-4">Configure advanced settings and integrations</p>
            <Button label="Project Settings" size="small" @click="$emit('menu-select', 'project-settings')" />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProjectsStore } from '@/stores/projects'
import { useToast } from '@/composables/useToast'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import ProgressBar from 'primevue/progressbar'

// Emits
const emit = defineEmits<{
  'menu-select': [menuId: string]
}>()

// Store & Composables
const projectsStore = useProjectsStore()
const { showSuccess } = useToast()

// State
const showFullApiKey = ref(false)

// Computed
const currentProject = computed(() => projectsStore.currentProject)

const maskedApiKey = computed(() => {
  if (!currentProject.value?.api_key) return 'Not generated'
  if (showFullApiKey.value) return currentProject.value.api_key
  const key = currentProject.value.api_key
  return `${key.substring(0, 8)}${'*'.repeat(24)}${key.substring(key.length - 4)}`
})

// Onboarding Steps
const onboardingSteps = ref([
  {
    id: 1,
    title: 'Create Project',
    description: 'Set up your project with basic information and website URL',
    icon: 'pi pi-plus-circle',
    completed: true,
    completedAt: new Date(),
    current: false,
    actionLabel: '',
    actionIcon: '',
    docsUrl: '/docs/getting-started'
  },
  {
    id: 2,
    title: 'Generate API Key',
    description: 'Create an API key to authenticate your SDK integration',
    icon: 'pi pi-key',
    completed: true,
    completedAt: new Date(),
    current: false,
    actionLabel: '',
    actionIcon: '',
    docsUrl: '/docs/api-keys'
  },
  {
    id: 3,
    title: 'Install SDK',
    description: 'Add the Radar-Snap SDK to your website or mobile app',
    icon: 'pi pi-code',
    completed: false,
    current: true,
    actionLabel: 'Install SDK',
    actionIcon: 'pi pi-download',
    docsUrl: '/docs/sdk-installation'
  },
  {
    id: 4,
    title: 'Verify Integration',
    description: 'Test your integration and ensure data is being collected',
    icon: 'pi pi-shield',
    completed: false,
    current: false,
    actionLabel: 'Test Integration',
    actionIcon: 'pi pi-play',
    docsUrl: '/docs/verification'
  },
  {
    id: 5,
    title: 'Configure Tracking',
    description: 'Set up custom events, goals, and tracking preferences',
    icon: 'pi pi-sliders-h',
    completed: false,
    current: false,
    actionLabel: 'Configure',
    actionIcon: 'pi pi-cog',
    docsUrl: '/docs/configuration'
  }
])

const completedSteps = computed(() => 
  onboardingSteps.value.filter(step => step.completed).length
)

const totalSteps = computed(() => onboardingSteps.value.length)

const completionPercentage = computed(() => 
  Math.round((completedSteps.value / totalSteps.value) * 100)
)

// Methods
function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    showSuccess('Copied to clipboard!')
  })
}

function toggleApiKeyVisibility() {
  showFullApiKey.value = !showFullApiKey.value
}

function handleStepAction(step: any) {
  switch (step.id) {
    case 3:
      emit('menu-select', 'sdk-installation')
      break
    case 4:
      // Implement verification logic
      showSuccess('Integration verification started')
      break
    case 5:
      emit('menu-select', 'project-settings')
      break
    default:
      console.log('Action for step:', step.id)
  }
}

function openDocs(url: string) {
  window.open(url, '_blank')
}

function formatDate(date: Date | undefined) {
  if (!date) return ''
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(date)
}

// Lifecycle
onMounted(() => {
  // Simulate checking step completion status
  // In real implementation, this would come from the store or API
})
</script>

<style scoped>
.onboarding-step {
  transition: all 0.2s ease;
}

.onboarding-step:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>