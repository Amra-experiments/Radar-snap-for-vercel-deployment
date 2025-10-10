<template>
  <div class="placeholder-component p-6">
    <Card>
      <template #title>
        <div class="flex items-center">
          <i :class="icon" class="mr-2 text-blue-600"></i>
          {{ title }}
        </div>
      </template>
      <template #content>
        <div class="text-center py-12">
          <i class="pi pi-wrench text-6xl text-gray-300 mb-4"></i>
          <h3 class="text-xl font-semibold text-gray-600 mb-2">Coming Soon</h3>
          <p class="text-gray-500 mb-6">This feature is currently under development.</p>
          <Button 
            label="Back to Overview" 
            icon="pi pi-arrow-left"
            @click="$emit('back-to-overview')"
            size="small"
          />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import Button from 'primevue/button'

// Props
interface Props {
  title?: string
  icon?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Feature',
  icon: 'pi pi-cog'
})

// Emits
defineEmits<{
  'back-to-overview': []
}>()
</script>