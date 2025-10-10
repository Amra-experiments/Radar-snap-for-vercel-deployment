<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <nav class="text-sm breadcrumb mb-4">
          <router-link to="/dashboard" class="text-blue-600 hover:text-blue-800">Dashboard</router-link>
          <span class="mx-2 text-gray-400">/</span>
          <router-link :to="`/projects/${projectId}`" class="text-blue-600 hover:text-blue-800">{{ project?.name }}</router-link>
          <span class="mx-2 text-gray-400">/</span>
          <span class="text-gray-600">Settings</span>
        </nav>
        <h1 class="text-3xl font-bold text-gray-900">Project Settings</h1>
        <p class="text-gray-600 mt-2">Manage your project configuration and API settings</p>
      </div>

      <div class="space-y-6" v-if="project">
        <!-- Basic Settings -->
        <Card>
          <template #title>
            <div class="flex items-center gap-2">
              <i class="pi pi-cog text-blue-600"></i>
              Basic Settings
            </div>
          </template>
          <template #content>
            <div class="space-y-4">
              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700">Project Name</label>
                <InputText 
                  v-model="form.name" 
                  :class="{ 'p-invalid': errors.name }"
                  placeholder="Enter project name"
                />
                <small class="p-error" v-if="errors.name">{{ errors.name }}</small>
              </div>
              
              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700">Website URL</label>
                <InputText 
                  v-model="form.website_url" 
                  placeholder="https://example.com"
                />
              </div>
              
              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700">Description</label>
                <Textarea 
                  v-model="form.description" 
                  rows="3"
                  placeholder="Enter project description (optional)"
                />
              </div>
            </div>
          </template>
        </Card>

        <!-- API Configuration -->
        <Card>
          <template #title>
            <div class="flex items-center gap-2">
              <i class="pi pi-key text-green-600"></i>
              API Configuration
            </div>
          </template>
          <template #content>
            <div class="space-y-4">
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <label class="text-sm font-medium text-gray-700">API Key</label>
                  <div class="flex gap-2">
                    <Button
                      @click="copyApiKey"
                      size="small"
                      severity="secondary"
                      outlined
                    >
                      <i class="pi pi-copy mr-1"></i>
                      Copy
                    </Button>
                    <Button
                      @click="regenerateApiKey"
                      size="small"
                      severity="warning"
                      outlined
                      :loading="regenerating"
                    >
                      <i class="pi pi-refresh mr-1"></i>
                      Regenerate
                    </Button>
                  </div>
                </div>
                <div class="relative">
                  <InputText 
                    :value="project.api_key" 
                    readonly
                    class="font-mono text-sm"
                  />
                </div>
                <small class="text-gray-500">This key is used to authenticate API requests</small>
              </div>
            </div>
          </template>
        </Card>

        <!-- Danger Zone -->
        <Card>
          <template #title>
            <div class="flex items-center gap-2">
              <i class="pi pi-exclamation-triangle text-red-600"></i>
              Danger Zone
            </div>
          </template>
          <template #content>
            <div class="space-y-4">
              <div class="border border-red-200 rounded-lg p-4 bg-red-50">
                <h4 class="font-medium text-red-900 mb-2">Delete Project</h4>
                <p class="text-red-700 text-sm mb-4">
                  This action cannot be undone. This will permanently delete the project and all associated data.
                </p>
                <Button
                  @click="confirmDelete = true"
                  severity="danger"
                  size="small"
                >
                  <i class="pi pi-trash mr-1"></i>
                  Delete Project
                </Button>
              </div>
            </div>
          </template>
        </Card>

        <!-- Actions -->
        <div class="flex justify-between">
          <Button
            @click="router.back()"
            severity="secondary"
            outlined
          >
            <i class="pi pi-arrow-left mr-1"></i>
            Back
          </Button>
          
          <div class="flex gap-2">
            <Button
              @click="resetForm"
              severity="secondary"
              outlined
              :disabled="!hasChanges"
            >
              Reset
            </Button>
            <Button
              @click="saveProject"
              :loading="saving"
              :disabled="!hasChanges || !isValidForm"
            >
              <i class="pi pi-save mr-1"></i>
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <i class="pi pi-spin pi-spinner text-4xl text-gray-400"></i>
        <p class="text-gray-500 mt-4">Loading project settings...</p>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <Dialog
      v-model:visible="confirmDelete"
      modal
      header="Delete Project"
      :style="{ width: '32rem' }"
    >
      <div class="space-y-4">
        <div class="flex items-start gap-3">
          <i class="pi pi-exclamation-triangle text-red-500 text-xl mt-1"></i>
          <div>
            <p class="text-gray-900 font-medium">Are you sure you want to delete this project?</p>
            <p class="text-gray-600 text-sm mt-1">
              This action cannot be undone. All data, settings, and team members will be permanently removed.
            </p>
          </div>
        </div>
        
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">
            Type <span class="font-mono bg-gray-100 px-1 rounded">{{ project?.name }}</span> to confirm:
          </label>
          <InputText 
            v-model="deleteConfirmText" 
            placeholder="Project name"
            class="w-full"
          />
        </div>
      </div>
      
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button
            @click="confirmDelete = false"
            severity="secondary"
            outlined
          >
            Cancel
          </Button>
          <Button
            @click="deleteProject"
            severity="danger"
            :loading="deleting"
            :disabled="deleteConfirmText !== project?.name"
          >
            <i class="pi pi-trash mr-1"></i>
            Delete Project
          </Button>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'

