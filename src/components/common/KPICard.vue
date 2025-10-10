<template>
    <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
        <div class="flex items-center justify-between">
            <div class="flex-1">
                <div class="flex items-center mb-2">
                    <div class="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                        :class="backgroundColorClass">
                        <i :class="[metric.icon, iconColorClass, 'text-lg']"></i>
                    </div>
                    <p class="text-sm font-medium text-gray-600">{{ metric.label }}</p>
                </div>

                <div class="mt-2">
                    <p class="text-3xl font-bold text-gray-900">{{ metric.value }}</p>
                </div>

                <div class="mt-2 flex items-center">
                    <div class="flex items-center">
                        <i :class="[trendIcon, trendColorClass, 'text-sm mr-1']"></i>
                        <span :class="['text-sm font-medium', trendColorClass]">
                            {{ metric.change }}
                        </span>
                    </div>
                    <span class="text-xs text-gray-500 ml-2">vs last period</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { KPIMetric } from '@/types/analytics'

interface Props {
    metric: KPIMetric
}

const props = defineProps<Props>()

const backgroundColorClass = computed(() => {
    const colors = {
        blue: 'bg-blue-50',
        green: 'bg-green-50',
        orange: 'bg-orange-50',
        red: 'bg-red-50',
        purple: 'bg-purple-50'
    }
    return colors[props.metric.color] || colors.blue
})

const iconColorClass = computed(() => {
    const colors = {
        blue: 'text-blue-600',
        green: 'text-green-600',
        orange: 'text-orange-600',
        red: 'text-red-600',
        purple: 'text-purple-600'
    }
    return colors[props.metric.color] || colors.blue
})

const trendIcon = computed(() => {
    const icons = {
        up: 'pi pi-arrow-up',
        down: 'pi pi-arrow-down',
        neutral: 'pi pi-minus'
    }
    return icons[props.metric.trend]
})

const trendColorClass = computed(() => {
    const colors = {
        up: 'text-green-600',
        down: 'text-red-600',
        neutral: 'text-gray-500'
    }
    return colors[props.metric.trend]
})
</script>