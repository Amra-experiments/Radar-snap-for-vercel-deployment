<template>
  <div class="sdk-installation-guide p-6 max-w-5xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 flex items-center mb-4">
        <i class="pi pi-code mr-3 text-blue-600"></i>
        SDK Installation Guide
      </h1>
      <p class="text-gray-600">Choose your platform and follow the integration steps to start collecting analytics data</p>
    </div>

    <!-- Platform Selection -->
    <div class="mb-8">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Select Platform</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Button
          v-for="platform in platforms"
          :key="platform.id"
          :label="platform.name"
          :icon="platform.icon"
          class="p-3 text-left justify-start"
          :class="{ 'p-button-outlined': selectedPlatform !== platform.id }"
          @click="selectedPlatform = platform.id"
        />
      </div>
    </div>

    <!-- Web SDK -->
    <Card v-if="selectedPlatform === 'web'" class="mb-6">
      <template #title>Web JavaScript SDK</template>
      <template #content>
        <div class="space-y-6">
          <!-- Installation Method Selection -->
          <div>
            <h4 class="text-md font-semibold text-gray-900 mb-3">Choose Installation Method</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <Button
                v-for="method in webMethods"
                :key="method.id"
                :label="method.name"
                :icon="method.icon"
                size="small"
                :class="{ 'p-button-outlined': selectedWebMethod !== method.id }"
                @click="selectedWebMethod = method.id"
              />
            </div>
          </div>

          <!-- HTML Script Tag -->
          <div v-if="selectedWebMethod === 'html'">
            <label class="block text-sm font-medium text-gray-700 mb-2">Add this script to your HTML &lt;head&gt; section:</label>
            <div class="code-block relative bg-gray-900 rounded-lg p-4 mb-4">
              <pre class="text-green-400 text-sm overflow-x-auto"><code>{{ htmlScript }}</code></pre>
              <Button
                icon="pi pi-copy"
                class="absolute top-2 right-2 p-button-sm p-button-text p-button-rounded copy-btn"
                @click="copyCode('HTML Script', htmlScript)"
                v-tooltip="'Copy to clipboard'"
              />
            </div>
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <p class="text-blue-700 text-sm">This script will automatically track page views and provide basic analytics.</p>
            </div>
          </div>

          <!-- NPM Package -->
          <div v-if="selectedWebMethod === 'npm'">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">1. Install the package:</label>
                <div class="code-block relative bg-gray-900 rounded-lg p-4">
                  <pre class="text-green-400 text-sm"><code>{{ npmInstallCmd }}</code></pre>
                  <Button
                    icon="pi pi-copy"
                    class="absolute top-2 right-2 p-button-sm p-button-text p-button-rounded copy-btn"
                    @click="copyCode('NPM Install', npmInstallCmd)"
                    v-tooltip="'Copy to clipboard'"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">2. Initialize in your JavaScript:</label>
                <div class="code-block relative bg-gray-900 rounded-lg p-4">
                  <pre class="text-green-400 text-sm overflow-x-auto"><code>{{ npmUsageCode }}</code></pre>
                  <Button
                    icon="pi pi-copy"
                    class="absolute top-2 right-2 p-button-sm p-button-text p-button-rounded copy-btn"
                    @click="copyCode('NPM Usage', npmUsageCode)"
                    v-tooltip="'Copy to clipboard'"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- CDN -->
          <div v-if="selectedWebMethod === 'cdn'">
            <label class="block text-sm font-medium text-gray-700 mb-2">Load directly from CDN:</label>
            <div class="code-block relative bg-gray-900 rounded-lg p-4 mb-4">
              <pre class="text-green-400 text-sm overflow-x-auto"><code>{{ cdnScript }}</code></pre>
              <Button
                icon="pi pi-copy"
                class="absolute top-2 right-2 p-button-sm p-button-text p-button-rounded copy-btn"
                @click="copyCode('CDN Script', cdnScript)"
                v-tooltip="'Copy to clipboard'"
              />
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- React SDK -->
    <Card v-if="selectedPlatform === 'react'" class="mb-6">
      <template #title>React SDK</template>
      <template #content>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">1. Install the React package:</label>
            <div class="code-block relative bg-gray-900 rounded-lg p-4">
              <pre class="text-green-400 text-sm"><code>{{ reactInstallCmd }}</code></pre>
              <Button
                icon="pi pi-copy"
                class="absolute top-2 right-2 p-button-sm p-button-text p-button-rounded copy-btn"
                @click="copyCode('React Install', reactInstallCmd)"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">2. Wrap your app with the provider:</label>
            <div class="code-block relative bg-gray-900 rounded-lg p-4">
              <pre class="text-green-400 text-sm overflow-x-auto"><code>{{ reactUsageCode }}</code></pre>
              <Button
                icon="pi pi-copy"
                class="absolute top-2 right-2 p-button-sm p-button-text p-button-rounded copy-btn"
                @click="copyCode('React Usage', reactUsageCode)"
              />
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- Vue SDK -->
    <Card v-if="selectedPlatform === 'vue'" class="mb-6">
      <template #title>Vue.js SDK</template>
      <template #content>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">1. Install the Vue plugin:</label>
            <div class="code-block relative bg-gray-900 rounded-lg p-4">
              <pre class="text-green-400 text-sm"><code>{{ vueInstallCmd }}</code></pre>
              <Button
                icon="pi pi-copy"
                class="absolute top-2 right-2 p-button-sm p-button-text p-button-rounded copy-btn"
                @click="copyCode('Vue Install', vueInstallCmd)"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">2. Configure in main.js:</label>
            <div class="code-block relative bg-gray-900 rounded-lg p-4">
              <pre class="text-green-400 text-sm overflow-x-auto"><code>{{ vueUsageCode }}</code></pre>
              <Button
                icon="pi pi-copy"
                class="absolute top-2 right-2 p-button-sm p-button-text p-button-rounded copy-btn"
                @click="copyCode('Vue Usage', vueUsageCode)"
              />
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- Mobile SDK -->
    <Card v-if="selectedPlatform === 'mobile'" class="mb-6">
      <template #title>Mobile SDK</template>
      <template #content>
        <div class="space-y-6">
          <!-- Mobile Platform Selection -->
          <div>
            <h4 class="text-md font-semibold text-gray-900 mb-3">Choose Mobile Platform</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <Button
                v-for="mobileType in mobileTypes"
                :key="mobileType.id"
                :label="mobileType.name"
                :icon="mobileType.icon"
                size="small"
                :class="{ 'p-button-outlined': selectedMobileType !== mobileType.id }"
                @click="selectedMobileType = mobileType.id"
              />
            </div>
          </div>

          <!-- React Native -->
          <div v-if="selectedMobileType === 'react-native'">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">1. Install React Native SDK:</label>
                <div class="code-block relative bg-gray-900 rounded-lg p-4">
                  <pre class="text-green-400 text-sm"><code>{{ reactNativeInstallCmd }}</code></pre>
                  <Button
                    icon="pi pi-copy"
                    class="absolute top-2 right-2 p-button-sm p-button-text p-button-rounded copy-btn"
                    @click="copyCode('React Native Install', reactNativeInstallCmd)"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">2. Initialize in App.js:</label>
                <div class="code-block relative bg-gray-900 rounded-lg p-4">
                  <pre class="text-green-400 text-sm overflow-x-auto"><code>{{ reactNativeUsageCode }}</code></pre>
                  <Button
                    icon="pi pi-copy"
                    class="absolute top-2 right-2 p-button-sm p-button-text p-button-rounded copy-btn"
                    @click="copyCode('React Native Usage', reactNativeUsageCode)"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- iOS Native -->
          <div v-if="selectedMobileType === 'ios'">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">1. Add to Package.swift:</label>
                <div class="code-block relative bg-gray-900 rounded-lg p-4">
                  <pre class="text-green-400 text-sm overflow-x-auto"><code>{{ iosPackageCode }}</code></pre>
                  <Button
                    icon="pi pi-copy"
                    class="absolute top-2 right-2 p-button-sm p-button-text p-button-rounded copy-btn"
                    @click="copyCode('iOS Package', iosPackageCode)"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">2. Initialize in AppDelegate:</label>
                <div class="code-block relative bg-gray-900 rounded-lg p-4">
                  <pre class="text-green-400 text-sm overflow-x-auto"><code>{{ iosUsageCode }}</code></pre>
                  <Button
                    icon="pi pi-copy"
                    class="absolute top-2 right-2 p-button-sm p-button-text p-button-rounded copy-btn"
                    @click="copyCode('iOS Usage', iosUsageCode)"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Android Native -->
          <div v-if="selectedMobileType === 'android'">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">1. Add to build.gradle:</label>
                <div class="code-block relative bg-gray-900 rounded-lg p-4">
                  <pre class="text-green-400 text-sm overflow-x-auto"><code>{{ androidGradleCode }}</code></pre>
                  <Button
                    icon="pi pi-copy"
                    class="absolute top-2 right-2 p-button-sm p-button-text p-button-rounded copy-btn"
                    @click="copyCode('Android Gradle', androidGradleCode)"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">2. Initialize in Application class:</label>
                <div class="code-block relative bg-gray-900 rounded-lg p-4">
                  <pre class="text-green-400 text-sm overflow-x-auto"><code>{{ androidUsageCode }}</code></pre>
                  <Button
                    icon="pi pi-copy"
                    class="absolute top-2 right-2 p-button-sm p-button-text p-button-rounded copy-btn"
                    @click="copyCode('Android Usage', androidUsageCode)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- Testing Section -->
    <Card>
      <template #title>
        <div class="flex items-center">
          <i class="pi pi-shield mr-2 text-green-600"></i>
          Test Your Integration
        </div>
      </template>
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-semibold text-gray-900 mb-3">Verification Steps</h4>
            <div class="space-y-3">
              <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                <i class="pi pi-globe mr-3 text-blue-600"></i>
                <span class="text-sm">Visit your website with the SDK installed</span>
              </div>
              <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                <i class="pi pi-eye mr-3 text-green-600"></i>
                <span class="text-sm">Check browser console for Radar-Snap logs</span>
              </div>
              <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                <i class="pi pi-chart-line mr-3 text-purple-600"></i>
                <span class="text-sm">View real-time data in your dashboard</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 class="font-semibold text-gray-900 mb-3">Common Issues</h4>
            <div class="space-y-2 text-sm text-gray-600">
              <p>• Verify your API key is correct</p>
              <p>• Check that HTTPS is enabled</p>
              <p>• Ensure no ad blockers are interfering</p>
              <p>• Look for JavaScript console errors</p>
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProjectsStore } from '@/stores/projects'
import { useToast } from '@/composables/useToast'
import Card from 'primevue/card'
import Button from 'primevue/button'

