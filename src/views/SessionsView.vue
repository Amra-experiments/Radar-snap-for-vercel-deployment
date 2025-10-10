<template>
    <div class="sessions-view">
        <div class="mb-6">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Sessions</h1>
            <p class="text-gray-600">Track and analyze user sessions</p>
        </div>

        <div class="card">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-gray-900">Recent Sessions</h3>
                <button class="btn-primary">
                    <i class="pi pi-refresh mr-2"></i>
                    Refresh
                </button>
            </div>

            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Duration</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Pages</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="i in 5" :key="i">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="h-10 w-10 bg-gray-300 rounded-full"></div>
                                    <div class="ml-4">
                                        <div class="text-sm font-medium text-gray-900">User {{ i }}</div>
                                        <div class="text-sm text-gray-500">user{{ i }}@example.com</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ Math.floor(Math.random() *
                                10) + 1 }}m {{ Math.floor(Math.random() * 60) }}s</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ Math.floor(Math.random() *
                                10) + 1 }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                                    :class="Math.random() > 0.5 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                                    {{ Math.random() > 0.5 ? 'Active' : 'Ended' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <router-link :to="`/sessions/${i}`" class="text-primary hover:text-primary-700">
                                    View Details
                                </router-link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// Sessions logic will be implemented here
</script>