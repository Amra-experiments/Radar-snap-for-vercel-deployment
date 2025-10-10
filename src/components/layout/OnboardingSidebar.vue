<template>
  <div class="sidebar-wrapper" :class="{ 'sidebar-collapsed': collapsed }">
    <!-- Toggle Button -->
    <button 
      @click="toggleSidebar"
      class="sidebar-toggle fixed top-4 left-4 z-50 w-10 h-10 bg-white shadow-lg rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
      :class="{ 'left-64': !collapsed }"
    >
      <i class="pi" :class="collapsed ? 'pi-angle-right' : 'pi-angle-left'"></i>
    </button>

    <!-- Sidebar -->
    <aside 
      class="sidebar fixed left-0 top-0 h-full bg-white shadow-xl border-r border-gray-200 transition-transform duration-300 z-40"
      :class="{ '-translate-x-full': collapsed }"
    >
      <div class="sidebar-content flex flex-col h-full w-80">
        <!-- Header -->
        <div class="sidebar-header px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <i class="pi pi-chart-bar text-white text-sm"></i>
              </div>
              <h2 class="text-lg font-semibold text-gray-900">Project Setup</h2>
            </div>
          </div>
        </div>

        <!-- Current Project Info -->
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <i class="pi pi-globe text-blue-600"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ currentProject?.name || 'No Project Selected' }}</p>
              <p class="text-xs text-gray-500 truncate">{{ currentProject?.website_url || 'Select a project to continue' }}</p>
            </div>
          </div>
        </div>

        <!-- Navigation Menu -->
        <nav class="flex-1 px-4 py-6 overflow-y-auto">
          <div class="space-y-1">
            <button
              v-for="item in menuItems"
              :key="item.id"
              @click="selectMenuItem(item)"
              class="menu-item w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
              :class="{
                'bg-blue-50 text-blue-700 border-l-4 border-blue-600': selectedMenuItem?.id === item.id,
                'text-gray-700 hover:bg-gray-50 hover:text-gray-900': selectedMenuItem?.id !== item.id
              }"
            >
              <i :class="item.icon" class="mr-3 text-lg"></i>
              <span class="flex-1 text-left">{{ item.label }}</span>
              <i v-if="item.badge" class="pi pi-circle-fill text-xs text-blue-500"></i>
            </button>
          </div>
        </nav>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-500">Need help?</span>
            <Button 
              icon="pi pi-question-circle" 
              text
              size="small"
              class="text-gray-400 hover:text-gray-600"
              @click="showHelp = true"
            />
          </div>
        </div>
      </div>
    </aside>

    <!-- Backdrop -->
    <div 
      v-if="!collapsed"
      class="sidebar-backdrop fixed inset-0 bg-black bg-opacity-25 z-30 lg:hidden"
      @click="collapsed = true"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProjectsStore } from '@/stores/projects'
import Button from 'primevue/button'

// Props
interface Props {
  modelValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'menu-select': [item: MenuItem]
}>()

// Types
interface MenuItem {
  id: string
  label: string
  icon: string
  badge?: boolean
  component?: string
}

// Store
const projectsStore = useProjectsStore()

// State
const collapsed = ref(props.modelValue)
const selectedMenuItem = ref<MenuItem | null>(null)
const showHelp = ref(false)

// Computed
const currentProject = computed(() => projectsStore.currentProject)

// Menu Items
const menuItems: MenuItem[] = [
  {
    id: 'onboarding',
    label: 'Onboarding Overview',
    icon: 'pi pi-flag',
    badge: true,
    component: 'OnboardingOverview'
  },
  {
    id: 'sdk-installation',
    label: 'SDK Installation',
    icon: 'pi pi-code',
    badge: true,
    component: 'SDKInstallation'
  },
  {
    id: 'project-settings',
    label: 'Project Settings',
    icon: 'pi pi-cog',
    component: 'ProjectSettings'
  },
  {
    id: 'api-keys',
    label: 'API Keys',
    icon: 'pi pi-key',
    component: 'APIKeys'
  },
  {
    id: 'team-members',
    label: 'Team Members',
    icon: 'pi pi-users',
    component: 'TeamMembers'
  },
  {
    id: 'integrations',
    label: 'Integrations',
    icon: 'pi pi-link',
    component: 'Integrations'
  },
  {
    id: 'documentation',
    label: 'Documentation',
    icon: 'pi pi-book',
    component: 'Documentation'
  }
]

// Methods
function toggleSidebar() {
  collapsed.value = !collapsed.value
  emit('update:modelValue', collapsed.value)
}

function selectMenuItem(item: MenuItem) {
  selectedMenuItem.value = item
  emit('menu-select', item)
  
  // Auto-collapse on mobile
  if (window.innerWidth < 1024) {
    collapsed.value = true
    emit('update:modelValue', collapsed.value)
  }
}

// Lifecycle
onMounted(() => {
  // Auto-select first item
  if (menuItems.length > 0) {
    selectedMenuItem.value = menuItems[0]
    emit('menu-select', menuItems[0])
  }
})

// Watch for prop changes
import { watch } from 'vue'
watch(() => props.modelValue, (value) => {
  collapsed.value = value
})
</script>

<style scoped>
.sidebar {
  width: 20rem; /* 320px */
}

.sidebar-collapsed .sidebar {
  transform: translateX(-100%);
}

.sidebar-toggle {
  transition: left 0.3s ease;
}

.menu-item {
  position: relative;
}

.menu-item:hover {
  transform: translateX(2px);
}

.text-gradient {
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Responsive */
@media (max-width: 1024px) {
  .sidebar-toggle {
    left: 1rem !important;
  }
}
</style>