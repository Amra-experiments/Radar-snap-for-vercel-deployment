<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Card from 'primevue/card'

import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'

const authStore = useAuthStore()

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref('')

async function handleChangePassword() {
  error.value = ''
  success.value = ''

  // Validation
  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    error.value = 'Please fill in all fields'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    error.value = 'New passwords do not match'
    return
  }

  if (newPassword.value.length < 8) {
    error.value = 'New password must be at least 8 characters long'
    return
  }

  const result = await authStore.changePassword({
    old_password: currentPassword.value,
    new_password: newPassword.value
  })

  if (result.success) {
    success.value = 'Password changed successfully!'
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } else {
    error.value = result.error || 'Failed to change password'
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <Card>
        <template #title>
          <div class="text-center">
            <h2 class="text-2xl font-bold text-gray-900">Change Password</h2>
            <p class="mt-2 text-sm text-gray-600">
              Update your password to keep your account secure
            </p>
          </div>
        </template>
        
        <template #content>
          <Message v-if="error" severity="error" :closable="false" class="mb-4">
            {{ error }}
          </Message>
          
          <Message v-if="success" severity="success" :closable="false" class="mb-4">
            {{ success }}
          </Message>

          <form @submit.prevent="handleChangePassword" class="space-y-6">
            <!-- Current Password -->
            <div>
              <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <Password 
                id="currentPassword" 
                v-model="currentPassword" 
                placeholder="Enter current password" 
                :feedback="false"
                toggleMask
                class="w-full" 
                inputClass="w-full"
                :inputStyle="{ padding: '0.75rem 1rem' }"
                required 
                autocomplete="current-password" 
              />
            </div>

            <!-- New Password -->
            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <Password 
                id="newPassword" 
                v-model="newPassword" 
                placeholder="Enter new password" 
                toggleMask
                class="w-full" 
                inputClass="w-full"
                :inputStyle="{ padding: '0.75rem 1rem' }"
                required 
                autocomplete="new-password" 
              />
            </div>

            <!-- Confirm New Password -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <Password 
                id="confirmPassword" 
                v-model="confirmPassword" 
                placeholder="Confirm new password" 
                :feedback="false"
                toggleMask
                class="w-full" 
                inputClass="w-full"
                :inputStyle="{ padding: '0.75rem 1rem' }"
                required 
                autocomplete="new-password" 
              />
            </div>

            <Button 
              type="submit" 
              label="Change Password" 
              :loading="authStore.loading"
              class="w-full"
              size="large"
            />
          </form>
        </template>
      </Card>
    </div>
  </div>
</template>