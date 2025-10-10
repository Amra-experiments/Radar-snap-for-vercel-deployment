<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
    <div class="flex items-start justify-between">
      <!-- Header with icon and type -->
      <div class="flex items-center space-x-3">
        <div class="p-2 rounded-lg" :class="getTypeColor(item.type)">
          <i :class="getTypeIcon(item.type)" class="text-lg"></i>
        </div>
        <div>
          <h3 class="font-medium text-gray-900 truncate" :title="item.key">
            {{ item.key }}
          </h3>
          <p class="text-sm text-gray-500">{{ formatType(item.type) }}</p>
        </div>
      </div>
      
      <!-- Size and persistence indicators -->
      <div class="flex items-center space-x-2 flex-shrink-0">
        <span class="text-sm font-medium text-gray-600">
          {{ formatSize(item.size) }}
        </span>
        <div 
          v-if="item.persistent" 
          class="w-2 h-2 rounded-full bg-blue-500" 
          title="Persistent storage"
        ></div>
        <div 
          v-else 
          class="w-2 h-2 rounded-full bg-orange-500" 
          title="Session storage"
        ></div>
      </div>
    </div>

    <!-- Category badge -->
    <div class="mt-3">
      <span 
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
        :class="getCategoryColor(item.category)"
      >
        <i :class="getCategoryIcon(item.category)" class="mr-1 text-xs"></i>
        {{ formatCategory(item.category) }}
      </span>
    </div>

    <!-- Value preview -->
    <div class="mt-3" v-if="item.value && showValue">
      <p class="text-sm text-gray-600 mb-1">Value preview:</p>
      <div class="bg-gray-50 rounded p-2 font-mono text-xs text-gray-800 overflow-hidden">
        {{ truncateValue(item.value) }}
      </div>
    </div>

    <!-- Cookie-specific information -->
    <div v-if="item.type === 'cookie' && (item.domain || item.expiryDate)" class="mt-3 space-y-1">
      <div v-if="item.domain" class="flex items-center text-sm text-gray-600">
        <i class="pi pi-globe mr-2 text-xs"></i>
        <span>{{ item.domain }}</span>
      </div>
      <div v-if="item.expiryDate" class="flex items-center text-sm text-gray-600">
        <i class="pi pi-calendar mr-2 text-xs"></i>
        <span>Expires: {{ formatDate(item.expiryDate) }}</span>
      </div>
      <div v-if="item.secure || item.httpOnly || item.sameSite" class="flex items-center space-x-2 text-xs">
        <span v-if="item.secure" class="bg-green-100 text-green-800 px-2 py-1 rounded">Secure</span>
        <span v-if="item.httpOnly" class="bg-blue-100 text-blue-800 px-2 py-1 rounded">HttpOnly</span>
        <span v-if="item.sameSite" class="bg-purple-100 text-purple-800 px-2 py-1 rounded">{{ item.sameSite }}</span>
      </div>
    </div>

    <!-- Description -->
    <div v-if="item.description" class="mt-3">
      <p class="text-sm text-gray-500">{{ item.description }}</p>
    </div>

    <!-- Timestamps -->
    <div class="mt-4 flex items-center justify-between text-xs text-gray-400">
      <div class="flex items-center space-x-4">
        <span title="Created">
          <i class="pi pi-plus-circle mr-1"></i>
          {{ formatRelativeTime(item.createdAt) }}
        </span>
        <span title="Last Modified">
          <i class="pi pi-clock mr-1"></i>
          {{ formatRelativeTime(item.lastModified) }}
        </span>
      </div>
      
      <!-- Actions dropdown -->
      <div class="relative" v-if="showActions">
        <Button 
          icon="pi pi-ellipsis-v" 
          class="p-button-text p-button-sm text-gray-400 hover:text-gray-600"
          @click="toggleActions"
        />
        <div 
          v-if="actionsVisible"
          class="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10"
        >
          <button 
            class="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            @click="$emit('inspect', item)"
          >
            <i class="pi pi-eye mr-2"></i>
            Inspect
          </button>
          <button 
            class="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            @click="$emit('copy', item)"
          >
            <i class="pi pi-copy mr-2"></i>
            Copy Value
          </button>
          <button 
            class="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            @click="$emit('delete', item)"
          >
            <i class="pi pi-trash mr-2"></i>
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import type { StorageItem } from '@/types/analytics'

// Props
interface Props {
  item: StorageItem
  showValue?: boolean
  showActions?: boolean
}

withDefaults(defineProps<Props>(), {
  showValue: true,
  showActions: true
})

// Emits
defineEmits<{
  inspect: [item: StorageItem]
  copy: [item: StorageItem]
  delete: [item: StorageItem]
}>()

// State
const actionsVisible = ref(false)

// Methods
const toggleActions = () => {
  actionsVisible.value = !actionsVisible.value
}

const getTypeIcon = (type: string): string => {
  const icons = {
    localStorage: 'pi pi-database',
    sessionStorage: 'pi pi-clock',
    indexedDB: 'pi pi-server',
    cookie: 'pi pi-bookmark'
  }
  return icons[type as keyof typeof icons] || 'pi pi-file'
}

const getTypeColor = (type: string): string => {
  const colors = {
    localStorage: 'bg-blue-100 text-blue-600',
    sessionStorage: 'bg-orange-100 text-orange-600',
    indexedDB: 'bg-purple-100 text-purple-600',
    cookie: 'bg-green-100 text-green-600'
  }
  return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-600'
}

const formatType = (type: string): string => {
  const labels = {
    localStorage: 'Local Storage',
    sessionStorage: 'Session Storage',
    indexedDB: 'IndexedDB',
    cookie: 'Cookie'
  }
  return labels[type as keyof typeof labels] || type
}

const getCategoryIcon = (category: string): string => {
  const icons = {
    essential: 'pi pi-shield',
    functional: 'pi pi-cog',
    analytics: 'pi pi-chart-line',
    marketing: 'pi pi-megaphone',
    preferences: 'pi pi-user'
  }
  return icons[category as keyof typeof icons] || 'pi pi-tag'
}

const getCategoryColor = (category: string): string => {
  const colors = {
    essential: 'bg-red-100 text-red-800',
    functional: 'bg-blue-100 text-blue-800',
    analytics: 'bg-purple-100 text-purple-800',
    marketing: 'bg-green-100 text-green-800',
    preferences: 'bg-yellow-100 text-yellow-800'
  }
  return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

const formatCategory = (category: string): string => {
  return category.charAt(0).toUpperCase() + category.slice(1)
}

const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const truncateValue = (value: string, maxLength = 100): string => {
  if (value.length <= maxLength) return value
  return value.substring(0, maxLength) + '...'
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInHours < 24) return `${diffInHours}h ago`
  if (diffInDays < 7) return `${diffInDays}d ago`
  return formatDate(dateString)
}

// Close actions menu when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    actionsVisible.value = false
  }
}

// Add/remove event listener for outside clicks
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Custom scrollbar for value preview */
.overflow-hidden {
  max-height: 60px;
  overflow-y: auto;
}

/* Animations */
.transition-shadow {
  transition: box-shadow 0.2s ease-in-out;
}

/* Ensure text doesn't overflow */
.truncate {
  max-width: 200px;
}
</style>