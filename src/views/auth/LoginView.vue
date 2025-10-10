<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'
import Checkbox from 'primevue/checkbox'
import LoginHelp from '@/components/auth/LoginHelp.vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const error = ref('')

// Handle credential selection from LoginHelp
function handleCredentialSelect(credentials: { email: string; password: string }) {
  email.value = credentials.email
  password.value = credentials.password
  error.value = '' // Clear any existing errors
}

async function handleLogin() {
  error.value = ''
  
  if (!email.value || !password.value) {
    error.value = 'Please fill in all fields'
    return
  }
  
  const result = await authStore.login(email.value, password.value)
  
  if (result.success) {
    // Redirect to dashboard or intended route
    const redirect = router.currentRoute.value.query.redirect as string
    router.push(redirect || '/dashboard')
  } else {
    error.value = result.error || 'Login failed'
  }
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
          Sign in to your account
        </h2>
        <p class="text-gray-600">
          Welcome back! Please enter your credentials
        </p>
      </div>

      <!-- Login Form -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <Message v-if="error" severity="error" :closable="false" class="mb-6">
          {{ error }}
        </Message>

        <form @submit.prevent="handleLogin" class="space-y-6">
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
            />
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <Password 
              id="password"
              v-model="password"
              placeholder="Enter your password"
              :feedback="false"
              toggleMask
              class="w-full"
              inputClass="w-full"
              :inputStyle="{ padding: '0.75rem 1rem' }"
              :class="{ 'p-invalid': error && !password }"
              required
              autocomplete="current-password"
            />
          </div>

          <!-- Remember Me and Forgot Password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <Checkbox 
                id="remember"
                v-model="rememberMe" 
                :binary="true"
              />
              <label for="remember" class="ml-2 text-sm text-gray-600">
                Remember me
              </label>
            </div>
            <router-link 
              to="/forgot-password" 
              class="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Forgot password?
            </router-link>
          </div>

          <!-- Submit Button -->
          <Button 
            type="submit"
            label="Sign In"
            class="w-full"
            size="large"
            :loading="authStore.loading"
            :disabled="authStore.loading"
          />
        </form>

        <!-- Demo Credentials Helper -->
        <div class="mt-6">
          <LoginHelp @credential-select="handleCredentialSelect" />
        </div>

        <!-- Signup Link -->
        <div class="mt-8 text-center">
          <p class="text-sm text-gray-600">
            Don't have an account?
            <router-link 
              to="/signup" 
              class="text-blue-600 hover:text-blue-700 font-semibold ml-1"
            >
              Create one now
            </router-link>
          </p>
        </div>
      </div>

      <!-- Features Preview -->
      <div class="text-center">
        <p class="text-xs text-gray-500 mb-4">
          Trusted by 10,000+ websites worldwide
        </p>
        <div class="flex justify-center items-center space-x-8 opacity-60">
          <div class="flex items-center gap-2">
            <i class="pi pi-shield text-green-600"></i>
            <span class="text-xs text-gray-600">GDPR Compliant</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="pi pi-clock text-blue-600"></i>
            <span class="text-xs text-gray-600">Real-time Analytics</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="pi pi-lock text-purple-600"></i>
            <span class="text-xs text-gray-600">Privacy First</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom animations */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>