<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'
import Checkbox from 'primevue/checkbox'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const agreeToTerms = ref(false)
const error = ref('')

async function handleSignup() {
  error.value = ''
  
  // Validation
  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    error.value = 'Please fill in all fields'
    return
  }
  
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }
  
  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters long'
    return
  }
  
  if (!agreeToTerms.value) {
    error.value = 'Please agree to the Terms of Service and Privacy Policy'
    return
  }
  
  const result = await authStore.register(name.value, email.value, password.value)
  
  if (result.success) {
    // Redirect to onboarding for new users
    router.push('/onboarding')
  } else {
    error.value = result.error || 'Registration failed'
  }
}

function validatePassword(password: string) {
  const requirements = [
    { test: password.length >= 8, text: 'At least 8 characters' },
    { test: /[A-Z]/.test(password), text: 'One uppercase letter' },
    { test: /[a-z]/.test(password), text: 'One lowercase letter' },
    { test: /\d/.test(password), text: 'One number' }
  ]
  return requirements
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
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
          Create your account
        </h2>
        <p class="text-gray-600">
          Start tracking analytics in minutes
        </p>
      </div>

      <!-- Signup Form -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <Message v-if="error" severity="error" :closable="false" class="mb-6">
          {{ error }}
        </Message>

        <form @submit.prevent="handleSignup" class="space-y-6">
          <!-- Full Name -->
          <div>
            <label for="name" class="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <InputText 
              id="name"
              v-model="name"
              placeholder="John Doe"
              class="w-full"
              size="large"
              :class="{ 'p-invalid': error && !name }"
              required
              autocomplete="name"
            />
          </div>

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
              placeholder="Create a strong password"
              toggleMask
              class="w-full"
              inputClass="w-full"
              :inputStyle="{ padding: '0.75rem 1rem' }"
              :class="{ 'p-invalid': error && !password }"
              required
              autocomplete="new-password"
              :feedback="true"
            />
            
            <!-- Password Requirements -->
            <div v-if="password" class="mt-2 space-y-1">
              <div 
                v-for="req in validatePassword(password)" 
                :key="req.text"
                class="flex items-center gap-2 text-xs"
              >
                <i 
                  :class="req.test ? 'pi pi-check text-green-600' : 'pi pi-times text-red-600'"
                ></i>
                <span :class="req.test ? 'text-green-600' : 'text-red-600'">
                  {{ req.text }}
                </span>
              </div>
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirm" class="block text-sm font-semibold text-gray-700 mb-2">
              Confirm Password
            </label>
            <Password 
              id="confirm"
              v-model="confirmPassword"
              placeholder="Repeat your password"
              :feedback="false"
              toggleMask
              class="w-full"
              inputClass="w-full"
              :inputStyle="{ padding: '0.75rem 1rem' }"
              :class="{ 'p-invalid': error && !confirmPassword }"
              required
              autocomplete="new-password"
            />
            <div v-if="confirmPassword && password !== confirmPassword" class="flex items-center gap-2 mt-2">
              <i class="pi pi-times text-red-600 text-xs"></i>
              <span class="text-xs text-red-600">Passwords do not match</span>
            </div>
            <div v-else-if="confirmPassword && password === confirmPassword" class="flex items-center gap-2 mt-2">
              <i class="pi pi-check text-green-600 text-xs"></i>
              <span class="text-xs text-green-600">Passwords match</span>
            </div>
          </div>

          <!-- Terms Agreement -->
          <div class="flex items-start gap-3">
            <Checkbox 
              id="terms" 
              v-model="agreeToTerms"
              :binary="true"
              class="mt-0.5"
            />
            <label for="terms" class="text-sm text-gray-600">
              I agree to the 
              <a href="/terms" target="_blank" class="text-blue-600 hover:text-blue-700 font-medium">
                Terms of Service
              </a>
              and 
              <a href="/privacy" target="_blank" class="text-blue-600 hover:text-blue-700 font-medium">
                Privacy Policy
              </a>
            </label>
          </div>

          <!-- Submit Button -->
          <Button 
            type="submit"
            label="Create Account"
            class="w-full"
            size="large"
            :loading="authStore.loading"
            :disabled="authStore.loading || !agreeToTerms"
          />
        </form>

        <!-- Login Link -->
        <div class="mt-8 text-center">
          <p class="text-sm text-gray-600">
            Already have an account?
            <router-link 
              to="/login" 
              class="text-blue-600 hover:text-blue-700 font-semibold ml-1"
            >
              Sign in instead
            </router-link>
          </p>
        </div>
      </div>

      <!-- Trust Indicators -->
      <div class="text-center">
        <p class="text-xs text-gray-500 mb-4">
          Join thousands of websites already using Radar-Snap
        </p>
        <div class="flex justify-center items-center space-x-8 opacity-60">
          <div class="flex items-center gap-2">
            <i class="pi pi-verified text-green-600"></i>
            <span class="text-xs text-gray-600">30-day free trial</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="pi pi-shield text-blue-600"></i>
            <span class="text-xs text-gray-600">No credit card required</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="pi pi-heart text-red-600"></i>
            <span class="text-xs text-gray-600">Setup in 2 minutes</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Password strength indicator styles */
.p-password .p-password-strength {
  height: 4px;
  border-radius: 2px;
}
</style>