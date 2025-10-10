<template>
  <div class="onboarding-page p-6 max-w-6xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">🚀 Project Setup</h1>
      <p class="text-gray-600">Welcome to your project onboarding! Follow these steps to integrate Radar-Snap analytics.</p>
    </div>

    <!-- Progress Steps -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div v-for="(step, index) in steps" :key="index" class="flex items-center">
          <div 
            class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
            :class="{
              'bg-green-500 text-white': step.completed,
              'bg-blue-500 text-white': step.current,
              'bg-gray-300 text-gray-600': !step.completed && !step.current
            }"
          >
            <i v-if="step.completed" class="pi pi-check"></i>
            <span v-else>{{ index + 1 }}</span>
          </div>
          <span class="ml-2 text-sm font-medium" :class="{
            'text-green-600': step.completed,
            'text-blue-600': step.current,
            'text-gray-500': !step.completed && !step.current
          }">{{ step.name }}</span>
          <div v-if="index < steps.length - 1" class="w-16 h-1 mx-4 bg-gray-200 rounded">
            <div class="h-full bg-blue-500 rounded transition-all" :style="{ width: step.completed ? '100%' : '0%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Current Project Info -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Current Project</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="flex items-center p-3 bg-gray-50 rounded-lg">
          <i class="pi pi-globe mr-3 text-blue-600"></i>
          <div>
            <p class="text-sm text-gray-500">Project Name</p>
            <p class="font-medium">{{ currentProject?.name || 'Demo Project' }}</p>
          </div>
        </div>
        <div class="flex items-center p-3 bg-gray-50 rounded-lg">
          <i class="pi pi-key mr-3 text-green-600"></i>
          <div>
            <p class="text-sm text-gray-500">API Key</p>
            <p class="font-mono text-sm">{{ maskedApiKey }}</p>
          </div>
        </div>
        <div class="flex items-center p-3 bg-gray-50 rounded-lg">
          <i class="pi pi-chart-line mr-3 text-purple-600"></i>
          <div>
            <p class="text-sm text-gray-500">Status</p>
            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Setup Pending
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- SDK Installation Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <h2 class="text-lg font-semibold text-gray-900 mb-6">
        <i class="pi pi-code mr-2 text-blue-600"></i>
        SDK Installation
      </h2>

      <!-- Platform Tabs -->
      <div class="border-b border-gray-200 mb-6">
        <nav class="-mb-px flex space-x-8">
          <button
            v-for="platform in platforms"
            :key="platform.id"
            @click="selectedPlatform = platform.id"
            class="py-2 px-1 border-b-2 font-medium text-sm transition-colors"
            :class="{
              'border-blue-500 text-blue-600': selectedPlatform === platform.id,
              'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': selectedPlatform !== platform.id
            }"
          >
            <i :class="platform.icon" class="mr-2"></i>
            {{ platform.name }}
          </button>
        </nav>
      </div>

      <!-- Web Platform -->
      <div v-if="selectedPlatform === 'web'">
        <div class="space-y-6">
          <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <div class="flex items-start">
              <i class="pi pi-info-circle text-blue-600 mt-1 mr-3"></i>
              <div>
                <h4 class="font-semibold text-blue-800 mb-1">Quick Installation</h4>
                <p class="text-blue-700 text-sm">Add this script to your website's &lt;head&gt; section to start tracking immediately.</p>
              </div>
            </div>
          </div>

          <div class="relative">
            <label class="block text-sm font-semibold text-gray-700 mb-3">HTML Script Tag (Recommended)</label>
            <div class="relative bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre class="text-green-400 text-sm font-mono"><code>{{ htmlScript }}</code></pre>
              <button
                @click="copyCode('HTML Script', htmlScript)"
                class="absolute top-3 right-3 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-xs font-medium transition-colors flex items-center"
              >
                <i class="pi pi-copy mr-2"></i>
                Copy
              </button>
            </div>
          </div>

          <div class="relative">
            <label class="block text-sm font-semibold text-gray-700 mb-3">NPM Installation</label>
            <div class="space-y-3">
              <div class="relative bg-gray-900 rounded-lg p-4">
                <pre class="text-green-400 text-sm font-mono"><code>npm install @radar-snap/web</code></pre>
                <button
                  @click="copyCode('NPM Command', 'npm install @radar-snap/web')"
                  class="absolute top-3 right-3 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-xs font-medium transition-colors flex items-center"
                >
                  <i class="pi pi-copy mr-2"></i>
                  Copy
                </button>
              </div>
              <div class="relative bg-gray-900 rounded-lg p-4">
                <pre class="text-green-400 text-sm font-mono"><code>{{ npmUsage }}</code></pre>
                <button
                  @click="copyCode('NPM Usage', npmUsage)"
                  class="absolute top-3 right-3 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-xs font-medium transition-colors flex items-center"
                >
                  <i class="pi pi-copy mr-2"></i>
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- React Platform -->
      <div v-if="selectedPlatform === 'react'">
        <div class="space-y-6">
          <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <div class="flex items-start">
              <i class="pi pi-info-circle text-blue-600 mt-1 mr-3"></i>
              <div>
                <h4 class="font-semibold text-blue-800 mb-1">React Integration</h4>
                <p class="text-blue-700 text-sm">Install the React SDK and wrap your app with the provider.</p>
              </div>
            </div>
          </div>

          <div class="relative">
            <label class="block text-sm font-semibold text-gray-700 mb-3">1. Install Package</label>
            <div class="relative bg-gray-900 rounded-lg p-4">
              <pre class="text-green-400 text-sm font-mono"><code>npm install @radar-snap/react</code></pre>
              <button
                @click="copyCode('React Install', 'npm install @radar-snap/react')"
                class="absolute top-3 right-3 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-xs font-medium transition-colors flex items-center"
              >
                <i class="pi pi-copy mr-2"></i>
                Copy
              </button>
            </div>
          </div>

          <div class="relative">
            <label class="block text-sm font-semibold text-gray-700 mb-3">2. Setup Provider</label>
            <div class="relative bg-gray-900 rounded-lg p-4">
              <pre class="text-green-400 text-sm font-mono"><code>{{ reactUsage }}</code></pre>
              <button
                @click="copyCode('React Setup', reactUsage)"
                class="absolute top-3 right-3 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-xs font-medium transition-colors flex items-center"
              >
                <i class="pi pi-copy mr-2"></i>
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Vue Platform -->
      <div v-if="selectedPlatform === 'vue'">
        <div class="space-y-6">
          <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <div class="flex items-start">
              <i class="pi pi-info-circle text-blue-600 mt-1 mr-3"></i>
              <div>
                <h4 class="font-semibold text-blue-800 mb-1">Vue.js Integration</h4>
                <p class="text-blue-700 text-sm">Install the Vue plugin and configure in your main.js file.</p>
              </div>
            </div>
          </div>

          <div class="relative">
            <label class="block text-sm font-semibold text-gray-700 mb-3">1. Install Plugin</label>
            <div class="relative bg-gray-900 rounded-lg p-4">
              <pre class="text-green-400 text-sm font-mono"><code>npm install @radar-snap/vue</code></pre>
              <button
                @click="copyCode('Vue Install', 'npm install @radar-snap/vue')"
                class="absolute top-3 right-3 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-xs font-medium transition-colors flex items-center"
              >
                <i class="pi pi-copy mr-2"></i>
                Copy
              </button>
            </div>
          </div>

          <div class="relative">
            <label class="block text-sm font-semibold text-gray-700 mb-3">2. Configure Plugin</label>
            <div class="relative bg-gray-900 rounded-lg p-4">
              <pre class="text-green-400 text-sm font-mono"><code>{{ vueUsage }}</code></pre>
              <button
                @click="copyCode('Vue Setup', vueUsage)"
                class="absolute top-3 right-3 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-xs font-medium transition-colors flex items-center"
              >
                <i class="pi pi-copy mr-2"></i>
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Platform -->
      <div v-if="selectedPlatform === 'mobile'">
        <div class="space-y-6">
          <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <div class="flex items-start">
              <i class="pi pi-info-circle text-blue-600 mt-1 mr-3"></i>
              <div>
                <h4 class="font-semibold text-blue-800 mb-1">Mobile Integration</h4>
                <p class="text-blue-700 text-sm">Choose your mobile platform and follow the installation guide.</p>
              </div>
            </div>
          </div>

          <!-- Mobile Platform Selection -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              v-for="mobileType in mobileTypes"
              :key="mobileType.id"
              @click="selectedMobileType = mobileType.id"
              class="p-4 text-left border border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
              :class="{ 'border-blue-500 bg-blue-50': selectedMobileType === mobileType.id }"
            >
              <i :class="mobileType.icon" class="text-2xl mb-2 block"></i>
              <h4 class="font-semibold text-gray-900">{{ mobileType.name }}</h4>
              <p class="text-sm text-gray-600">{{ mobileType.description }}</p>
            </button>
          </div>

          <!-- React Native -->
          <div v-if="selectedMobileType === 'react-native'" class="relative">
            <label class="block text-sm font-semibold text-gray-700 mb-3">React Native Setup</label>
            <div class="relative bg-gray-900 rounded-lg p-4">
              <pre class="text-green-400 text-sm font-mono"><code>{{ reactNativeUsage }}</code></pre>
              <button
                @click="copyCode('React Native', reactNativeUsage)"
                class="absolute top-3 right-3 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-xs font-medium transition-colors flex items-center"
              >
                <i class="pi pi-copy mr-2"></i>
                Copy
              </button>
            </div>
          </div>

          <!-- iOS Native -->
          <div v-if="selectedMobileType === 'ios'" class="relative">
            <label class="block text-sm font-semibold text-gray-700 mb-3">iOS Swift Setup</label>
            <div class="relative bg-gray-900 rounded-lg p-4">
              <pre class="text-green-400 text-sm font-mono"><code>{{ iosUsage }}</code></pre>
              <button
                @click="copyCode('iOS Swift', iosUsage)"
                class="absolute top-3 right-3 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-xs font-medium transition-colors flex items-center"
              >
                <i class="pi pi-copy mr-2"></i>
                Copy
              </button>
            </div>
          </div>

          <!-- Android Native -->
          <div v-if="selectedMobileType === 'android'" class="relative">
            <label class="block text-sm font-semibold text-gray-700 mb-3">Android Kotlin Setup</label>
            <div class="relative bg-gray-900 rounded-lg p-4">
              <pre class="text-green-400 text-sm font-mono"><code>{{ androidUsage }}</code></pre>
              <button
                @click="copyCode('Android Kotlin', androidUsage)"
                class="absolute top-3 right-3 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-xs font-medium transition-colors flex items-center"
              >
                <i class="pi pi-copy mr-2"></i>
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Next Steps -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">What's Next?</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="flex items-start p-4 bg-green-50 rounded-lg">
          <i class="pi pi-check-circle text-green-600 mt-1 mr-3"></i>
          <div>
            <h4 class="font-semibold text-green-800 mb-1">Test Your Integration</h4>
            <p class="text-green-700 text-sm">Visit your website and check the browser console for Radar-Snap logs.</p>
          </div>
        </div>
        <div class="flex items-start p-4 bg-blue-50 rounded-lg">
          <i class="pi pi-chart-line text-blue-600 mt-1 mr-3"></i>
          <div>
            <h4 class="font-semibold text-blue-800 mb-1">View Analytics</h4>
            <p class="text-blue-700 text-sm">Start monitoring your website's performance and user behavior.</p>
          </div>
        </div>
      </div>

      <div class="mt-6 flex space-x-4">
        <button 
          @click="$router.push('/dashboard')"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
        >
          <i class="pi pi-chart-line mr-2"></i>
          View Dashboard
        </button>
        <button 
          class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
          @click="testIntegration"
        >
          <i class="pi pi-play mr-2"></i>
          Test Integration
        </button>
      </div>
    </div>

    <!-- Toast for copy notifications -->
    <div 
      v-if="showToast"
      class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center z-50"
    >
      <i class="pi pi-check mr-2"></i>
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProjectsStore } from '@/stores/projects'

