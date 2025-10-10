<template>
    <div class="not-found-view min-h-screen bg-gray-50 flex items-center justify-center">
        <div class="text-center">
            <div class="mb-8">
                <i class="pi pi-exclamation-triangle text-6xl text-gray-400"></i>
            </div>
            <h1 class="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
            <p class="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
            <router-link to="/" class="btn-primary">
                <i class="pi pi-home mr-2"></i>
                Go to Dashboard
            </router-link>
        </div>
    </div>
</template>

<script setup lang="ts">
// 404 logic
</script>