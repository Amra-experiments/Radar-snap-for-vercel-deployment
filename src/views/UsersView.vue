<template>
    <div class="users-view">
        <div class="mb-6">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">User Analytics</h1>
            <p class="text-gray-600">Understand your users and their behavior</p>
        </div>

        <!-- User Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="card">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600">Total Users</p>
                        <p class="text-2xl font-bold text-gray-900">8,542</p>
                    </div>
                    <div class="p-3 bg-blue-100 rounded-lg">
                        <i class="pi pi-users text-blue-600 text-xl"></i>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600">Active Users</p>
                        <p class="text-2xl font-bold text-green-600">1,234</p>
                    </div>
                    <div class="p-3 bg-green-100 rounded-lg">
                        <i class="pi pi-user text-green-600 text-xl"></i>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600">New Users</p>
                        <p class="text-2xl font-bold text-purple-600">156</p>
                    </div>
                    <div class="p-3 bg-purple-100 rounded-lg">
                        <i class="pi pi-user-plus text-purple-600 text-xl"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- User Analytics -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="card">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
                <div class="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p class="text-gray-500">User growth chart will be implemented here</p>
                </div>
            </div>

            <div class="card">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">User Behavior Flow</h3>
                <div class="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p class="text-gray-500">Behavior flow diagram will be implemented here</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// User analytics logic will be implemented here
</script>