// Store
const projectsStore = useProjectsStore()

// State
const selectedPlatform = ref('web')
const selectedMobileType = ref('react-native')
const showToast = ref(false)
const toastMessage = ref('')

// Computed
const currentProject = computed(() => projectsStore.currentProject)

const maskedApiKey = computed(() => {
  const apiKey = currentProject.value?.api_key || 'rs_demo_1234567890abcdef'
  return `${apiKey.substring(0, 8)}${'*'.repeat(16)}${apiKey.substring(apiKey.length - 4)}`
})

// Progress Steps
const steps = ref([
  { name: 'Create Project', completed: true, current: false },
  { name: 'Install SDK', completed: false, current: true },
  { name: 'Verify Setup', completed: false, current: false },
  { name: 'Go Live', completed: false, current: false }
])

// Platform Options
const platforms = [
  { id: 'web', name: 'Web / JavaScript', icon: 'pi pi-globe' },
  { id: 'react', name: 'React', icon: 'pi pi-spin' },
  { id: 'vue', name: 'Vue.js', icon: 'pi pi-shield' },
  { id: 'mobile', name: 'Mobile', icon: 'pi pi-mobile' }
]

const mobileTypes = [
  { 
    id: 'react-native', 
    name: 'React Native', 
    icon: 'pi pi-mobile',
    description: 'Cross-platform mobile development' 
  },
  { 
    id: 'ios', 
    name: 'iOS Native', 
    icon: 'pi pi-apple',
    description: 'Native iOS development with Swift' 
  },
  { 
    id: 'android', 
    name: 'Android Native', 
    icon: 'pi pi-android',
    description: 'Native Android development with Kotlin' 
  }
]

