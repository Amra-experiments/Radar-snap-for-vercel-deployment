<script setup lang="ts">
import { computed } from 'vue'
import type { FeatureUsage } from '@/types/analytics'
import { formatDistanceToNow } from 'date-fns'

const props = defineProps<{
    feature: FeatureUsage
}>()

const adoptionColor = computed(() => {
    const rate = props.feature.adoptionRate
    if (rate >= 70) return 'text-green-600'
    if (rate >= 40) return 'text-orange-600'
    return 'text-red-600'
})

const adoptionBarColor = computed(() => {
    const rate = props.feature.adoptionRate
    if (rate >= 70) return 'bg-green-500'
    if (rate >= 40) return 'bg-orange-500'
    return 'bg-red-500'
})

const categoryColor = computed(() => {
    const colors: Record<string, string> = {
        Core: 'bg-blue-100 text-blue-700',
        Analytics: 'bg-purple-100 text-purple-700',
        Monitoring: 'bg-green-100 text-green-700',
        Settings: 'bg-gray-100 text-gray-700'
    }
    return colors[props.feature.category || ''] || 'bg-gray-100 text-gray-700'
})

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
}

const lastUsedText = computed(() => {
    if (!props.feature.lastUsed) return ''
    return formatDistanceToNow(new Date(props.feature.lastUsed), { addSuffix: true })
})
</script>

<template>
    <div
        class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer">
        <!-- Header -->
        <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                    <h3 class="text-base font-semibold text-gray-900">
                        {{ feature.featureName }}
                    </h3>
                    <span v-if="feature.category" :class="['px-2 py-0.5 text-xs font-medium rounded', categoryColor]">
                        {{ feature.category }}
                    </span>
                </div>
                <p class="text-xs text-gray-500">
                    {{ lastUsedText }}
                </p>
            </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 gap-3 mb-3">
            <div>
                <p class="text-xs text-gray-600 mb-0.5">Usage Count</p>
                <p class="text-lg font-bold text-gray-900">
                    {{ feature.usageCount.toLocaleString() }}
                </p>
            </div>
            <div>
                <p class="text-xs text-gray-600 mb-0.5">Unique Users</p>
                <p class="text-lg font-bold text-gray-900">
                    {{ feature.uniqueUsers.toLocaleString() }}
                </p>
            </div>
            <div>
                <p class="text-xs text-gray-600 mb-0.5">Avg Time</p>
                <p class="text-lg font-bold text-gray-900">
                    {{ formatTime(feature.avgTimeSpent) }}
                </p>
            </div>
            <div>
                <p class="text-xs text-gray-600 mb-0.5">Success Rate</p>
                <p class="text-lg font-bold text-green-600">
                    {{ feature.successRate }}%
                </p>
            </div>
        </div>

        <!-- Adoption Rate -->
        <div class="pt-3 border-t border-gray-100">
            <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-medium text-gray-600">Adoption Rate</span>
                <span :class="['text-sm font-bold', adoptionColor]">
                    {{ feature.adoptionRate.toFixed(1) }}%
                </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
                <div :class="['h-2 rounded-full transition-all', adoptionBarColor]"
                    :style="{ width: `${feature.adoptionRate}%` }"></div>
            </div>
        </div>
    </div>
</template>