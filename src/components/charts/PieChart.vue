<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { EChartsOption } from 'echarts'

interface Props {
    data: { name: string; value: number }[]
    title?: string
    height?: string
    isDonut?: boolean
    colors?: string[]
}

const props = withDefaults(defineProps<Props>(), {
    height: '300px',
    isDonut: false,
    colors: () => ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
})

const option = computed<EChartsOption>(() => ({
    tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        textStyle: { color: '#374151' }
    },
    legend: {
        orient: 'horizontal',
        bottom: '5%',
        left: 'center',
        textStyle: { color: '#6b7280', fontSize: 12 },
        itemWidth: 12,
        itemHeight: 12
    },
    color: props.colors,
    series: [{
        type: 'pie',
        radius: props.isDonut ? ['40%', '70%'] : '70%',
        center: ['50%', '45%'],
        data: props.data,
        emphasis: {
            itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.2)'
            }
        },
        label: {
            fontSize: 11,
            color: '#6b7280'
        },
        labelLine: {
            length: 15,
            length2: 10
        }
    }]
}))
</script>

<template>
    <div>
        <h3 v-if="title" class="text-sm font-semibold text-gray-700 mb-3">{{ title }}</h3>
        <v-chart :option="option" :style="{ height }" autoresize />
    </div>
</template>