// Code Templates
const htmlScript = computed(() => {
  const apiKey = currentProject.value?.api_key || 'rs_demo_1234567890abcdef'
  return `<!-- Radar-Snap Analytics -->
<script>
(function(r,a,d,s,n,p){
  r.RadarSnap=r.RadarSnap||function(){
    (r.RadarSnap.q=r.RadarSnap.q||[]).push(arguments)
  };
  n=a.createElement(d);p=a.getElementsByTagName(d)[0];
  n.async=1;n.src=s;p.parentNode.insertBefore(n,p);
})(window,document,'script','https://cdn.radar-snap.com/v1/radar-snap.min.js');

RadarSnap('init', '${apiKey}');
RadarSnap('trackPageView');
</` + `script>`
})

const npmUsage = computed(() => {
  const apiKey = currentProject.value?.api_key || 'rs_demo_1234567890abcdef'
  return `import RadarSnap from '@radar-snap/web';

// Initialize
RadarSnap.init('${apiKey}');

// Track page views
RadarSnap.trackPageView();

// Track custom events
RadarSnap.track('button_click', {
  element: 'signup_button',
  page: 'homepage'
});`
})

const reactUsage = computed(() => {
  const apiKey = currentProject.value?.api_key || 'rs_demo_1234567890abcdef'
  return `import React from 'react';
import { RadarSnapProvider } from '@radar-snap/react';

function App() {
  return (
    <RadarSnapProvider apiKey="${apiKey}">
      {/* Your app components */}
    </RadarSnapProvider>
  );
}

export default App;`
})

