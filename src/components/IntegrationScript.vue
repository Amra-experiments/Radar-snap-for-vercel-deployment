<template>
    <div class="integration-script-display">
        <div class="mb-4">
            <h3 class="text-lg font-semibold text-gray-800 mb-2">
                <i class="pi pi-code mr-2"></i>
                HTML Script Integration
            </h3>
            <p class="text-sm text-gray-600">
                Copy and paste this code into your HTML file, preferably before the closing &lt;/body&gt; tag.
            </p>
        </div>

        <div class="relative bg-gray-900 rounded-lg overflow-hidden">
            <!-- Header with Copy Button -->
            <div class="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                <span class="text-gray-300 text-sm font-medium">HTML Integration Script</span>
                <Button :icon="copied ? 'pi pi-check' : 'pi pi-copy'" :label="copied ? 'Copied!' : 'Copy Script'"
                    size="small" :severity="copied ? 'success' : 'secondary'" outlined @click="copyToClipboard"
                    class="transition-all duration-200 text-white" />
            </div>

            <!-- Script Content -->
            <div class="p-4">
                <pre class="text-green-400 overflow-x-auto"><code>{{ scriptContent }}</code></pre>
            </div>
        </div>

        <!-- Additional Copy Action -->
        <div class="mt-3 flex items-center justify-between">
            <div class="text-sm text-gray-600">
                <i class="pi pi-info-circle mr-1"></i>
                Click the copy button to copy the entire script to your clipboard
            </div>
            <Button :icon="copied ? 'pi pi-check' : 'pi pi-copy'"
                :label="copied ? 'Script Copied!' : 'Copy Integration Script'"
                :severity="copied ? 'success' : 'primary'" @click="copyToClipboard"
                class="transition-all duration-200" />
        </div>

        <div class="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
            <div class="flex items-start">
                <i class="pi pi-info-circle text-blue-500 mt-0.5 mr-2"></i>
                <div>
                    <h4 class="text-sm font-semibold text-blue-800 mb-1">
                        Integration Notes:
                    </h4>
                    <ul class="text-xs text-blue-700 space-y-1">
                        <li>• The script will automatically start recording user sessions</li>
                        <li>• Debug mode is {{ config.debug ? 'enabled' : 'disabled' }} for this environment</li>
                        <li>• Data will be sent to: {{ config.sessionEndpoint }}</li>
                        <li>• Make sure your website domain is whitelisted in project settings</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Advanced Configuration -->
        <div class="mt-4">
            <Accordion>
                <AccordionTab header="Advanced Configuration">
                    <div class="space-y-4">
                        <div>
                            <h5 class="font-medium text-gray-700 mb-2">Custom Endpoints</h5>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-xs font-medium text-gray-600 mb-1">
                                        Session Endpoint
                                    </label>
                                    <InputText v-model="customSessionEndpoint"
                                        placeholder="https://your-api.com/sessions" size="small" class="w-full"
                                        @input="updateScript" />
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-600 mb-1">
                                        Events Endpoint
                                    </label>
                                    <InputText v-model="customEventsEndpoint" placeholder="https://your-api.com/events"
                                        size="small" class="w-full" @input="updateScript" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <div class="flex items-center space-x-2">
                                <Checkbox v-model="debugMode" inputId="debug" @change="updateScript" />
                                <label for="debug" class="text-sm text-gray-700">Enable Debug Mode</label>
                            </div>
                            <p class="text-xs text-gray-500 mt-1">
                                Debug mode shows console logs and helps with integration testing
                            </p>
                        </div>
                    </div>
                </AccordionTab>
            </Accordion>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Checkbox from 'primevue/checkbox'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import { useRadarSnap } from '@/composables/useRadarSnap'
import { useToast } from '@/composables/useToast'

interface Props {
    projectApiKey: string
    projectName?: string
}

const props = defineProps<Props>()

const { config, generateIntegrationScript } = useRadarSnap()
const { showSuccess, showError } = useToast()

// Reactive state
const copied = ref(false)
const customSessionEndpoint = ref('')
const customEventsEndpoint = ref('')
const debugMode = ref(config.value.debug)

// Computed script content
const scriptContent = computed(() => {
    return generateIntegrationScript(props.projectApiKey, {
        sessionEndpoint: customSessionEndpoint.value || undefined,
        eventsEndpoint: customEventsEndpoint.value || undefined
    })
})

// Initialize custom endpoints
onMounted(() => {
    customSessionEndpoint.value = config.value.sessionEndpoint
    customEventsEndpoint.value = config.value.eventsEndpoint
})

// Update script when configuration changes
const updateScript = () => {
    // Force reactivity update
    // The computed will automatically recalculate
}

// Copy to clipboard functionality
const copyToClipboard = async () => {
    try {
        await navigator.clipboard.writeText(scriptContent.value)
        copied.value = true

        // Show success feedback
        showSuccess('Integration script copied to clipboard!', 'Ready to paste')
        console.log('✅ Integration script copied to clipboard')

        // Reset after 3 seconds
        setTimeout(() => {
            copied.value = false
        }, 3000)
    } catch (error) {
        console.error('Failed to copy to clipboard:', error)

        // Fallback for older browsers or when clipboard API is not available
        try {
            const textArea = document.createElement('textarea')
            textArea.value = scriptContent.value
            textArea.style.position = 'fixed'
            textArea.style.left = '-9999px'
            textArea.style.top = '0'
            textArea.setAttribute('readonly', '')
            document.body.appendChild(textArea)
            textArea.select()
            textArea.setSelectionRange(0, 99999) // For mobile devices

            const successful = document.execCommand('copy')
            document.body.removeChild(textArea)

            if (successful) {
                copied.value = true
                showSuccess('Integration script copied to clipboard!', 'Ready to paste')
                console.log('✅ Integration script copied to clipboard (fallback method)')
                setTimeout(() => {
                    copied.value = false
                }, 3000)
            } else {
                console.error('❌ Failed to copy script using fallback method')
                showError('Failed to copy script', 'Please try selecting and copying manually')
            }
        } catch (fallbackError) {
            console.error('❌ Both clipboard methods failed:', fallbackError)
            showError('Copy failed', 'Please select and copy the script manually')
        }
    }
}
</script>

<style scoped>
.integration-script-display {
    max-width: 100%;
}

pre {
    font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
    line-height: 1.4;
}

code {
    white-space: pre-wrap;
    word-break: break-all;
}
</style>