// Store & Composables
const projectsStore = useProjectsStore()
const { showSuccess, showError } = useToast()

// State
const selectedPlatform = ref('web')
const selectedWebMethod = ref('html')
const selectedMobileType = ref('react-native')

// Computed
const currentProject = computed(() => projectsStore.currentProject)
const apiKey = computed(() => currentProject.value?.api_key || 'your-api-key-here')

// Platform Options
const platforms = [
  { id: 'web', name: 'Web / JavaScript', icon: 'pi pi-globe' },
  { id: 'react', name: 'React', icon: 'pi pi-spin' },
  { id: 'vue', name: 'Vue.js', icon: 'pi pi-shield' },
  { id: 'mobile', name: 'Mobile', icon: 'pi pi-mobile' }
]

const webMethods = [
  { id: 'html', name: 'HTML Script', icon: 'pi pi-code' },
  { id: 'npm', name: 'NPM Package', icon: 'pi pi-box' },
  { id: 'cdn', name: 'CDN', icon: 'pi pi-cloud' }
]

const mobileTypes = [
  { id: 'react-native', name: 'React Native', icon: 'pi pi-mobile' },
  { id: 'ios', name: 'iOS Native', icon: 'pi pi-apple' },
  { id: 'android', name: 'Android Native', icon: 'pi pi-android' }
]

