<template>
    <div class="session-detail-view">
        <div class="mb-6">
            <div class="flex items-center mb-2">
                <router-link to="/sessions" class="text-gray-500 hover:text-gray-700 mr-2">
                    <i class="pi pi-arrow-left"></i>
                </router-link>
                <h1 class="text-3xl font-bold text-gray-900">Session Details</h1>
            </div>
            <p class="text-gray-600">Session ID: {{ sessionId }}</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Session Info -->
            <div class="lg:col-span-1">
                <div class="card">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Session Information</h3>
                    <div class="space-y-3">
                        <div>
                            <p class="text-sm text-gray-500">User</p>
                            <p class="font-medium">John Doe</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Duration</p>
                            <p class="font-medium">5m 42s</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Pages Visited</p>
                            <p class="font-medium">7</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Device</p>
                            <p class="font-medium">Desktop - Chrome</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Location</p>
                            <p class="font-medium">New York, US</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Session Timeline -->
            <div class="lg:col-span-2">
                <div class="card">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Session Timeline</h3>
                    <div class="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                        <p class="text-gray-500">Session replay will be implemented here</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    id: string
}

const props = defineProps<Props>()
const sessionId = props.id
</script>