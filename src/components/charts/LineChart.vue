<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { EChartsOption } from 'echarts'

interface Props {
    data: { x: string | number; y: number }[]
    title?: string
    color?: string
    height?: string
    showGrid?: boolean
    smooth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    color: '#3B82F6',
    height: '300px',
    showGrid: true,
    smooth: true
})

const option = computed<EChartsOption>(() => ({
    tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        textStyle: { color: '#374151' },
        axisPointer: { type: 'line', lineStyle: { color: '#d1d5db' } }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: props.title ? '15%' : '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        data: props.data.map(d => d.x),
        boundaryGap: false,
        axisLine: { lineStyle: { color: '#e5e7eb' } },
        axisLabel: { color: '#6b7280', fontSize: 11 }
    },
    yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#f3f4f6', type: 'dashed' } },
        axisLabel: { color: '#6b7280', fontSize: 11 }
    },
    series: [{
        data: props.data.map(d => d.y),
        type: 'line',
        smooth: props.smooth,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: props.color, width: 2 },
        itemStyle: { color: props.color },
        areaStyle: {
            color: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                    { offset: 0, color: `${props.color}40` },
                    { offset: 1, color: `${props.color}00` }
                ]
            }
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
