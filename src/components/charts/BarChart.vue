<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { EChartsOption } from 'echarts'

interface Props {
    data: { name: string; value: number }[]
    title?: string
    height?: string
    color?: string
    horizontal?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    height: '300px',
    color: '#3B82F6',
    horizontal: false
})

const option = computed<EChartsOption>(() => ({
    tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        textStyle: { color: '#374151' },
        axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(0,0,0,0.05)' } }
    },
    grid: {
        left: props.horizontal ? '15%' : '3%',
        right: '4%',
        bottom: '3%',
        top: '3%',
        containLabel: true
    },
    xAxis: {
        type: props.horizontal ? 'value' : 'category',
        data: !props.horizontal ? props.data.map(d => d.name) : undefined,
        axisLine: { lineStyle: { color: '#e5e7eb' } },
        axisLabel: { color: '#6b7280', fontSize: 11 },
        axisTick: { show: false }
    },
    yAxis: {
        type: props.horizontal ? 'category' : 'value',
        data: props.horizontal ? props.data.map(d => d.name) : undefined,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#f3f4f6', type: 'dashed' } },
        axisLabel: { color: '#6b7280', fontSize: 11 }
    },
    series: [{
        data: props.data.map(d => d.value),
        type: 'bar',
        barWidth: '60%',
        itemStyle: {
            color: props.color,
            borderRadius: props.horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]
        },
        emphasis: {
            itemStyle: { opacity: 0.8 }
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
