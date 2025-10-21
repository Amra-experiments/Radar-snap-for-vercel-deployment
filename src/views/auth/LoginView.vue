<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProjectsStore } from '@/stores/projects'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'
import Checkbox from 'primevue/checkbox'

const router = useRouter()
const authStore = useAuthStore()
const projectsStore = useProjectsStore()

  // Global debug function for checking auth state
  ; (window as any).debugAuth = function () {
    console.log('🔍 Debug Auth State:')
    console.log('- Access token:', localStorage.getItem('auth_access_token'))
    console.log('- Refresh token:', localStorage.getItem('auth_refresh_token'))
    console.log('- User data:', localStorage.getItem('auth_user'))
    console.log('- Auth store state:', {
      isAuthenticated: authStore.isAuthenticated,
      user: authStore.user,
      token: !!authStore.token
    })
  }

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''

  if (!email.value || !password.value) {
    error.value = 'Please fill in all fields'
    return
  }
  const result = await authStore.login(email.value, password.value)

  if (result.success) {
    console.log('✅ Login successful, auth state:', {
      isAuthenticated: authStore.isAuthenticated,
      user: authStore.user,
      token: !!authStore.token
    })

    // Debug: Check localStorage tokens
    console.log('🔍 Debug localStorage after login:')
    console.log('- Access token:', localStorage.getItem('auth_access_token'))
    console.log('- Refresh token:', localStorage.getItem('auth_refresh_token'))
    console.log('- User data:', localStorage.getItem('auth_user'))

    // Wait a tick to ensure token is set before making authenticated requests
    await new Promise(resolve => setTimeout(resolve, 100))

    // Verify authentication before projects call
    console.log('🔍 Pre-projects auth check:', {
      isAuthenticated: authStore.isAuthenticated,
      hasToken: !!authStore.token,
      tokenInStorage: !!localStorage.getItem('auth_access_token')
    })

    // Initialize projects store after ensuring token is set
    console.log('🔄 Initializing projects after login...')
    await projectsStore.initialize()

    console.log('📊 Projects initialized:', {
      projectCount: projectsStore.projects.length,
      hasProjects: projectsStore.hasProjects
    })

    // Decide where to navigate based on projects
    let targetRoute: string
    if (projectsStore.projects.length === 0) {
      targetRoute = '/onboarding'
      console.log('➡️ No projects, navigating to onboarding')
    } else {
      const redirect = router.currentRoute.value.query.redirect as string
      targetRoute = redirect || '/dashboard'
      console.log('➡️ Has projects, navigating to dashboard')
    }

    console.log('🔄 Attempting navigation to:', targetRoute)

    try {
      await router.push(targetRoute)
      console.log('✅ Navigation successful to:', targetRoute)
    } catch (navError) {
      console.error('❌ Navigation failed:', navError)
      error.value = 'Navigation failed after login'
    }
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
            <InputText id="email" v-model="email" type="email" placeholder="you@example.com" class="w-full" size="large"
              :class="{ 'p-invalid': error && !email }" required autocomplete="email" />
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <Password id="password" v-model="password" placeholder="Enter your password" :feedback="false" toggleMask
              class="w-full" inputClass="w-full" :inputStyle="{ padding: '0.75rem 1rem' }"
              :class="{ 'p-invalid': error && !password }" required autocomplete="current-password" />
          </div>

          <!-- Remember Me and Forgot Password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <Checkbox id="remember" v-model="rememberMe" :binary="true" />
              <label for="remember" class="ml-2 text-sm text-gray-600">
                Remember me
              </label>
            </div>
            <router-link to="/forgot-password" class="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Forgot password?
            </router-link>
          </div>

          <!-- Submit Button -->
          <Button type="submit" label="Sign In" class="w-full" size="large" :loading="authStore.loading"
            :disabled="authStore.loading" />
        </form>

        <!-- Signup Link -->
        <div class="mt-8 text-center">
          <p class="text-sm text-gray-600">
            Don't have an account?
            <router-link to="/signup" class="text-blue-600 hover:text-blue-700 font-semibold ml-1">
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>