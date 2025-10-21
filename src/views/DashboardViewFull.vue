<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p class="text-gray-600 mt-1">Comprehensive view of your project analytics</p>
      </div>

      <!-- Date Range Selector -->
      <div class="flex gap-2">
        <Button label="Today" outlined size="small" @click="setPresetRange('today')" />
        <Button label="7 Days" outlined size="small" @click="setPresetRange('7d')" />
        <Button label="30 Days" size="small" @click="setPresetRange('30d')" />
        <Button label="90 Days" outlined size="small" @click="setPresetRange('90d')" />
      </div>
    </div>

    <!-- Error Message -->
    <Message v-if="error && !loading" severity="error" :closable="false">
      {{ error }}
    </Message>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card v-for="i in 4" :key="i">
        <template #content>
          <Skeleton height="2rem" class="mb-2" />
          <Skeleton height="3rem" />
        </template>
      </Card>
    </div>

    <!-- Stats Cards -->
    <div v-else-if="hasData" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Sessions -->
      <Card>
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Total Sessions</p>
              <p class="text-3xl font-bold text-gray-900">
                {{ totalSessions.toLocaleString() }}
              </p>
              <p class="text-sm text-green-600 mt-1">+12% from last period</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i class="pi pi-users text-2xl text-blue-600"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Page Views -->
      <Card>
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Page Views</p>
              <p class="text-3xl font-bold text-gray-900">
                {{ totalPageViews.toLocaleString() }}
              </p>
              <p class="text-sm text-green-600 mt-1">+8% from last period</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i class="pi pi-eye text-2xl text-green-600"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Unique Visitors -->
      <Card>
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Unique Visitors</p>
              <p class="text-3xl font-bold text-gray-900">
                {{ uniqueVisitors.toLocaleString() }}
              </p>
              <p class="text-sm text-green-600 mt-1">+15% from last period</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i class="pi pi-user text-2xl text-purple-600"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Bounce Rate -->
      <Card>
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Bounce Rate</p>
              <p class="text-3xl font-bold text-gray-900">
                {{ formatPercentage(bounceRate) }}
              </p>
              <p class="text-sm text-orange-600 mt-1">-3% from last period</p>
            </div>
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <i class="pi pi-chart-line text-2xl text-orange-600"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- No Data State -->
    <Card v-else>
      <template #content>
        <div class="text-center py-12">
          <i class="pi pi-chart-bar text-6xl text-gray-300 mb-4"></i>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No Data Yet</h3>
          <p class="text-gray-600 mb-6">
            Start tracking events by installing the RadarSnap SDK on your website
          </p>
          <Button 
            label="View Integration Guide" 
            icon="pi pi-book" 
            @click="$router.push('/projects/setup')" 
          />
        </div>
      </template>
    </Card>

    <!-- Charts Row -->
    <div v-if="hasData && !loading" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Sessions Trend -->
      <Card class="lg:col-span-2">
        <template #title>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Session Trends</h3>
            <span class="text-sm text-gray-500">Last 7 days</span>
          </div>
        </template>
        <template #content>
          <div class="h-64">
            <Chart 
              v-if="sessionsTrendData" 
              type="line" 
              :data="sessionsTrendData" 
              :options="chartOptions" 
            />
          </div>
        </template>
      </Card>

      <!-- Device Breakdown -->
      <Card>
        <template #title>
          <div class="text-lg font-semibold">Device Types</div>
        </template>
        <template #content>
          <div class="h-64">
            <Chart 
              v-if="deviceChartData" 
              type="doughnut" 
              :data="deviceChartData"
              :options="pieChartOptions" 
            />
          </div>
        </template>
      </Card>
    </div>

    <!-- Performance Metrics -->
    <Card v-if="hasData && !loading">
      <template #title>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Performance Metrics</h3>
          <span class="text-sm text-gray-500">Average response times</span>
        </div>
      </template>
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <!-- First Contentful Paint -->
          <div class="text-center p-4 bg-blue-50 rounded-lg">
            <p class="text-sm text-gray-600 mb-1">First Contentful Paint</p>
            <p class="text-2xl font-bold text-blue-600">1.2s</p>
            <p class="text-xs text-green-600 mt-1">Good</p>
          </div>
          
          <!-- Largest Contentful Paint -->
          <div class="text-center p-4 bg-green-50 rounded-lg">
            <p class="text-sm text-gray-600 mb-1">Largest Contentful Paint</p>
            <p class="text-2xl font-bold text-green-600">2.1s</p>
            <p class="text-xs text-green-600 mt-1">Good</p>
          </div>
          
          <!-- Time to Interactive -->
          <div class="text-center p-4 bg-orange-50 rounded-lg">
            <p class="text-sm text-gray-600 mb-1">Time to Interactive</p>
            <p class="text-2xl font-bold text-orange-600">3.8s</p>
            <p class="text-xs text-orange-600 mt-1">Needs Improvement</p>
          </div>
        </div>
      </template>
    </Card>

    <!-- Top Pages Table -->
    <Card v-if="hasData && !loading">
      <template #title>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Top Pages</h3>
          <Button label="View All" text size="small" />
        </div>
      </template>
      <template #content>
        <DataTable :value="dashboardData?.top_pages || []" :rows="10" stripedRows>
          <Column field="page_url" header="Page URL">
            <template #body="{ data }">
              <div class="font-medium">{{ data.page_title || data.page_url }}</div>
              <div class="text-sm text-gray-500">{{ data.page_url }}</div>
            </template>
          </Column>
          <Column field="views" header="Views">
            <template #body="{ data }">
              {{ data.views.toLocaleString() }}
            </template>
          </Column>
          <Column field="unique_visitors" header="Unique Visitors">
            <template #body="{ data }">
              {{ data.unique_visitors.toLocaleString() }}
            </template>
          </Column>
          <Column field="avg_time_on_page" header="Avg. Time">
            <template #body="{ data }">
              {{ formatDuration(data.avg_time_on_page) }}
            </template>
          </Column>
          <Column field="bounce_rate" header="Bounce Rate">
            <template #body="{ data }">
              {{ formatPercentage(data.bounce_rate) }}
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Recent User Activity -->
    <Card v-if="hasData && !loading">
      <template #title>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Recent User Activity</h3>
          <Button label="Live View" icon="pi pi-eye" text size="small" />
        </div>
      </template>
      <template #content>
        <div class="space-y-4">
          <!-- Activity Item -->
          <div v-for="activity in recentActivity" :key="activity.id" 
               class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <i :class="activity.icon" class="text-blue-600 text-sm"></i>
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ activity.action }}</p>
                <p class="text-sm text-gray-500">{{ activity.user }} • {{ activity.page }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-500">{{ activity.time }}</p>
              <p class="text-xs text-gray-400">{{ activity.location }}</p>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- Error Tracking -->
    <Card v-if="hasData && !loading">
      <template #title>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Error Tracking</h3>
          <Button label="View Details" text size="small" />
        </div>
      </template>
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Error Stats -->
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div class="flex items-center space-x-2">
                <i class="pi pi-exclamation-triangle text-red-600"></i>
                <span class="font-medium">JavaScript Errors</span>
              </div>
              <span class="text-red-600 font-bold">12</span>
            </div>
            
            <div class="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div class="flex items-center space-x-2">
                <i class="pi pi-times-circle text-orange-600"></i>
                <span class="font-medium">Network Errors</span>
              </div>
              <span class="text-orange-600 font-bold">5</span>
            </div>
            
            <div class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div class="flex items-center space-x-2">
                <i class="pi pi-exclamation-circle text-yellow-600"></i>
                <span class="font-medium">Console Warnings</span>
              </div>
              <span class="text-yellow-600 font-bold">23</span>
            </div>
          </div>
          
          <!-- Recent Errors -->
          <div class="space-y-3">
            <h4 class="font-medium text-gray-700 mb-3">Recent Errors</h4>
            <div v-for="error in recentErrors" :key="error.id"
                 class="p-3 border border-gray-200 rounded-lg hover:border-red-300">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <p class="font-medium text-gray-900 text-sm">{{ error.message }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ error.page }} • {{ error.time }}</p>
                </div>
                <span :class="[
                  'px-2 py-1 text-xs rounded',
                  error.severity === 'high' ? 'bg-red-100 text-red-700' :
                  error.severity === 'medium' ? 'bg-orange-100 text-orange-700' :
                  'bg-yellow-100 text-yellow-700'
                ]">
                  {{ error.severity }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useDashboard } from '@/composables/useDashboard'