// Code Templates
const htmlScript = computed(() => {
  const scriptOpen = '<script>'
  const scriptClose = '</' + 'script>'
  return `<!-- Radar-Snap Analytics -->
${scriptOpen}
(function(r,a,d,s,n,p){
  r.RadarSnap=r.RadarSnap||function(){
    (r.RadarSnap.q=r.RadarSnap.q||[]).push(arguments)
  };
  n=a.createElement(d);p=a.getElementsByTagName(d)[0];
  n.async=1;n.src=s;p.parentNode.insertBefore(n,p);
})(window,document,'script','https://cdn.radar-snap.com/v1/radar-snap.min.js');

RadarSnap('init', '${apiKey.value}');
RadarSnap('trackPageView');
${scriptClose}`
})

const npmInstallCmd = 'npm install @radar-snap/web'

const npmUsageCode = computed(() => `import RadarSnap from '@radar-snap/web';

// Initialize
RadarSnap.init('${apiKey.value}');

// Track page views
RadarSnap.trackPageView();

// Track custom events
RadarSnap.track('button_click', {
  element: 'signup_button',
  page: 'homepage'
});`)

const cdnScript = computed(() => {
  const scriptOpen = '<script'
  const scriptClose = '</' + 'script>'
  return `${scriptOpen} src="https://cdn.radar-snap.com/v1/radar-snap.min.js">${scriptClose}
${scriptOpen}>
  RadarSnap.init('${apiKey.value}');
  RadarSnap.trackPageView();
${scriptClose}`
})