const vueUsage = computed(() => {
  const apiKey = currentProject.value?.api_key || 'rs_demo_1234567890abcdef'
  return `import { createApp } from 'vue';
import RadarSnapPlugin from '@radar-snap/vue';
import App from './App.vue';

const app = createApp(App);

app.use(RadarSnapPlugin, {
  apiKey: '${apiKey}',
  trackPageViews: true
});

app.mount('#app');`
})

const reactNativeUsage = computed(() => {
  const apiKey = currentProject.value?.api_key || 'rs_demo_1234567890abcdef'
  return `import RadarSnap from '@radar-snap/react-native';

export default function App() {
  React.useEffect(() => {
    RadarSnap.init('${apiKey}');
  }, []);

  return (
    // Your app components
  );
}`
})

const iosUsage = computed(() => {
  const apiKey = currentProject.value?.api_key || 'rs_demo_1234567890abcdef'
  return `import RadarSnap

func application(_ application: UIApplication, 
                didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    RadarSnap.initialize(apiKey: "${apiKey}")
    return true
}`
})

const androidUsage = computed(() => {
  const apiKey = currentProject.value?.api_key || 'rs_demo_1234567890abcdef'
  return `import com.radarsnap.sdk.RadarSnap

class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        RadarSnap.initialize(this, "${apiKey}")
    }
}`
})

// Methods
function copyCode(title: string, code: string) {
  navigator.clipboard.writeText(code).then(() => {
    toastMessage.value = `${title} copied to clipboard!`
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
    }, 3000)
  }).catch(() => {
    toastMessage.value = 'Failed to copy to clipboard'
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
    }, 3000)
  })
}

function testIntegration() {
  toastMessage.value = 'Opening integration test guide...'
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
  // Could open a modal or redirect to test page
}

console.log('Enhanced onboarding view loaded successfully!')
</script>

<style scoped>
/* Simple styles */
</style>