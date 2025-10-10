<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { EChartsOption } from 'echarts'

interface DataSeries {
    name: string
    data: number[]
    color?: string
}

interface Props {
    xAxisData: string[]
    series: DataSeries[]
    title?: string
    height?: string
    yAxisLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
    height: '300px'
})

const option = computed<EChartsOption>(() => ({
    tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        textStyle: { color: '#374151' }
    },
    legend: {
        data: props.series.map(s => s.name),
        top: '3%',
        textStyle: { color: '#6b7280', fontSize: 12 }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        data: props.xAxisData,
        boundaryGap: false,
        axisLine: { lineStyle: { color: '#e5e7eb' } },
        axisLabel: { color: '#6b7280', fontSize: 11 }
    },
    yAxis: {
        type: 'value',
        name: props.yAxisLabel,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#f3f4f6', type: 'dashed' } },
        axisLabel: { color: '#6b7280', fontSize: 11 }
    },
    series: props.series.map(s => ({
        name: s.name,
        type: 'line',
        smooth: true,
        data: s.data,
        lineStyle: { width: 2, color: s.color },
        itemStyle: { color: s.color },
        symbol: 'circle',
        symbolSize: 6
    }))
}))
</script>

<template>
    <div>
        <h3 v-if="title" class="text-sm font-semibold text-gray-700 mb-3">{{ title }}</h3>
        <v-chart :option="option" :style="{ height }" autoresize />
    </div>
</template>