const route = useRoute()
const router = useRouter()
const projectsStore = useProjectsStore()

const projectId = route.params.id as string
const saving = ref(false)
const regenerating = ref(false)
const deleting = ref(false)
const confirmDelete = ref(false)
const deleteConfirmText = ref('')

const project = computed(() => 
  projectsStore.projects.find(p => p.id === projectId)
)

// Form data
const form = ref({
  name: '',
  website_url: '',
  description: ''
})

const errors = ref<Record<string, string>>({})

// Initialize form when project loads
watch(project, (newProject) => {
  if (newProject) {
    form.value = {
      name: newProject.name || '',
      website_url: newProject.website_url || '',
      description: '' // Not available in current interface
    }
  }
}, { immediate: true })

const hasChanges = computed(() => {
  if (!project.value) return false
  return (
    form.value.name !== (project.value.name || '') ||
    form.value.website_url !== (project.value.website_url || '') ||
    form.value.description !== '' // Always consider description as changed since we don't store it
  )
})

const isValidForm = computed(() => {
  return form.value.name.trim().length > 0 &&
         Object.keys(errors.value).length === 0
})

function validateForm() {
  errors.value = {}
  
  if (!form.value.name.trim()) {
    errors.value.name = 'Project name is required'
  }
}

function resetForm() {
  if (project.value) {
    form.value = {
      name: project.value.name || '',
      website_url: project.value.website_url || '',
      description: ''
    }
  }
  errors.value = {}
}

async function saveProject() {
  validateForm()
  if (!isValidForm.value || !project.value) return
  
  try {
    saving.value = true
    await projectsStore.updateProject(project.value.id, form.value)
    console.log('Project updated successfully')
  } catch (error) {
    console.error('Failed to update project:', error)
  } finally {
    saving.value = false
  }
}

function copyApiKey() {
  if (project.value?.api_key) {
    navigator.clipboard.writeText(project.value.api_key).then(() => {
      console.log('API key copied to clipboard')
    }).catch(() => {
      console.error('Failed to copy API key')
    })
  }
}

async function regenerateApiKey() {
  if (!project.value) return
  
  try {
    regenerating.value = true
    await projectsStore.regenerateApiKey(project.value.id)
    console.log('API key regenerated successfully')
  } catch (error) {
    console.error('Failed to regenerate API key:', error)
  } finally {
    regenerating.value = false
  }
}

async function deleteProject() {
  if (!project.value || deleteConfirmText.value !== project.value.name) return
  
  try {
    deleting.value = true
    await projectsStore.deleteProject(project.value.id)
    console.log('Project deleted successfully')
    router.push('/dashboard')
  } catch (error) {
    console.error('Failed to delete project:', error)
  } finally {
    deleting.value = false
    confirmDelete.value = false
    deleteConfirmText.value = ''
  }
}
</script>