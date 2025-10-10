<script setup lang="ts">
import { computed } from 'vue'
import type { APIError } from '@/types/analytics'
import { formatDistanceToNow } from 'date-fns'
import Button from 'primevue/button'

const props = defineProps<{
    error: APIError
}>()

const emit = defineEmits<{
    viewDetails: [error: APIError]
}>()

const statusCodeColor = computed(() => {
    const code = props.error.statusCode
    if (code >= 500) return 'bg-red-100 text-red-700 border-red-300'
    if (code >= 400) return 'bg-orange-100 text-orange-700 border-orange-300'
    if (code >= 300) return 'bg-blue-100 text-blue-700 border-blue-300'
    return 'bg-gray-100 text-gray-700 border-gray-300'
})

const errorTypeConfig = computed(() => {
    const configs = {
        failure: { icon: 'pi-times-circle', color: 'text-red-600', bg: 'bg-red-50', label: 'Failure' },
        popup: { icon: 'pi-exclamation-triangle', color: 'text-orange-600', bg: 'bg-orange-50', label: 'Popup' },
        redirect: { icon: 'pi-arrow-right', color: 'text-blue-600', bg: 'bg-blue-50', label: 'Redirect' }
    }
    return configs[props.error.errorType]
})

const methodColor = computed(() => {
    const colors: Record<string, string> = {
        GET: 'bg-blue-100 text-blue-700',
        POST: 'bg-green-100 text-green-700',
        PUT: 'bg-orange-100 text-orange-700',
        DELETE: 'bg-red-100 text-red-700',
        PATCH: 'bg-purple-100 text-purple-700'
    }
    return colors[props.error.method] || 'bg-gray-100 text-gray-700'
})

const timeAgo = computed(() => {
    return formatDistanceToNow(new Date(props.error.timestamp), { addSuffix: true })
})

const formatResponseTime = (ms?: number) => {
    if (!ms) return 'N/A'
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(2)}s`
}
</script>

<template>
    <div class="bg-white border-l-4 rounded-lg shadow-sm hover:shadow-md transition-all"
        :class="error.statusCode >= 500 ? 'border-red-500' : error.statusCode >= 400 ? 'border-orange-500' : 'border-blue-500'">
        <div class="p-4">

            <!-- Header -->
            <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                        <!-- HTTP Method Badge -->
                        <span :class="['px-2 py-1 text-xs font-bold rounded', methodColor]">
                            {{ error.method }}
                        </span>

                        <!-- Status Code Badge -->
                        <span :class="['px-2 py-1 text-xs font-bold rounded border', statusCodeColor]">
                            {{ error.statusCode }}
                        </span>

                        <!-- Error Type Badge -->
                        <span
                            :class="['px-2 py-1 text-xs font-semibold rounded flex items-center gap-1', errorTypeConfig.bg, errorTypeConfig.color]">
                            <i :class="['pi text-xs', errorTypeConfig.icon]"></i>
                            {{ errorTypeConfig.label }}
                        </span>
                    </div>

                    <!-- Endpoint -->
                    <code class="text-sm font-mono text-gray-900 bg-gray-50 px-2 py-1 rounded">
            {{ error.endpoint }}
          </code>
                </div>

                <!-- Error Count Badge -->
                <div class="ml-4 text-center">
                    <div :class="['w-12 h-12 rounded-full flex items-center justify-center', errorTypeConfig.bg]">
                        <span :class="['text-lg font-bold', errorTypeConfig.color]">
                            {{ error.count }}
                        </span>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">occurrences</p>
                </div>
            </div>

            <!-- Error Message -->
            <div class="mb-3 p-3 bg-gray-50 rounded border-l-2 border-gray-300">
                <p class="text-sm text-gray-800 font-medium">{{ error.errorMessage }}</p>
            </div>

            <!-- Metadata Grid -->
            <div class="grid grid-cols-2 gap-3 text-sm mb-3">
                <div class="flex items-center gap-2">
                    <i class="pi pi-clock text-gray-400 text-xs"></i>
                    <span class="text-gray-600">{{ timeAgo }}</span>
                </div>
                <div class="flex items-center gap-2">
                    <i class="pi pi-user text-gray-400 text-xs"></i>
                    <span class="text-gray-600">{{ error.userId }}</span>
                </div>
                <div class="flex items-center gap-2">
                    <i class="pi pi-box text-gray-400 text-xs"></i>
                    <span class="text-gray-600">{{ error.sessionId }}</span>
                </div>
                <div class="flex items-center gap-2">
                    <i class="pi pi-bolt text-gray-400 text-xs"></i>
                    <span class="text-gray-600">{{ formatResponseTime(error.responseTime) }}</span>
                </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                <Button label="View Stack Trace" icon="pi pi-file-code" text size="small" severity="secondary"
                    :disabled="!error.stackTrace" @click="emit('viewDetails', error)" />
                <Button label="View Session" icon="pi pi-arrow-right" iconPos="right" text size="small"
                    @click="emit('viewDetails', error)" />
            </div>

        </div>
    </div>
</template>