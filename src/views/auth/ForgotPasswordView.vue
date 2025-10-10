<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Message from 'primevue/message'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const error = ref('')
const success = ref(false)

async function handleForgotPassword() {
  error.value = ''
  
  if (!email.value) {
    error.value = 'Please enter your email address'
    return
  }
  
  if (!/\S+@\S+\.\S+/.test(email.value)) {
    error.value = 'Please enter a valid email address'
    return
  }
  
  const result = await authStore.forgotPassword(email.value)
  
  if (result.success) {
    success.value = true
  } else {
    error.value = result.error || 'Failed to send reset email'
  }
}

function goBackToLogin() {
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo and Header -->
      <div class="text-center">
        <div class="inline-flex items-center justify-center gap-3 mb-6">
          <div class="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <i class="pi pi-chart-bar text-white text-2xl"></i>
          </div>
          <h1 class="text-3xl font-bold text-gray-900">Radar-Snap</h1>
        </div>
        <h2 class="text-2xl font-semibold text-gray-900 mb-2">
          Forgot your password?
        </h2>
        <p class="text-gray-600">
          {{ success ? 'Check your email for reset instructions' : 'No worries, we\'ll send you reset instructions' }}
        </p>
      </div>

      <!-- Reset Form or Success Message -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <!-- Success State -->
        <div v-if="success" class="text-center space-y-6">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <i class="pi pi-check text-3xl text-green-600"></i>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              Reset email sent!
            </h3>
            <p class="text-sm text-gray-600 mb-4">
              We've sent a password reset link to:
            </p>
            <p class="font-medium text-blue-600">{{ email }}</p>
          </div>

          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <div class="flex items-start gap-3">
              <i class="pi pi-info-circle text-blue-600 mt-0.5"></i>
              <div class="text-sm text-blue-900">
                <p class="font-medium mb-1">Didn't receive the email?</p>
                <ul class="space-y-1 text-blue-800">
                  <li>• Check your spam/junk folder</li>
                  <li>• Make sure {{ email }} is correct</li>
                  <li>• Wait a few minutes for delivery</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <Button 
              label="Resend Email"
              class="w-full"
              outlined
              @click="handleForgotPassword"
              :loading="authStore.loading"
            />
            <Button 
              label="Back to Sign In"
              class="w-full"
              text
              @click="goBackToLogin"
            />
          </div>
        </div>

        <!-- Reset Form -->
        <div v-else>
          <Message v-if="error" severity="error" :closable="false" class="mb-6">
            {{ error }}
          </Message>

          <form @submit.prevent="handleForgotPassword" class="space-y-6">
            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
                Email address
              </label>
              <InputText 
                id="email"
                v-model="email"
                type="email"
                placeholder="you@example.com"
                class="w-full"
                size="large"
                :class="{ 'p-invalid': error && !email }"
                required
                autocomplete="email"
                autofocus
              />
              <p class="text-xs text-gray-500 mt-2">
                Enter the email address associated with your account
              </p>
            </div>

            <!-- Submit Button -->
            <Button 
              type="submit"
              label="Send Reset Instructions"
              class="w-full"
              size="large"
              :loading="authStore.loading"
              :disabled="authStore.loading"
            />
          </form>

          <!-- Back to Login -->
          <div class="mt-6 text-center">
            <button 
              @click="goBackToLogin"
              class="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Back to Sign In
            </button>
          </div>
        </div>
      </div>

      <!-- Help Section -->
      <div v-if="!success" class="bg-gray-100 rounded-lg p-6 text-center">
        <h3 class="font-semibold text-gray-900 mb-2">Still need help?</h3>
        <p class="text-sm text-gray-600 mb-3">
          If you're having trouble accessing your account, our support team is here to help.
        </p>
        <div class="flex justify-center gap-4 text-sm">
          <a href="mailto:support@radar-snap.com" class="text-blue-600 hover:text-blue-700 font-medium">
            Email Support
          </a>
          <span class="text-gray-400">•</span>
          <a href="/help" class="text-blue-600 hover:text-blue-700 font-medium">
            Help Center
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional hover effects */
.hover-lift {
  transition: transform 0.2s ease-in-out;
}
.hover-lift:hover {
  transform: translateY(-1px);
}
</style>