import Card from 'primevue/card'
import Chart from 'primevue/chart'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'
import Message from 'primevue/message'

const {
  dashboardData,
  loading,
  error,
  hasData,
  totalSessions,
  totalPageViews,
  uniqueVisitors,
  bounceRate,
  fetchDashboard,
  setPresetRange,
  formatDuration,
  formatPercentage,
} = useDashboard()

// Chart data computed from dashboard data
const sessionsTrendData = computed(() => {
  if (!dashboardData.value?.sessions_trend) return null
  
  const labels = dashboardData.value.sessions_trend.map(item => item.date)
  const data = dashboardData.value.sessions_trend.map(item => item.value)
  
  return {
    labels,
    datasets: [{
      label: 'Sessions',
      data,
      fill: false,
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4
    }]
  }
})

const deviceChartData = computed(() => {
  if (!dashboardData.value?.devices) return null
  
  const labels = dashboardData.value.devices.map(item => item.device_type)
  const data = dashboardData.value.devices.map(item => item.count)
  
  return {
    labels,
    datasets: [{
      data,
      backgroundColor: [
        '#3B82F6',  // Desktop - Blue
        '#10B981',  // Mobile - Green  
        '#8B5CF6'   // Tablet - Purple
      ]
    }]
  }
})

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: '#f3f4f6'
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  }
}

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
}

// Mock data for enhanced features
const recentActivity = ref([
  {
    id: 1,
    action: 'Page View',
    user: 'Anonymous User',
    page: '/dashboard',
    time: '2 min ago',
    location: 'New York, US',
    icon: 'pi pi-eye'
  },
  {
    id: 2,
    action: 'Button Click',
    user: 'john@example.com',
    page: '/products',
    time: '5 min ago',
    location: 'London, UK',
    icon: 'pi pi-mouse'
  },
  {
    id: 3,
    action: 'Form Submit',
    user: 'sarah@example.com',
    page: '/contact',
    time: '8 min ago',
    location: 'Toronto, CA',
    icon: 'pi pi-send'
  }
])

const recentErrors = ref([
  {
    id: 1,
    message: 'TypeError: Cannot read property of undefined',
    page: '/checkout',
    time: '10 min ago',
    severity: 'high'
  },
  {
    id: 2,
    message: 'Network request failed: 404',
    page: '/api/products',
    time: '15 min ago',
    severity: 'medium'
  },
  {
    id: 3,
    message: 'Console warning: Deprecated API usage',
    page: '/dashboard',
    time: '20 min ago',
    severity: 'low'
  }
])

// Initialize dashboard
onMounted(() => {
  fetchDashboard()
})
</script>

<style scoped>
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.metric-card {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-container {
  position: relative;
  height: 250px;
}
</style>