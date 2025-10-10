<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Invite Team Member"
    :style="{ width: '32rem' }"
    :closable="!loading"
    @update:visible="handleClose"
  >
    <div class="space-y-4">
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">Email Address</label>
        <InputText
          v-model="form.email"
          type="email"
          placeholder="colleague@example.com"
          class="w-full"
          :class="{ 'p-invalid': errors.email }"
          :disabled="loading"
          @keyup.enter="handleSubmit"
        />
        <small class="p-error" v-if="errors.email">{{ errors.email }}</small>
      </div>
      
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">Role</label>
        <Dropdown
          v-model="form.role"
          :options="roleOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Select role"
          class="w-full"
          :class="{ 'p-invalid': errors.role }"
          :disabled="loading"
        />
        <small class="p-error" v-if="errors.role">{{ errors.role }}</small>
        <small class="text-gray-500">
          {{ getRoleDescription(form.role) }}
        </small>
      </div>
      
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">Message (Optional)</label>
        <Textarea
          v-model="form.message"
          rows="3"
          placeholder="Welcome to our project! Looking forward to working together."
          class="w-full"
          :disabled="loading"
        />
        <small class="text-gray-500">This message will be included in the invitation email.</small>
      </div>

      <!-- Project Context -->
      <div v-if="project" class="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div class="flex items-center gap-2">
          <i class="pi pi-info-circle text-blue-600"></i>
          <div class="text-sm">
            <p class="font-medium text-blue-900">Inviting to: {{ project.name }}</p>
            <p class="text-blue-700">{{ project.website_url }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <template #footer>
      <div class="flex justify-end gap-2">
        <Button
          @click="handleClose"
          severity="secondary"
          outlined
          :disabled="loading"
        >
          Cancel
        </Button>
        <Button
          @click="handleSubmit"
          :loading="loading"
          :disabled="!isValidForm"
        >
          <i class="pi pi-send mr-1"></i>
          Send Invite
        </Button>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'

interface Props {
  visible: boolean
  projectId?: string
  project?: {
    id: string
    name: string
    website_url: string
  }
}

interface Emits {
  'update:visible': [value: boolean]
  'invite-sent': [data: { email: string; role: string; message?: string }]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const loading = ref(false)

const form = ref({
  email: '',
  role: 'developer',
  message: ''
})

const errors = ref<Record<string, string>>({})

const roleOptions = [
  { 
    label: 'Admin', 
    value: 'admin',
    description: 'Can manage project settings, invite members, and access all features'
  },
  { 
    label: 'Developer', 
    value: 'developer',
    description: 'Can view analytics, manage events, but cannot modify project settings'
  },
  { 
    label: 'Viewer', 
    value: 'viewer',
    description: 'Read-only access to analytics dashboards and reports'
  }
]

const isValidForm = computed(() => {
  return form.value.email.trim().length > 0 && 
         form.value.role.length > 0 &&
         Object.keys(errors.value).length === 0
})

function getRoleDescription(role: string): string {
  const roleOption = roleOptions.find(option => option.value === role)
  return roleOption?.description || ''
}

function validateForm(): boolean {
  errors.value = {}
  
  if (!form.value.email.trim()) {
    errors.value.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Please enter a valid email address'
  }
  
  if (!form.value.role) {
    errors.value.role = 'Role is required'
  }
  
  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  if (!validateForm()) return
  
  try {
    loading.value = true
    
    // Emit the invitation data
    emit('invite-sent', {
      email: form.value.email,
      role: form.value.role,
      message: form.value.message || undefined
    })
    
    // Reset form
    resetForm()
    
    // Close modal
    emit('update:visible', false)
  } catch (error) {
    console.error('Failed to send invitation:', error)
  } finally {
    loading.value = false
  }
}

function handleClose() {
  if (loading.value) return
  
  resetForm()
  emit('update:visible', false)
}

function resetForm() {
  form.value = {
    email: '',
    role: 'developer',
    message: ''
  }
  errors.value = {}
}

// Reset form when modal is opened
watch(() => props.visible, (newVisible) => {
  if (newVisible) {
    resetForm()
  }
})
</script>

<style scoped>
/* Custom styles if needed */
</style>