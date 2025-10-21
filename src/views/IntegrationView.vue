<template>
    <div class="integration-view">
        <!-- Header -->
        <div class="mb-6">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">SDK Integration</h1>
                    <p class="text-gray-600 mt-1">Get your integration script and API configuration</p>
                </div>

                <div class="flex items-center gap-2">
                    <Button label="View Documentation" icon="pi pi-book" outlined size="small" />
                    <Button label="Test Integration" icon="pi pi-play" size="small" />
                </div>
            </div>
        </div>

        <!-- Current Project Info -->
        <div v-if="currentProject" class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="flex items-center gap-3">
                <i class="pi pi-info-circle text-blue-600"></i>
                <div>
                    <h3 class="font-semibold text-blue-900">Project: {{ currentProject.name }}</h3>
                    <p class="text-sm text-blue-700">Integration details for {{ currentProject.website_url || 'your website' }}</p>
                </div>
            </div>
        </div>

        <!-- No Project Selected -->
        <div v-else class="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div class="flex items-center gap-3">
                <i class="pi pi-exclamation-triangle text-yellow-600"></i>
                <div>
                    <h3 class="font-semibold text-yellow-900">No Project Selected</h3>
                    <p class="text-sm text-yellow-700">Please select a project to view integration details.</p>
                </div>
            </div>
        </div>

        <!-- Integration Script Section -->
        <Card class="mb-6">
            <template #title>
                <div class="flex items-center gap-2">
                    <i class="pi pi-code text-xl"></i>
                    <span>HTML Script Integration</span>
                </div>
            </template>
            <template #content>
                <div v-if="currentProject">
                    <IntegrationScript :project-api-key="currentProject.api_key || ''"
                        :project-name="currentProject.name" />
                </div>
                <div v-else class="text-center py-8 text-gray-500">
                    <i class="pi pi-code text-4xl mb-3"></i>
                    <p>Select a project to view integration script</p>
                </div>
            </template>
        </Card>

        <!-- API Configuration -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <!-- API Endpoints -->
            <Card>
                <template #title>
                    <div class="flex items-center gap-2">
                        <i class="pi pi-server text-xl"></i>
                        <span>API Endpoints</span>
                    </div>
                </template>
                <template #content>
                    <div v-if="currentProject" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Session Endpoint</label>
                            <div class="flex items-center gap-2">
                                <InputText :value="config.sessionEndpoint" readonly class="flex-1 font-mono text-sm" />
                                <Button icon="pi pi-copy" size="small" outlined
                                    @click="copyToClipboard(config.sessionEndpoint)" />
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Event Endpoint</label>
                            <div class="flex items-center gap-2">
                                <InputText :value="config.eventsEndpoint" readonly class="flex-1 font-mono text-sm" />
                                <Button icon="pi pi-copy" size="small" outlined
                                    @click="copyToClipboard(config.eventsEndpoint)" />
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                            <div class="flex items-center gap-2">
                                <InputText :value="maskApiKey ? '••••••••••••••••' + apiKey.slice(-4) : apiKey" readonly
                                    class="flex-1 font-mono text-sm" />
                                <Button :icon="maskApiKey ? 'pi pi-eye' : 'pi pi-eye-slash'" size="small" outlined
                                    @click="maskApiKey = !maskApiKey" />
                                <Button icon="pi pi-copy" size="small" outlined @click="copyToClipboard(apiKey)" />
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-center py-8 text-gray-500">
                        <i class="pi pi-server text-4xl mb-3"></i>
                        <p>Select a project to view API configuration</p>
                    </div>
                </template>
            </Card>

            <!-- SDK Configuration -->
            <Card>
                <template #title>
                    <div class="flex items-center gap-2">
                        <i class="pi pi-cog text-xl"></i>
                        <span>SDK Configuration</span>
                    </div>
                </template>
                <template #content>
                    <div v-if="currentProject" class="space-y-4">
                        <div class="flex items-center justify-between">
                            <label class="text-sm font-medium text-gray-700">Debug Mode</label>
                            <Tag :value="config.debug ? 'Enabled' : 'Disabled'"
                                :severity="config.debug ? 'success' : 'secondary'" />
                        </div>

                        <div class="flex items-center justify-between">
                            <label class="text-sm font-medium text-gray-700">Session Endpoint</label>
                            <Tag :value="config.sessionEndpoint.includes('localhost') ? 'Development' : 'Production'"
                                :severity="config.sessionEndpoint.includes('localhost') ? 'warning' : 'success'" />
                        </div>

                        <div class="flex items-center justify-between">
                            <label class="text-sm font-medium text-gray-700">Events Endpoint</label>
                            <Tag :value="config.eventsEndpoint.includes('localhost') ? 'Development' : 'Production'"
                                :severity="config.eventsEndpoint.includes('localhost') ? 'warning' : 'success'" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Allowed Domains</label>
                            <div class="space-y-2">
                                <div v-for="domain in allowedDomains" :key="domain"
                                    class="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                    <i class="pi pi-globe text-gray-500"></i>
                                    <span class="text-sm">{{ domain }}</span>
                                </div>
                                <div v-if="allowedDomains.length === 0" class="text-sm text-gray-500 italic">
                                    No domains configured. Add domains in project settings.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-center py-8 text-gray-500">
                        <i class="pi pi-cog text-4xl mb-3"></i>
                        <p>Select a project to view SDK configuration</p>
                    </div>
                </template>
            </Card>
        </div>

        <!-- Installation Steps -->
        <Card>
            <template #title>
                <div class="flex items-center gap-2">
                    <i class="pi pi-list text-xl"></i>
                    <span>Installation Steps</span>
                </div>
            </template>
            <template #content>
                <Steps :model="installationSteps" :readonly="true" />
            </template>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useProjectsStore } from '@/stores/projects'
