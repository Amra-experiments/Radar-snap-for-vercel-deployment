<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProjectsStore } from '@/stores/projects'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Message from 'primevue/message'

const router = useRouter()
const authStore = useAuthStore()
const projectsStore = useProjectsStore()

// Form data
const projectName = ref('')
const websiteUrl = ref('')
const projectType = ref('website')
const error = ref('')
const currentStep = ref(0)

// Project type options
const projectTypes = [
  {
    id: 'website',
    label: 'Website',
    icon: 'pi-globe',
    description: 'Track a website or web application'
  },
  {
    id: 'spa',
    label: 'Single Page App',
    icon: 'pi-desktop',
    description: 'React, Vue, Angular or similar SPA'
  },
  {
    id: 'mobile',
    label: 'Mobile App',
    icon: 'pi-mobile',
    description: 'iOS or Android application'
  },
  {
    id: 'ecommerce',
    label: 'E-commerce',
    icon: 'pi-shopping-cart',
    description: 'Online store or marketplace'
  }
]

// Validation
const isStep1Valid = computed(() => {
  return projectType.value && projectName.value.trim().length >= 2  // Require both project type and name
})

const isStep2Valid = computed(() => {
  return websiteUrl.value.trim().length > 0 &&
    /^https?:\/\/.+/.test(websiteUrl.value)
})

// Final validation for project creation
const canCreateProject = computed(() => {
  return projectType.value &&
    projectName.value.trim().length >= 2 &&
    websiteUrl.value.trim().length > 0 &&
    /^https?:\/\/.+/.test(websiteUrl.value)
})

// Steps
async function nextStep() {
  if (currentStep.value === 0 && !isStep1Valid.value) {
    if (!projectType.value) {
      error.value = 'Please select a project type'
    } else if (!projectName.value.trim() || projectName.value.trim().length < 2) {
      error.value = 'Please enter a project name (minimum 2 characters)'
    }
    return
  }

  if (currentStep.value === 1 && !isStep2Valid.value) {
    error.value = 'Please enter a valid website URL (starting with http:// or https://)'
    return
  }

  error.value = ''

  if (currentStep.value < 2) {
    currentStep.value++
  } else {
    await createProject()
  }
}

function previousStep() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

async function createProject() {
  error.value = ''

  // Ensure we have required fields for project creation
  if (!projectName.value.trim()) {
    error.value = 'Please enter a project name'
    return
  }

  if (!websiteUrl.value.trim()) {
    error.value = 'Please enter a website URL'
    return
  }

  const result = await projectsStore.createProject({
    name: projectName.value.trim(),
    website_url: websiteUrl.value.trim()
  })

  if (result.success && result.project) {
    router.push(`/projects/${result.project.id}/setup`)
  } else {
    error.value = result.error || 'Failed to create project'
  }
}

