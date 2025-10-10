<template>
    <div class="errors-view">
        <div class="mb-6">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Error Tracking</h1>
            <p class="text-gray-600">Monitor and debug application errors</p>
        </div>

        <!-- Error Summary -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="card">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600">Total Errors</p>
                        <p class="text-2xl font-bold text-red-600">142</p>
                    </div>
                    <div class="p-3 bg-red-100 rounded-lg">
                        <i class="pi pi-times-circle text-red-600 text-xl"></i>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600">JavaScript Errors</p>
                        <p class="text-2xl font-bold text-gray-900">89</p>
                    </div>
                    <div class="p-3 bg-orange-100 rounded-lg">
                        <i class="pi pi-code text-orange-600 text-xl"></i>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600">Network Errors</p>
                        <p class="text-2xl font-bold text-gray-900">35</p>
                    </div>
                    <div class="p-3 bg-yellow-100 rounded-lg">
                        <i class="pi pi-wifi text-yellow-600 text-xl"></i>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600">Resolved</p>
                        <p class="text-2xl font-bold text-green-600">18</p>
                    </div>
                    <div class="p-3 bg-green-100 rounded-lg">
                        <i class="pi pi-check text-green-600 text-xl"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Error List -->
        <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Errors</h3>
            <div class="space-y-4">
                <div v-for="i in 5" :key="i" class="border-l-4 border-red-500 pl-4 py-2">
                    <div class="flex items-start justify-between">
                        <div>
                            <h4 class="font-medium text-gray-900">TypeError: Cannot read property 'x' of undefined</h4>
                            <p class="text-sm text-gray-500 mt-1">at line 42 in main.js</p>
                            <p class="text-xs text-gray-400 mt-1">{{ new Date().toLocaleString() }}</p>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span
                                class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                Unresolved
                            </span>
                            <button class="text-primary hover:text-primary-700 text-sm">
                                View Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// Error tracking logic will be implemented here
</script>