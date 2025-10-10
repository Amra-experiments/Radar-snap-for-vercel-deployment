<template>
  <div class="project-switcher">
    <Dropdown
      v-model="selectedProject"
      :options="projects"
      optionLabel="name"
      optionValue="id"
      placeholder="Select Project"
      :loading="loading"
      @change="handleProjectChange"
      class="w-48"
      :class="{ 'p-invalid': error }"
    >
      <template #value="slotProps">
        <div v-if="slotProps.value && currentProject" class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-green-500"></div>
          <span class="font-medium">{{ currentProject.name }}</span>
        </div>
        <span v-else class="text-gray-500">Select Project</span>
      </template>
      
      <template #option="slotProps">
        <div class="flex items-center justify-between w-full py-2">
          <div class="flex items-center gap-2">
            <div 
              class="w-2 h-2 rounded-full" 
              :class="{
                'bg-green-500': slotProps.option.status === 'active',
                'bg-orange-500': slotProps.option.status === 'setup_pending',
                'bg-gray-400': slotProps.option.status === 'inactive'
              }"
            ></div>
            <div>
              <div class="font-medium">{{ slotProps.option.name }}</div>
              <div class="text-xs text-gray-500">{{ slotProps.option.website_url }}</div>
            </div>
          </div>
          <Badge
            :value="slotProps.option.role"
            :severity="getRoleSeverity(slotProps.option.role)"
            size="small"
          />
        </div>
      </template>
      
      <template #footer>
        <div class="border-t border-gray-200 pt-2">
          <Button
            @click="handleCreateProject"
            text
            class="w-full justify-start"
          >
            <i class="pi pi-plus mr-2"></i>
            Create New Project
          </Button>
        </div>
      </template>
    </Dropdown>
    
    <small v-if="error" class="p-error block mt-1">{{ error }}</small>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import Badge from 'primevue/badge'

interface Props {
  showCreateOption?: boolean
  size?: 'small' | 'normal' | 'large'
}

withDefaults(defineProps<Props>(), {
  showCreateOption: true,
  size: 'normal'
})

const emit = defineEmits<{
  projectChange: [projectId: string]
  createProject: []
}>()

const router = useRouter()
const projectsStore = useProjectsStore()

const error = ref('')

// Computed
const projects = computed(() => projectsStore.projects)
const currentProject = computed(() => projectsStore.currentProject)
const loading = computed(() => projectsStore.loading)

const selectedProject = computed({
  get: () => currentProject.value?.id || '',
  set: () => {
    // The actual change is handled by handleProjectChange
  }
})

// Methods
function getRoleSeverity(role: string) {
  const severityMap: Record<string, any> = {
    owner: 'success',
    admin: 'info',
    developer: 'secondary',
    viewer: 'warning'
  }
  return severityMap[role] || 'secondary'
}

async function handleProjectChange(event: any) {
  const projectId = event.value
  if (!projectId || projectId === currentProject.value?.id) return
  
  try {
    error.value = ''
    await projectsStore.switchProject(projectId)
    emit('projectChange', projectId)
    
    // Navigate to project dashboard
    router.push(`/projects/${projectId}`)
  } catch (err) {
    console.error('Failed to switch project:', err)
    error.value = 'Failed to switch project. Please try again.'
  }
}

function handleCreateProject() {
  emit('createProject')
  router.push('/onboarding')
}

// Load projects on mount if not already loaded
if (projects.value.length === 0 && !loading.value) {
  projectsStore.fetchProjects()
}
</script>

<style scoped>
.project-switcher :deep(.p-dropdown) {
  transition: all 0.2s;
}

.project-switcher :deep(.p-dropdown:hover) {
  border-color: #3b82f6;
}

.project-switcher :deep(.p-dropdown-panel) {
  min-width: 280px;
}

.project-switcher :deep(.p-dropdown-item) {
  padding: 0.5rem 0.75rem;
}

.project-switcher :deep(.p-dropdown-item:hover) {
  background-color: #f8fafc;
}
</style>