const reactInstallCmd = 'npm install @radar-snap/react'

const reactUsageCode = computed(() => `import React from 'react';
import { RadarSnapProvider } from '@radar-snap/react';

function App() {
  return (
    <RadarSnapProvider apiKey="${apiKey.value}">
      {/* Your app components */}
    </RadarSnapProvider>
  );
}

export default App;`)

const vueInstallCmd = 'npm install @radar-snap/vue'

const vueUsageCode = computed(() => `import { createApp } from 'vue';
import RadarSnapPlugin from '@radar-snap/vue';
import App from './App.vue';

const app = createApp(App);

app.use(RadarSnapPlugin, {
  apiKey: '${apiKey.value}',
  trackPageViews: true
});

app.mount('#app');`)

const reactNativeInstallCmd = 'npm install @radar-snap/react-native'

const reactNativeUsageCode = computed(() => `import RadarSnap from '@radar-snap/react-native';

export default function App() {
  React.useEffect(() => {
    RadarSnap.init('${apiKey.value}');
  }, []);

  return (
    // Your app components
  );
}`)

const iosPackageCode = `dependencies: [
  .package(
    url: "https://github.com/radar-snap/ios-sdk.git",
    from: "1.0.0"
  )
]`

const iosUsageCode = computed(() => `import RadarSnap

func application(_ application: UIApplication, 
                didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    RadarSnap.initialize(apiKey: "${apiKey.value}")
    return true
}`)

const androidGradleCode = `dependencies {
    implementation 'com.radar-snap:android-sdk:1.0.0'
}`

const androidUsageCode = computed(() => `import com.radarsnap.sdk.RadarSnap

class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        RadarSnap.initialize(this, "${apiKey.value}")
    }
}`)

// Methods
function copyCode(title: string, code: string) {
  navigator.clipboard.writeText(code).then(() => {
    showSuccess(`${title} copied to clipboard!`)
  }).catch(() => {
    showError('Failed to copy code to clipboard')
  })
}


</script>

<style scoped>
.code-block {
  position: relative;
}

.code-block pre {
  margin: 0;
  font-family: 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', monospace;
  line-height: 1.5;
}

.copy-btn {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: rgba(255, 255, 255, 0.8) !important;
}

.copy-btn:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  color: rgba(255, 255, 255, 1) !important;
}
</style>