function skipOnboarding() {
  router.push('/dashboard')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
    <div class="container mx-auto px-4 py-12">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg mb-6">
          <i class="pi pi-rocket text-4xl text-blue-600"></i>
        </div>
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Radar-Snap, {{ authStore.user?.first_name }}! 🎉
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Let's set up your first project to start tracking analytics. This will only take a minute.
        </p>
      </div>

      <!-- Progress Steps -->
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <Message v-if="error" severity="error" :closable="false" class="m-6 mb-0">
            {{ error }}
          </Message>

          <!-- Custom Step Progress Indicator -->
          <div class="p-6">
            <div class="flex items-center justify-center mb-8">
              <div class="flex items-center space-x-4">
                <!-- Step 1 -->
                <div class="flex items-center">
                  <div :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
                    currentStep >= 0 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                  ]">
                    1
                  </div>
                  <span class="ml-2 text-sm font-medium text-gray-700">Project Details</span>
                </div>

                <!-- Connector -->
                <div :class="[
                  'w-16 h-1 rounded transition-all',
                  currentStep >= 1 ? 'bg-blue-600' : 'bg-gray-200'
                ]"></div>

                <!-- Step 2 -->
                <div class="flex items-center">
                  <div :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
                    currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                  ]">
                    2
                  </div>
                  <span class="ml-2 text-sm font-medium text-gray-700">Website Details</span>
                </div>

                <!-- Connector -->
                <div :class="[
                  'w-16 h-1 rounded transition-all',
                  currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'
                ]"></div>

                <!-- Step 3 -->
                <div class="flex items-center">
                  <div :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
                    currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                  ]">
                    3
                  </div>
                  <span class="ml-2 text-sm font-medium text-gray-700">Review & Create</span>
                </div>
              </div>
            </div>

            <!-- Step Content -->
            <!-- Step 1: Project Type & Name -->
            <div v-if="currentStep === 0" class="py-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-6">
                What type of project are you tracking?
              </h3>

              <!-- Project Type Selection -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div v-for="type in projectTypes" :key="type.id" class="relative">
                  <input :id="type.id" v-model="projectType" :value="type.id" type="radio" class="sr-only peer" />
                  <label :for="type.id"
                    class="flex flex-col items-center p-6 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 hover:bg-blue-50 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all duration-200">
                    <i :class="`pi ${type.icon} text-3xl text-gray-600 mb-3`"></i>
                    <h4 class="font-semibold text-gray-900 mb-2">{{ type.label }}</h4>
                    <p class="text-sm text-gray-600 text-center">{{ type.description }}</p>
                  </label>
                </div>
              </div>

              <!-- Project Name -->
              <div>
                <label for="projectName" class="block text-sm font-semibold text-gray-700 mb-3">
                  Project Name <span class="text-red-500">*</span>
                </label>
                <InputText id="projectName" v-model="projectName" placeholder="My Awesome Project" class="w-full"
                  size="large" :class="{ 'p-invalid': error && !projectName }" />
                <p class="text-xs text-gray-500 mt-2">
                  Choose a name that helps you identify this project (minimum 2 characters).
                </p>
              </div>
            </div>

            <!-- Step 2: Website Details -->
            <div v-if="currentStep === 1" class="py-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-6">
                Tell us about your website
              </h3>

              <!-- Website URL -->
              <div class="mb-6">
                <label for="websiteUrl" class="block text-sm font-semibold text-gray-700 mb-3">
                  Website URL
                </label>
                <InputText id="websiteUrl" v-model="websiteUrl" type="url" placeholder="https://mywebsite.com"
                  class="w-full" size="large" :class="{ 'p-invalid': error && !websiteUrl }" />
                <p class="text-xs text-gray-500 mt-2">
                  The main URL where you'll install the tracking script
                </p>
              </div>
            </div>

            <!-- Step 3: Confirmation -->
            <div v-if="currentStep === 2" class="py-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-6">
                Ready to create your project?
              </h3>

              <!-- Project Summary -->
              <div class="bg-gray-50 rounded-lg p-6 mb-6">
                <h4 class="font-semibold text-gray-900 mb-4">Project Summary</h4>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Type:</span>
                    <span class="font-medium">
                      {{projectTypes.find(t => t.id === projectType)?.label}}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Name:</span>
                    <span class="font-medium">{{ projectName }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Website:</span>
                    <span class="font-medium">{{ websiteUrl }}</span>
                  </div>
                </div>
              </div>

              <!-- What's Next -->
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 class="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <i class="pi pi-info-circle"></i>
                  What happens next?
                </h4>
                <ul class="space-y-2 text-sm text-blue-800">
                  <li class="flex items-center gap-2">
                    <i class="pi pi-check text-green-600"></i>
                    Your project will be created with a unique API key
                  </li>
                  <li class="flex items-center gap-2">
                    <i class="pi pi-check text-green-600"></i>
                    You'll get step-by-step installation instructions
                  </li>
                  <li class="flex items-center gap-2">
                    <i class="pi pi-check text-green-600"></i>
                    Start seeing analytics data immediately
                  </li>
                </ul>
              </div>
            </div>

          </div>

          <!-- Navigation -->
          <div class="flex items-center justify-between p-6 bg-gray-50 border-t border-gray-200">
            <div>
              <Button v-if="currentStep > 0" label="Previous" icon="pi pi-arrow-left" outlined @click="previousStep"
                :disabled="projectsStore.loading" />
            </div>

            <div class="flex flex-col items-end gap-2">
              <!-- Validation Message -->
              <div v-if="(currentStep === 0 && !isStep1Valid) || (currentStep === 1 && !isStep2Valid)"
                class="text-xs text-gray-500 text-right">
                <span v-if="currentStep === 0 && !projectType">Please select a project type</span>
                <span v-else-if="currentStep === 0 && (!projectName.trim() || projectName.trim().length < 2)">Please
                  enter a project name (minimum 2 characters)</span>
                <span v-else-if="currentStep === 1 && !websiteUrl.trim()">Please enter your website URL</span>
                <span v-else-if="currentStep === 1 && !/^https?:\/\/.+/.test(websiteUrl)">Please enter a valid URL
                  (starting with http:// or https://)</span>
              </div>

              <div class="flex items-center gap-3">
                <!-- <Button label="Skip for now" text @click="skipOnboarding" :disabled="projectsStore.loading" /> -->

                <Button :label="currentStep === 2 ? 'Create Project' : 'Continue'"
                  :icon="currentStep === 2 ? 'pi pi-plus' : 'pi pi-arrow-right'" iconPos="right" @click="nextStep"
                  :loading="projectsStore.loading" :disabled="projectsStore.loading ||
                    (currentStep === 0 && !isStep1Valid) ||
                    (currentStep === 1 && !isStep2Valid) ||
                    (currentStep === 2 && !canCreateProject)
                    " />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Features Preview -->
      <div class="max-w-6xl mx-auto mt-16">
        <h3 class="text-2xl font-semibold text-center text-gray-900 mb-8">
          What you'll get with Radar-Snap
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <i class="pi pi-chart-line text-2xl text-blue-600"></i>
            </div>
            <h4 class="font-semibold text-gray-900 mb-2">Real-time Analytics</h4>
            <p class="text-gray-600 text-sm">
              Track user behavior, page views, and conversions in real-time
            </p>
          </div>
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
              <i class="pi pi-shield text-2xl text-green-600"></i>
            </div>
            <h4 class="font-semibold text-gray-900 mb-2">Privacy Focused</h4>
            <p class="text-gray-600 text-sm">
              GDPR compliant with cookie consent management and data privacy
            </p>
          </div>
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <i class="pi pi-bolt text-2xl text-purple-600"></i>
            </div>
            <h4 class="font-semibold text-gray-900 mb-2">Easy Setup</h4>
            <p class="text-gray-600 text-sm">
              One-line script installation with detailed setup guides
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom stepper animations */
.p-stepper .p-stepper-panels {
  background: transparent;
}

/* Radio button styling enhancements */
input[type="radio"]:checked+label {
  transform: scale(1.02);
}

/* Smooth transitions */
* {
  transition: all 0.2s ease-in-out;
}
</style>