import { useRadarSnap } from '@/composables/useRadarSnap'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'
import Steps from 'primevue/steps'
import IntegrationScript from '@/components/IntegrationScript.vue'

const projectsStore = useProjectsStore()
const { config } = useRadarSnap()

// State  
const maskApiKey = ref(true)
const copySuccess = ref(false)

// Computed
const currentProject = computed(() => projectsStore.currentProject)
const apiKey = computed(() => config.value.apiKey)
const allowedDomains = computed(() => {
    if (!currentProject.value?.website_url) return []
    try {
        const url = new URL(currentProject.value.website_url)
        return [url.hostname]
    } catch {
        return [currentProject.value.website_url]
    }
})

// Installation steps
const installationSteps = ref([
    {
        label: 'Copy Script',
        icon: 'pi pi-copy'
    },
    {
        label: 'Add to HTML',
        icon: 'pi pi-code'
    },
    {
        label: 'Test Integration',
        icon: 'pi pi-play'
    },
    {
        label: 'Start Monitoring',
        icon: 'pi pi-chart-line'
    }
])

// Methods
async function copyToClipboard(text: string) {
    try {
        await navigator.clipboard.writeText(text)
        copySuccess.value = true
        setTimeout(() => {
            copySuccess.value = false
        }, 2000)
    } catch (err) {
        console.error('Failed to copy to clipboard:', err)
    }
}

// Watch for project changes to update configuration
watch(currentProject, async (newProject, oldProject) => {
    if (newProject && newProject.id !== oldProject?.id) {
        console.log('Project changed, updating integration details for:', newProject.name)
        
        // Initialize RadarSnap for the new project if it has an API key
        if (newProject.api_key) {
            const { initializeForProject } = useRadarSnap()
            await initializeForProject(newProject.api_key)
        }
    }
}, { immediate: true })
</script>

<style scoped>
.integration-view {
    max-width: 1200px;
}
</style>